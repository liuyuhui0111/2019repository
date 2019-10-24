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


export function expertLogin(params) {
  // 专家登录
  const url = '/login-expert/expertLogin';
  return axios.post(BASE_URL + url, params || {});
}
export function expertLogout(params) {
  // 退出
  const url = '/login-expert/expertLogout';
  return axios.post(BASE_URL + url, params || {});
}

export function getVerificationCode(params) {
  // 发送验证码
  const url = '/login-expert/getVerificationCode';
  return axios.post(BASE_URL + url, params || {});
}


export function resetPassword(params) {
  // 忘记~~~~密码
  const url = '/login-expert/resetPassword';
  return axios.post(BASE_URL + url, params || {});
}
export function getTradeList(params) {
  // 获取行业信息  缓存信息到session
  const url = '/expert/getTradeList';
  return new Promise((resolve) => {
    if (window.sessionStorage.getItem('getTradeListData')) {
      // 如果缓存里存在  直接取缓存
      resolve(JSON.parse(window.sessionStorage.getItem('getTradeListData')));
      return;
    }
    axios.get(BASE_URL + url, { params }).then((res) => {
      if (res.data.code === '0000') {
        window.sessionStorage.setItem('getTradeListData', JSON.stringify(res));
      }
      resolve(res);
    });
  });
}
export function getFieldList(params) {
  // 获取所属领域信息
  const url = '/expert/getFieldList';
  return new Promise((resolve) => {
    if (window.sessionStorage.getItem('getFieldListData')) {
      // 如果缓存里存在  直接取缓存
      resolve(JSON.parse(window.sessionStorage.getItem('getFieldListData')));
      return;
    }
    axios.get(BASE_URL + url, { params }).then((res) => {
      if (res.data.code === '0000') {
        window.sessionStorage.setItem('getFieldListData', JSON.stringify(res));
      }
      resolve(res);
    });
  });
}
export function getTaxCategoryList(params) {
  // 获取所属税种信息
  const url = '/expert/getTaxCategoryList';
  return new Promise((resolve) => {
    if (window.sessionStorage.getItem('getTaxCategoryListData')) {
      // 如果缓存里存在  直接取缓存
      resolve(JSON.parse(window.sessionStorage.getItem('getTaxCategoryListData')));
      return;
    }
    axios.get(BASE_URL + url, { params }).then((res) => {
      if (res.data.code === '0000') {
        window.sessionStorage.setItem('getTaxCategoryListData', JSON.stringify(res));
      }
      resolve(res);
    });
  });
}
export function getCommonPhrasesList(params) {
  // 获取常用语
  const url = '/expert/getCommonPhrasesList';
  return axios.get(BASE_URL + url, { params });
}
export function getExpertInfoList(params) {
  // 转单弹窗-搜索专家
  const url = '/expert/getExpertInfoList';
  return axios.get(BASE_URL + url, { params } || {});
}
export function SearchPage(params, opt) {
  // 搜索页
  const url = '/expert/searchPage';
  return axios.post(BASE_URL + url, params || {}, opt);
}
export function proposeEndConsult(params) {
  // 专家提出是否结束咨询
  const url = '/expert/proposeEndConsult';
  return axios.get(BASE_URL + url, { params } || {});
}
export function EndConsult(params) {
  // 结束咨询
  const url = '/expert/EndConsult';
  return axios.post(BASE_URL + url, params || {});
}
export function questionSort(params) {
  // 问题分类
  const url = '/expert/questionSort';
  return axios.post(BASE_URL + url, params || {});
}
export function getIMById(params) {
  // 根据ID获取咨询单信息
  const url = '/login-expert/getIMById';
  return axios.get(BASE_URL + url, { params });
}
export function countdown(params) {
  // 结束咨询倒计时
  const url = '/expert/countdown';
  return axios.post(BASE_URL + url, params || {});
}


export function getEvaluateByCondition(params) {
  // 根据条件查询评价信息
  const url = '/expert/getEvaluateByCondition';
  return axios.post(BASE_URL + url, params || {});
}
export function getIMListByCondition(params) {
  // 根据条件获取咨询单信息
  const url = '/expert/getIMListByCondition';
  return axios.post(BASE_URL + url, params || {});
}
export function getEvaluateByQuestionId(params) {
  // 根据咨询单ID查询评价信息
  const url = '/expert/getEvaluateByQuestionId';
  return axios.get(BASE_URL + url, { params } || {});
}
export function changeExpertPassword(params) {
  // 个人设置-修改密码
  const url = '/login-expert/changeExpertPassword';
  return axios.post(BASE_URL + url, params || {});
}
export function ChangeOrder(params) {
  // 转单
  const url = '/expert/changeOrder';
  return axios.post(BASE_URL + url, params || {});
}
export function sendInfoNtf(params) {
  // 发送通知消息
  const url = '/expert/sendInfoNtf';
  return axios.post(BASE_URL + url, params || {});
}

export function getQuestionToExpert(params) {
  // 专家获取未分配的咨询
  const url = '/login-expert/getQuestionToExpert';
  return axios.post(BASE_URL + url, params || {});
}
export function getSourceInfoByUri(params) {
  // 底部信息
  const url = '/dmm/getSourceInfoByUri';
  return axios.get(`/fatsapi/aosp-portal-web${url}`, { params } || {});
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

export function getQuestionById(params) {
  // 获取问题分类信息
  const url = '/consult-question/getQuestionById';
  return axios.post(BASE_URL + url, params);
}


export function downloadinfo() {
  // 获取版本号
  const url = '/api-gateway/product/aosp-product/product/downloadInfo';
  return axios.get(url, { params: { id: '4dcf25b4eda74b8f845cb7cd731df07f' } });
}
