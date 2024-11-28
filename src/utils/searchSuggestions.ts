import { jsonp } from "vue-jsonp";
//构造统一回传对象
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const makeObject = (res: Array<any>, titleProp = ""): Array<any> => {
  if (res) {
    let newRes = [...res];
    newRes = newRes.map((item) => {
      return {
        title: item[titleProp] ? item[titleProp] : item,
        isSelected: false,
      };
    });
    return newRes;
  }
    return [];
};

//baidu
const suggestBaidu = async (searchContent: string) => {
  const res = await jsonp("https://suggestion.baidu.com/su", {
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
  const res = await jsonp("https://sg1.api.bing.com/qsonhs.aspx", {
    callbackName: "bing_cb",
    q: searchContent,
    type: "cb",
    cb: "bing_cb",
    t: Date.now(),
  });
  return makeObject(res?.AS?.Results[1]?.Suggests, "Txt");
};

// Duck Duck Go(很遗憾，不支持JSONP)
const suggestDuckDuckGo = async (searchContent: string) => {
  return await suggestBaidu(searchContent)
  // let res = await jsonp(`https://start.duckduckgo.com/ac/`, {
  //   dataType: "jsonp",
  //   callback: "jsonCallback",
  //   q: searchContent,
  // });
  // console.log(res);
}

//暂无实现(被墙)
const suggestGoogle = async (searchContent: string) => {
  return [];
};

export const suggestAPI = {
  suggestBaidu,
  suggestBing,
  suggestDuckDuckGo
};

// export type SuggestAPI = {
//   suggestBaidu?: Function;
//   suggestBing?: Function;
//   method?: "suggestBaidu" | "suggestBing";
// };
