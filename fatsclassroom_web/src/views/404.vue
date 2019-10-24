<template>
    <div class="page404">
        <img src="./imgs/404.png" alt="404">
        <div class="btns">
            <span @click="routerGo(-1)">返回上一级页面</span>
            <span @click="routerGo('/index')">返回首页</span>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      name: '404',
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {

    },
    routerGo(path) {
      if (path === -1) {
        this.$router.go(-1);
      } else {
        this.$router.push({ path });
      }
    },
  },
};
</script>
<style scoped>
.page404 {
    padding-bottom: 10%;
}
.page404 img{
    display: block;
    max-width: 428px;
    width: 44%;
    height: auto;
    margin: 10% auto 0 auto;
}
.btns{
  margin: 30px auto;
  max-width: 428px;
  min-width: 213px;
  width: 44%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    color: #FB683C;
    letter-spacing: -0.39px;
    text-align: center;
    cursor: pointer;
    overflow: hidden\0;
}
:root .btns span{
    float: left\0;
}
</style>
