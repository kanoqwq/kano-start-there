import { jsonp } from "vue-jsonp";
//构造统一回传对象
const makeObject = (res: Array<any>, titleProp: string = ""): Array<any> => {
  if (res) {
    let newRes = [...res];
    newRes = newRes.map((item) => {
      return {
        title: item[titleProp] ? item[titleProp] : item,
        isSelected: false,
      };
    });
    return newRes;
  } else {
    return [];
  }
};

//baidu
const suggestBaidu = async (searchContent: string) => {
  let res = await jsonp("https://suggestion.baidu.com/su", {
    callbackName: "baidu_cb",
    wd: searchContent,
    cb: "baidu_cb",
    t: Date.now(),
    p: 3,
  });
  return makeObject(res?.s);
};

//bing
const suggestBing = async (searchContent: string) => {
  let res = await jsonp("https://sg1.api.bing.com/qsonhs.aspx", {
    callbackName: "bing_cb",
    q: searchContent,
    type: "cb",
    cb: "bing_cb",
    t: Date.now(),
  });
  return makeObject(res?.AS?.Results[1]?.Suggests, "Txt");
};

//暂无实现(被墙)
const suggestGoogle = async (searchContent: string) => {
  return [];
};

export const suggestAPI = {
  suggestBaidu,
  suggestBing,
};

// export type SuggestAPI = {
//   suggestBaidu?: Function;
//   suggestBing?: Function;
//   method?: "suggestBaidu" | "suggestBing";
// };
