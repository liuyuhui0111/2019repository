<template>
  <div class="common-set-psw">
    <div class="title">修改密码</div>
    <el-form class="form" ref="form" :model="form" :rules="rules" label-width="100px"
    autocomplete="off">
      <el-form-item label="当前密码：" prop="currentPassword">
        <el-input v-model="form.currentPassword"
        autocomplete="new-password" show-password placeholder="请输入当前密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPassword">
        <el-input v-model="form.newPassword"
        @keyup.enter.native="submit"
        autocomplete="new-password" show-password placeholder="请输入新密码"></el-input>
      </el-form-item>
      <p class="tips">如果您忘记当前密码，建议通过“<router-link to="/resetPsw">找回密码</router-link>”来重置密码！</p>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form>
  </div>
</template>

<script>
import { changeExpertPassword } from '@/api/apis';

export default {
  data() {
    let psw = (rule, value, callback) => {
      if (/^[0-9a-z]{6}$/i.test(value) && /[0-9]/.test(value) && /[a-z]/i.test(value)) {
        callback();
      } else {
        callback(new Error('密码要求6位字母和数字组合'));
      }
    };
    return {
      form: {
        currentPassword: '', // 当前密码
        newPassword: '', // 新密码
      },
      rules: {
        currentPassword: [
          { required: true, message: '请输入当前密码', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: psw, trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          changeExpertPassword({
            currentPassword: this.form.currentPassword,
            newPassword: this.form.newPassword,
            account: this.curUserData.account,
          }).then((response) => {
            let res = response.data;
            if (res.code === '0000') {
              this.form.currentPassword = '';
              this.form.newPassword = '';
              this.$message({
                message: '修改密码成功',
                type: 'success',
              });
              this.$router.replace('/login');
            } else {
              this.$message({
                message: res.message,
                type: 'error',
              });
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss">
.common-layout-index {
  .common-set-psw {
    .el-input__inner {
      border: 1px solid #d9d9d9;
      height: 36px;
      width: 240px;
      padding: 0 8px;
    }
  }
}
</style>
<style lang="scss" scoped>
  .title {
    font-size: 20px;
    color: #000;
    text-align: left;
  }
  .common-set-psw {
    padding: 20px;
    text-align: center;
  }
  .form {
    display: inline-block;
    margin-top: 40px;
  }
  .tips {
    margin-bottom: 40px;
    a {
      color: #33C8DF;
      text-decoration: none;
    }
  }
</style>
