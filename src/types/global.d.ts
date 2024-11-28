import type { AxiosStatic } from "axios";

export interface Global {
  axios?: AxiosStatic;
}

export interface SuggestWords {
  title: string;
  isSelected: boolean;
  allowDel: boolean;
}

export interface SearchEngine {
  id: number,
  name: string;
  icon: string;
  url: string;
  method: "suggestBaidu" | "suggestBing";
}


interface LinkObj {
  id?: number,
  href: string,
  imgUrl: string,
  isBlank?: boolean,
}