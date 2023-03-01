import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";
// 请求拦截器
axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
});
// 响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (err) => {
    return Promise.reject(err);
  }
);
export default axios;
