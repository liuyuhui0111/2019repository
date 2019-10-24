

import Vue from 'vue';
import store from './store';
import router from './router';
import './axios';
import mixin from './mixin';
import sensorsMixin from '@/mixin/sensors';
/* eslint-disable */
Vue.use(mixin);
Vue.use(sensorsMixin);

import App from './App.vue';
import './plugins/element';

// 神策埋点
import '@/assets/plugins/sensors';
// swiper 样式文件

import '@/plugins/swiper/swiper.css';

import COMMON_ENV from '@/config/env';
import VueLazyload from 'vue-lazyload';

// 全局公共样式文件,element-ui,swiper 样式调整文件
require('@/assets/styles/common.css');
require('@/assets/styles/reset-elementui.css');
require('@/assets/styles/reset-swiper.css');


Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: require('./assets/imgs/error.png'),
    loading: require('./assets/imgs/loadding.png'),
    attempt: 1,
});


/* eslint-enable */

Vue.config.productionTip = false;
// alert(JSON.stringify(router))
window.vue = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

window.COMMON_ENV = COMMON_ENV;
