import COMMON_ENV from '@/config/env';
  // 神策埋点
(function(para) {
  var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script',x = null,y = null;
  if(typeof(w['sensorsDataAnalytic201505']) !== 'undefined') {
      return false;
  }
  w['sensorsDataAnalytic201505'] = n;
  w[n] = w[n] || function(a) {return function() {(w[n]._q = w[n]._q || []).push([a, arguments]);}};
  var ifs = ['track','quick','register','registerPage','registerOnce','trackSignup', 'trackAbtest', 'setProfile','setOnceProfile','appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify','login','logout','trackLink','clearAllRegister','getAppStatus'];
  for (var i = 0; i < ifs.length; i++) {
    w[n][ifs[i]] = w[n].call(null, ifs[i]);
  }
  if (!w[n]._t) {
    x = d.createElement(s), y = d.getElementsByTagName(s)[0];
    x.async = 1;
    x.src = p;
    x.setAttribute('charset','UTF-8');
    w[n].para = para;
    y.parentNode.insertBefore(x, y);
  }
})({
  sdk_url: process.env.BASE_URL+'/plugin/sensors/sensorsdata.min.js',
  heatmap_url: process.env.BASE_URL+'/plugin/sensors/heatmap.min.js',
  name: 'sensors',
  server_url: COMMON_ENV.sensors.server_url,
  heatmap:{}
})
// if (window.COMMON_ENV && window.COMMON_ENV.version) {
//   let commonData = {
//     productName: window.COMMON_ENV.name,
//     platformType: 'web',
//     version: window.COMMON_ENV.version,
//   };
//   // 设置公共属性
//   window.sensors.registerPage(commonData);
// }
console.log(COMMON_ENV.sensors.server_url);