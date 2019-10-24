// 各模块配置代理 统一引入这个文件
// let path = require('path');
/*eslint-disable*/ 
// http://10.1.29.120:8105  10.1.2.70,
// http://wxkf.5ifapiao.com:8888

let pageProxy = {
	// '/fatsapi/fats-expert/login-expert/getIMById': {
 //    target: 'http://10.1.2.70:8105',
 //    changeOrigin: true,
 //    pathRewrite: { '^/fatsapi/fats-expert/login-expert/getIMById': '/login-expert/getIMById' },
 //  },
  '/fatsapi/fats-expert': {
    target: 'http://test.5ifapiao.com:8888/',
    changeOrigin: true,
    pathRewrite: { '^/fatsapi/fats-expert': '/fatsapi/fats-expert' },
  },
  '/demo': {
    target: 'http://127.0.0.1:7001/',
    changeOrigin: true,
    pathRewrite: { '^/demo': '' },
  },
};

module.exports = pageProxy;
