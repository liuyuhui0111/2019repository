<template>
  <div class="login">
    <div class="tc">
      <div class="logo"><img src="@/assets/icon/login-logo.png" alt=""></div>
      <!-- 登录 -->
      <el-form v-if="isLogin" class="form" ref="loginForm"
      :model="loginForm" :rules="loginRules">
        <div class="title">登录专家版</div>
        <el-form-item prop="loginAccount">
          <el-input v-model.trim ="loginForm.loginAccount" placeholder="输入手机号">
            <i slot="prefix" class="fi icon2yonghu"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="loginPassword">
          <el-input v-model="loginForm.loginPassword"
          @keyup.enter.native="login"
          autocomplete="new-password" show-password placeholder="输入密码">
            <i slot="prefix" class="fi icon2mima"></i>
          </el-input>
        </el-form-item>
        <button type="button" class="submit" @click="login">登录</button>
        <div class="forget" @click="forget">忘记密码？</div>
      </el-form>
      <!-- 重置密码 -->
      <el-form v-if="isResetPsw" class="form" ref="form" :model="form" :rules="rules">
        <div class="goback" @click="goback"><i class="fi icon2fanhui"></i></div>
        <div class="title">重置密码</div>
        <el-form-item prop="account">
          <el-input v-model.trim="form.account" placeholder="输入手机号">
            <i slot="prefix" class="fi icon2yonghu"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="yzm" prop="verificationCode">
          <el-input v-model="form.verificationCode" placeholder="输入短信验证码">
            <i slot="prefix" class="fi icon2yanzhengma"></i>
            <div slot="suffix">
              <button type="button" @click="getYzm()" :disabled="disabled">
                {{yzmText}}
              </button>
            </div>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password"
          autocomplete="new-password" show-password placeholder="输入密码">
            <i slot="prefix" class="fi icon2mima"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password1">
          <el-input v-model="form.password1"
          @keyup.enter.native="submit"
          autocomplete="new-password" show-password placeholder="再次输入密码">
            <i slot="prefix" class="fi icon2mima"></i>
          </el-input>
        </el-form-item>
        <button type="button" class="submit" @click="submit">完成</button>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  expertLogin, resetPassword, getVerificationCode, getQuestionToExpert,
} from '@/api/apis';

export default {
  data() {
    let psw = (rule, value, callback) => {
      if (/^[0-9a-z]{6}$/i.test(value) && /[0-9]/.test(value) && /[a-z]/i.test(value)) {
        callback();
      } else {
        callback(new Error('密码要求6位字母和数字组合'));
      }
    };
    let mobile = (rule, value, callback) => {
      if (/^1\d{10}$/.test(value)) {
        callback();
      } else {
        callback(new Error('手机号格式不正确'));
      }
    };
    let psw1 = (rule, value, callback) => {
      if (this.form.password === value) {
        callback();
      } else {
        callback(new Error('两次密码不一致'));
      }
    };
    return {
      yzmText: '获取验证码',
      isLogin: this.$route.path === '/login', // 判断是不是登录
      isResetPsw: this.$route.path === '/resetPsw', // 判断是不是登录
      loginForm: { // 登录表单
        loginAccount: '',
        loginPassword: '',
      },
      form: { // 修改密码表单
        account: '',
        verificationCode: '',
        password: '',
        password1: '',
      },
      loginRules: {
        loginAccount: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: mobile, trigger: 'blur' },
        ],
        loginPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
      rules: {
        account: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: mobile, trigger: 'blur' },
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: psw, trigger: 'blur' },
        ],
        password1: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: psw, trigger: 'blur' },
          { validator: psw1, trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    disabled: {
      get() {
        return !(/^1\d{10}$/.test(this.form.account) && this.yzmText === '获取验证码');
      },
      set() {},
    },
  },
  watch: {
    $route() {
      this.isLogin = this.$route.path === '/login';
      this.isResetPsw = this.$route.path === '/resetPsw';
      if (this.$refs.loginForm) {
        this.$refs.loginForm.clearValidate();
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
      this.loginForm = {
        account: '',
        password: '',
      };
      this.form = {
        account: '',
        verificationCode: '',
        password: '',
        password1: '',
      };
    },
  },
  methods: {
    // 登录
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          expertLogin({
            account: this.loginForm.loginAccount,
            password: this.loginForm.loginPassword,
          }).then((response) => {
            let res = response.data;
            if (res.code === '0000') {
              this.$message({
                message: '登录成功',
                type: 'success',
              });
              this.setToken(res.data.token);
              this.setcurUserData(res.data);
              getQuestionToExpert({
                id: res.data.id,
                account: res.data.account,
                name: res.data.name,
                distributorId: res.data.distributorId,
              });
              this.$router.replace('/askMange');
            } else {
              this.$message({ message: res.message, type: 'error' });
            }
          }).catch((err) => {
            console.log(err);
          });
        }
      });
    },
    // 重置密码提交
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          resetPassword(this.form).then((response) => {
            let res = response.data;
            if (res.code === '0000') {
              this.form = {
                account: '',
                verificationCode: '',
                password: '',
                password1: '',
              };
              this.$message({
                message: '重置密码成功',
                type: 'success',
              });
              this.$router.replace('/login');
            } else {
              this.$message({ message: res.message, type: 'error' });
            }
          });
        }
      });
    },
    // 获取验证码
    getYzm() {
      getVerificationCode({ account: this.form.account }).then((response) => {
        let res = response.data;
        if (res.code === '0000') {
          this.$message({
            message: '验证码发送成功',
            type: 'success',
          });
        } else {
          this.$message({ message: res.message, type: 'error' });
        }
      });
      let counter = 60;
      let timer = window.setInterval(() => {
        if (counter <= 0) {
          this.yzmText = '获取验证码';
          window.clearInterval(timer);
          counter = 60;
          this.disabled = false;
        } else {
          this.yzmText = `${counter}s后可重发`;
          this.disabled = true;
        }
        counter -= 1;
      }, 1000);
    },
    // 忘记密码
    forget() {
      this.$router.push('/resetPsw');
    },
    // 后退
    goback() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss">
  .login {
    .el-input--prefix .el-input__inner {
      padding-left: 45px;
      height: 42px;
    }
    .el-input__prefix {
      width: 36px;
      left: 0;
      top: 8px;
      height: 24px;
      line-height: 24px;
      border-right: 1px solid #DCDFE6;
    }
    .yzm {
      .el-input__inner {
        padding-right: 110px;
      }
      button {
        padding: 0;
        border: 0;
        background: none;
        outline: none;
        height: 24px;
        color: #229FFF;
        cursor: pointer;
        &:disabled {
          cursor: not-allowed;
          color: #d5d5d5;
        }
      }
      .el-input__suffix {
        width: 100px;
        right: 0;
        top: 8px;
        height: 24px;
        line-height: 24px;
        border-left: 1px solid #DCDFE6;
      }
    }
  }
</style>
<style lang="scss" scoped>
.login {
  height: 100vh;
  background: url("../../assets/icon/bg.png");
  background-size: 12px 12px;
  text-align: center;
  display: table;
  width: 100%;
  .tc {
    display: table-cell;
    vertical-align: middle;
  }
  .goback {
    position: absolute;
    left: 15px;
    top: 15px;
    color: #BBCFDD;
    cursor: pointer;
    &:hover {
      color: #39A9FF;
    }
  }
  .title {
    font-size: 20px;
    color: #000;
    margin-bottom: 30px;
    &:after {
      content: '';
      display: block;
      clear: both;
    }
  }
  .logo {
    margin-bottom: 40px;
  }
  .form {
    background-color: #fff;
    box-shadow: 0 0 30px 2px #e8e8e8;
    border-radius: 4px;
    max-width: 380px;
    box-sizing: border-box;
    margin: auto;
    padding: 20px 40px 40px;
    position: relative;
  }
  .submit {
    width: 100%;
    border: 0;
    outline: none;
    background-color: #33C8DF;
    border-radius: 4px;
    color: #fff;
    height: 46px;
    font-size: 18px;
    cursor: pointer;
    &:hover {
      background-color: lighten(#33C8DF, 5%)
    }
  }
  .forget {
    float: right;
    cursor: pointer;
    margin-top: 4px;
  }
}
</style>
