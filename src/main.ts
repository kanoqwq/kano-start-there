import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import "./assets/css/reset.css";
import App from "./App.vue";
import axios from "./utils/request";
import { globalKey } from "./symbols";
const app = createApp(App);
//pinia
app.use(createPinia());
//全局挂载
app.provide(globalKey, {
  axios,
});
app.mount("#app");
