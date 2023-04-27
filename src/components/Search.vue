<template>
  <div class="container mx-auto">
    <div class="top-banner flex justify-end">
      <svg class="icon kano-icon dark:dark-icon w-8 icon-hover" aria-hidden="false" @click="settingHandler">
        <use xlink:href="#icon-settings" class="rotate"></use>
      </svg>
    </div>
    <div class="search relative flex flex-col">
      <form action="#" method="get"
        class="search-engine flex overflow-hidden dark:dark-search-engine dark:hover:dark-shadow"
        ref="searchEngineElement">
        <div class="flex items-center" id="engine_switch_btn" @click="switchEngine">
          <svg class="icon kano-icon dark:dark-icon" aria-hidden="true">
            <use :xlink:href="selectedEngine.icon"></use>
          </svg>
        </div>
        <input ref="searchBox" id="searchBox" type="text" autocomplete="off" v-model="searchContent"
          @keyup.enter="enterEvent" @input="searchSuggestion(selectedEngine.method)" @keydown="moveSuggestion"
          @mouseenter="eventMouse" @focusin="showHideSearchHistory" @focusout="showHideSearchHistory"
          @mouseleave="eventMouse" class="input pl-3 box-border outline-none dark:input-dark"
          :placeholder="`在${selectedEngine.name}上搜索`" />
        <div class="clear-input" @click="clearContent" v-show="searchContent">
          <svg class="icon close" aria-hidden="false">
            <use xlink:href="#icon-close" class="close-icon"></use>
          </svg>
        </div>
        <button id="searchbtn" class="search-btn flex justify-center items-center dark:hover:dark-hover-bg"
          @click="startSearch()">
          <svg class="icon" aria-hidden="false" height="30px">
            <use xlink:href="#icon-search"></use>
          </svg>
        </button>
      </form>
      <div @mouseenter="suggestActiveControl" @mouseleave="suggestActiveControl"
        class="search-suggestion top-border absolute dark:dark-suggest-bg" v-show="suggestWords.length && suggestIsShow">
        <ul>
          <li class="inner" :class="{ active: item.isSelected }" @click="startSearch(item.title)"
            v-for="(item, index) in suggestWords" :key="index">
            <span class="searchkey" :id="`key_${index}_${Math.random()}`">{{ item.title }}</span>
            <svg class="close" aria-hidden="false" v-show="item.allowDel" @click.stop="delHistory(index)">
              <use xlink:href="#icon-close"></use>
            </svg>
          </li>
        </ul>
      </div>
      <Favorites />
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
 * @Last Modified time: 2023-04-27 15:00:52
 * @Description: Description
 */
import { ref, reactive, watch } from 'vue'
import Settings from './Settings.vue'
import throttle from 'lodash/throttle'
import { suggestAPI } from '@/utils/searchSuggestions'
import useStore from '@/store'
import { SearchEngine, SuggestWords } from '@/types/global'
import Favorites from './Favorites/Favorites.vue'
//store
const historySearch = useStore.historySearch()
const searchEnginesStore = useStore.searchEngines()

// const global = inject(globalKey)
let searchContent = ref('')
let engineIndex: number = searchEnginesStore.selectedEngine;
let selectedEngine = reactive<SearchEngine>({ ...searchEnginesStore.searchEngines[engineIndex] })
let suggestionIndex = -1
let suggestWords = ref<Array<SuggestWords>>([])
const searchBox = ref()
const suggestIsShow = ref(false)
const suggestActive = ref(false)
const settingsIsShow = ref(false);


watch([suggestWords, suggestIsShow, searchContent, suggestActive], () => {
  if (suggestWords.value.length && suggestIsShow.value || suggestActive.value) {
    toggleSearchBorder(false)
  } else {
    toggleSearchBorder(true)
  }
})

//点击图标切换搜索引擎
const switchEngine = (): void => {
  //限制数字范围
  engineIndex = (engineIndex + 1) % (searchEnginesStore.searchEngines.length)
  let newEngine = searchEnginesStore.searchEngines[engineIndex]

  //保存选择历史
  searchEnginesStore.setSelectedEngine(engineIndex);

  selectedEngine.name = newEngine.name
  selectedEngine.url = newEngine.url
  selectedEngine.icon = newEngine.icon
  selectedEngine.method = newEngine.method
}

//开始搜索
const startSearch = (keyWord = ''): void => {
  if (keyWord) {
    searchContent.value = keyWord.trim()
  }
  let reqUrl = selectedEngine.url + searchContent.value.trim()
  //添加搜索历史
  addSearchHistory()
  //返回新标签页打开
  window.open(reqUrl, '_blank')
}

// 鼠标滑过改变阴影
const searchEngineElement = ref<HTMLFormElement>()
const eventMouse = (e: MouseEvent): void => {
  if (e.type == 'mouseenter') {
    if (searchContent.value.length == 0) {
      searchEngineElement.value?.classList.add("shadow")
    }
  } else {
    if (searchContent.value.length == 0) {
      searchEngineElement.value?.classList.remove("shadow")
    }
  }
}

//回车搜索
const enterEvent = (): void => {
  startSearch()
}

//搜索建议(谷歌接口暂时无法支持跨域)
const searchSuggestion = throttle(async (method: 'suggestBaidu' | 'suggestBing'): Promise<void> => {
  try {
    //清除阴影
    searchEngineElement.value?.classList.remove("shadow")
    //清除一下历史选择的index
    suggestionIndex = -1
    //搜索建议的trigger保持开启
    suggestIsShow.value = true
    if (searchContent.value) {
      let res = await suggestAPI[method](searchContent.value)
      suggestWords.value.length = 0
      suggestWords.value.push(...res)

      //远端没有数据返回，下边框为圆角
      if (suggestWords.value.length == 0) {
        toggleSearchBorder(true);
      } else {
        toggleSearchBorder(false);
      }

    } else {
      //没有内容的时候，应该显示搜索历史
      suggestWords.value = [...historySearch.gethistorySearchList]
    }
  }
  catch (e) {
    console.log("搜索建议获取失败");
  }
}, 100)

//清空搜索词列表和搜索框内容
const clearContent = (): void => {
  suggestWords.value.length = 0
  searchContent.value = ''
}

//实现上下键选择候选词
const moveSuggestion = (e: KeyboardEvent): void => {
  let key = e.key
  if (key == 'ArrowUp') {
    //阻止上下按键操作光标
    e.preventDefault()
    if (suggestionIndex == 0 || suggestionIndex == -1) {
      suggestionIndex = suggestWords.value.length - 1
    }
    else {
      suggestionIndex = (suggestionIndex - 1) % suggestWords.value.length;
    }
    removeActive();
    suggestWords.value[suggestionIndex].isSelected = true
    searchContent.value = suggestWords.value[suggestionIndex].title
  }
  else if (key == 'ArrowDown') {
    e.preventDefault()
    if (suggestWords.value.length - 1 == suggestionIndex) {
      suggestionIndex = 0
    }
    else {
      suggestionIndex = (suggestionIndex + 1) % suggestWords.value.length;
    }
    removeActive();
    suggestWords.value[suggestionIndex].isSelected = true
    searchContent.value = suggestWords.value[suggestionIndex].title
  }

  //test
  //del按下可以快速删除历史
  if (key == 'Delete') {
    if (suggestWords.value.length != 0) {
      historySearch.deleteHistory(suggestionIndex)
      suggestWords.value.splice(suggestionIndex, 1)

      if (suggestWords.value.length) {
        suggestionIndex - 1 >= 0 ? suggestionIndex-- : suggestionIndex
        suggestWords.value[suggestionIndex].isSelected = true
      } else {
        toggleSearchBorder(true);
      }
    }
  }
}

//清除样式
const removeActive = (): void => {
  suggestWords.value.forEach((item) => {
    item.isSelected = false
  })
}

//搜索历史功能
const addSearchHistory = () => {
  //添加搜索历史
  historySearch.addHistory(searchContent.value)
}

//展示/隐藏搜索历史
const showHideSearchHistory = (e: Event) => {
  if (e.type == 'focusin') {
    suggestIsShow.value = true;
    if (suggestWords.value.length == 0) {
      suggestWords.value = [...historySearch.gethistorySearchList];
    }
  } else {
    //恢复圆角
    // if (!suggestActive.value) {
    //   toggleSearchBorder(true);
    // }
    if (!suggestActive.value) {

      //没有内容的时候，需要清空一下推荐词
      if (searchContent.value.length == 0) {
        suggestWords.value.length = 0
      }
      suggestIsShow.value = false
    }
  }
}

//判定鼠标是否在搜索历史框内
const suggestActiveControl = (e: Event) => {
  if (e.type == 'mouseenter') {
    suggestActive.value = true
    //鼠标在搜索历史框内，保持搜索边框直角
    // toggleSearchBorder(false)
  } else {
    suggestActive.value = false
  }
}

//删除搜索历史
const delHistory = (index: number) => {
  suggestWords.value.splice(index, 1)
  historySearch.deleteHistory(index)
  //删空了就设为圆角边框
  if (suggestWords.value.length == 0) {
    //suggest此时不活跃
    suggestActive.value = false
    toggleSearchBorder(true)
  }
}


//TODO:添加设置按钮,需要弹出一个模态框
const settingHandler = () => {
  settingsIsShow.value = true;
  console.log("okk");
}

//切换搜索的下边框
const toggleSearchBorder = (active: boolean) => {
  searchEngineElement.value?.classList[active ? 'remove' : 'add']('search-engine-active')
}
</script>

<style scoped lang="less">
.container {
  height: 100%;
  padding: 0 15px;

  .top-banner {
    position: fixed;
    right: 0px;
    top: 0px;
    padding-right: 15px;
    width: 100%;
    height: 60px;
    color: #ccc;
  }

  //旋转动画
  .rotate {
    transition: all .2s;
    animation: rotate 2s infinite linear;
  }

  .icon-hover:hover .rotate {
    fill: #666;
  }

  .search-suggestion {
    width: 100%;
    max-height: 360px;
    z-index: 9999;
    top: 100%;
    overflow: auto;
    border-radius: 6px;
    backdrop-filter: blur(10px);

    .inner {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .searchkey {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    li {
      padding: 10px 15px;
      transition: all .1s;

      .close {
        height: 14px;
        width: 14px;
        margin: 0 5px;

        .close-icon {
          fill: #fff;
        }
      }
    }

    li:hover,
    .active {
      background-color: rgb(0 0 0 / .1)
    }
  }


  .search-engine {
    height: 50px;
    transition: all .2s;
    transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
    backdrop-filter: blur(10px);
    border-radius: 6px;

    .clear-input {
      display: flex;
      padding: 0 10px;
      align-items: center;

      .close {
        width: 14px;
      }
    }
  }

  .shadow {
    box-shadow: 2px 8px 16px #999;
  }

  .search {
    left: 50%;
    top: 40%;
    z-index: 999;
    transform: translateX(-50%);
    max-width: 600px;


    .kano-icon {
      width: 40px;
      height: 100%;
      margin-left: 6px;
      fill: #222;
    }

    .input {
      width: 100%;
      color: #333;
      background: transparent;
    }

    &-btn {
      width: 60px;
      transition: all .2s;
    }

    &-btn:hover {
      background-color: #eee;
    }
  }

  .top-border {
    border-top: none;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }

  .search-engine-active {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
