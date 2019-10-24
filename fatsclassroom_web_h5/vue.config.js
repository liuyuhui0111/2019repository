let baseProxyUrl = '';
let publicPath = process.env.NODE_ENV === 'development' ? './' : process.env.VUE_APP_PATH; // 生产环境发布路径

/*eslint-disable*/
//dev使用测试环境数据  需要连本地调试 屏蔽此行代码baseProxyUrl
baseProxyUrl = process.env.NODE_ENV === 'development' ? process.env.VUE_APP_URL : '';


let proxyData = {
    'http://test.5ifapiao.com:8888': [
        '/fatscourse',
        '/ele-myinvoice', '/course_authentication', '/course_api-gateway'
    ], //分享
    // 'http://10.1.28.167:9983': ['/fatscourse'],
    // 'http://10.1.28.153:9983': ['/fatscourse'],
    // 'http://10.1.30.214:9983': ['/fatscourse'],
};

let proxy = {};
Object.keys(proxyData).forEach((key) => {
    let target = key;
    if (baseProxyUrl) {
        // 存在 统一使用这个
        target = baseProxyUrl;
    }
    let arr = proxyData[key];
    arr.forEach((item) => {
        let pathRewrite = `^${item}`;
        proxy[item] = {
            target,
            changeOrigin: true,
            pathRewrite: {},
        };
        proxy[item].pathRewrite[pathRewrite] = item;
    });
});
// console.log(proxy);

module.exports = {
    // 基本路径
    publicPath: publicPath,

    lintOnSave: process.env.NODE_ENV !== 'production',

    devServer: {
        proxy,
    },

    // 生产环境是否需要sourcemap
    productionSourceMap: false,

    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch');
    },

    configureWebpack: config => {
        // 去除生产环境console.log
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
    },

    css: {
        loaderOptions: {
            stylus: {
                'resolve url': true,
                'import': [
                    './src/theme'
                ]
            }
        }
    },

    pluginOptions: {
        'cube-ui': {
            postCompile: true,
            theme: true
        }
    }
};

// http://wxkf.5ifapiao.com     //开发登录地址
// http://10.1.31.140  陈埼
// 10.1.28.167:9983  赵聪
// http://10.1.29.53:9983  梁玉欢
// 17128240164  dxhy0328  http://test.5ifapiao.com:8888/mcourse-430100006
