// 各模块配置代理 统一引入这个文件
let path = require('path');
/*eslint-disable*/ 
const demoProxy = require(path.join(__dirname, '/demo/proxy.js'));
// http://10.1.29.120:8105 http://10.1.2.70:8105  10.1.28.168
const hostUrl = 'http://test.5ifapiao.com:8888'
let pageProxy = {
  // '/fatsapi/fats-expert/expert/clearUnreadMsgCount': {
  //   target: 'http://10.1.28.168:8105',
  //   changeOrigin: true,
  //   pathRewrite: { '^/fatsapi/fats-expert/expert/clearUnreadMsgCount': '/expert/clearUnreadMsgCount' },
  // },
  // '/fatsapi/fats-expert/expert/getUnreadMsgCount': {
  //   target: 'http://10.1.28.168:8105',
  //   changeOrigin: true,
  //   pathRewrite: { '^/fatsapi/fats-expert/expert/getUnreadMsgCount': '/expert/getUnreadMsgCount' },
  // },
	'/fatsapi/fats-expert': {
    target: hostUrl,
    changeOrigin: true,
    pathRewrite: { '^/fatsapi/fats-expert': '/fatsapi/fats-expert' },
  },
	'/fatsapi/aosp-portal-web': {
    target: hostUrl,
    changeOrigin: true
  },
  '/api-gateway': {
    target: hostUrl,
    changeOrigin: true,
    pathRewrite: { '^/api-gateway': '/api-gateway' },
  },
  
  ...demoProxy,
};

module.exports = pageProxy;
