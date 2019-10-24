<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>

// import COMMON_ENV from '@/config/env';

export default {
  name: 'app',
  watch: {
    isShowLoading() {
      if (this.isShowLoading) {
        this.$loading();
      } else {
        this.$loading().close();
      }
    },
  },
  async mounted() {
    // window.rongCloudConfig(COMMON_ENV.rongCloudConfig);
    // // 动态插入客服数据
    // if (document.getElementById('qimoChatScript')) {
    //   this.setIsqimoChatClickFlag(true);
    //   return;
    // }
    // let accessId = '60b5ca80-a22f-11e9-8ca3-3f368529f02c';
    // let src = `https://webchat.7moor.com/javascripts/7moorInit.js?accessId=${accessId}&autoShow=false&language=ZHCN`;
    // let script = document.createElement('script');
    // script.type = 'text/javascript';
    // script.id = 'qimoChatScript';
    // script.src = src;
    // document.getElementsByTagName('head')[0].appendChild(script);
    // script.onload = () => {
    //   this.setIsqimoChatClickFlag(true);
    // };
  },

};
</script>

<style>
#app {
}
/*避免他们服务不稳定出现客服咨询按钮 强制隐藏该按钮*/
div#chatBtn{
  display: none !important;
}
/*element-ui弹出信息bodypadding*/
body.el-popup-parent--hidden{
  padding-right: 0 !important;
}
</style>
