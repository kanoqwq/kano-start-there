import { defineStore } from "pinia";
import { getItemArray, setItem, getItem } from "@/utils/storage";
import { LinkObj } from "@/types/global";

let images = getItem("backgroundImages")
let live2dEnabled = getItem("live2dEnabled")
let searchTransitonIsEnabled = getItem("searchTransitonIsEnabled")

export const Configs = defineStore("Configs", {
  state() {
    return {
      //背景图片（多图）
      backgroundImages: (images ? (JSON.parse(images).length ? JSON.parse(images) : []) : ['./assets/bg.webp']) as Array<string>,
      //是否启用live2d
      live2dIsEnabled: live2dEnabled ? live2dEnabled == 'true' ? true : false : true,
      //是否启用搜索框动画
      searchTransitonIsEnabled: searchTransitonIsEnabled ? searchTransitonIsEnabled == 'true' ? true : false : true,
      //常用链接列表
      favLinks: getItemArray("favLinks") || [],
      //过滤词列表
      filterWords: getItemArray("filterWords") || [],
      modelId: Number(getItem("modelId")) || 1
    };
  },
  getters: {
    bgs(state) {
      return state.backgroundImages
    },
    live2dEnabled(state) {
      return state.live2dIsEnabled
    },
    modId(state) {
      return state.modelId
    },
    searchTransitonEnabled(state) {
      return state.searchTransitonIsEnabled
    },
    links(state) {
      return state.favLinks
    },
    //格式化后的过滤词（可以直接附加在url的keyword后面）
    formattedFilterWords(state) {
      return state.filterWords.length ? '-' + state.filterWords.join(' -') : ''
    }
  },
  actions: {
    //设置过滤词
    setFilterWord(word: string) {
      if (this.filterWords.findIndex(item => item.toLowerCase() === word.toLowerCase()) == -1) {
        const newFilterWords = [...new Set([...this.filterWords].concat(word))]
        this.filterWords = newFilterWords
        setItem("filterWords", newFilterWords);
        return true;
      } else {
        return false
      }
    },
    //删除指定过滤词
    removeFilterWord(word: string) {
      const newFilterWords = this.filterWords.filter(wd => wd != word)
      this.filterWords = newFilterWords
      setItem("filterWords", newFilterWords);
    },
    //清空过滤词
    clearFilterWord() {
      this.filterWords.length = 0
      setItem("filterWords", this.filterWords);
    },
    //设置背景图片
    setBackgroundImage(image: string) {
      if (image) {
        this.backgroundImages.push(image);
        setItem("backgroundImages", this.backgroundImages);
      }
    },
    //获取背景图片
    getBackgroundImage(index: number): string {
      if (index < 0 || isNaN(Number(index))) {
        return this.backgroundImages[this.backgroundImages.length - 1];
      }
      return this.backgroundImages[index];
    },
    getBackgroundImages(): string[] {
      return this.backgroundImages;
    },
    //清空背景图片
    resetBackground() {
      setItem("backgroundImages", []);
      this.backgroundImages = []
    },
    //开关live2d功能
    toggleLive2d(flag: boolean) {
      this.live2dIsEnabled = flag
      setItem("live2dEnabled", flag);
    },
    //开关搜索框动画
    toggleSearchTransiton(flag: boolean) {
      this.searchTransitonIsEnabled = flag
      setItem("searchTransitonIsEnabled", flag);
    },
    //修改常用链接
    updateFavLink(linkObj: LinkObj) {
      let curLinksIndex: number = this.favLinks.findIndex(item => item.href.trim() == linkObj.href.trim())
      //如在现有列表重找到url一致的标签，则进行替换
      if (curLinksIndex !== -1) {
        if (linkObj) {
          this.favLinks[curLinksIndex] = {
            href: linkObj.href.trim(),
            imgUrl: linkObj.imgUrl.trim(),
            isBlank: linkObj.isBlank
          }
          setItem("favLinks", this.favLinks)
        }
      }
    },
    // 设置常用链接
    setFavLink(linkObj: LinkObj) {
      if (linkObj.href.trim() == '') {
        throw new Error("链接不能为空")
      } else if (linkObj.imgUrl.trim() == '') {
        throw new Error("图片地址不能为空")
      } else if (this.favLinks.length >= 4) {
        throw new Error("常用链接最大不超过四个")
      } else {
        if (linkObj) {
          this.favLinks.push({
            href: linkObj.href.trim(),
            imgUrl: linkObj.imgUrl.trim(),
            isBlank: linkObj.isBlank
          })
          setItem("favLinks", this.favLinks)
        }
      }
    },
    //删除指定链接
    removeFavLinkByUrl(href: string) {
      const newFavLinks = this.favLinks.filter(item => item.href != href)
      this.favLinks = newFavLinks
      setItem("favLinks", newFavLinks)
    },
    //清空常用链接
    clearFavLink() {
      this.favLinks.length = 0;
      setItem("favLinks", this.favLinks)
    },
    //设置模型index
    setModelId(index: number) {
      this.modelId = index
      setItem('modelId', index)
    },
    //初始化一切
    reset() {
      localStorage.clear()
    },
    //导入设置
    importSettings(settings: typeof this.$state) {
      if (settings) {
        let state = this.$state
        state.backgroundImages = settings.backgroundImages
        setItem('backgroundImages', settings.backgroundImages)
        state.favLinks = settings.favLinks
        setItem('favLinks', settings.favLinks)

        state.filterWords = settings.filterWords
        setItem('filterWords', settings.filterWords)

        state.live2dIsEnabled = settings.live2dIsEnabled
        setItem('live2dIsEnabled', settings.live2dIsEnabled)

        state.modelId = settings.modelId
        setItem('modelId', settings.modelId)

        state.searchTransitonIsEnabled = settings.searchTransitonIsEnabled
        setItem('searchTransitonIsEnabled', settings.searchTransitonIsEnabled)

      }
      // Object.keys(settings).forEach((key: any) => {
      //   state[key] = settings[key]
      // })
    }
  },
});
