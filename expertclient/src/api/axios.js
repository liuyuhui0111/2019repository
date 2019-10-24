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
        config.headers.Authorization = store.getters.token ? 'Bearer '+store.getters.token : 'Bearer';
        // config.headers.Authorization = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWNlbnNlIjoibWFkZSBieSBoZWF2ZW4iLCJ1c2VyX25hbWUiOiIxODUwMDM2OTE3NiIsInNjb3BlIjpbInNlcnZlciJdLCJ1c2VyVHlwZSI6IkMiLCJleHAiOjE1NjUzNTY4MDIsInVzZXJJZCI6MTgsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJqdGkiOiI2MmE2ZDQ4NC1iNjE5LTRhNzgtODJkNi05ZTFlMGUwYmUwYjQiLCJjbGllbnRfaWQiOiJmYXRjIn0.bXLegVDQTYE1WgCN7u2_47y5-BsbfBi1tUWT1gq6V_A';
        config.headers.httpHost = window.location.href || '';
        config.headers.userId = store.getters.curUserData.userId ? store.getters.curUserData.userId : '-1';

        if(!config.isHideLoading){
          // 如果为true 请求提示loadding
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
              Vue.prototype.$$message({
                message: error,
                type: 'warning'
              });
            return Promise.reject(error)
        }else{
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
    (response) => {
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
            if(response.data.code === '1058' && store.getters.token){
              // 登录过期
              // Vue.prototype.$$message({
              //   message: '登录状态过期，请重新登录',
              //   type: 'warning'
              // });
              store.commit('setToken','');
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
              Vue.prototype.$$message({
                message: error,
                type: 'warning'
              });
            return Promise.reject(error)
        }else{
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
