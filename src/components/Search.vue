<template>
  <div class="container mx-auto">
    <div class="search relative flex flex-col" @mouseleave="showHideSearchHistory">
      <!-- <div class="search-engine flex overflow-hidden" ref="searchEngineElement"> -->
      <form action="#" method="get" class="search-engine flex overflow-hidden dark:hover:dark-shadow"
        ref="searchEngineElement">
        <div class="flex items-center" @click="switchEngine">
          <svg class="icon kano-icon dark:dark-icon" aria-hidden="true">
            <use :xlink:href="selectedEngine.icon"></use>
          </svg>
        </div>
        <input type="text" v-model="searchContent" @keyup.enter="enterEvent"
          @input="searchSuggestion(selectedEngine.method)" @keydown="moveSuggestion" @mouseenter="eventMouse"
          @focusin="showHideSearchHistory" @mouseleave="eventMouse" class="input pl-3 box-border outline-none"
          :placeholder="`在${selectedEngine.name}上搜索`" />
        <div class="clear-input" @click="clearContent" v-show="searchContent">
          <svg class="icon close" aria-hidden="false">
            <use xlink:href="#icon-close"></use>
          </svg>
        </div>
        <button class="search-btn flex justify-center items-center dark:hover:dark-hover-bg" @click="startSearch()">
          <svg class="icon" aria-hidden="false" height="30px">
            <use xlink:href="#icon-search"></use>
          </svg>
        </button>
        <!-- </div> -->
      </form>
      <div class="search-suggestion top-border absolute dark:dark-bg" v-show="suggestWords.length">
        <ul>
          <li class="inner" :class="{ active: item.isSelected }" @click="startSearch(item.title)"
            v-for="(item, index) in suggestWords" :key="index">
            <span class="searchkey">{{ item.title }}</span>
            <svg class="close" aria-hidden="false" v-show="item.allowDel" @click.stop="delHistory(index)">
              <use xlink:href="#icon-close"></use>
            </svg>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import throttle from 'lodash/throttle'
import { suggestAPI } from '../utils/searchSuggestions'
import { isMobile } from '../utils/ua'
import useStore from '../store'
import { SuggestWords } from '../types/global'
const historySearch = useStore.historySearch()
interface SearchEngine {
  name: string,
  icon: string,
  url: string,
  method: 'suggestBaidu' | 'suggestBing'
}
// console.log(isMobile());
let searchEngines: Array<SearchEngine> = [{
  name: 'Baidu',
  icon: '#icon-bxl-baidu',
  url: !isMobile() ? 'https://www.baidu.com/baidu?&ie=utf-8&wd=' : 'https://www.baidu.com/from=%E5%82%BB%E9%80%BC%E7%99%BE%E5%BA%A6%E4%BD%A0%E5%A6%88%E6%AD%BB%E4%BA%86/s?ts=0&t_kt=0&ie=utf-8&ms=1&word=',
  method: 'suggestBaidu'
}, {
  name: 'Google',
  icon: '#icon-google',
  url: 'https://google.com/search?q=',
  method: 'suggestBaidu'
}, {
  name: 'Bing',
  icon: '#icon-bing',
  url: 'https://cn.bing.com/search?q=',
  method: 'suggestBing'
}]

// const global = inject(globalKey)
let searchContent = ref('')
let selectedEngine = reactive<SearchEngine>({ ...searchEngines[0] })
let engineIndex: number = 1
let suggestionIndex = -1
let suggestWords = ref<Array<SuggestWords>>([])

//点击图标切换搜索引擎
const switchEngine = (): void => {
  let newEngine = searchEngines[engineIndex++ % (searchEngines.length)]
  selectedEngine.name = newEngine.name
  selectedEngine.url = newEngine.url
  selectedEngine.icon = newEngine.icon
  selectedEngine.method = newEngine.method
}

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
  //清除阴影
  searchEngineElement.value?.classList.remove("shadow")
  //清除一下历史选择的index
  suggestionIndex = -1

  if (searchContent.value) {
    let res = await suggestAPI[method](searchContent.value)
    suggestWords.value.length = 0
    suggestWords.value.push(...res)
  } else {
    suggestWords.value.length = 0
  }
}, 333)

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
    suggestWords.value = [...historySearch.gethistorySearchList];
  } else {
    //让子弹飞一会
    setTimeout(() => {
      suggestWords.value.length = 0
    }, 200)
  }
}

//删除搜索历史
const delHistory = (index: number) => {
  suggestWords.value.splice(index, 1)
  historySearch.deleteHistory(index)
}
</script>

<style scoped lang="less">
.container {
  height: 100%;
  padding: 0 15px;

  // overflow: scroll;
  .search-suggestion {
    width: 100%;
    top: 89%;
    background: white;
    border: 1px solid #ccc;
    border-radius: 6px;

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
      }
    }

    li:hover,
    .active {
      background-color: rgb(0 0 0 / .1)
    }
  }


  .search-engine {
    height: 50px;
    border: 1px solid #ccc;
    border-radius: 6px;
    transition: all .2s;
    transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);

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
    transform: translateX(-50%);
    max-width: 600px;

    .kano-icon {
      width: 40px;
      margin-left: 6px;
    }

    .input {
      width: 500px;
      color: #666;
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
}
</style>
