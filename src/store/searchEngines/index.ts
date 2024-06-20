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
          name: "Baidu",
          icon: "#icon-bxl-baidu",
          url: !isMobile()
            ? "https://www.baidu.com/baidu?&ie=utf-8&wd="
            : "https://www.baidu.com/from=%E5%82%BB%E9%80%BC%E7%99%BE%E5%BA%A6%E4%BD%A0%E5%A6%88%E6%AD%BB%E4%BA%86/s?ts=0&t_kt=0&ie=utf-8&ms=1&word=",
          method: "suggestBaidu",
        },
        {
          name: "Google",
          icon: "#icon-google",
          url: "https://google.com/search?q=",
          method: "suggestBaidu",
        },
        {
          name: "Bing",
          icon: "#icon-bing",
          url: "https://cn.bing.com/search?q=",
          method: "suggestBing",
        },
        {
          name: "Duck Duck Go",
          icon: "#icon-icons-duckduckgo",
          url: "https://duckduckgo.com/?t=h_&hps=1&start=1&ia=web&q=",
          method: "suggestDuckDuckGo",
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
