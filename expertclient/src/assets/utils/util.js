import COMMON_ENV from '@/config/env';

function setCookie(name, value, day) {
  // 写cookies
  if (!value) {
    return null;
  }
  try {
    const Days = day || 30;
    const exp = new Date();
    let val = value;
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    if (typeof (val) !== 'string') {
      val = JSON.stringify(value);
    }
    if (!day) {
      document.cookie = `${name}=${escape(val)};`;
    } else {
      document.cookie = `${name}=${escape(val)};expires=${exp.toGMTString()}`;
    }
  } catch (e) {
    return null;
  }
  return true;
}

function getCookie(name) {
  // 读cookie
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  if (arr) { return unescape(arr[2]); }
  return null;
}

function delCookie(name) {
  // 删除cookie
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const cval = getCookie(name);
  if (cval != null) { document.cookie = `${name}=${cval};expires=${exp.toGMTString()}`; }
}

// 获取url中的参数
function getUrlParam(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  let query = window.location.href.split('?')[1] || '';
  const r = query.match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  }
  return null;
}

// 将url中code=xxx 替换成空字符串
function replaceCode(fullPath) {
  /*eslint-disable*/
    const reg = /code\=\w*(&|$)/;
    let href = window.location.href;
    let host = href.split('#')[0];

        // ie9  不支持history模式 hash模式
        let hashUrl = fullPath || window.location.hash.replace('#', '')
        let hashArr = hashUrl.split('?');
        let path = encodeURIComponent(hashArr[0].substring(1, hashArr[0].length)); // path
        // 把参数截取成数组[a=1,b=2]
        // let queryList = hashArr[1]?hashArr[1].split('&'):[];
        let query = hashArr[1] ? `&${hashArr[1]}` : '';
        // 取消 #号  拼接成 ?path=path

        href = host + `?${COMMON_ENV.COMMON_REPLACE_URL}=${path}${query}`;

        href=href.replace(reg, '');
        if (href.substr(href.length - 1, 1) === '?' || href.substr(href.length - 1, 1) === '&') {
            // 如果最后一个字符是？
            href = href.substring(0, href.length - 1);
        }
 /* eslint-enable */
  return href;
}

function getTokenFn() {
  return getCookie(COMMON_ENV.COMMON_TOKEN);
  // return window.sessionStorage.getItem(COMMON_TOKEN);
}

function setTokenFn(token) {
  if (token) {
    // window.sessionStorage.setItem(COMMON_TOKEN, token);
    setCookie(COMMON_ENV.COMMON_TOKEN, token, COMMON_ENV.COMMON_TOKEN_DAY);
    // window.localStorage.setItem(COMMON_TOKEN,token);
  } else {
    delCookie(COMMON_ENV.COMMON_TOKEN);
    // window.localStorage.removeItem(COMMON_TOKEN);
    // 清除本地缓存信息
    // window.sessionStorage.removeItem(COMMON_TOKEN);
    window.sessionStorage.removeItem('commonUserData');
  }
}

function getScrollTop() {
  // 获取当前滚动条高度
  return document.documentElement.scrollTop || document.body.scrollTop;
}

function setScrollTop(top) {
  // 设置当前滚动条高度
  if (document.documentElement) {
    document.documentElement.scrollTop = top;
    document.body.scrollTop = top;
  } else {
    document.body.scrollTop = top;
  }
}

export {
  setCookie,
  getCookie,
  delCookie,
  getUrlParam,
  replaceCode,
  getTokenFn,
  setTokenFn,
  setScrollTop,
  getScrollTop,
};
