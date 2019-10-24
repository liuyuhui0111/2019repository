<template>
    <div class="signup common-h5-signup">
        <classTitle color="#868686" title="课程信息"></classTitle>
        <!--<div class="courseInfo">-->
        <!--<ClassCard @cardClick="cardClick"-->
        <!--:item="detailData" page="list">-->
        <!--<template slot-scope="props"-->
        <!--slot="onlineIntro">-->
        <!--<span class="money">￥{{props.detailData.price}}</span>-->
        <!--</template>-->
        <!--</ClassCard>-->
        <!--</div>-->
        <div class="courseInfo">
            <template>
                <div class="itembox">
                    <ClassCard @cardClick="cardClick"
                               :item="detailData" page="list">
                        <template
                                slot="onlineIntro">
                            <span class="money">￥{{detailData.price}}</span>
                        </template>
                    </ClassCard>
                </div>
                <!-- 公开课地址 -->
                <div v-if="classTime" class="classTimebox">
                    <p class="address ellipsis">{{
                        detailData.address+' ' +
                        detailData.city+' ' +
                        detailData.county
                        }}</p>
                    <p class="classTime ellipsis">
                        {{classTime}}
                    </p>
                </div>
            </template>
        </div>


        <classTitle color="#868686" title="报名信息"></classTitle>

        <div class="form">
            <div class="item">
                <span class="label"><small>*</small>姓名</span>
                <input placeholder="请输入称呼"
                       v-model.trim="onlineForm.name"/>
            </div>


            <div class="item">
                <span class="label"><small>*</small>电话</span>
                <input placeholder="请输入电话"
                       v-model.trim="onlineForm.tel"/>
            </div>


            <div class="item">
                <span class="label"> &nbsp;公司</span>
                <input placeholder="请输入公司"
                       v-model.trim="onlineForm.comp"/>
            </div>
        </div>

        <div class="mes-box">
            <!--<p>您要咨询的内容</p>-->
        </div>
        <div class="mes-box">
            <!-- <input
                    maxlength="50"
                    v-model.trim="onlineForm.message"
                    placeholder="请输入您要咨询的问题"
                    type="text"> -->
            <textarea
            placeholder="请输入您要咨询的问题"
            v-model.trim="onlineForm.message"
            maxlength="50"
            >
            </textarea>
            <span class="textNum"> {{ onlineForm.message.length }} /50</span>
        </div>
        <!--付款 start-->
        <classTitle v-show="isCharge" color="#868686" title="付款选择"></classTitle>
        <!--<div class="radio_outer">-->
        <!--<cube-radio-group v-model="selected" :options="options"/>-->
        <!--</div>-->
        <div v-show="isCharge" class="radio_outer">
            <cube-checkbox v-if="qyNum >= 1" @input="checkChange1" v-model="checked1">
                <div>
                    <span style="color:#444444;">消耗1次公开课会员权益</span>
                    <span style="color:#868686;font-size: 12px">(未上课会将权益退回)</span>
                    <p style="color:#868686;font-size: 14px">当前剩余
                        <span style="color:#FB683C;">{{ qyNum == -1? '无限' : qyNum }}</span>
                        次公开课会员权益</p>
                </div>
            </cube-checkbox>
            <cube-checkbox v-else @input="checkChange1" v-model="checked1">
                线上付款
            </cube-checkbox>
            <cube-checkbox @input="checkChange2" v-model="checked2">
                线下付款
            </cube-checkbox>
        </div>
        <!--付款 end-->

        <my-btn :submitForm="submitForm" eventName="submitForm" btnName="提交报名"></my-btn>
    </div>
</template>
<script>
import {
  offlineCourseSignUp, createOrderInfo, queryEquity,
} from '@/api/apis';
import { validByPhone } from '@/assets/utils/validator';
import ClassCard from '@/views/components/card.vue';
import { formatDate } from '@/assets/utils/timefn';

export default {
  name: 'signup',
  data() {
    return {
      checked1: true,
      checked2: false,
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
      detailData: {},
      classTime: '', // 课程时间
      qyNum: 0,
      isCharge: false,
    };
  },
  components: {
    ClassCard,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.courseId = this.$route.query.cid;
      let detailData = JSON.parse(window.sessionStorage.getItem('openCourseDetailData'));
      console.log(detailData);
      if (detailData) {
        // 权益查询
        this.queryEquityFn();
        if (detailData.price === '0') {
          this.isCharge = false;
        } else {
          this.isCharge = true;
        }
        this.detailData = detailData;
        this.detailData.type = 2;
        this.classTime = `${formatDate(detailData.startTime, 'yy年mm月dd日')}~${formatDate(detailData.endTime, 'yy年mm月dd日')}`;
      } else {
        this.$router.push({ path: '/index' });
      }
    },
    checkChange1() {
      if ((this.checked1 === true && this.checked2 === true)
                    || (this.checked1 === false && this.checked2 === false)) {
        this.checked1 = true;
        this.checked2 = false;
      }
    },
    checkChange2() {
      if ((this.checked1 === true && this.checked2 === true)
                    || (this.checked1 === false && this.checked2 === false)) {
        this.checked2 = true;
        this.checked1 = false;
      }
    },
    // 查询权益
    queryEquityFn() {
      queryEquity({ courseType: 1 }).then((res) => {
        if (res.data.code === '0000') {
          console.log(res);
          if (res.data.totalType === undefined || res.data.consumeNum <= 0) {
            this.qyNum = 0;
          } else if (res.data.totalType === '0') {
            this.qyNum = res.data.consumeNum;
          } else {
            this.qyNum = -1;
          }
        }
      }).catch((err) => {
        console.log(err);
        this.$message('获取权益信息失败，请稍后再试');
      });
    },

    submitForm() {
      // 收藏 如果未登录  提示去登陆
      if (!this.token) {
        this.confirmLogin();
        return;
      }
      if (!this.onlineForm.name) {
        this.$message('请输入称呼');
        return;
      }
      if (this.onlineForm.name.length < 2 || this.onlineForm.name.length > 4) {
        this.$message('姓名长度请控制在2~4个字内');
        return;
      }
      if (!this.onlineForm.tel) {
        this.$message('请输入电话');
        return;
      }
      if (!validByPhone(this.onlineForm.tel)) {
        this.$message('电话号码格式不对');
        return;
      }
      // if (!this.onlineForm.comp) {
      //   this.$message('请输入公司');
      //   return;
      // }
      if (this.onlineForm.comp.length > 50) {
        this.$message('公司名称过长，请控制在50字内');
        return;
      }
      if (this.onlineForm.work.length > 10) {
        this.$message('职位名字过长，请控制在10字内');
        return;
      }

      if (this.onlineForm.message
                    && (this.onlineForm.message.length < 2
                        || this.onlineForm.message.length > 50)) {
        this.$message('咨询内容请控制在2-50字以内');
        return;
      }
      if (this.isCanSub) {
        this.isCanSub = false;
      } else {
        return;
      }
      this.offlineCourseSignUpFn();
    },
    // 提交报名
    offlineCourseSignUpFn() {
      this.ysxy_signUp({
        name: this.onlineForm.name,
        phone: this.onlineForm.tel,
        company: this.onlineForm.comp,
      });
      let payType = '';
      if (this.qyNum === 0 && this.checked1) {
        payType = '0';
      } else {
        payType = '1';
      }
      // 线上课在线报名提交表单
      let params = {
        company: this.onlineForm.comp,
        offlineCourseId: this.courseId,
        name: this.onlineForm.name,
        phone: this.onlineForm.tel,
        job: this.onlineForm.work,
        content: this.onlineForm.message,
        payType,
      };
      offlineCourseSignUp(params).then((res) => {
        this.isCanSub = true;
        if (res.data.code === '0000') {
          let right = '';
          if (this.isCharge && this.qyNum >= 1 && this.checked1) {
            right = '1';
          } else {
            right = '0';
          }
          let formData = {
            goodsType: '2', // 1线上视频课 2公开课 3线上专题课
            ids: [{ id: this.courseId }],
            right,
            invoiceInfo: {},
            id: res.data.id,
          };
          if (this.isCharge && this.qyNum === 0 && this.checked1) {
            // 线上支付
            formData.type = '2';
            formData.name = params.name;
            formData.phone = params.phone;
            formData.company = params.company;
            this.setOrderData({ item: this.detailData, formData });
            this.$router.push({ path: '/order' });
          } else {
            this.createOrderInfoFn(formData);
          }
        } else {
          this.$message('报名失败，请稍后再试');
        }
      }).catch((err) => {
        this.isCanSub = true;
        console.log(err);
        this.$message('报名失败，请稍后再试');
      });
    },
    // 生成订单id
    createOrderInfoFn(data) {
      createOrderInfo(data).then((res) => {
        console.log(res);
        if (res.data.code === '0000') {
          if (this.isCharge) {
            if (this.qyNum >= 1 && this.checked1) {
              // 消耗权益
              this.continueShow();
            } else if (this.checked2) {
              // 线下支付
              window.sessionStorage.removeItem('openCourseTkm');
              this.$router.replace({ path: '/success' });
            }
          } else {
            // 免费课
            window.sessionStorage.setItem('openCourseTkm', res.data.tkm);
            this.$router.replace({ path: '/success' });
          }
        } else if (res.data.code === '0008') {
          window.sessionStorage.setItem('openCourseTkm', res.data.tkm);
          this.$router.push({ path: '/success' });
        } else if (res.data.code === '0002') {
          this.$message('因账号缓存被清除，请重新登录');
        } else if (res.data.code === '0013') {
          this.$message('该报名信息已经提交过订单，不能重复提交');
        } else {
          this.$message('生成订单出错，请稍后再试');
        }
      }).catch((err) => {
        console.log(err);
        this.$message('生成订单出错，请稍后再试');
      });
    },
  },
};
</script>
<style>
    .common-h5-signup .el-form-item {
        margin-bottom: 0;
    }

    .common-h5-signup .radio_outer .cube-radio {
        height: 44px;
        font-size: 17px;
    }

    .common-h5-signup .cube-radio_selected .cube-radio-ui {
        background-color: #FB683C;
    }
</style>
<style lang="less" scoped>
    .form {
        display: block;
        background-color: #fff;
        box-sizing: border-box;
        padding-left: 15px;
        font-size: 14px;
        color: #444444;
        letter-spacing: -0.68px;
        text-align: center;
        line-height: 20px;
    }

    .itembox {
        padding-right: 15px;
        border-bottom: 1px solid #d8d8d8;
        padding-bottom: 10px;
    }

    .money {
        font-size: 17px;
        font-weight: bold;
        padding-top: 20px;
    }

    .classTimebox {
        padding: 15px 0;
        height: auto;
        line-height: 20px;
        background: none;

        p {
            font-size: 14px;
            /*height: 44px;*/
            /*line-height: 44px;*/
            color: #868686;
        }
    }

    .classTimebox .classTime,
    .classTimebox .address {
        padding-left: 20px;
        height: 20px;
        margin-bottom: 5px;
        background: url('./img/address.png') no-repeat center left;
        -webkit-background-size: 15px 15px;
        background-size: 15px 15px;
    }

    .classTimebox .classTime {
        margin-bottom: 0;
        background-image: url('./img/date.png');
    }

    .courseInfo {
        background: #fff;
        padding: 10px 0 0 15px;
        border-bottom: 7px solid #f1f1f1;
    }

    .radio_outer {
        background-color: #fff;
        font-size: 17px;
        color: #444444;
        .cube-radio {
            height: 44px;
        }
    }

    .form .item {
        border-bottom: .5px solid #d4d4d4;
        height: 44px;
        line-height: 44px;
        padding-left: 60px;
        position: relative;
        box-sizing: border-box;
        font-size: 17px;
        input {
            box-sizing: border-box;
            height: 32px;
            line-height: 32px;
            width: 100%;
            padding: 0 15px;
            outline: none;
            background: transparent;
            border: none;
            outline: medium;
            &::-webkit-input-placeholder {
                color: rgb(196, 196, 207);
            }
        }

    }

    .form .item.noborder {
        border-color: #fff;
    }

    .item .label {
        position: absolute;
        left: 0;
        top: 0px;
        height: 20px;
        letter-spacing: 3px;
        font-size: 17px;
        small {
            color: red;
        }
    }

    .mes-box {
        display: block;
        width: 100%;
        /*height: 207px;*/
        text-align: left;
        box-sizing: border-box;
        /*padding: 30px 15px 15px 15px;*/
        /*margin: 10px 0;*/
        position: relative;
        background-color: #fff;
        .textNum {
            display: block;
            text-align: right;
            font-size: 14px;
            color: #B2B2B2;
            padding: 10px 15px;
        }
        input {
            box-sizing: border-box;
            height: 32px;
            line-height: 32px;
            width: 100%;
            padding: 0 15px;
            outline: none;
            background: transparent;
            border: none;
            outline: medium;
            &::-webkit-input-placeholder {
                color: rgb(196, 196, 207);
            }
        }
        textarea {
            outline: none;
            /*background:transparent;*/
            border: none;
            outline: medium;

            width: 100%;
            padding: 5px 15px;
            border: 0px solid #C0C4CC;
            border-radius: 4px;
            background-color: #fff;
            box-sizing: border-box;

            outline: none;
            outline: medium;
            &::-webkit-input-placeholder {
                color: rgb(196, 196, 207);
            }
        }
    }

    .sub_outer {
        margin-top: 41px;
        width: 100%;
        padding: 10px 15px;
        box-sizing: border-box;
        .sub-btn {
            background: #FB683C;
            border-radius: 4px;
            display: block;
            width: 100%;
            height: 47px;
            text-align: center;
            line-height: 47px;
            color: #fff;
            font-size: 18px;
        }
    }

    .mes-box p {
        position: absolute;
        top: 0;
        left: 15px;
        font-size: 14px;
    }
</style>
