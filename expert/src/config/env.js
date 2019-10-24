
/* eslint-disable */
let COMMON_ENV = {
	version:'1.1.1.1',		//版本号
  SSO_URL: 'http://test.5ifapiao.com:8888', // 单点登录相关地址
  CLIENT_ID:'fatc',		//登录对接CLIENT_ID
	COMMON_REPLACE_URL:'COMMONREPLACEURL',		//#号替换字段?COMMONREPLACEURL=
	COMMON_TOKEN:'token',			//token字段名称
	COMMON_TOKEN_DAY:0,				//token 失效时间 0代表关闭浏览器就失效
	appkey:'sfci50a7s3uzi',		//融云appkey
	sensors:{			//埋点相关配置
  	server_url:'http://101.124.5.238:8106/sa',
  },
};
if (process.env.VUE_APP_ENV === 'production') {
	// 生产环境
  COMMON_ENV.SSO_URL = 'https://efats.utax360.cn/';
  COMMON_ENV.appkey = 'y745wfm8yq6av'; //融云appkey
} else if (process.env.VUE_APP_ENV === 'pre') {
	// 预发环境
	// COMMON_ENV.SSO_URL = 'http://apptest.5ifapiao.com';
	COMMON_ENV.SSO_URL = 'https://sso-pre.ele-cloud.com';
	COMMON_ENV.appkey = 'sfci50a7s3uzi'; //融云appkey
} else if (process.env.VUE_APP_ENV === 'test') {
	// 测试环境
	// COMMON_ENV.SSO_URL = 'http://apptest.5ifapiao.com';
	COMMON_ENV.SSO_URL = 'http://test.5ifapiao.com:8888';
	COMMON_ENV.appkey = 'pwe86ga5p4d56'; //融云appkey
} else if (process.env.VUE_APP_ENV === 'development') {
	// 开发环境
  // COMMON_ENV.SSO_URL = 'http://ysxy.5ifapiao.com';
  COMMON_ENV.SSO_URL = 'http://test.5ifapiao.com:8888';
  // COMMON_ENV.appkey = '3argexb63qv6e'; //融云appkey
  COMMON_ENV.appkey = 'pwe86ga5p4d56'; //融云appkey
}

export default COMMON_ENV;
