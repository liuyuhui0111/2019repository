import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
// import routes from './routeConf';
import 'nprogress/nprogress.css';

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
    { name: '/', path: '/', redirect: '/demo' },
    {
      path: '/demo',
      name: '/demo',
      meta: {
        isNotNeedLogin: true,
        title: '优税专家',
      },
      component: () => import('@/views/layout/demo.vue'),
      // children: routes,
    }, {
      path: '/login',
      name: 'login',
      meta: {
        isNotNeedLogin: true,
        title: '优税专家',
      },
      component: () => import('@/views/login/login.vue'),
      // children: routes,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(async (to) => {
  document.title = to.meta.title || '优税专家';
  NProgress.done();
  // 埋点相关
  window.vue.$nextTick(() => {
    // if(store.getters.token){
    //   window.sensors.login(store.getters.token);
    // }
    // window.sensors.track('frompath',{"frompath":from.fullPath,"topath":to.fullPath});
    window.sensors.quick('autoTrackSinglePage', {
      platForm: 'web',
    });
  });
  // ...
});


export default router;
