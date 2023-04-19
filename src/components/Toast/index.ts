/*
 * @Author: kanoqwq
 * @Email: 1540508428@qq.com
 * @Date: 2023-04-17 14:47:36
 * @Last Modified by:   kanoqwq
 * @Last Modified time: 2023-04-17 14:47:36
 * @Description: Description
 */

import { createVNode, render } from "vue";
import toastTemplate from "./index.vue";
export interface Props {
  value?: string;
  duration?: number;
  background?: string;
  color?: string;
}
const defaultOptions = {
  duration: 3000,
};

export const Toast = (options: Props): void => {
  const container = document.createElement("div");
  const opt = { ...defaultOptions, ...options };
  const vm = createVNode(toastTemplate, opt);
  render(vm, container);
  document.body.appendChild(container);
  const dom = vm.el as HTMLDivElement;
  //添加淡入效果
  dom.classList.add("enter");
  //移除淡入效果
  setTimeout(() => {
    dom.classList.remove("enter");
  }, 300);
  //添加淡出效果
  setTimeout(() => {
    dom.classList.add("leave");
  }, opt.duration);
  //移除元素
  setTimeout(() => {
    document.body.removeChild(container);
  }, opt.duration + 300);
};
