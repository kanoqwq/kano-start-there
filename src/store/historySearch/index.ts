import { defineStore } from "pinia";
import { getItemArray, setItem } from "../../utils/storage";
//搜索历史存储库
export const historySearch = defineStore("historySearch", {
  state: () => {
    return {
      //搜索历史列表
      historySearchList: getItemArray("historySearch") ?? <Array<any>>[],
    };
  },
  getters: {
    gethistorySearchList(state) {
      return state.historySearchList.map((item) => {
        return {
          title: item,
          isSelected: false,
        };
      });
    },
  },
  actions: {
    //存储搜索历史
    addHistory(item: string): void {
      if (item && item.trim() != "") {
        // 去重
        const index = this.historySearchList.indexOf(item);
        if (index == -1) {
          this.historySearchList.push(item);
          setItem("historySearch", this.historySearchList);
        }
      }
    },
  },
});
