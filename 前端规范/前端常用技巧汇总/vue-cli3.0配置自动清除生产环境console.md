vue-cli3.0配置消除生产环境console
```
module.exports = {
	configureWebpack: config => {
	  // 去除生产环境console.log
	  if (process.env.NODE_ENV === 'production') {
	    config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
	  }
	}
}
```

by-刘宇辉