import { defineStore } from "pinia";
import { getItemArray, setItem, getItem } from "@/utils/storage";
export const Configs = defineStore("Configs", {
  state() {
    return {
      //背景图片（多图）
      backgroundImages: getItemArray("backgroundImages") || [],
      //是否启用live2d
      live2dIsEnabled: getItem("live2dEnabled") == 'true' ? true : false
    };
  },
  getters: {
    bgs(state) {
      return state.backgroundImages;
    },
    live2dEnabled(state) {
      return state.live2dIsEnabled
    }
  },
  actions: {
    //设置背景图片
    setBackgroundImage(image: string) {
      //去重
      //   let index = this.backgroundImages.indexOf(image); 
      //   if (index == -1) {
      if (image) {
        this.backgroundImages.push(image);
        setItem("backgroundImages", this.backgroundImages);
      }
      //   }
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
      localStorage.removeItem("backgroundImages");
    },
    //开关live2d功能
    toggleLive2d(flag: boolean) {
      this.live2dIsEnabled = flag
      setItem("live2dEnabled", flag);
    }
  },
});
