
export default {
  install(Vue) {
    Vue.mixin({
      methods: {
        // 神策埋点
        track(eventName, data, fn) {
          const commonData = {
            productName: '优税学院',
            companyName: '大象慧云',
            platformType: 'H5',
            version: window.COMMON_ENV.version,
          };
          let params = Object.assign(commonData, data);
          console.log(this.fromRoute, params);
          if (!eventName) {
            return;
          }
          // this.track('frompath',{'frompath':'/'})
          // eventName 埋点事件名称，data埋点数据 必须对象, fn回调函数
          window.sensors.track(eventName, params, () => {
            /*eslint-disable*/
            fn && fn();
            /* eslint-enable */
          });
        },

        // 首页栏目点击
        ysxy_columnClick(params) {
          this.track('ysxy_columnClick', params);
        },
        // 视频播放
        ysxy_videoPlay(params) {
          this.track('ysxy_videoPlay', params);
        },
        // 课程详情页浏览
        ysxy_detailView(params) {
          this.track('ysxy_detailView', params);
        },
        // 公开课报名（提交信息按钮点击）
        ysxy_signUp(params) {
          this.track('ysxy_signUp', params);
        },
        // 收藏
        ysxy_collect(params) {
          this.track('ysxy_collect', params);
        },
        // 分享
        ysxy_share(params) {
          this.track('ysxy_share', params);
        },
      },
    });
  },
};
