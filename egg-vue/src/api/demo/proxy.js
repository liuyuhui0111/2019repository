// 配置代理转发
let demoProxy = {
  '/fatsapi': {
    target: 'http://wxkf.5ifapiao.com:8888',
    changeOrigin: true,
    pathRewrite: { '^/fatsapi': '/fatsapi' },
  },
};

module.exports = demoProxy;
