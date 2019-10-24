let publicPath = process.env.NODE_ENV === 'development' ? '/' : '/expertclient/'; // 生产环境文件构建路径
/*eslint-disable*/
var path = require('path');
const pageProxy = require(path.join(__dirname,'/src/api/proxy.js'));   //导入pageProxy

let proxy = {
'/course_authentication': {
  target: 'http://test.5ifapiao.com:8888',
  changeOrigin: true,
  pathRewrite: {'^/course_authentication' : '/course_authentication'}
},
...pageProxy
};


module.exports = {
    // 基本路径
    publicPath: publicPath,
    lintOnSave: process.env.NODE_ENV !== 'production',
    devServer: {
      proxy,
    },
    // 生产环境是否需要sourcemap
    productionSourceMap:false,
    chainWebpack: config => {
      // 移除 prefetch 插件
      config.plugins.delete('prefetch');
      // 增加文件hash 防止缓存
      config.output.filename('[name].[hash].js').end();
    },
    configureWebpack: config => {
      // 去除生产环境console.log
      // if (process.env.NODE_ENV === 'production') {
      //   config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      // }

    },
    css: {
      loaderOptions: { // 向 CSS 相关的 loader 传递选项
        less: {
          javascriptEnabled: true
        }
      }
    }

};

