import { AxiosStatic } from "axios";

export interface Global {
  axios?: AxiosStatic;
}

export interface SuggestWords {
  title: string;
  isSelected: boolean;
  allowDel: boolean;
}

interface SearchEngine {
  name: string;
  icon: string;
  url: string;
  method: "suggestBaidu" | "suggestBing";
}
