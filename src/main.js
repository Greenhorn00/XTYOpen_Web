import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import  './assets/global.css';
import axios from "axios";

//引入代码块高亮插件
import Highlight from "./codeFont/index.js";

import VueRouter from "vue-router"; //路由
import router from "@/router";
import store from "@/store";//路由

// 隐藏 右侧浏览器 滚动条
import VueSmoothScroll from "vue2-smooth-scroll";
Vue.prototype.$music = new Audio();
Vue.prototype.$axios=axios;
// Vue.prototype.$httpUrl=' https://123.57.77.249:9000'; //后端地址
// Vue.prototype.$httpUrl='https://8.140.192.183:9000'; //后端地址
Vue.prototype.$httpUrl=' https://localhost:9000'; //后端地址
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(VueSmoothScroll);
Vue.use(Highlight);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
