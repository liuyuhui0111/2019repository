<template>
  <div class="common-layout-footer">
    <div class="footer-info">
      <div class="logo"><img :src="footerData.logo" alt=""></div>
      <div class="time">
        <p>客服电话：{{footerData.servicePhone}}</p>
        <p>客服工作时间：{{footerData.workTime}}</p>
      </div>
    </div>
    <div class="copyright">{{footerData.publisher}}</div>
  </div>
</template>

<script>
import { getSourceInfoByUri } from '@/api/apis';

export default {
  data() {
    return {
      footerData: {},
    };
  },
  created() {
    this.getSourceInfoByUri();
  },
  methods: {
    async getSourceInfoByUri() {
      let url = window.location.host.includes('localhost') ? 'http://test.5ifapiao.com:8888/expert-0/#/login'
        : window.location.href;
      let res = await getSourceInfoByUri({ uri: url });
      if (res.data.code === '0000') {
        this.footerData = res.data.data;
      } else {
        this.$message({
          message: res.data.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.common-layout-footer {
  background-color: #313134;
  text-align: center;
  padding: 35px 20px 15px;
}
.footer-info {
  display: inline-block;
  color: #e8e8e8;
  .logo, .time {
    display: inline-block;
    vertical-align: middle;
  }
  .time {
    text-align: left;
    font-size: 16px;
    p:first-child {
      margin-bottom: 10px;
    }
  }
  .logo {
    width: 120px;
    padding-right: 26px;
    margin-right: 26px;
    border-right: 1px solid #666;
    img {
      width: 100%;
      max-height: 120px;
    }
  }
}
.copyright {
  font-size: 14px;
  margin-top: 40px;
}
</style>
