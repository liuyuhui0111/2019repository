// 路由尽量与PC端保持一致  没有的新建 PC端有的要保持一致
// 路由尽量与PC端保持一致  没有的新建 PC端有的要保持一致
// 路由尽量与PC端保持一致  没有的新建 PC端有的要保持一致
const routes = [{
  title: '首页',
  name: 'index',
  path: '/index',
  meta: {
    isHideQuickNav: true,
    keepAlive: true,
  },
  view: () => import(/* webpackChunkName: "group-index" */ '@/views/index/index.vue'),
}, {
  title: '会员介绍',
  name: 'interests',
  path: '/interests',
  meta: {
    keepAlive: true,
  },
  view: () => import(/* webpackChunkName: "group-detail" */ '@/views/vipInfo/vipInfo.vue'),
}, {
  title: '公开课详情',
  name: 'detail',
  path: '/detail',
  meta: {
    isHideShare: true, // 隐藏全局通用分享，自定义分享内容
  },
  view: () => import(/* webpackChunkName: "group-detail" */ '@/views/openCourses/openCoursesDetails.vue'),
}, {
  title: '录播课详情',
  name: 'online-detail',
  path: '/online-detail',
  meta: {
    isHideShare: true, // 隐藏全局通用分享，自定义分享内容
  },
  view: () => import(/* webpackChunkName: "group-detail" */ '@/views/lineOfCourses/lineOfCoursesDetails.vue'),
}, {
  title: '全部课程',
  name: 'online-class',
  path: '/online-class',
  meta: {
    isHideQuickNav: true,
    keepAlive: true,
    wxShareTitle: '优税学院-全部课程',
    fromRoute: '最近学习-录播课',
  },
  view: () => import(/* webpackChunkName: "group-index" */ '@/views/allclass/online.vue'),
}, {
  title: '全部课程',
  name: 'open-class',
  path: '/open-class',
  meta: {
    isHideQuickNav: true,
    keepAlive: true,
    wxShareTitle: '优税学院-全部课程',
    fromRoute: '最近学习-公开课',
  },
  view: () => import(/* webpackChunkName: "group-index" */ '@/views/allclass/offline.vue'),
}, {
  title: '全部权益课程',
  name: '/vipclass',
  path: '/vipclass',
  view: () => import(/* webpackChunkName: "group-index" */ '@/views/allclass/vipclass.vue'),
}, {
  title: '在线报名',
  name: 'signup',
  path: '/signup',
  view: () => import(/* webpackChunkName: "group-detail" */ '@/views/openCourses/signup.vue'),
}, {
  title: '报名成功',
  name: 'success',
  path: '/success',
  view: () => import(/* webpackChunkName: "group-detail" */ '@/views/openCourses/success.vue'),
}, {
  title: '我的学习',
  name: 'centerMyclass',
  path: '/center/myclass',
  meta: {
    isHideQuickNav: true,
    isNeedLogin: true, // 登录拦截
  },
  view: () => import(/* webpackChunkName: "group-index" */ '@/views/learnlist/index.vue'),
}, {
  title: '我的学习',
  name: '/center/offline',
  path: '/center/offline',
  meta: {
    isHideQuickNav: true,
    isNeedLogin: true, // 登录拦截
  },
  view: () => import(/* webpackChunkName: "group-index" */ '@/views/learnlist/offline.vue'),
}, {
  title: '个人中心',
  name: 'center',
  path: '/center',
  meta: {
    isHideQuickNav: true,
    keepAlive: true,
  },
  view: () => import(/* webpackChunkName: "group-index" */ '@/views/mycenter/index.vue'),
},
{
  title: '我的订单',
  name: 'centerMyorder',
  path: '/center/myorder',
  meta: {
    isNeedLogin: true, // 登录拦截
  },
  view: () => import(/* webpackChunkName: "group-my" */ '@/views/mycenter/myorder.vue'),
},
{
  title: '我的收藏',
  name: 'centerMycol',
  path: '/center/mycol',
  meta: {
    isNeedLogin: true, // 登录拦截
  },
  view: () => import(/* webpackChunkName: "group-my" */ '@/views/mycenter/mycol.vue'),
}, {
  title: '我的预约报名',
  name: 'centerSignin',
  path: '/center/signin',
  meta: {
    isNeedLogin: true, // 登录拦截
  },
  view: () => import(/* webpackChunkName: "group-my" */ '@/views/mycenter/mysigin.vue'),
},
{
  title: '续费会员',
  name: '/center/preson',
  path: '/center/preson',
  meta: {
    isNeedLogin: true, // 登录拦截
  },
  view: () => import(/* webpackChunkName: "group-my" */ '@/views/mycenter/myorder.vue'),
},

{
  title: '订单支付',
  name: '/order',
  path: '/order',
  meta: {
    isNeedLogin: true, // 登录拦截
    isHideQuickNav: true,
  },
  view: () => import(/* webpackChunkName: "group-order" */ '@/views/order/index.vue'),
},
{
  title: '订单支付',
  name: '/pay-order',
  path: '/pay-order',
  meta: {
    isNeedLogin: true, // 登录拦截
    isHideQuickNav: true,
  },
  view: () => import(/* webpackChunkName: "group-order" */ '@/views/order/pay.vue'),
},
{
  title: '支付成功',
  name: '/order/success',
  path: '/order/success',
  meta: {
    isNeedLogin: true, // 登录拦截
    isHideQuickNav: true,
  },
  view: () => import(/* webpackChunkName: "group-order" */ '@/views/order/success.vue'),
},
{
  title: '请填写发票信息',
  name: '/invoice',
  path: '/invoice',
  meta: {
    keepAlive: true,
    isNeedLogin: true, // 登录拦截
    isHideQuickNav: true,
  },
  view: () => import(/* webpackChunkName: "group-order" */ '@/views/order/invoice.vue'),
},
{
  title: '会员剩余权益',
  name: '/residualEquity',
  path: '/residualEquity',
  meta: {
    keepAlive: true,
    isNeedLogin: true, // 登录拦截
    isHideQuickNav: true,
  },
  view: () => import(/* webpackChunkName: "group-order" */ '@/views/vipInfo/residualEquity.vue'),
},

];
export default routes;
