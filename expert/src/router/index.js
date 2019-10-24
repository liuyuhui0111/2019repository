import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
// import routes from './routeConf';
import 'nprogress/nprogress.css';
import store from '@/store';
import { downloadinfo } from '@/api/apis';

Vue.use(Router);

NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});
// 右侧路由
const mainRoutes = [
  {
    path: '/askMange',
    name: '/askMange',
    meta: {
      title: '咨询管理',
    },
    component: () => import('@/views/askMange/index.vue'),
  }, {
    path: '/assessMange',
    name: '/assessMange',
    meta: {
      title: '评价管理',
    },
    component: () => import('@/views/assessMange/index.vue'),
  }, {
    path: '/set',
    name: '/set',
    meta: {
      title: '个人设置',
    },
    component: () => import('@/views/set/index.vue'),
  },
];
const router = new Router({
  linkActiveClass: 'active',
  routes: [
    { name: '/', path: '/', redirect: '/login' },
    {
      path: '/layout',
      name: '/layout',
      meta: {
        title: '专家端',
        isNotNeedLogin: true,
      },
      component: () => import('@/views/layout/index.vue'),
      children: mainRoutes,
    }, {
      path: '/user',
      name: '/user',
      meta: {
        title: '客服页面',
      },
      component: () => import('@/views/layout/user.vue'),
      // children: routes,
    }, {
      path: '/login',
      name: '/login',
      meta: {
        title: '登录',
        isNotNeedLogin: true,
      },
      component: () => import('@/views/login/index.vue'),
      // children: routes,
    },
    {
      path: '/resetPsw',
      name: '/resetPsw',
      meta: {
        title: '重置密码',
        isNotNeedLogin: true,
      },
      component: () => import('@/views/login/index.vue'),
      // children: routes,
    }, {
      path: '/troubleSort',
      name: '/troubleSort',
      meta: {
        title: '问题分类',
      },
      component: () => import('@/views/trouble/troubleSort.vue'),
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
  if (!to.meta.isHideProcess) {
    NProgress.start();
  }
  if (to.meta.isNotNeedLogin) {
    next();
  } else if (to.path === '/login') {
    next();
  } else if (store.getters.token) {
    if (to.path === '/login') {
      next(from.path);
    } else {
      next();
    }
  } else {
    next('/login');
  }
});

router.afterEach(async (to) => {
  document.title = to.meta.title || '加载中...';
  if (!to.meta.isHideProcess) {
    NProgress.done();
  }
  // 埋点相关
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

  // ...
});

export default router;
