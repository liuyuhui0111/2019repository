<template>
  <div class="success">
    <div class="icon-success">报名成功</div>
    <p>请保持手机畅通稍后课程顾问会联系您哒</p>
  </div>
</template>
<script>
export default {
  name: 'success',
  data() {
    return {
      name: 'success',
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {

    },
  },
};
</script>
<style scoped>
.success{
  width: 100%;
  padding-top: 19%;
  text-align: center;
  font-size: 14px;
color: #FB683C;
letter-spacing: -0.68px;
}
.icon-success{
  display: block;
  width: 150px;
  padding-left: 50px;
  background: url('./imgs/icon-success.png') no-repeat left center;
  background-size: 40px 40px;
  font-size: 25px;
  color: #444444;
  letter-spacing: 0;
  height: 40px;
  box-sizing:border-box;
  margin: 0 auto 15px auto;
}
</style>
