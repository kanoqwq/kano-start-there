import { createApp } from "vue";
import "./style.css";
import "./assets/css/reset.css";
import App from "./App.vue";
import axios from "./utils/request";
import { globalKey } from "./symbols";
const app = createApp(App)
//全局挂载
app.provide(globalKey, {
  axios,
});
app.mount("#app");
