<template>
  <div class="signup common-h5-signup">
    <div class="form">
      <el-form
        ref="formDialog"
        :label-position="labelPosition"
        label-width="0px"
        :model="onlineForm">
        <el-form-item prop="name">
        <div class="item">
          <span class="label">称呼</span>
          <el-input placeholder="请输入称呼"
          v-model.trim="onlineForm.name"></el-input>
        </div>

        </el-form-item>

        <el-form-item prop="tel">
        <div class="item">
          <span class="label">电话</span>
          <el-input placeholder="请输入电话"
          v-model.trim="onlineForm.tel"></el-input>
        </div>
        </el-form-item>


        <el-form-item prop="comp">
        <div class="item">
          <span class="label">公司</span>
          <el-input placeholder="请输入公司"
          v-model.trim="onlineForm.comp"></el-input>
        </div>
        </el-form-item>


         <el-form-item prop="work">
          <div class="item noborder">
          <span class="label">职位</span>
          <el-input placeholder="请输入职位"
          v-model.trim="onlineForm.work"></el-input>
          </div>
        </el-form-item>

        </el-form>
    </div>

    <div class="mes-box">
      <p>您要咨询的内容</p>
      <el-form label-width="0px">
        <el-form-item prop="message">
          <el-input type="textarea"
          placeholder="请输入您的问题"
           v-model.trim="onlineForm.message"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span @click="submitForm()" class="btn-sub">提交内容</span>
  </div>
</template>
<script>
import {
  offlineCourseSignUp,
} from '@/api/apis';
import { validByPhone } from '@/assets/utils/validator';

export default {
  name: 'signup',
  data() {
    return {
      name: 'signup',
      labelPosition: 'left',
      onlineForm: { // 在线报名表单
        name: '',
        tel: '',
        comp: '',
        work: '',
        message: '',
      },
      courseId: '',
      isCanSub: true,

    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.courseId = this.$route.query.cid;
    },
    submitForm() {
      if (!this.token) {
        this.confirm();
        return;
      }
      if (!this.onlineForm.name) {
        this.$message({
          message: '请输入称呼',
          type: 'warning',
          duration: 2000,
        });
        return;
      }
      if (this.onlineForm.name.length < 2 || this.onlineForm.name.length > 4) {
        this.$message({
          message: '姓名长度请控制在2~4个字内',
          type: 'warning',
          duration: 2000,
        });
        return;
      }
      if (!this.onlineForm.tel) {
        this.$message({
          message: '请输入电话',
          type: 'warning',
          duration: 2000,
        });
        return;
      }
      if (!validByPhone(this.onlineForm.tel)) {
        this.$message({
          message: '电话号码格式不对',
          type: 'warning',
          duration: 2000,
        });
        return;
      }
      if (!this.onlineForm.comp) {
        this.$message({
          message: '请输入公司',
          type: 'warning',
          duration: 2000,
        });
        return;
      }
      if (this.onlineForm.comp.length > 50) {
        this.$message({
          message: '公司名称过长，请控制在50字内',
          type: 'warning',
          duration: 2000,
        });
        return;
      }
      if (this.onlineForm.work.length > 10) {
        this.$message({
          message: '职位名字过长，请控制在10字内',
          type: 'warning',
          duration: 2000,
        });
        return;
      }

      if (this.onlineForm.message
        && (this.onlineForm.message.length < 2
          || this.onlineForm.message.length > 50)) {
        this.$message({
          message: '咨询内容请控制在2-50字以内',
          type: 'warning',
          duration: 2000,
        });
        return;
      }
      if (this.isCanSub) {
        this.isCanSub = false;
      } else {
        return;
      }
      this.offlineCourseSignUpFn();
    },
    offlineCourseSignUpFn() {
      // 录播课在线报名提交表单
      let params = {
        company: this.onlineForm.comp,
        offlineCourseId: this.courseId,
        name: this.onlineForm.name,
        phone: this.onlineForm.tel,
        job: this.onlineForm.work,
        content: this.onlineForm.message,
      };
      offlineCourseSignUp(params).then((res) => {
        this.isCanSub = true;
        if (res.data.code === '0000') {
          // this.detailData = res.data.data
          this.$router.replace({ path: '/h5/success' });
        } else if (res.data.code !== '0002') {
          this.$message({
            message: '报名失败，请稍后再试',
            type: 'warning',
          });
        }
      }).catch((err) => {
        this.isCanSub = true;
        console.log(err);
        this.$message({
          message: '报名失败，请稍后再试',
          type: 'warning',
        });
      });
    },
  },
};
</script>
<style>
  .common-h5-signup .el-form-item{
    margin-bottom: 0;
  }
</style>
<style scoped>
  .form{
    display: block;
    box-sizing:border-box;
    padding-left: 15px;
    border-bottom: 1px solid #d4d4d4;
    font-size: 14px;
    color: #444444;
    letter-spacing: -0.68px;
    text-align: center;
    line-height: 20px;
  }
  .form .item{
    border-bottom: 1px solid #d4d4d4;
    height: 40px;
    line-height: 40px;
    padding-left: 60px;
    position: relative;
    box-sizing:border-box;
  }
  .form .item.noborder{
    border-color: #fff;
  }
  .item .label{
    position: absolute;
    left: 0;
    top: 0px;
    height: 20px;
  }
  .mes-box{
    display: block;
    width: 100%;
    height: 207px;
    text-align: left;
    box-sizing:border-box;
    padding: 30px 15px 15px 15px;
    margin: 10px 0;
    position: relative;
  }
  .mes-box p{
    position: absolute;
    top: 0;
    left: 15px;
  }
</style>
