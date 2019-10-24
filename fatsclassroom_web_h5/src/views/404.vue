<template>
    <div class="page404">
        <img src="./imgs/404.png" alt="404">
        <p>sorry！你访问的页面被外星人带走了~</p>
        <div class="btns">
            <span @click="routerReplace('/index')">返回首页</span>
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
   font-size: 17px;
   text-align: center;
}
.page404 img{
    display: block;
    width: 214px;
    height: auto;
    margin: 10% auto 15px auto;
}
.btns{
  text-align: center;
  display: block;
  width: 100%;
  color: #FB683C;
  padding-top: 10px;
}

</style>
