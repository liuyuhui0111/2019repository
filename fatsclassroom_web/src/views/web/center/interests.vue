<template>
  <div class="interests common-container-width">
    <div class="title">
      <h3>优税学院会员   享专属特权</h3>
      <p v-if="dueTime <= 0">开通会员尊享课程资源免费观看，还有更多特权服务</p>
      <p v-if="dueTime > 0 && commonUserData">
        Hi,{{commonUserData.userName}},您开通的{{commonUserData.leaguerLevelName}}会员，剩余{{dueTime}}天
      </p>
    </div>
    <div v-if="lvList.length>0" class="contain-box">
      <div class="item" v-for="(item,index) in lvList"
      :class="[{empty:item == null},{active:(item && item.openVipType==='1') || dueTime <= 0}]"
      :key="index">
        <template v-if="item != null">
        <h3 class="level">{{item.name}}</h3>
        <p class="intro ellipsis2">{{item.introduce}}</p>
        <ul v-if="item.equityDtoList" class="list">
          <li v-for="(list,index) in item.equityDtoList"
          :class="{active:list.tickType == '1'}"
          :key="index">
            {{list.name}}
          </li>
        </ul>
         <span @click="goOrder(item)"
         v-if="item.openVipType==='1'"
        class="btn-sub pointer">立即续费</span>
        <span @click="goOrder(item)"
        v-else
        class="btn-sub pointer">￥{{item.fee}}/年</span>
        </template>
      </div >
    </div>

    <!-- 让售前经理联系表单 -->
    <div class="form">
      <h3>让售前经理联系我</h3>
      <el-form :inline="true"
      :rules="rules"
      ref="ruleInterForm"
      :model="formInline"
      class="form-inline">
        <div class="form-line">
          <el-form-item label=""
          prop="name">
            <!-- <el-input v-model.trim="formInline.name" placeholder="请输入你的姓名"></el-input> -->
            <input type="text"
          v-model.trim="formInline.name"
          @blur="validateFieldFn('name')"
          autocomplete="off"
          placeholder="请输入你的姓名"
          class="el-input__inner">
          </el-form-item>
          <el-form-item label=""
          prop="company">
            <!-- <el-input v-model.trim="formInline.company" placeholder="请输入你的公司名称"></el-input> -->
            <input type="text"
          v-model.trim="formInline.company"
          @blur="validateFieldFn('company')"
          autocomplete="off"
          placeholder="请输入你的公司名称"
          class="el-input__inner">

          </el-form-item>
        </div>
        <div class="form-line">
          <el-form-item label=""
          prop="phone">
           <!--  <el-input v-model.trim="formInline.phone" placeholder="请输入你的电话"></el-input> -->
            <input type="text"
          v-model.trim="formInline.phone"
          @blur="validateFieldFn('phone')"
          autocomplete="off"
          placeholder="请输入你的电话"
          class="el-input__inner">
          </el-form-item>
          <el-form-item label=""
          prop="job">
           <!--  <el-input v-model.trim="formInline.job" placeholder="请输入你的职务"></el-input> -->
           <input type="text"
          v-model.trim="formInline.job"
          @blur="validateFieldFn('job')"
          autocomplete="off"
          placeholder="请输入你的职务"
          class="el-input__inner">
          </el-form-item>
        </div>
      </el-form>
      <span @click="submitForm('ruleInterForm')" class="btn-sub">提交</span>
    </div>
  </div>
</template>
<script>
import mixin from './js/mixin';
import { addcontactMe, queryList } from '@/api/apis';
import { initList } from '@/assets/utils/util';
import { validByPhone } from '@/assets/utils/validator';

export default {
  name: 'interests',
  mixins: [mixin],
  data() {
    return {
      name: 'interests',
      formInline: {
        name: '',
        company: '',
        phone: '',
        job: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          },
          {
            min: 2, max: 4, message: '姓名长度请控制在2~4个字内', trigger: 'blur',
          },
        ],
        company: [
          {
            min: 0, max: 50, message: '公司名称过长，请控制在50字内', trigger: 'blur',
          },
        ],
        job: [
          {
            min: 0, max: 10, message: '职位名字过长，请控制在10字内', trigger: 'blur',
          },
        ],
        phone: [
          {
            required: true,
            message: '请输入电话号码',
            trigger: 'blur',
          },
          {
            min: 11,
            max: 11,
            message: '格式错误，请重新输入',
            trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
              if (!validByPhone(value)) {
                callback(new Error());
              } else {
                callback();
              }
            },
            trigger: 'blur',
            message: '格式错误，请重新输入',
          },
        ],
      },
      lvList: [],
      lvId: '',

      courseId: '',
      type: 3, // 1线上视频课 2公开课 3会员
      isCanReq: true,
      dueTime: '', // 会员到期时间

    };
  },
  // beforeRouteEnter(to, from, next) {
  //   if (getTokenFn()) {
  //     next();
  //   } else {
  //     next(from);
  //   }
  // },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 查询会员权益
      this.queryListFn();
    },
    queryListFn() {
      // 查询会员权益列表
      queryList().then((res) => {
        if (res.data.code === '0000') {
          this.lvList = initList(res.data.list, 4);
          this.dueTime = res.data.num;
        }
      }).catch((err) => {
        console.log(err);
        this.$message({
          message: '获取会员权益信息失败，请稍后再试',
          type: 'warning',
        });
      });
    },
    addcontactMeFn() {
      // 提交表单
      if (this.isCanReq) {
        this.isCanReq = false;
      } else {
        return;
      }
      addcontactMe(this.formInline).then((res) => {
        this.isCanReq = true;
        if (res.data.code === '0000') {
          this.$message({
            message: '提交成功',
            type: 'success',
          });
        }
      }).catch((err) => {
        console.log(err);
        this.isCanReq = true;
        this.$message({
          message: '提交失败，请稍后再试',
          type: 'warning',
        });
      });
    },
    goOrder(item) {
      if (item.openVipType !== '1' && this.dueTime > 0) {
        return;
      }
      if (!this.token) {
        this.confirm();
        // this.$message({
        //   message: '您还没有登录，请先登录',
        //   type: 'warning',
        // });
        return;
      }
      this.$router.push({
        path: '/order',
        query: {
          money: item.fee,
          level: item.name,
          ptype: 'vip',
          type: this.type,
          cid: item.id,
          // dueTime:item.dueTime,
        },
      });
    },
    validateFieldFn(prop) {
      let curForm = this.$refs.ruleInterForm.validate
        ? this.$refs.ruleInterForm
        : this.$refs.ruleInterForm[0];
      curForm.validateField([prop]);
    },
    submitForm(formName) {
      // 表单提交

      let curForm = this.$refs[formName].validate
        ? this.$refs[formName]
        : this.$refs[formName][0];
      curForm.validate((valid) => {
        if (!valid) {
          console.log('提交失败');
        } else {
          this.addcontactMeFn();
        }
      });
    },
  },
};
</script>
<style scoped>
  .interests{
    color: #444444;
    letter-spacing: 0;
    font-size: 14px;
  }
  .title{
    padding: 40px 0;
    text-align: center;
    font-size: 16px;

  }
  .title h3{
    font-size: 16px;
    margin-bottom: 10px;
    line-height: 22px;
  }
  .title p{
    font-size: 14px;
    color: #868686;
    letter-spacing: 0;
  }
  .contain-box{
    display: flex;
    align-items: justify;
    justify-content: space-between;
    font-size: 14px;
    flex-wrap: wrap;
    overflow: hidden\0;
  }
  .contain-box .item{
    background: #F7F7F7;
    border: 1px solid #D4D4D4;
    position: relative;
    padding:20px 20px 80px 20px;
    width: 230px;
    box-sizing:border-box;
    margin-bottom: 20px;
    margin: 0 15px 20px 0\0;
    min-height: 500px\0;
    float: left;
  }
  .contain-box .item.active{
    /*border-color: #fb683c;*/
  }
  .contain-box .item.empty{
    opacity: 0;
    height: 0;
  }
  .contain-box .item h3{
    text-align: center;
    margin-bottom: 10px;
  }
  .contain-box .item .intro{

    color: #868686;
    margin-bottom: 30px;
  }
  .contain-box .item .btn-sub{
    position: absolute;
    bottom: 30px;
    margin: 0;
    left: 50%;
    margin-left: -54px;
    background: #ccc;
  }
  .contain-box .item.active .btn-sub{
    background: #FB683C;
  }
  .contain-box li{
    display: block;
    position: relative;
    line-height: 20px;
    padding-left: 18px;
    background: url('./imgs/icon-error.png') no-repeat left 5px;
    background-size: 10px auto;
    margin-bottom: 10px;
  }
  .contain-box .list .active{
    background-image: url('./imgs/icon-right.png');
  }
  /*售前经理*/
  .form{
    display: block;
    position: relative;
    padding-right: 292px;
  }
  .form h3{
    margin-top: 30px;
    margin-bottom: 20px;
  }
  .el-form-item{
    width: 314px;
    margin-right: 20px;
  }

  .form .btn-sub{
    position: absolute;
    right: 0;
    top: 22px;
  }

</style>
