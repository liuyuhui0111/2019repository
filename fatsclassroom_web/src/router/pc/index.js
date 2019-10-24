// 个人中心子页面
// 路由尽量与H5端保持一致  没有的新建 H5端有的要保持一致
// 路由尽量与H5端保持一致  没有的新建 H5端有的要保持一致
// 路由尽量与H5端保持一致  没有的新建 H5端有的要保持一致
const centerChildrens = [{
  title: '个人中心',
  name: 'center-preson',
  path: '/center/preson',
  meta: {
    isNeedLogin: true,
    loginBackPath: '/index',
  },
  view: () => import(/* webpackChunkName: "group-center" */ '@/views/web/center/preson.vue'),
}, {
  title: '我的课程',
  name: 'center-myclass',
  path: '/center/myclass',
  meta: {
    isNeedLogin: true,
    loginBackPath: '/index',
  },
  view: () => import(/* webpackChunkName: "group-center" */ '@/views/web/center/myclass.vue'),
}, {
  title: '我的收藏',
  name: 'center-mycol',
  path: '/center/mycol',
  meta: {
    isNeedLogin: true,
    loginBackPath: '/index',
  },
  view: () => import(/* webpackChunkName: "group-center" */ '@/views/web/center/mycol.vue'),
}, {
  title: '我的报名',
  name: 'center-signin',
  path: '/center/signin',
  meta: {
    isNeedLogin: true,
    loginBackPath: '/index',
  },
  view: () => import(/* webpackChunkName: "group-center" */ '@/views/web/center/signin.vue'),
}, {
  title: '我的订单',
  name: 'center-myorder',
  path: '/center/myorder',
  meta: {
    isNeedLogin: true,
    loginBackPath: '/index',
  },
  view: () => import(/* webpackChunkName: "group-center" */ '@/views/web/center/myorder.vue'),
}, {
  title: '我的订单',
  name: 'center-myorder-detail',
  path: '/center/detail',
  meta: {
    isNeedLogin: true,
    loginBackPath: '/index',
  },
  view: () => import(/* webpackChunkName: "group-center" */ '@/views/web/center/detail.vue'),
}, {
  title: '个人设置',
  name: 'center-myset',
  path: '/center/myset',
  meta: {
    isNeedLogin: true,
    loginBackPath: '/index',
  },
  view: () => import(/* webpackChunkName: "group-center" */ '@/views/web/center/myset.vue'),
}];

const defaultChildrens = [{
  title: '首页',
  name: 'index',
  path: '/index',
  view: () => import(/* webpackChunkName: "group-pc" */ '@/views/web/index/index.vue'),
}, {
  title: '财税公开课',
  name: 'open-class',
  path: '/open-class',
  view: () => import(/* webpackChunkName: "group-pc" */ '@/views/web/open-class/index.vue'),
}, {
  title: '公开课详情',
  name: 'detail-class',
  path: '/detail',
  view: () => import(/* webpackChunkName: "group-pc" */ '@/views/web/open-class/detail.vue'),
  meta: {
    navIndex: 1, // 导航位置
  },
}, {
  title: '报名成功',
  name: 'success',
  path: '/success',
  view: () => import(/* webpackChunkName: "group-pc" */ '@/views/web/open-class/success.vue'),
}, {
  title: '在线学习',
  name: 'online-class',
  path: '/online-class',
  view: () => import(/* webpackChunkName: "group-pc" */ '@/views/web/online-class/index.vue'),
}, {
  title: '在线学习详情',
  name: 'online-detail',
  path: '/online-detail',
  view: () => import(/* webpackChunkName: "group-pc" */ '@/views/web/online-class/detail.vue'),
  meta: {
    navIndex: 2, // 导航位置
  },
},

{
  title: '搜索',
  name: 'search',
  path: '/search',
  view: () => import(/* webpackChunkName: "group-search" */ '@/views/web/search/index.vue'),
},
// 订单相关
{
  title: '订单',
  name: 'order',
  path: '/order',
  view: () => import(/* webpackChunkName: "group-order" */ '@/views/web/order/index.vue'),
}, {
  title: '支付订单',
  name: 'pay-order',
  path: '/pay-order',
  meta: {
    isNeedLogin: true,
  },
  view: () => import(/* webpackChunkName: "group-order" */ '@/views/web/order/pay-order.vue'),
}, {
  title: '个人中心',
  name: 'center',
  path: '/center',
  redirect: '/center/preson',
  view: () => import(/* webpackChunkName: "group-center" */ '@/views/web/center/index.vue'),
  children: centerChildrens,
}, {
  title: '会员权益',
  name: 'interests',
  path: '/interests',
  view: () => import(/* webpackChunkName: "group-pc" */ '@/views/web/center/interests.vue'),
},
];

export default defaultChildrens;
