const COMMON_TOKEN = 'token'; // token 字段名称
const COMMON_TOKEN_DAY = 0; // token失效时间7天
const COMMON_REPLACE_URL = 'COMMONREPLACEURL'; // 将#号替换成COMMON_REPLACE_URL 去登录

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
// 将url中code=xxx 替换成空字符串
// function replaceCode() {
//   /*eslint-disable*/
//     const reg = /code\=\w*(&|$)/;
//     let href = window.location.href;
//     href=href.replace(reg, '');
//     if (href.substr(href.length - 1, 1) === '?' || href.substr(href.length - 1, 1) === '&') {
//         // 如果最后一个字符是？
//         href = href.substring(0, href.length - 1);
//     }
//  /* eslint-enable */
//   href = href.replace('#', COMMON_REPLACE_URL);

//   return href;
// }

// 将url中code=xxx 替换成空字符串
function replaceCode(fullPath) {
  /*eslint-disable*/
  const reg = /code\=\w*(&|$)/;
   
  const reg1 = /token\=[\w|\.|\-|\_]*(&|$)/;
  let href = window.location.href;
  let host = href.split('#')[0];
  let hash = href.split('#')[1];
      // ie9  不支持history模式 hash模式
  let hashUrl = fullPath || hash.replace('#', '');
  let hashArr = hashUrl.split('?');
   
  let path = encodeURIComponent(hashArr[0].substring(1, hashArr[0].length)); // path
  // 把参数截取成数组[a=1,b=2]
  // let queryList = hashArr[1]?hashArr[1].split('&'):[];
  let query = hashArr[1] ? `&${hashArr[1]}` : '';
  // 取消 #号  拼接成 ?path=path

  href = host + `?${COMMON_REPLACE_URL}=${path}${query}`;

  href=href.replace(reg, '').replace(reg1, '');

  if (href.substr(href.length - 1, 1) === '?' || href.substr(href.length - 1, 1) === '&') {
      // 如果最后一个字符是？
      href = href.substring(0, href.length - 1);
  }
 /* eslint-enable */
  return href;
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


function initList(arr, arrnum) {
  /**
          * 数组补位
          * @desc arr 要补位的数组 num 要补的位数
          * @author liuyuhui
          * @date 2019年4月19日17:33:59
    */
  const num = arr.length % arrnum === 0 ? 0 : arrnum - (arr.length % arrnum); // 计算需要补位的数量
  if (num !== 0) {
    // 如果能被4整除且当前页条数小于当页最大条数，开始补位
    for (let i = 0; i < num; i += 1) {
      arr.push(null);
    }
  }
  return arr;
}

function getTokenFn() {
  return getCookie(COMMON_TOKEN);
  // return window.sessionStorage.getItem(COMMON_TOKEN);
}

function setTokenFn(token) {
  if (token) {
    // window.sessionStorage.setItem(COMMON_TOKEN, token);
    setCookie(COMMON_TOKEN, token, COMMON_TOKEN_DAY);
    // window.localStorage.setItem(COMMON_TOKEN,token);
  } else {
    delCookie(COMMON_TOKEN);
    // window.localStorage.removeItem(COMMON_TOKEN);
    // 清除本地缓存信息
    // window.sessionStorage.removeItem(COMMON_TOKEN);
    window.sessionStorage.removeItem('commonUserData');
  }
}


function transferString(content) {
  // 替换回车
  let string = content;
  if (!string) return null;
  try {
    string = string.replace(/\r\n/g, '<br>');
    string = string.replace(/\n/g, '<br>');
  } catch (e) {
    console.log(e);
  }
  return string;
}

function isMobile() {
  // 检测是否是移动端
  return window.navigator.userAgent.indexOf('Mobi') === -1;
}

export {
  COMMON_REPLACE_URL,
  setTokenFn,
  getTokenFn,
  setCookie,
  getCookie,
  delCookie,
  getScrollTop,
  setScrollTop,
  replaceCode,
  getUrlParam,
  initList,
  transferString,
  isMobile,
};
