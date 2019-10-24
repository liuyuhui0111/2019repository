
export default {
  install(Vue) {
    Vue.mixin({
      methods: {
        // 神策埋点
        track(eventName, data, fn) {
          const commonData = {
            productName: window.COMMON_ENV.name,
            platformType: 'web',
            version: window.COMMON_ENV.version,
          };
          // 设置公共属性
          window.sensors.registerPage(commonData);
          if (!eventName) {
            return;
          }
          // this.track('frompath',{'frompath':'/'})
          // eventName 埋点事件名称，data埋点数据 必须对象, fn回调函数
          window.sensors.track(eventName, data, () => {
            /*eslint-disable*/
            fn && fn();
            /* eslint-enable */
          });
        },

        // 发送图片
        yszj_sendPicture() {
          this.track('yszj_sendPicture', { Affiliated: '专家端im' });
        },

        // 客服转单
        yszj_customerServiceChangeOrder(params) {
          this.track('yszj_customerServiceChangeOrder', params);
        },

        // 发送文件
        yszj_sendFile() {
          this.track('yszj_sendFile', { Affiliated: '专家端im' });
        },

        // 快捷回复
        yszj_quickResponse(params) {
          this.track('yszj_quickResponse', params);
        },
        sensors_login(userId) {
          // 用户登录
          window.sensors.login(userId);
        },

      },
    });
  },
};
