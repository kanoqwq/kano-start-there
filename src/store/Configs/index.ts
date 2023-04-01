import { defineStore } from "pinia";
import { getItemArray, setItem } from "../../utils/storage";
export const Configs = defineStore("Configs", {
  state() {
    return {
      //背景图片（多图）
      backgroundImages: getItemArray("backgroundImages") || [],
    };
  },
  getters: {
    bgs(state) {
      return state.backgroundImages;
    },
  },
  actions: {
    //设置背景图片
    setBackgroundImage(image: string) {
      //去重
      let index = this.backgroundImages.indexOf(image);
      if (index == -1) {
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
  },
});
