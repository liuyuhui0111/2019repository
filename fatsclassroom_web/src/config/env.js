
/* eslint-disable */
let COMMON_ENV = {
  SSO_URL: 'http://test.5ifapiao.com:8888', // 单点登录相关地址
  version:'1.1.1',
  sensors:{			//埋点相关配置
  	server_url:'http://101.124.5.238:8106/sa',
  },
  rongCloudConfig:{       //专家聊天相关
  	host:'http://wxkf.5ifapiao.com:8888',
  }
};
if (process.env.VUE_APP_ENV === 'production') {
	// 生产环境
  COMMON_ENV.SSO_URL = 'https://sso.ele-cloud.com';
  COMMON_ENV.rongCloudConfig.host="https://efats.ele-cloud.com";		//专家聊天地址配置
  // COMMON_ENV.SSO_URL = 'https://passport.utax360.cn';
  // COMMON_ENV.rongCloudConfig.host='https://efats.utax360.cn';		//专家聊天地址配置
} else if (process.env.VUE_APP_ENV === 'pre') {
	// 预发环境
	// COMMON_ENV.SSO_URL = 'http://apptest.5ifapiao.com';
	COMMON_ENV.SSO_URL = 'https://sso-pre.ele-cloud.com';
	COMMON_ENV.rongCloudConfig.host="https://efats-pre.ele-cloud.com";		//专家聊天地址配置
} else if (process.env.VUE_APP_ENV === 'test') {
	// 测试环境
	// COMMON_ENV.SSO_URL = 'http://apptest.5ifapiao.com';
	COMMON_ENV.SSO_URL = 'http://test.5ifapiao.com:8888';
	COMMON_ENV.rongCloudConfig.host="http://test.5ifapiao.com:8888";		//专家聊天地址配置
} else if (process.env.VUE_APP_ENV === 'development') {
	// 开发环境
  // COMMON_ENV.SSO_URL = 'http://ysxy.5ifapiao.com';
  COMMON_ENV.SSO_URL = 'http://test.5ifapiao.com:8888';
  // COMMON_ENV.rongCloudConfig.host="http://wxkf.5ifapiao.com:8888";    //专家聊天地址配置
  COMMON_ENV.rongCloudConfig.host="http://10.1.31.83:8080";		//专家聊天地址配置
}

export default COMMON_ENV;
