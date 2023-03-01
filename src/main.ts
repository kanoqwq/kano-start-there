import { createApp, provide } from "vue";
import "./style.css";
import "./assets/css/reset.css";
import App from "./App.vue";
import axios from "./util/request";
const app = createApp(App);
//全局挂载
provide("global", {
  axios
});
app.mount("#app");
