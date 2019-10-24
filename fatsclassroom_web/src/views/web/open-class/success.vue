<template>
  <div class="success">
    <div class="icon-success">报名成功</div>
    <p>请保持手机畅通稍后课程顾问会联系您哒</p>
    <p class="btns">
    <!-- <router-link tag="span" to="/index" class="btn-sub gray">我再想想</router-link> -->
    <span class="btn-sub gray" @click="back()">我再想想</span>
    <span class="btn-sub" @click="goBuy()">立即购买</span>
    </p>
  </div>
</template>
<script>
export default {
  name: 'success',
  data() {
    return {
      name: 'success',
      id: '',
      sid: '',
      type: '',
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.id = this.$route.query.cid || '';
      this.sid = this.$route.query.sid || '';
      this.type = this.$route.query.type || '';
    },
    back() {
      this.$router.go(-1);
    },
    goBuy() {
      if (this.id) {
        this.$router.push({
          path: '/order',
          query: {
            cid: this.id,
            type: this.type,
            sid: this.sid,
          },
        });
      } else {
        this.$message({
          message: '报名信息获取失败，请重新报名',
          type: 'warning',
        });
      }
    },
  },
};
</script>
<style scoped>
.success{
  width: 100%;
  padding-top: 15%;
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
.btns{
  width: 300px;
  width: 280px\0;
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
  overflow: hidden\0;
}
.btns span{
  cursor: pointer;
  float: right\0;
}
.btns .gray{
  background: #ccc;
  float: left\0;
}
</style>
