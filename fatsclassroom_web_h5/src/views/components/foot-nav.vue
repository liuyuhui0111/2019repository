<template>
  <div v-show="curindex != -1" class="foot-nav">
    <div class="item"
    :class="{active:index == curindex}"
    @click="routerReplace(item.path)"
    v-for="(item,index) in list"
    :key="index">
      {{item.text}}
    </div>
  </div>
</template>
<script>
export default {
  name: 'FootNav',
  data() {
    return {
      curindex: -1,
      list: [
        {
          text: '首页',
          path: '/index',
          index: 0,
        }, {
          text: '全部课程',
          path: '/online-class',
          index: 1,
        }, {
          text: '我的学习',
          path: '/center/myclass',
          index: 2,
        }, {
          text: '个人中心',
          path: '/center',
          index: 3,
        },
      ],
    };
  },
  watch: {
    $route() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initFootNav();
    },
    initFootNav() {
      this.curindex = -1;
      // 判断是否显示底部导航
      let { path } = this.$route;
      if (path === '/open-class') {
        path = '/online-class';
      }

      if (path === '/center/offline') {
        path = '/center/myclass';
      }
      this.list.forEach((item, index) => {
        if (item.path === path) {
          this.curindex = index;
        }
      });
    },
  },
};
</script>
<style scoped>
.foot-nav{
  position: fixed;
  width: 100%;
  height: 50px;
  background: #fff;
  bottom: 0;
  left: 0;
  box-shadow: 0 -1px 0 0 #D4D4D4;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 99;
}
.item{
  padding-top: 32px;
  font-size: 9px;
  text-align: center;
  color: #444;
  background: url('./imgs/icon-nav0.png') no-repeat center 2px;
  background-size: auto 25px;
  width: 25%;
}
.item.active{
  color: #FB683C;
}
.item:nth-child(1){
  background-image: url('./imgs/icon-nav0.png');
}
.item:nth-child(1).active{
  background-image: url('./imgs/icon-nav0-active.png');
}
.item:nth-child(2){
  background-image: url('./imgs/icon-nav1.png');
}
.item:nth-child(2).active{
  background-image: url('./imgs/icon-nav1-active.png');
}
.item:nth-child(3){
  background-image: url('./imgs/icon-nav2.png');
}
.item:nth-child(3).active{
  background-image: url('./imgs/icon-nav2-active.png');
}
.item:nth-child(4){
  background-image: url('./imgs/icon-nav3.png');
}
.item:nth-child(4).active{
  background-image: url('./imgs/icon-nav3-active.png');
}
</style>
