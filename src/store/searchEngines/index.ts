import { defineStore } from "pinia";
import { SearchEngine } from "@/types/global";
import { setItem, getItem } from "@/utils/storage";
import { isMobile } from "@/utils/ua";
export const searchEngines = defineStore("searchEngines", {
  state() {
    return {
      //搜索引擎
      searchEngines: [
        {
          id: 1,
          name: "Baidu",
          icon: "icon-bxl-baidu",
          url: !isMobile()
            ? "https://www.baidu.com/baidu?&ie=utf-8&wd="
            : "https://www.baidu.com/from=%E5%82%BB%E9%80%BC%E7%99%BE%E5%BA%A6%E4%BD%A0%E5%A6%88%E6%AD%BB%E4%BA%86/s?ts=0&t_kt=0&ie=utf-8&ms=1&word=",
          method: "suggestBaidu",
        },
        {
          id: 2,
          name: "Google",
          icon: "icon-google",
          url: "https://google.com/search?q=",
          method: "suggestBaidu",
        },
        {
          id: 3,
          name: "Bing",
          icon: "icon-bing",
          url: "https://cn.bing.com/search?q=",
          method: "suggestBing",
        },
        {
          id: 4,
          name: "Duck Duck Go",
          icon: "icon-icons-duckduckgo",
          url: "https://duckduckgo.com/?t=h_&hps=1&start=1&ia=web&q=",
          method: "suggestDuckDuckGo",
        },
        {
          id: 5,
          name: "Baidu开发者",
          icon: "icon-baidurenzhenga",
          url: 'https://kaifa.baidu.com/searchPage?wd=',
          method: "suggestBaidu",
        },
        {
          id: 6,
          name: "360搜索",
          icon: "icon-sousuo",
          url: "https://www.so.com/s?q=",
          method: "suggestBaidu",
        },
        {
          id: 7,
          name: "搜狗",
          icon: "icon-sougou",
          url: !isMobile()
            ? "https://www.sogou.com/web?query="
            : "https://m.sogou.com/web/searchList.jsp?s_from=pcsearch&keyword=",
          method: "suggestBaidu",
        },
        {
          id: 8,
          name: "GitHub",
          icon: "icon-github",
          url: "https://github.com/search?q=",
        },
        {
          id: 9,
          name: "StackOverflow",
          icon: "icon-stackoverflow",
          url: "https://stackoverflow.com/nocaptcha?s=",
        },
        {
          id: 10,
          name: "MDN",
          icon: "icon-mozilla",
          url: "https://developer.mozilla.org/zh-CN/search?q=",
        },
        {
          id: 11,
          name: "哔哩哔哩",
          icon: "icon-bilibili-line",
          url: "https://search.bilibili.com/all?keyword=",
        },
        {
          id: 12,
          name: "抖音",
          icon: "icon-douyin",
          url: "https://www.douyin.com/search/",
        },

        {
          id: 13,
          name: "Yahoo!",
          icon: "icon-yahoo-fill",
          url: "https://hk.search.yahoo.com/search?p=",
          method: "suggestBaidu",
        },
        {
          id: 14,
          name: "知乎",
          icon: "icon-zhihu",
          url: "https://www.zhihu.com/search?type=content&q=",
        },
        {
          id: 15,
          name: "小红书",
          icon: "icon-xiaohongshu",
          url: "https://www.xiaohongshu.com/search_result/?&m_source=itab&keyword=",
        },

      ] as Array<SearchEngine>,
      //上一次选中的搜索引擎index
      lastSelectedEngine: Number(getItem("selectedEngine")) || 0,
    };
  },
  getters: {
    selectedEngine(state) {
      let tmp = Number(state.lastSelectedEngine);
      if (isNaN(tmp) && tmp >= 0) {
        //数字不合规，重置为0
        state.lastSelectedEngine = 0;
      }
      return tmp;
    },
    getSearchEngines(state) {
      return state.searchEngines
    }
  },
  actions: {
    //设置搜索引擎选中记录
    setSelectedEngine(index: number) {
      if (!isNaN(Number(index)) && index >= 0) {
        this.lastSelectedEngine = index;
      } else {
        this.lastSelectedEngine = 0;
      }
      setItem("selectedEngine", index);
    },
  },
});
