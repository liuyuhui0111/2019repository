
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

function setScrollTop(endTop) {
  // 设置当前滚动条高度
  clearInterval(window.scrollToptimer);
  let top = document.body.scrollTop || document.documentElement.scrollTop;
  let speed = (endTop - top) / 18;
  let curTop = document.body.scrollTop || document.documentElement.scrollTop;
  window.scrollToptimer = setInterval(() => {
    console.log(`定时循环回到顶部${curTop}`);
    curTop += speed;
    if (speed < 0) {
      if (curTop <= endTop) {
        clearInterval(window.scrollToptimer);
        curTop = endTop;
      }
    } else if (curTop >= endTop) {
      clearInterval(window.scrollToptimer);
      curTop = endTop;
    }
    document.body.scrollTop = curTop;
    if (document.documentElement) {
      document.documentElement.scrollTop = curTop;
    }
  }, 17);
}

function initWxShareUrl(url) {
  /*eslint-disable*/ 
  // 删除链接里微信自动拼接的from isappinstalled sharer_username scene clicktime
  const delFromReg = /from\=\w*(&|$)/;
  const delsharer_username = /sharer_username\=\w*(&|$)/;
  const delscene = /scene\=\w*(&|$)/;
  const delclicktime = /clicktime\=\w*(&|$)/;
  const delIsappinstalledReg = /isappinstalled\=\w*(&|$)/;
  let href = url.replace(delFromReg, '')
    .replace(delIsappinstalledReg, '')
    .replace(delsharer_username, '')
    .replace(delscene, '')
    .replace(delclicktime, '');
  if (href.substr(href.length - 1, 1) === '?' || href.substr(href.length - 1, 1) === '&') {
    // 如果最后一个字符是？
    href = href.substring(0, href.length - 1);
  }
  return href;
  /* eslint-enable */
}

// 将url中code=xxx 替换成空字符串
function replaceCode(url, fullPath) {
  /*eslint-disable*/

    const reg = /code\=\w*(&|$)/;
    let href = url || window.location.href;
    let host = href.split('#')[0];
    let hash = href.split('#')[1];
    let fromQuery = '';

    host=initWxShareUrl(host);  //清除微信自带的一些来源信息
    if(host.indexOf('?')!==-1){
      host = host.split('?')[0];
      fromQuery = '&'+host.split('?')[1];
    }

    let hashUrl = fullPath || hash.replace('#', '');

    let hashArr = hashUrl.split('?');

    let path = encodeURIComponent(hashArr[0].substring(1, hashArr[0].length)); // path
    // 把参数截取成数组[a=1,b=2]
    // let queryList = hashArr[1]?hashArr[1].split('&'):[];
    let query = hashArr[1] ? `&${hashArr[1]}` : '';
    
    // 取消 #号  拼接成 ?path=path

    href = host + `?${COMMON_REPLACE_URL}=${path}${query}${fromQuery}`;

    href=href.replace(reg, '');

    if (href.substr(href.length - 1, 1) === '?' || href.substr(href.length - 1, 1) === '&') {
        // 如果最后一个字符是？
        href = href.substring(0, href.length - 1);
    }
 /* eslint-enable */
  return initWxShareUrl(href);
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
  // return getCookie(COMMON_TOKEN);
  return window.localStorage.getItem(COMMON_TOKEN);
}

function setTokenFn(token) {
  if (token) {
    window.localStorage.setItem(COMMON_TOKEN, token);
    setCookie(COMMON_TOKEN, token, COMMON_TOKEN_DAY);
    // window.localStorage.setItem(COMMON_TOKEN,token);
  } else {
    delCookie(COMMON_TOKEN);
    window.localStorage.removeItem(COMMON_TOKEN);
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

function getNetworkType() {
  // 获取网络状态,wifi net 流量
  let ua = navigator.userAgent;
  let networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
  networkStr = networkStr.toLowerCase().replace('nettype/', '');
  let networkType;
  console.log(ua);
  console.log(networkStr);
  switch (networkStr) {
    case 'wifi':
      networkType = 'wifi';
      break;
    case '5g':
      networkType = 'net';
      break;
    case '4g':
      networkType = 'net';
      break;
    case '3g':
      networkType = 'net';
      break;
    case '3gnet':
      networkType = 'net';
      break;
    case '2g':
      networkType = 'net';
      break;
    default:
      networkType = 'error';
  }
  return networkType;
}

function getSystem() {
  // 获取系统环境
  /*eslint-disable*/
  let sys = {
    wx: false,
    android: false,
    ios: false,
  };
  let ua = window.navigator.userAgent;
  let wxua = window.navigator.userAgent.toLowerCase();
  if (wxua.match(/MicroMessenger/i) == 'micromessenger') {
    sys.wx = true;
  } else {
    sys.wx = false;
  }
  sys.android = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1;
  sys.ios = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  /* eslint-enable */
  return sys;
}

function paramsStr(url) {
  /*eslint-disable*/
  let hash;
  let myJson = {};
  if (!url) {
    return myJson;
  }
  let hashes = url.slice(url.indexOf('?') + 1).split('&');
  for (let i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    myJson[hash[0]] = hash[1];
  }
  return myJson;
  /* eslint-enable */
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
  getNetworkType,
  getSystem,
  paramsStr,
};
