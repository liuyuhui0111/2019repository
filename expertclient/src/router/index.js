import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
// import routes from './routeConf';
import 'nprogress/nprogress.css';
import { downloadinfo } from '@/api/apis';

Vue.use(Router);

NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});

const router = new Router({
  routes: [
    { name: '/', path: '/', redirect: '/index' },
    {
      path: '/index',
      name: '/index',
      meta: {
        isNotNeedLogin: true,
        title: '优税专家',
      },
      component: () => import('@/views/layout/index.vue'),
      // children: routes,
    }, {
      path: '/init',
      name: 'init',
      meta: {
        isNotNeedLogin: true,
        title: '优税专家',
      },
      component: () => import('@/views/layout/user.vue'),
      // children: routes,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (!(window.COMMON_ENV && window.COMMON_ENV.version)) {
    let res = await downloadinfo().catch(() => {
      next();
    });
    if (res && res.data.code === '0000') {
      window.COMMON_ENV.version = res.data.data.versionNum;
      window.COMMON_ENV.name = res.data.data.name;
    }
  }
  NProgress.start();
  next();
});

router.afterEach(async (to) => {
  document.title = to.meta.title || '优税专家';
  NProgress.done();
  // 埋点相关
  if (window.vue) {
    window.vue.$nextTick(() => {
      // if(store.getters.token){
      //   window.sensors.login(store.getters.token);
      // }
      // window.sensors.track('frompath',{"frompath":from.fullPath,"topath":to.fullPath});
      window.sensors.quick('autoTrackSinglePage', {
        platForm: 'web',
      });
      if (window.vue.userId) {
        window.sensors.login(window.vue.userId);
      }
      if (window.COMMON_ENV && window.COMMON_ENV.version) {
        let commonData = {
          productName: window.COMMON_ENV.name,
          platformType: 'web',
          version: window.COMMON_ENV.version,
        };
        // 设置公共属性
        window.sensors.registerPage(commonData);
      }
    });
  }
  // ...
});


export default router;
