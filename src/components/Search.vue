<template>
  <div class="container mx-auto" @click.self="containerClick" ref="container">
    <div class="top-banner flex justify-end items-center">
<!--      <div class="day-night-switch mr-2">-->
<!--        <i class="iconfont icon-light-mode icon kano-icon dark:dark-icon w-8 icon-hover"></i>-->
<!--        <i class="iconfont icon-dark-mode icon kano-icon dark:dark-icon w-8 icon-hover"></i>-->
<!--      </div>-->

      <svg
          class="kano-icon dark:dark-icon w-8 icon-hover"
          aria-hidden="false"
          @click.stop="settingHandler">
        <use xlink:href="#icon-settings" class="rotate"></use>
      </svg>
    </div>
    <div ref="searchEle" class="search relative flex flex-col">
      <div
          class="search-engine flex overflow-hidden dark:dark-search-engine"
          ref="searchEngineElement">
        <div
            class="flex items-center"
            id="engine_switch_btn"
            @click.stop="switchEngine">
          <i
              :class="`icon kano-icon dark:dark-kano-icon iconfont dark:dark-icon ${selectedEngine.icon}`"></i>
        </div>
        <input
            ref="searchBox"
            id="searchBox"
            type="text"
            autocomplete="off"
            v-model="searchContent"
            @keyup.enter="enterEvent"
            @input.stop="searchSuggestion(selectedEngine.method)"
            @keydown.stop="moveSuggestion"
            @mouseenter.stop="eventMouse"
            @focusin.stop="showHideSearchHistory"
            @focusout.stop="showHideSearchHistory"
            @mouseleave.stop="eventMouse"
            class="input pl-3 box-border outline-none dark:input-dark"
            :placeholder="`在${selectedEngine.name}上搜索`"/>
        <div
            class="clear-input"
            @click.stop="clearContent"
            v-show="searchContent">
          <i class="iconfont dark:dark:dark-text icon-close icon close"></i>
        </div>
        <button
            id="searchbtn"
            class="search-btn flex justify-center items-center dark:hover:dark-hover-bg"
            @click.stop="startSearch(undefined, true)">
          <svg class="icon" aria-hidden="false" height="30px">
            <use xlink:href="#icon-search"></use>
          </svg>
        </button>
      </div>
      <Transition name="suggestion">
        <div
            @mouseenter.stop="suggestActiveControl"
            @mouseleave.stop="suggestActiveControl"
            class="search-suggestion top-border absolute dark:dark-suggest-bg"
            v-if="
            (suggestWords.length && suggestIsShow) || isSearchEngineListMode
          ">
          <ul ref="scrollUl">
            <transition-group name="suggestion-ul">
              <li
                  v-if="!isSearchEngineListMode"
                  class="inner dark:dark-text"
                  :class="{ active: item.isSelected }"
                  @click.stop="startSearch(item.title)"
                  v-for="(item, index) in suggestWords"
                  :key="index">
                <span class="searchkey" :id="`key_${index}_${Math.random()}`">{{
                    item.title
                  }}</span>
                <i
                    v-show="item.allowDel"
                    @click.stop.prevent="delHistory(index)"
                    class="iconfont icon-close icon close"></i>
              </li>
              <!-- 搜索引擎切换列表 -->
              <li v-else class="searchEngineListBox">
                <SearchEngines/>
              </li>
            </transition-group>
          </ul>
        </div>
      </Transition>
      <Favorites/>
    </div>
  </div>
  <!-- settings -->
  <Settings :show="settingsIsShow" @close="settingsIsShow = false"></Settings>
</template>
<script setup lang="ts">
/*
 * @Author: kanoqwq
 * @Email: kanoqwq@qq.com
 * @Date: 2023-04-17 14:47:15
 * @Last Modified by: kanoqwq
 * @Last Modified time: 2024-11-07 20:18:03
 * @Description: Description
 */
import {ref, reactive, watch, computed, onMounted} from 'vue';
import Settings from './Settings.vue';
import SearchEngines from '@/components/SearchEngines/index.vue';
import throttle from 'lodash/throttle';
import {suggestAPI} from '@/utils/searchSuggestions';
import useStore from '@/store';
import {SearchEngine, SuggestWords} from '@/types/global';
import Favorites from './Favorites/Favorites.vue';
import {openWithoutReferrer} from '@/utils/openLink';

const emit = defineEmits(['blur', 'focus']);

//store
const historySearch = useStore.historySearch();
const searchEnginesStore = useStore.searchEngines();

// const global = inject(globalKey)
let searchContent = ref('');
let engineId: number = searchEnginesStore.selectedEngine;
let selectedEngine = reactive<SearchEngine>({
  ...(searchEnginesStore.searchEngines.find((i) => i.id == engineId) ||
      searchEnginesStore.searchEngines[0]),
});
let suggestionIndex = ref(-1);
let suggestWords = ref<Array<SuggestWords>>([]);
const Configs = useStore.Configs();
const searchBox = ref();
const suggestIsShow = ref(false);
const suggestActive = ref(false);
const settingsIsShow = ref(false);
const filterWords = computed(() => Configs.formattedFilterWords);
const isSearchFocused = ref(false);

onMounted(() => {
  window.onkeyup = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key == 'Alt') {
      if (isSearchFocused.value) {
        containerClick({} as any);
      } else {
        searchBox.value.focus();
      }
    }
    if (e.key == 'Escape') {
      containerClick({} as any);
    }
  };
});

watch(
    () => searchEnginesStore.selectedEngine,
    (id) => {
      const newEngine =
          searchEnginesStore.searchEngines.find((i) => i.id == id) ||
          searchEnginesStore.searchEngines[0];
      selectedEngine.name = newEngine.name;
      selectedEngine.url = newEngine.url;
      selectedEngine.icon = newEngine.icon;
      selectedEngine.method = newEngine.method;
    }
);

//设置搜索建议模式的标识
let isSuggestMode = false;

//是否为搜索引擎切换模式
const isSearchEngineListMode = ref(false);

const uncheckSuggestWords = () => {
  suggestWords.value = [...historySearch.gethistorySearchList].map((item) => ({
    ...item,
    isSelected: false,
  }));
};

//点击container隐藏搜索历史框
const containerClick = (e: Event) => {
  showHideSearchHistory(e);
  uncheckSuggestWords();
  searchBox.value.blur();
  searchBlur();
  isSearchEngineListMode.value = false;
  isSearchFocused.value = false;
  suggestIsShow.value = false;
  suggestIsShow.value = false;
};

watch([suggestWords, suggestIsShow, searchContent, suggestActive], () => {
  (suggestWords.value.length && suggestIsShow.value) ||
  isSearchEngineListMode.value
      ? toggleSearchBorder(false)
      : toggleSearchBorder(true);
});

//点击图标切换搜索引擎
const switchEngine = (): void => {
  isSearchEngineListMode.value = true;
  focus();
};

//开始搜索
//FIX:fixed problem when search string has spacial character
//feat:Support for directly entering URL addresses in the search box
let timeout: any = null;
const startSearch = (
    keyWord = searchContent.value.trim(),
    needClear = false
): void => {
  let URLReg =
      /^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$/;

  let reqUrl =
      selectedEngine.url + encodeURIComponent(keyWord) + ' ' + filterWords.value;

  if (keyWord.trim() !== searchContent.value.trim()) {
    searchContent.value = keyWord.trim();
  }
  //搜索历史滚动到最顶部
  isScrollingToTop.value = true;
  try {
    scrollUl.value.children[0].scrollIntoView({
      top: 0,
      behavior: 'instant',
    });
  } catch {
  }

  //添加搜索历史
  addSearchHistory(keyWord);

  // 隐藏
  searchBox.value.blur();
  searchBlur();
  uncheckSuggestWords();
  isSearchFocused.value = false;
  suggestIsShow.value = false;

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    isScrollingToTop.value = false;
    //If keyWord is an URL
    if (URLReg.exec(keyWord)) {
      openWithoutReferrer(keyWord);
    } else {
      openWithoutReferrer(reqUrl);
    }
    if (needClear) {
      clearContent();
    }
  }, 400);
};

const searchEngineElement = ref<HTMLFormElement>();
const toggleShadow = (flag: boolean) => {
  searchEngineElement.value?.classList?.[flag ? 'add' : 'remove']('shadow');
  searchEngineElement.value?.classList?.[flag ? 'add' : 'remove'](
      'dark:dark-shadow'
  );
};

// 鼠标滑过改变阴影

const eventMouse = (e: MouseEvent): void => {
  if (e.type == 'mouseenter' && !isSearchFocused.value) {
    if (isSearchEngineListMode.value) {
      toggleShadow(false);
      return;
    }
    if (searchContent.value.length == 0) {
      toggleShadow(true);
    }
  } else {
    if (searchContent.value.length == 0) {
      if (isSearchEngineListMode.value) return;
      toggleShadow(false);
    }
  }
};

//回车搜索
const enterEvent = (): void => {
  searchBlur();
  startSearch(undefined, true);
};

const searchBlur = () => {
  if (Configs.searchTransitonEnabled) {
    searchEle.value.style.top = '';
    emit('blur');
  }
  isSearchFocused.value = false;
  searchBox.value.blur();
  toggleSearchBorder(true);
  if (!suggestActive.value) {
    suggestIsShow.value = false;
  }
};

const searchEle = ref();

const focus = () => {
  if (Configs.searchTransitonEnabled) {
    searchEle.value.style.top = '33%';
    emit('focus');
  }
  toggleShadow(false);
  suggestIsShow.value = true;
  isSearchFocused.value = true;
  if (suggestWords.value.length == 0) {
    suggestWords.value = [...historySearch.gethistorySearchList];
  }
};

//搜索建议(谷歌接口暂时无法支持跨域)
const searchSuggestion = throttle(
    async (
        method: 'suggestBaidu' | 'suggestBing' | 'suggestDuckDuckGo'
    ): Promise<void> => {
      try {
        //清除阴影
        toggleShadow(false);
        //清除一下历史选择的index
        suggestionIndex.value = -1;
        //搜索建议的trigger保持开启
        suggestIsShow.value = true;
        if (searchContent.value && method) {
          let res = await suggestAPI[method](searchContent.value);
          suggestWords.value.length = 0;
          suggestWords.value.push(...res);
          isSuggestMode = true;
          //远端没有数据返回，下边框为圆角
          if (suggestWords.value.length == 0) {
            toggleSearchBorder(true);
          } else {
            toggleSearchBorder(false);
          }
        } else {
          //没有内容的时候，应该显示搜索历史
          isSuggestMode = false;
          suggestWords.value = [...historySearch.gethistorySearchList];
        }
      } catch (e) {
        console.log('搜索建议获取失败');
      }
    },
    100
);

//清空搜索词列表和搜索框内容
const clearContent = (): void => {
  isSuggestMode = false;
  suggestWords.value.length = 0;
  searchContent.value = '';
};

const scrollUl = ref();
const isScrollingToTop = ref(false);

watch(suggestionIndex, () => {
  //滚动
  if (isScrollingToTop.value) return;
  try {
    scrollUl.value.children[suggestionIndex.value].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  } catch {
  }
});

//实现上下键选择候选词
let removeandInit = () => {
  removeActive();
  suggestWords.value[suggestionIndex.value].isSelected = true;
  searchContent.value = suggestWords.value[suggestionIndex.value].title;
};
const moveSuggestion = (e: KeyboardEvent): void => {
  let key = e.key;
  //跳过组合键
  if (e.shiftKey || e.ctrlKey) return;

  //候选词列表不为空
  if (suggestWords.value.length != 0) {
    if (key == 'ArrowUp') {
      //阻止上下按键操作光标
      e.preventDefault();
      if (suggestionIndex.value == 0 || suggestionIndex.value == -1) {
        suggestionIndex.value = suggestWords.value.length - 1;
      } else {
        suggestionIndex.value =
            (suggestionIndex.value - 1) % suggestWords.value.length;
      }
      removeandInit();
    } else if (key == 'ArrowDown') {
      e.preventDefault();
      if (suggestWords.value.length - 1 == suggestionIndex.value) {
        suggestionIndex.value = 0;
      } else {
        suggestionIndex.value =
            (suggestionIndex.value + 1) % suggestWords.value.length;
      }
      removeandInit();
    } else if (key == 'Home') {
      e.preventDefault();
      suggestionIndex.value = 0;
      removeandInit();
    } else if (key == 'End') {
      e.preventDefault();
      suggestionIndex.value = suggestWords.value.length - 1;
      removeandInit();
    }
  }
  //del按下可以快速删除历史
  if (key == 'Delete') {
    //防止误删搜索建议中的内容
    if (suggestWords.value.length != 0 && !isSuggestMode) {
      historySearch.deleteHistory(suggestionIndex.value);
      suggestWords.value.splice(suggestionIndex.value, 1);
      if (suggestWords.value.length) {
        suggestionIndex.value - 1 >= 0
            ? suggestionIndex.value--
            : suggestionIndex.value;
        suggestWords.value[suggestionIndex.value].isSelected = true;
      } else {
        toggleSearchBorder(true);
      }
    }
  }
};

//清除样式
const removeActive = (): void => {
  suggestWords.value.forEach((item) => {
    item.isSelected = false;
  });
};

//搜索历史功能
const addSearchHistory = (keyword: string) => {
  //添加搜索历史
  historySearch.addHistory(keyword ? keyword : searchContent.value);
};

//展示/隐藏搜索历史
let showHideTimer: any = null;
const showHideSearchHistory = (e: Event) => {
  showHideTimer && clearTimeout(showHideTimer);
  showHideTimer = setTimeout(() => {
    if (e.type == 'focusin') {
      focus();
      isSearchEngineListMode.value = false;
    } else {
      if (isSearchFocused.value) {
        isSearchFocused.value = false;
        return;
      }
      searchBlur();
    }
  }, 100);
};

//判定鼠标是否在搜索历史框内
const suggestActiveControl = (e: Event) => {
  if (e.type == 'mouseenter') {
    suggestActive.value = true;
  } else {
    suggestActive.value = false;
  }
};

//删除搜索历史
const delHistory = (index: number) => {
  focus();
  emit('focus');
  suggestWords.value.splice(index, 1);
  historySearch.deleteHistory(index);
  //删空后将搜索框设为圆角边框
  if (suggestWords.value.length == 0) {
    //suggest此时不活跃
    suggestActive.value = false;
    toggleSearchBorder(true);
  }
};

const settingHandler = () => {
  settingsIsShow.value = true;
};

//切换搜索的下边框
const toggleSearchBorder = (active: boolean) => {
  searchEngineElement.value?.classList[active ? 'remove' : 'add'](
      'search-engine-active'
  );
};

//导出
defineExpose({
  blur: containerClick,
});
</script>

<style scoped lang="less">
@import url('./Search.less');
</style>
