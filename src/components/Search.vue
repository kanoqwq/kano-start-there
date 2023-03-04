<template>
  <div class="container mx-auto">
    <div class="search relative flex flex-col">
      <div class="search-engine flex overflow-hidden" ref="searchEngineElement">
        <div class="flex items-center" @click="switchEngine">
          <svg class="icon kano-icon" aria-hidden="true">
            <use :xlink:href="selectedEngine.icon"></use>
          </svg>
        </div>
        <input type="text" v-model="searchContent" @keyup.enter="enterEvent" @input="searchSuggestion"
          @keyup="moveSuggestion" class="input pl-3 box-border outline-none"
          :placeholder="`在${selectedEngine.name}上搜索`" />
        <div class="clear-input" @click="clearContent" v-show="searchContent">
          <svg class="icon close" aria-hidden="false">
            <use xlink:href="#icon-close"></use>
          </svg>
        </div>
        <button class="search-btn flex justify-center items-center" @click="startSearch()">
          <svg class="icon" aria-hidden="false" height="30px">
            <use xlink:href="#icon-search"></use>
          </svg>
        </button>
      </div>
      <div class="search-suggestion top-border absolute" v-show="suggestWords.length" ref="searchSuggestionElement">
        <ul>
          <li :class="{ active: item.isSelected }" v-for="(item, index) in suggestWords" :key="index"
            @click="startSearch(item.title)">{{ item.title }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, Ref } from 'vue'
import { jsonp } from 'vue-jsonp'
//@ts-ignore
import throttle from 'lodash/throttle'
// import { globalKey } from '../symbols/'

interface SearchEngine {
  name: string,
  icon: string,
  url: string
}

let searchEngines: Array<SearchEngine> = [{
  name: 'Baidu',
  icon: '#icon-bxl-baidu',
  url: 'https://www.baidu.com/baidu?&ie=utf-8&wd='
}, {
  name: 'Google',
  icon: '#icon-google',
  url: 'https://google.com'
}, {
  name: 'Bing',
  icon: '#icon-bing',
  url: 'https://bing.com'
}]

// const global = inject(globalKey)
let searchContent = ref('')
let selectedEngine = reactive<SearchEngine>({ ...searchEngines[0] })
let engineIndex: number = 1
let suggestionIndex = -1

//点击图标切换搜索引擎
const switchEngine = (): void => {
  let newEngine = searchEngines[engineIndex++ % (searchEngines.length)]
  selectedEngine.name = newEngine.name
  selectedEngine.url = newEngine.url
  selectedEngine.icon = newEngine.icon
}

const startSearch = (keyWord = ''): void => {
  if (keyWord) {
    searchContent.value = keyWord.trim()
  }
  let reqUrl = selectedEngine.url + searchContent.value.trim()
  //返回到搜索页面时刷新
  window.open(reqUrl, '_blank')
}

//回车搜索
const enterEvent = (): void => {
  startSearch()
}
interface SuggestWords {
  title: string,
  isSelected: boolean
}
let suggestWords = ref<Array<SuggestWords>>([])
//搜索建议
//http://suggestion.baidu.com/su?wd=关键词&p=3&cb=callbackFunction&t=time
const searchSuggestion = throttle(async (): Promise<void> => {
  //清除一下历史选择的index
  suggestionIndex = -1
  if (searchContent.value) {
    let res = await jsonp('http://suggestion.baidu.com/su', {
      callbackName: 'kano_jsonp',
      wd: searchContent.value,
      cb: 'kano_jsonp',
      t: Date.now(),
      p: 3
    })
    // console.log(res.s);
    suggestWords.value.length = 0
    //构造res
    let newRes = [...res.s]
    newRes = newRes.map((item) => {
      return {
        title: item,
        isSelected: false
      }
    })
    console.log(newRes);

    suggestWords.value.push(...newRes)
  } else {
    suggestWords.value.length = 0
  }
}, 211)

const clearContent = (): void => {
  suggestWords.value.length = 0
  searchContent.value = ''
}

//实现上下键选择候选词
const moveSuggestion = (e: KeyboardEvent): void => {
  let key = e.key
  if (key == 'ArrowUp') {
    if (suggestionIndex == 0 || suggestionIndex == -1) {
      suggestionIndex = suggestWords.value.length - 1
    } else {
      suggestionIndex = (suggestionIndex - 1) % suggestWords.value.length;
    }
    removeActive();
    suggestWords.value[suggestionIndex].isSelected = true
    searchContent.value = suggestWords.value[suggestionIndex].title
  } else if (key == 'ArrowDown') {
    if (suggestWords.value.length - 1 == suggestionIndex) {
      suggestionIndex = 0
    } else {
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
</script>

<style scoped lang="less">
.container {
  height: 100%;
  padding: 0 15px;

  .search-suggestion {
    width: 100%;
    top: 89%;
    background: white;
    border: 1px solid #ccc;
    border-radius: 6px;

    li {
      padding: 8px 15px;
      transition: all .1s;
    }

    li:hover,
    .active {
      background-color: #eee;
    }
  }

  .search-engine {
    height: 50px;
    border: 1px solid #ccc;
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
