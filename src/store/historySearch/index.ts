import { defineStore } from "pinia";
import { getItemArray, setItem } from "@/utils/storage";
//搜索历史存储库
export const historySearch = defineStore("historySearch", {
  state: () => {
    return {
      //搜索历史列表
      historySearchList: getItemArray("historySearchList") ?? <Array<any>>[],
    };
  },
  getters: {
    gethistorySearchList(state) {
      return state.historySearchList.map((item) => {
        return {
          title: item,
          isSelected: false,
          allowDel: true,
        };
      });
    },
  },
  actions: {
    //存储搜索历史
    addHistory(item: string): void {
      if (item && item.trim() != "") {
        // 去重
        this.historySearchList.unshift(item);
        this.historySearchList = [...new Set(this.historySearchList)]
        setItem("historySearchList", this.historySearchList);
      }
    },
    //删除搜索历史（index
    deleteHistory(index: number): void {
      this.historySearchList.splice(index, 1);
      setItem("historySearchList", this.historySearchList);
    },
    //导入设置
    importSettings(settings: typeof this.$state) {
      if (settings) {
        let state = this.$state
        state.historySearchList = settings.historySearchList
        setItem('historySearchList', settings.historySearchList)
        // Object.keys(settings).forEach((key: any) => {
        //   state[key] = settings[key]
        // })
      }
    }
  },
});
