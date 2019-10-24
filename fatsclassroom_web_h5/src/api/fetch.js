/* eslint-disable */
import axios from '@/axios';
// 代理接口名称
// const devProxy = ['/api', '/riskCalc', '/server','/account','/aosp-dmm','/client','/aosp-extra','/aosp-oam','/aosp-product','/aosp-msg']; // 代理
// 后台微服务名，与代理接口对应位置
// const serviceName = ['/index-manage', '/risk-manage', '/api-gateway/server', '/api-gateway/account', '/api-gateway/aosp-dmm/aosp-dmm',
// '/api-gateway/customer','/api-gateway/extra','/api-gateway/aosp-oam/aosp-oam','/api-gateway/product','/api-gateway/aosp-msg/aosp-msg'];
const environment = process.env.NODE_ENV;

const get = (url, params, config) => {
    return axios.get(url, { params }, config);
};
const post = (url, params, config) => {
    return axios.post(url, params, config);
}


const del = (url, config) => new Promise((resolve, reject) => {
    axios
        .delete(handleUrl(url), config)
        .then(
            (res) => {
                resolve(res);
            },
            (err) => {
                reject('网络连接失败，请稍后重试');
            },
        )
        .catch((err) => {
            reject('网络连接失败，请稍后重试');
        });
});

const filePost = (url, params, config) => new Promise((resolve, reject) => {
    axios
        .post(handleUrl(url), params, config)
        .then(
            (res) => {
                resolve(res);
            },
            (err) => {
                reject('网络连接失败，请稍后重试');
            },
        )
        .catch((err) => {
            reject('网络连接失败，请稍后重试');
        });
});

const urlAddParams = (url, params) => {
    let tmp = '';
    if (params) {
        for (const i in params) {
            tmp += `${i}=${params[i]}&`;
        }
        tmp = `${url}?${tmp.substr(0, tmp.length - 1)}`;
    } else {
        tmp = url;
    }
    return tmp;
};
// form表单方式提交
const postForm = (option = { params: {}, data: {} }) => new Promise((resolve, reject) => {
    axios
        .post(urlAddParams(handleUrl(option.url), option.params), option.data)
        .then(
            (res) => {
                resolve(res);
            },
            (err) => {
                reject(err);
            },
        )
        .catch((err) => {
            reject(err);
        });
});
// get请求地址栏带参数的
const getForm = (option = { params: {}, data: {} }) => new Promise((resolve, reject) => {
    axios
        .get(handleUrl(option.url), { params: option.params })
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            reject(err);
        });
});

const handleUrl = url =>
    // if(url === undefined || url === 'undefined' || url === null || url === ''){
    //     return url;
    // }
    // if (environment === 'production') {
    //     devProxy.forEach((value, index) => {
    //         //开始出现的位置
    //         const startIndex = url.indexOf(value);
    //         if(startIndex != -1){
    //             //截取代理前缀
    //             url = url.substring(startIndex + value.length, url.length);
    //             //拼接后台微服务名
    //             url = serviceName[index] + url;
    //             return url;
    //         }
    //     });
    // }
    url;

export {
    post, get, del, filePost, postForm, getForm,
};
