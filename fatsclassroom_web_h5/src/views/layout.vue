<template>
  <div class="layout">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- 首页底部导航 -->
    <FootNav></FootNav>

    <!-- 返回顶部 -->
    <BackTop></BackTop>

    <!-- 网络连接出错 -->
    <div v-if="netWorkError" class="network-error">
      <i class="icon-neterror"></i>
      网络不给力~
    </div>
    <!-- 请求loadding -->
    <div v-if="requestLoading" class="request-loading">
      <div class="loading-box">
        <cube-loading :size="40"></cube-loading>
      </div>
    </div>
    <!-- 快捷导航 -->
    <quickNav></quickNav>

  </div>
</template>
<script>
/* eslint-disable prefer-destructuring,eqeqeq */

import FootNav from '@/views/components/foot-nav.vue';
import {
  getSourceData,
} from '@/api/apis';
import quickNav from '@/views/components/quickNav.vue';

export default {
  name: 'index',
  data() {
    return {
      name: 'common-layout',
      showFootNavPath: ['/index'], // 显示底部导航的路由

    };
  },
  // beforeRouteEnter(to, from, next) {
  //   console.log('layout beforeRouteEnter', to, from);
  //   next();
  // },
  components: {
    FootNav,
    quickNav,
  },
  watch: {
    isShowLoading() {
      // 全局loadding
      if (this.isShowLoading) {
        this.$loading();
      } else {
        this.$loading().close();
      }
    },
    token(newval, oldval) {
      if (oldval && !newval) {
        this.loginoutFn(true);
        return;
      }
      if (!this.token && !this.$route.meta.isNeedLogin) {
        this.getTokenByCode();
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 获取公司主体信息
      if (!this.COMMON_COMP_DATA.logoUrl) {
        this.getSourceDataFn();
      }
      if ((!this.commonUserData || !this.commonUserData.userName)
        && this.token) {
        this.getUserInfoFn();
      }
      if (!this.token && !this.$route.meta.isNeedLogin) {
        this.getTokenByCode();
      }
    },

    // getTokenByCode(){
    //   // 重写该方法  防止重复调用
    // },
    getSourceDataFn() {
      // 获取公司主体信息
      getSourceData().then((res) => {
        this.isCanRequest = true;
        if (res.data.code === '0000') {
          // 获取成功
          this.setCopData(res.data.sourceData);
          // 动态插入客服数据
          if (document.getElementById('qimoChatScript')) {
            this.setIsqimoChatClickFlag(true);
            return;
          }
          if (res.data.sourceData.standbyFieldOne && res.data.sourceData.standbyFieldOneType == '1') {
            let url = '';
            let standbyField = res.data.sourceData.standbyFieldOne;
            if (standbyField.indexOf('|') !== -1) {
              let urlArr = standbyField.split('|');
              url = urlArr[1];
            } else {
              url = standbyField;
            }
            console.log('客服src', url);
            // let accessId = '60b5ca80-a22f-11e9-8ca3-3f368529f02c';
            let src = url;
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = 'qimoChatScript';
            script.src = src;
            document.getElementsByTagName('head')[0].appendChild(script);
            script.onload = () => {
              this.setIsqimoChatClickFlag(true);
            };
          } else {
            this.setIsqimoChatClickFlag(false);
          }
        }
      }).catch((err) => {
        this.isCanRequest = true;
        console.log(err);
        // 获取token 失败  退出登录 提示重新登录
      });
    },

  },
};
</script>
<style scoped>
/*页面过渡效果*/
  .network-error{
    display: block;
    position: fixed;
    width: 136px;
    height: 86px;
    background: rgba(0,0,0,0.79);
    border-radius: 4px;
    color: #fff;
    text-align: center;
    font-size: 14px;
    letter-spacing: -0.68px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .network-error .icon-neterror{
    background: url('./imgs/network-error.png') no-repeat center center;
    background-size: 100% 100%;
    display: block;
    width: 41px;
    height: 41px;
    margin:10px auto 5px auto;
  }
  .request-loading{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background: rgba(0,0,0,0);
  }
  .loading-box{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #fff;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #444;
  }
</style>
