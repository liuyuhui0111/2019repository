### 一、UI框架及css预处理器选择
- 1、PC端Vue项目UI框架：ElementUI（优先）、iView
- 2、移动端Vue项目UI框架：mint-ui（优先）、cube-ui
- 3、sass/scss、less、postcss(待定)

### 二、Vue 项目中的命名



- 组件命名 [级别：S]



```
当注册组件 (或者 prop) 时， PascalCase (单词首字母大写命名)。
```


- 命名可遵循以下规则：
-  1、有意义的名词、简短、具有可读性
-  2、以小写开头，采用短横线分割命名
-  3、公共组件命名以公司名称简拼为命名空间(app-xx.vue)
-  4、文件夹命名主要以功能模块代表命名
-  5、组件内部禁止使用全局变量，全局样式，如特殊情况必须使用，必须增加命名空间杜绝全局污染，变量声明只能使用let const 杜绝var 
-  6、JS变量名参照通用规范
-  7、CSS命名参照通用规范（由于CSS不区分大小写，单词之间推荐使用中划线"-"来连接）

```
命名空间规则：common_项目名_模块名_变量名,
例如 企业财税项目下的登录模块需要添加全局用户名，
const COMMON_CORPORATE_LOGIN_USERNAME = '张三'
css全局样式  common
 .common-corporate-login-username{}
同时还需要注意：必须符合自定义元素规范: 使用连字符分隔单词，切勿使用保留字。
app- 前缀作为命名空间: 如果非常通用的话可使用一个单词来命名，这样可以方便于其它项目里复用。 
```
 

### 三、结构化规范 [级别：S]

基础结构必须准守如下规则，如有项目需求新增其它目录文件，需在README文件说明

- 基于Vue-cli脚手架的结构基础划分, 2.0

```
 ├── index.html                      入口页面
   ├── build                           构建脚本目录
   │   ├── build-server.js                 运行本地构建服务器，可以访问构后的页面
   │   ├── build.js                        生产环境构建脚本
   │   ├── dev-client.js                   开发服务器热重载脚本，主要用来实现开发阶段的页面自动刷新
   │   ├── dev-server.js                   运行本地开发服务器
   │   ├── utils.js                        构建相关工具方法
   │   ├── webpack.base.conf.js            wabpack基础配置
   │   ├── webpack.dev.conf.js             wabpack开发环境配置
   │   └── webpack.prod.conf.js            wabpack生产环境配置
   ├── config                          项目配置
   │   ├── dev.env.js                      开发环境变量
   │   ├── index.js                        项目配置文件
   │   ├── prod.env.js                     生产环境变量
   │   └── test.env.js                     测试环境变量
   ├── mock                            mock数据目录
   │   └── hello.js
   ├── package.json                    npm包配置文件，里面定义了项目的npm脚本，依赖包等信息
   ├── src                             项目源码目录    
   │   ├── main.js                         入口js文件
   │   ├── App.vue                         根组件
   │   ├── components                      公共组件目录
   │   │   └── title.vue
   │   ├── assets                          资源目录，这里的资源会被wabpack构建
   │   │   ├── css                         公共样式文件目录
   │   │   ├── js                          公共js文件目录
   │   │   └── img                      图片存放目录
   │   ├── routes                          前端路由
   │   │   └── index.js
   │   ├── store                           应用级数据（state）
   │   │   └── index.js
   │   └── views                           页面目录
   │       ├── login					   登录模块
   │ 	   │   ├── login.vue			   
   │       ├── help						   帮助模块等等
   │ 	   │   ├── help.vue
   │       └── notfound.vue
   ├── static                          纯静态资源，不会被wabpack构建。
   └── test                            测试文件目录（unit&e2e） （非必须）
       └── unit                            单元测试
           ├── index.js                        入口脚本
           ├── karma.conf.js                   karma配置文件
           └── specs                           单测case目录
               └── Hello.spec.js
               
vue cli3 相关结构

├── public/index.html                      入口html页面
   ├── src                             放置组件和js入口文件 
   │   ├── main.js                         入口js文件
   │   ├── App.vue                         根组件
   │   ├── components                      公共组件目录
   │   │   └── title.vue
   │   ├── assets                          资源目录，这里的资源会被wabpack构建
   │   │   ├── css                         公共样式文件目录
   │   │   ├── js                          公共js文件目录
   │   │   └── img                        图片存放目录
   │   ├── router.js                       前端路由
   │   │   
   │   ├── store.js                         vuex应用级数据（state）
   │   │   
   │   └── views                           页面目录
   │       ├── login                       登录模块
   │     │   ├── login.vue               
   │       ├── help                        帮助模块等等
   │     │   ├── help.vue
         └── notfound.vue
├──package.json                           项目及工具的依赖配置文件。
├──babel.config.js                         babel相关配置项 可选
├──webpack.config.js                         webpack相关配置项 可选
```


- vue文件基本结构


```
   <template>
          <div>
            <!--必须在div中编写页面-->
          </div>
        </template>
        <script>
          export default {
            components : {
            },
            data () {
              return {
              }
            },
            methods: {
            },
            mounted() {
        
            }
         }
        </script>
        <!--声明语言，并且添加scoped-->
        <style lang="less" scoped>
        </style>
```

- vue文件方法声明顺序

```
    - components   
    - props    
    - data     
    - created
    - mounted
    - activited
    - update
    - beforeRouteUpdate
    - metods   
    - filter
    - computed
    - watch
```


### 四、注释规范 [级别：A]

代码注释在一个项目的后期维护中显的尤为重要，所以我们要为每一个被复用的组件编写组件使用说明，为组件中每一个方法编写方法说明。
以下情况，务必添加注释

```
1.公共组件使用说明
2.各组件中重要函数或者类说明
3.复杂的业务逻辑处理说明
4.特殊情况的代码处理说明,对于代码中特殊用途的变量、存在临界值、函数中使用的hack、使用了某种算法或思路等需要进行注释描述
5.注释块必须以/**（至少两个星号）开头**/；
6.单行注释使用//；
```

- 单行注释

`普通方法一般使用单行注释// 来说明该方法主要作用`

- 多行注释

```
组件使用说明，和调用说明 
   <!--公用组件：数据表格
      /**
      * 组件名称
      * @module 组件存放位置
      * @desc 组件描述
      * @author 组件作者
      * @date 2017年12月05日17:22:43
      * @param {Object} [title]    - 参数说明
      * @param {String} [columns] - 参数说明
      * @example 调用示例
      *  <hbTable :title="title" :columns="columns" :tableData="tableData"></hbTable>
          */
       -->
    原则上一百行以上的方法以及复杂组件都必须添加注释
```

### 五、所有新项目引入Eslint规范[级别：A]

### 移动端适配方案

- 插件：amfe-flexible + postcss-px2rem


```
1.安装依赖
npm i amfe-flexible postcss-px2rem

2.index.html文件头部引入
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

3.main.js引入amfe-flexible
import 'amfe-flexible'

4.修改项目根目录下的.postcssrc.js

//rem适配方案  rootValue的值根据设计图宽度来定
module.exports = { 
	plugins: {
 	'postcss-pxtorem': 
	 	{ 
		 	rootValue: 75,     
		 	propList: ['*'], //属性的选择器，*表示通用
            selectorBlackList : ['.ig-'],         //忽略的选择器 .ig- 表示 .ig- 开头的都不会转换
		 	minPixelValue: 2 
		}
 	} 
};

```





