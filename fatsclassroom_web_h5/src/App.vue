<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  async mounted() {
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
  #chatBtn{
    display: none!important;
  }
#app {
  width: 100%;
  overflow-x: hidden;
  line-height: 1;
}
/*设置灰色背景*/
#app:before{
  content: "";
  position: fixed;
  display: block;
  top: 0;
  left: 0;
  bottom:0;
  right: 0;
  z-index: -1;
  background: #f1f1f1;
}
</style>
