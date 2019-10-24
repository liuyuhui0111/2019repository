<template>
  <div class="signin">
    <h3>Hi，请填写信息签到</h3>
    <p>签到后才可以领取教材哦</p>
    <div class="inp">
      <input type="text" v-model.trim="code"
      placeholder="请输入听课凭借码">
    </div>
    <span @click="qrCodeSignInFn" class="btn-sub">提交</span>
    <div v-show="isShowDialog"
    @click="isShowDialog=false"
     class="mask">
      <div @click.stop class="dialog-success">
        <!-- 成功弹窗 -->
        <p>棒棒哒！签到成功~</p>
        <p>快去领取教材吧</p>


        <span @click="isShowDialog=false"
        class="btn-sub">好的</span>
      </div>
    </div>
  </div>
</template>
<script>
import {
  qrCodeSignIn,
} from '@/api/apis';
import { getUrlParam } from '@/assets/utils/util';

export default {
  name: 'signin',
  data() {
    return {
      name: 'signin',
      code: '',
      courseId: '',
      isCanSub: true,
      isShowDialog: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.courseId = this.$route.query.cid;
      this.initUserInfo();
    },
    initUserInfo() {
      // 获取用户信息
      const code = getUrlParam('code');
      if (code) {
        // 如果code 存在 token不存在
        if (!this.token) {
          this.getTokenByCode();
        }
      }
    },
    qrCodeSignInFn() {
      // 录播课在线报名提交表单
      if (!this.token || !this.courseId) {
        this.login();
        return;
      }
      if (!this.code) {
        this.$message({
          message: '请输入听课凭借码',
          type: 'warning',
          duration: 1000,
        });
        return;
      }
      let params = {
        tkm: this.code,
        courseId: this.courseId,
      };
      if (this.isCanSub) {
        this.isCanSub = false;
      } else {
        return;
      }
      qrCodeSignIn(params).then((res) => {
        this.isCanSub = true;
        if (res.data.code === '0000') {
          this.isShowDialog = true;
        } else if (res.data.code === '0012') {
          this.$message({
            message: '您已签到成功，无需重复签到哦~',
            type: 'warning',
          });
        } else if (res.data.code !== '0002') {
          this.$message({
            message: '签到失败，请检查您的听课凭借码是否正确',
            type: 'warning',
          });
        }
      }).catch((err) => {
        this.isCanSub = true;
        console.log(err);
        this.$message({
          message: '签到失败，请稍后再试',
          type: 'warning',
        });
      });
    },
  },
};
</script>
<style scoped>
  .signin{
    padding: 15px 35px;
    display: block;
    width: 100%;
    box-sizing:border-box;
  }
  .inp{
    border-bottom: 1px solid #d4d4d4;
    width: 250px;
    margin: 0 auto;
  }
  input{
    border: none;
    font-size: 14px;
    color: #444;
    text-align: center;
    display: block;
    width: 100%;
    height: 100%;
    line-height: 20px;
    padding: 5px;
    height: 30px;
    box-sizing:border-box;
    outline: none;
  }
  p{
    color: #FB683C;
    margin-top: 5px;
    margin-bottom: 50px;
  }
  .btn-sub{
    margin-top: 90px;
    width: 190px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
  }
  .mask{
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,0.62);
  }
  .dialog-success{
    display: block;
    width: 295px;
    height: 209px;
    background: #FFFFFF;
    border: 1px solid #979797;
    border-radius: 8px;
    font-size: 14px;
    color: #444444;
    letter-spacing: -0.68px;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 20%;
    transform: translate(-50%);
    padding: 30px 0;
    box-sizing:border-box;
  }
  .dialog-success .btn-sub{
    margin-top: 50px;
  }
  .dialog-success p{
    margin-bottom: 15px;
  }

</style>
