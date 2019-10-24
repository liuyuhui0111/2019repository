

import Vue from 'vue';
import './cube-ui';
import store from './store';
import router from './router';
import './axios';

import mixin from './mixin';
import sensorsMixin from '@/mixin/sensors';
/* eslint-disable */
Vue.use(mixin);
Vue.use(sensorsMixin);


import App from './App.vue';
// swiper 样式文件

// 神策埋点
import '@/assets/plugins/sensors';

import COMMON_ENV from '@/config/env';
import VueLazyload from 'vue-lazyload';
import 'amfe-flexible'
// fastclick
// import FastClick from 'fastclick';
// FastClick.attach(document.body);
/* eslint-enable */
// 全局公共样式文件,element-ui,swiper 样式调整文件
require('@/assets/styles/common.css');


/* eslint-disable */
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: require('@/assets/imgs/error.png'),
    loading: require('@/assets/imgs/loadding.png'),
    attempt: 1,
});

/* eslint-enable */


Vue.config.productionTip = false;
window.vue = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');


window.COMMON_ENV = COMMON_ENV;
// window.env = process.env;
