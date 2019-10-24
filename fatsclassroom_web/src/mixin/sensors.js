
export default {
  install(Vue) {
    Vue.mixin({
      methods: {
        // 神策埋点
        track(eventName, data, fn) {
          const commonData = {
            productName: '优税学院',
            companyName: '大象慧云',
            platformType: 'web',
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

        // 搜索按钮点击
        ysxy_searchButtonClick(params) {
          this.track('ysxy_searchButtonClick', params);
        },

        // 搜索结果
        ysxy_sendSearchRequest(params) {
          this.track('ysxy_sendSearchRequest', params);
        },

        // 搜索结果点击
        ysxy_searchResultClick(params) {
          this.track('ysxy_searchResultClick', params);
        },

        // 测评按钮点击
        ysxy_EvaluationClick(params) {
          this.track('ysxy_EvaluationClick', params);
        },

        // 视频播放点击
        ysxy_videoPlay(params) {
          /*eslint-disable*/ 
          params.contentSource = params.contentSource || this.fromRoute;
          /* eslint-enable */
          this.track('ysxy_videoPlay', params);
        },

        // 首页栏目点击
        ysxy_columnClick(params) {
          this.track('ysxy_columnClick', params);
        },

        // 课程详情页浏览
        ysxy_detailView(params) {
          /*eslint-disable*/ 
          params.contentSource = params.contentSource || this.fromRoute;
          /* eslint-enable */
          this.track('ysxy_detailView', params);
        },

        // 支付成功  后端埋点
        ysxy_payment(params) {
          this.track('ysxy_payment', params);
        },

        // 公开课报名（提交信息按钮点击）
        ysxy_signUp(params) {
          this.track('ysxy_signUp', params);
        },

        // 收藏
        ysxy_collect(params) {
          this.track('ysxy_collect', params);
        },
        // 分享按钮点击
        ysxy_shareClick(params) {
          this.track('ysxy_shareClick', params);
        },


        // 评论
        ysxy_comment(params) {
          console.log(params);
          this.track('ysxy_comment', params);
        },

      },
    });
  },
};
