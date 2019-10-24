import {
  post,
  get,
} from './fetch';
import COMMON_ENV from '@/config/env';
import {
  replaceCode,
} from '@/assets/utils/util';
// 登录 token 相关 18911413287 a123456
const { SSO_URL } = COMMON_ENV;
const CLIENT_ID = 'fatc';
const BASE_URL = '/fatscourse';
export function goLogin(type, path) {
  const REDIRECT_URI = encodeURIComponent(replaceCode(path));
  // alert(replaceCode())
  // 去登录页 去登录的时候本地缓存 REDIRECT_URI 获取token传参无需编码，直接存href
  window.localStorage.setItem('REDIRECT_URI', replaceCode(path));

  let url = `/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`;
  // let flag = confirm(`登录REDIRECT_URI地址是${replaceCode()}`);
  // if (!flag) {
  //     return;
  // }
  if (type === 'reg') {
    // 注册
    url = `/oauth/authorize?page=register&client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`;
  }
  window.location.href = SSO_URL + url;
}

export function noPassLogin(params) {
  // 查询订单详情
  const url = `${BASE_URL}/unlogin/noPassLogin`;
  return post(url, params || {});
}

export function loginout() {
  // 退出登录
  const REDIRECT_URI = encodeURIComponent(replaceCode());
  window.localStorage.setItem('REDIRECT_URI', replaceCode());
  const url = `/course_authentication/h5/logout?redirect_uri=${REDIRECT_URI}`;
  window.location.href = SSO_URL + url;
}

export function locations(params) {
  // 获取地区接口 缓存本地数据
  const url = '/course_api-gateway/customer/customer/dictionary/locations';
  let city = [];
  if (window.localStorage.getItem('locationsCityListData')) {
    city = JSON.parse(window.localStorage.getItem('locationsCityListData'));
    let locationStorage = {
      code: '0000',
      message: 'SUCCESSFULL!',
      data: city,
    };
    return Promise.resolve({ data: locationStorage });
  }
  return get(url, params || {}).then((res) => {
    if (res.data.code === '0000') {
      window.localStorage.setItem('locationsCityListData', JSON.stringify(res.data.data));
    }
    return Promise.resolve(res);
  }).catch(err => Promise.reject(err));
}


export function getToken(params) {
  // alert(window.localStorage.getItem('REDIRECT_URI'))
  const url = '/course_authentication/oauth/token';
  // // 获取token 从本地获取上一次REDIRECT_URI
  const formData = {
    client_id: CLIENT_ID, // 为client_id:secret，分配一个即可
    grant_type: 'authorization_code', // 固定取值authorization_code
    redirect_uri: window.localStorage.getItem('REDIRECT_URI'), // 重定向地址,跟登录重定向地址保持一致
    code: params.code, // 登录成功后，重定向回来的页面url中获取
    client_secret: CLIENT_ID,
  };

  return post(url, formData);
}

export function getUserInfo(params) {
  // 获取用户信息
  const url = `${BASE_URL}/personal-web/userInformation`;
  return post(url, params || {});
}

export function showFoucusPic(params) {
  // 获取首页焦点图
  const url = `${BASE_URL}/offlineUnLogin/showFoucusPic`;
  return post(url, params || {});
}
export function showCourseOffline(params) {
  // 获取首页线下公开课，线下训练营
  const url = `${BASE_URL}/offlineUnLogin/showCourseOffline`;
  return post(url, params || {});
}

export function showCourseOnline(params) {
  // 获取首页大家都在学
  const url = `${BASE_URL}/offlineUnLogin/showCourseOnline`;
  return post(url, params || {});
}
export function showTeacher(params) {
  // 获取首页老师
  const url = `${BASE_URL}/offlineUnLogin/showTeacher`;
  return post(url, params || {});
}

export function getNewCourseList(params) {
  // 首页新鲜出炉列表
  const url = `${BASE_URL}/courseUnlogin-web/getNewCourseList`;
  return post(url, params || {});
}
export function getGroomCourseList(params) {
  // 首页推荐课程列表
  const url = `${BASE_URL}/courseUnlogin-web/getGroomCourseList`;
  return post(url, params || {});
}

export function getSearchList(params) {
  // 首页搜索联动结果
  const url = `${BASE_URL}/searchword-web/getSearchList`;
  return post(url, params || {});
}

export function getCategoryList(params) {
  // 获取录播课程分类接口
  const url = `${BASE_URL}/category-web/getCategoryList`;
  return post(url, params || {});
}

export function getHighWordList(params) {
  // 获取热门搜索词列表
  const url = `${BASE_URL}/searchword-web/getHighWordList`;
  return post(url, params || {});
}

export function getHighTitleList(params) {
  // 获取热门文章列表
  const url = `${BASE_URL}/searchword-web/getHighTitleList`;
  return post(url, params || {});
}
export function getCourseList(params) {
  // boolean == 1 那么查询最热  否则查询最新~~~~ 视频课程列表
  const url = `${BASE_URL}/courseUnlogin-web/getCourseList`;
  return post(url, params || {});
}


export function findOfflineCourseById(params) {
  // 获取公开课详情
  const url = `${BASE_URL}/offlineUnLogin/findOfflineCourseById`;
  return post(url, params || {});
}
export function offlineCourseList(params) {
  // 获取公开课列表
  const url = `${BASE_URL}/offlineUnLogin/offlineCourseList`;
  return post(url, params || {});
}


export function updateUvOrPv(params) {
  // 统计课程访问量
  const url = `${BASE_URL}/uvpv/updateUvOrPv`;
  return post(url, params || {});
}

export function getSearchOffList(params) {
  // 搜索--公开课
  const url = `${BASE_URL}/searchword-web/getSearchOffList`;
  return post(url, params || {});
}

export function getCourse(params) {
  // 根据id查询录播课
  const url = `${BASE_URL}/courseUnlogin-web/getCourse`;
  return post(url, params || {});
}

export function getUserLevel(params) {
  // 获取登录用户等级
  const url = `${BASE_URL}/course-web/getUserLevel`;
  return post(url, params || {});
}

export function insertEvaluate(params) {
  // 提交课程评价
  const url = `${BASE_URL}/evaluate/insertEvaluate`;
  return post(url, params || {});
}
export function getEvaluateList(params) {
  // 获取评价列表
  const url = `${BASE_URL}/evaluate/getEvaluateList`;
  return post(url, params || {});
}
export function getVideoUrl(params) {
  // 获取视频播放地址
  const url = `${BASE_URL}/courseUnlogin-web/getVideoUrl`;
  return post(url, params || {});
}
export function initCourseRecord(params) {
  // 同步播放记录（视频和课程维度）
  const url = `${BASE_URL}/course-web/initCourseRecord`;
  return post(url, params || {}, { isHideLoading: true });
}
export function getGoodEvaluateCount(params) {
  // 获取好评总次数
  const url = `${BASE_URL}/evaluate/getEvaluateCount`;
  return post(url, params || {});
}
export function offlineCourseSignUp(params) {
  // 公开课在线报名
  const url = `${BASE_URL}/offline/offlineCourseSignUp`;
  return post(url, params || {});
}
export function qrCodeSignIn(params) {
  // 公开课二维码签到
  const url = `${BASE_URL}/offline/qrCodeSignIn`;
  return post(url, params || {});
}
export function getReview(params) {
  // 获取测评报告
  const url = `${BASE_URL}/review/getReview`;
  return post(url, params || {});
}
export function getReviewUrl(params) {
  // 获取跳转测评地址
  const url = `${BASE_URL}/review/getReviewUrl`;
  return post(url, params || {}, { isHideLoading: true });
}
export function queryPersonalMap(params) {
  // 个人中心页面
  const url = `${BASE_URL}/personal-web/queryPersonalMap`;
  return post(url, params || {});
}
export function queryMyApplication(params) {
  // 个人中心我的报名页面
  const url = `${BASE_URL}/myapplication-web/queryMyApplication`;
  return post(url, params || {});
}
export function queryClassList(params) {
  // 个人中心 我的课程页面
  const url = `${BASE_URL}/myClass-web/queryClassList`;
  return post(url, params || {});
}

export function saveMyCollection(params) {
  // 收藏
  const url = `${BASE_URL}/mycollection-web/saveMyCollection`;
  return post(url, params || {}, { isHideLoading: true });
}
export function queryMycollectionList(params) {
  // 查询收藏列表
  const url = `${BASE_URL}/mycollection-web/queryMycollectionList`;
  return post(url, params || {});
}

export function payType(params) {
  // 支付成功回调接口
  const url = `${BASE_URL}/orderUnLogin/payType`;
  return post(url, params || {});
}

export function createOrderInfo(params) {
  // 保存订单和发票
  const url = `${BASE_URL}/orderInfo/createOrderInfo`;
  return post(url, params || {});
}

export function pay(params) {
  // 统一下单
  const url = `${BASE_URL}/orderInfo/pay`;
  return post(url, params || {});
}

export function removeClass(params) {
  // 我的课堂删除接口
  const url = `${BASE_URL}/myClass-web/removeClass`;
  return post(url, params || {});
}

export function addcontactMe(params) {
  // 保存用户信息
  const url = `${BASE_URL}/membercenter/addcontactMe`;
  return post(url, params || {});
}

export function queryList(params) {
  // 会员权益列表
  const url = `${BASE_URL}/membercenter/queryList`;
  return post(url, params || {});
}

export function findRights(params) {
  // 下订单前查询权益
  const url = `${BASE_URL}/orderInfo/findRights`;
  return post(url, params || {});
}

export function videorights(params) {
  // 视频权限接口 code"1000";可以观看   "1001";//不是会员   "1002";//没有权限
  const url = `${BASE_URL}/classpower-web/videorights`;
  return post(url, params || {});
}

export function payStyle(params) {
  // 根据渠道查询支付方式
  const url = `${BASE_URL}/orderInfo/payStyle`;
  return post(url, params || {});
}

export function getPayStatus(params) {
  // 根据渠道查询支付方式
  const url = `${BASE_URL}/orderInfo/getPayStatus`;
  return post(url, params || {}, { isHideLoading: true });
}

export function queryEquity(params) {
  // 剩余权益数量查询
  const url = `${BASE_URL}/classpower-web/queryEquity`;
  return post(url, params || {});
}
export function equityConsume(params) {
  // 权益消耗
  const url = `${BASE_URL}/classpower-web/equityConsume`;
  return post(url, params || {});
}

export function queryOrderList(params) {
  // 我的订单列表
  const url = `${BASE_URL}/personalorder-web/queryOrderList`;
  return post(url, params || {});
}

export function queryOrderById(params) {
  // 订单详情
  const url = `${BASE_URL}/personalorder-web/queryOrderById`;
  return post(url, params || {});
}

export function updateOrderById(params) {
  // 取消订单
  const url = `${BASE_URL}/personalorder-web/updateOrderById`;
  return post(url, params || {});
}

export function getOrderInfo(params) {
  // 查询订单详情
  const url = `${BASE_URL}/orderInfo/getOrderInfo`;
  return post(url, params || {});
}

export function getSourceData(params) {
  // 查询主体信息
  const url = `${BASE_URL}/source-web/getSourceData`;
  return post(url, params || {});
}

export function downloadPower(params) {
  // 下载权限接口
  const url = `${BASE_URL}/classpower-web/downloadPower`;
  return post(url, params || {});
}

export function getProductStatusByProductId(params) {
  // 下载权限接口
  const url = '/fatsapi/aosp-portal-web/product/getProductStatusByProductId';
  return get(url, params || {}, { isHideLoading: true });
}

export function getUnreadMsgCount(params) {
  // 获取未读消息type
// user用户类型： user/expert  userId 1用户id 专家id

  const url = `/fatsapi/fats-expert/login-expert/getUnreadMsgCount/${params.type}/${params.userId}`;
  console.log(url);
  return get(url, {}, { isHideLoading: true });
}
