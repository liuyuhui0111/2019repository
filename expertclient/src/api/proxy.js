// 各模块配置代理 统一引入这个文件
// let path = require('path');
/*eslint-disable*/ 
// http://10.1.29.120:8105  10.1.2.70,
// http://wxkf.5ifapiao.com:8888
const hostUrl = 'http://test.5ifapiao.com:8888'
let pageProxy = {
	// '/fatsapi/fats-expert/login-expert/getIMById': {
 //    target: 'http://10.1.2.70:8105',
 //    changeOrigin: true,
 //    pathRewrite: { '^/fatsapi/fats-expert/login-expert/getIMById': '/login-expert/getIMById' },
 //  },
  '/fatsapi/fats-expert': {
    target: hostUrl,
    changeOrigin: true,
    pathRewrite: { '^/fatsapi/fats-expert': '/fatsapi/fats-expert' },
  },
  '/api-gateway': {
    target: hostUrl,
    changeOrigin: true,
    pathRewrite: { '^/api-gateway': '/api-gateway' },
  },
  
};

module.exports = pageProxy;
