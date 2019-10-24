import Vue from 'vue';
import Axios from 'axios';
// import qs from 'qs';
import store from '@/store';


const axios = Axios.create({
  timeout: 1000 * 60 * 3, // 超时时间60s
  // baseURL: '',
  withCredentials: false, // 跨域请求时，允许其他域设置自身站点下的cookie
  cache: false,
});
// axios.defaults.headers['content-type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let COMMON_LOADING = null;
let requestList = [];

/* eslint-disable */
/**
      * 全局请求拦截器
*/
axios.interceptors.request.use(
    (config) => {
        // if(!config.noBaseUrl){
        //   // 如果noBaseUrl不为真  拼接baseUrl
        //   config.url = BASE_URL + config.url;
        // }
        config.headers.Authorization = store.getters.token ? store.getters.token : '-1';
        config.headers.userId = store.getters.curUserData.id ? store.getters.curUserData.id : '-1';
        // config.headers.Authorization = '20190821111718664aac1cdf2e60146d6a0b06aa0b49ace4c';
        config.headers.httpHost = window.location.href || '';

        if(!config.isHideLoading){
          // 如果不为true 请求提示loadding
          requestList.push(config.url);
          if(!COMMON_LOADING){
            COMMON_LOADING = Vue.prototype.$loading();
          }
        }
        // 添加headers "application/x-www-form-urlencoded"
        //如果是formdata格式 自动格式化数据
        if(config.method === 'post' && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {

          if(window.FormData){
            const formData = new FormData();
            let data = config.data
            for(let key in data){
              formData.append(key,data[key])
            }
            config.data = formData
            // config.data = qs.stringify(config.data);
          }else{
            // config.headers['Content-Type'] === 'application/json';
            console.log('不支持formdata')
          }
        }

        return config;
    }, (error) => {
    if (process.env.NODE_ENV === 'development') {
              Vue.prototype.$$message.closeAll();
              Vue.prototype.$$message({
                message: error,
                type: 'warning'
              });
            return Promise.reject(error)
        } else {
              Vue.prototype.$$message.closeAll();
              Vue.prototype.$$message({
                message: '请求出错，请稍后再试',
                type: 'warning'
              });
            return Promise.reject('请求出错，请稍后再试')
        }
    },
);

/**
      * 全局响应拦截器
*/
axios.interceptors.response.use(
    async (response) => {
            if(COMMON_LOADING){

              requestList.forEach((item,index)=>{
                if(item === response.config.url){
                  requestList.splice(index,1);
                }
              })
              if(requestList.length<1){
                COMMON_LOADING.close();
                COMMON_LOADING = null;
              }
            }
            // console.log('token::::::::',store.getters.token,'code::::::::',response.data.code)
            if((response.data.code === '1058' 
              || response.data.code ==='1059') 
              && store.getters.token){
              let mes = response.data.code === '1058' ? '登录状态过期' : '用户账户已在其他设备登录' 
              // 登录过期
              window.vue.setToken('');
              await window.vue.$$confirm(mes, '确定', '', '', true);
              window.vue.routerReplace('/login');
            }
            return response;
    },
    (error) => {
          if(COMMON_LOADING && error.config && error.config.url){
              requestList.forEach((item,index)=>{
                if(item === error.config.url){
                  requestList.splice(index,1);
                }
              })
              if(requestList.length<1){
                COMMON_LOADING.close();
                COMMON_LOADING = null;
              }
          }else{
            COMMON_LOADING = null;
            requestList=[];
          }
        if (process.env.NODE_ENV === 'development') {
              Vue.prototype.$$message.closeAll();
              Vue.prototype.$$message({
                message: error,
                type: 'warning'
              });
            return Promise.reject(error)
        } else {
              Vue.prototype.$$message.closeAll();
              Vue.prototype.$$message({
                message: '请求出错，请稍后再试',
                type: 'warning'
              });
            return Promise.reject('请求出错，请稍后再试')
        }

    },
);
/* eslint-enable */
Vue.prototype.$http = axios;
// window.$http = axios
export default axios;
