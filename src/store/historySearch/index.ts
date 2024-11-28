import { defineStore } from "pinia";
import { getItem, getItemArray, setItem } from "@/utils/storage";
import { Configs } from "../Configs";

//搜索历史存储库
const searchHistoryIsEnabled = getItem("searchHistoryIsEnabled") ? getItem("searchHistoryIsEnabled") === 'true' : true

export const historySearch = defineStore("historySearch", {
    state: () => {
        return {
            //搜索历史列表
            //搜索历史功能未启用则为空数组
            historySearchList: searchHistoryIsEnabled ? getItemArray("historySearchList") ?? <Array<string>>[] : [],
        };
    },
    getters: {
        gethistorySearchList(state) {
            if (searchHistoryIsEnabled) {
                return state.historySearchList.map((item) => {
                    return {
                        title: item,
                        isSelected: false,
                        allowDel: true,
                    };
                })
            }
            return [];
        },
    },
    actions: {
        //存储搜索历史
        addHistory(item: string): void {
            if (item && item.trim() !== "") {
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
                const state = this.$state
                state.historySearchList = settings.historySearchList
                setItem('historySearchList', settings.historySearchList)
                // Object.keys(settings).forEach((key: any) => {
                //   state[key] = settings[key]
                // })
            }
        }
    },
});
