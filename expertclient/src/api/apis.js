import axios from '@/api/axios';
import COMMON_ENV from '@/config/env';
import {
  replaceCode,
} from '@/assets/utils/util';

const BASE_URL = '/fatsapi/fats-expert';
// 公共接口
export function login(type, path) {
  // 登录注册
  const REDIRECT_URI = encodeURIComponent(replaceCode(path));
  // alert(replaceCode())
  // 去登录页 去登录的时候本地缓存 REDIRECT_URI 获取token传参无需编码，直接存href
  window.localStorage.setItem('REDIRECT_URI', replaceCode(path));

  let url = `/oauth/authorize?client_id=${COMMON_ENV.CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`;
  // let flag = confirm(`登录REDIRECT_URI地址是${replaceCode()}`);
  // if (!flag) {
  //     return;
  // }
  if (type === 'reg') {
    // 注册
    url = `/oauth/authorize?page=register&client_id=${COMMON_ENV.CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`;
  }
  window.location.href = COMMON_ENV.SSO_URL + url;
}
export function loginout() {
  // 退出登录
  const REDIRECT_URI = encodeURIComponent(replaceCode());
  window.localStorage.setItem('REDIRECT_URI', replaceCode());
  const url = `/course_authentication/h5/logout?redirect_uri=${REDIRECT_URI}`;
  window.location.href = COMMON_ENV.SSO_URL + url;
}

// export function getToken(params) {
//   // alert(window.localStorage.getItem('REDIRECT_URI'))
//   const url = '/course_authentication/oauth/token';
//   // // 获取token 从本地获取上一次REDIRECT_URI
//   const formData = {
//     client_id: COMMON_ENV.CLIENT_ID, // 为COMMON_ENV.CLIENT_ID:secret，分配一个即可
//     grant_type: 'authorization_code', // 固定取值authorization_code
//     redirect_uri: window.localStorage.getItem('REDIRECT_URI'), // 重定向地址,跟登录重定向地址保持一致
//     code: params.code, // 登录成功后，重定向回来的页面url中获取
//     client_secret: COMMON_ENV.CLIENT_ID,
//   };

//   return axios.post(url, formData);
// }
export function getIMById(params) {
  // 根据ID获取咨询单信息
  const url = '/login-expert/getIMById';
  return axios.get(BASE_URL + url, { params } || {});
}

export function getUserInfo(params) {
  // 获取用户信息
  const url = `${BASE_URL}/getUserInfo`;
  return axios.post(url, params || {});
}

export function getToken(params) {
  // 获取imtoken
  const url = '/user-im-info/getUserImInfo';
  return axios.post(BASE_URL + url, params || {}, {
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

export function fileUpload(params) {
  // 上传图片、文件
  const url = '/file-vo/fileUpload';
  return axios.post(BASE_URL + url, params || {}, {
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    isHideLoading: true,
  });
}

export function getEquityTime(params) {
  // 上传图片、文件
  const url = '/consult-equity/getEquityTime';
  return axios.post(BASE_URL + url, params || {});
}

export function addVipNotice(params) {
  // 添加用户购买会员提醒
  const url = '/consult-vip-notice/addVipNotice';
  return axios.post(BASE_URL + url, params || {});
}

export function getExpertQuestion(params) {
  // 提交咨询，获取咨询专家
  const url = '/consult-question/getExpertQuestion';
  return axios.post(BASE_URL + url, params || {}, {
    isLoading: true, // 显示loading
  });
}

export function andEvaluate(params) {
  // 添加用户评价
  const url = '/account-equity/andEvaluate';
  return axios.post(BASE_URL + url, params || {});
}


export function getWorkTime(params) {
  // 获取工作时间
  const url = '/consult-equity/getWorkTime';
  return axios.post(BASE_URL + url, params || {});
}
export function requestAuth(params) {
  // 用户授权
  const url = '/consult-auth/requestAuth';
  return axios.post(BASE_URL + url, params || {});
}
export function getWaitNum(params) {
  // 获取等待人数
  const url = '/consult-question/getWaitCounts';
  return axios.post(BASE_URL + url, params || {});
}
export function exchange(params) {
  // 专家转单
  const url = '/account-equity/exchange';
  return axios.post(BASE_URL + url, params || {});
}

export function endEvaluate(params) {
  // 结束咨询回话
  const url = '/consult-question/endExpertQuestion';
  return axios.post(BASE_URL + url, params || {});
}
export function uauth(params) {
  // 回收用户数据授权
  const url = '/account-equity/uauth';
  return axios.post(BASE_URL + url, params || {});
}

export function questionSort(params) {
  // 咨询分类
  const url = '/consult-question/questionSort';
  return axios.post(BASE_URL + url, params || {});
}
export function expertEvaluate(params) {
  // 咨询专家评分
  const url = '/consult-question/expertEvaluate';
  return axios.post(BASE_URL + url, params || {});
}
export function getQuestionToExpert(params) {
  // 专家获取未分配的咨询
  const url = '/login-expert/getQuestionToExpert';
  return axios.post(BASE_URL + url, params || {});
}

export function getInQuestion(params) {
  // 专家获取未分配的咨询
  const url = '/consult-question/getInQuestion';
  return axios.post(BASE_URL + url, params || {});
}

export function clearUnreadMsgCount(params) {
  // 清除未读消息
  const url = '/login-expert/clearUnreadMsgCount';
  return axios.get(BASE_URL + url, { params, isHideLoading: true });
}
export function getUnreadMsgCount(params) {
  // 获取未读消息
  const url = `/login-expert/getUnreadMsgCount/${params.type}/${params.userId}`;
  return axios.get(BASE_URL + url, { isHideLoading: true });
}

export function send(params) {
  // 发送单聊信息
  const url = '/login-expert/send';
  return axios.post(BASE_URL + url, params || {});
}

export function groupSend(params) {
  // 发送群组信息
  const url = '/login-expert/groupSend';
  return axios.post(BASE_URL + url, params || {});
}

export function downloadinfo() {
  // 获取版本号
  const url = '/api-gateway/product/aosp-product/product/downloadInfo';

  return axios.get(url, { params: { id: '4dcf25b4eda74b8f845cb7cd731df07f' } });
}
