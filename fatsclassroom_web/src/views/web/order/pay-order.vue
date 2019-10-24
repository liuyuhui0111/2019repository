<template>
  <div class="order common-container-width">
    <!-- 订单步骤条 -->
    <div class="top-step">
        <div class="step-box">
          <Step :stepList="stepList" :active="stepIndex"></Step>
        </div>
    </div>
    <div v-if="!isSuccess" class="contain">
      <div v-show="type!=''" class="order-box">
        <p v-if="type!='' && type==3">会员订单: {{order.orderCode}}</p>
        <p v-else>课程订单: {{order.orderCode}}</p>
        <p v-if="order.paymoney != ''">支付金额: <span class="money">￥{{order.paymoney}} </span>
        <p v-if="type!='' && type==3">会员类型: {{order.title}}</p>
        <p v-else>课程名称: {{order.title}}</p>
      </div>
      <div v-if="isShowPayList" class="payTitle">支付方式</div>
      <div v-if="isShowPayList" class="paylist">
        <div v-for="(item,index) in paylist"
        class="item"
        :class="[item.payType,{active:item.payType===payChannelType}]"
        @click="checkPayType(item)"
        :key="index">
          {{item.name}}
        </div >
      </div>
      <div v-if="order.payUrl" class="payment">
        <div class="item">
        <div>
          <Qrcode docId="wxQrcode"
          :width="qrcodeWidth"
          :url="order.payUrl"
          ></Qrcode>
          <p class="tip">
          请打开手机{{payChannelTypeName}}，扫一扫完成支付
          </p>
        </div>
        </div>
      </div>
    </div>

    <div v-if="isSuccess && courseId" class="contain success">
      <div class="icon-success">
        支付成功
      </div>
      <div v-if="code" class="code">
        听课凭借码: <span>{{code}}</span>
      </div>
      <div v-if="code" class="tel-box">
        听课前请通过听课凭借码签到，入场听课~
      </div>
      <div class="btns">
        <span v-if="type == 1"
        @click="routerGo('/online-detail',{cid:courseId})">返回学习课程</span>
        <span v-if="type == 3"
        @click="routerGo('/index',{})">返回首页</span>
        <span v-show="type!='' && type!=3"
        @click="routerGo('/center/detail',{orderId:orderId})"
        >查看我的订单</span>
        <span v-show="type!='' && type==3"
        @click="routerGo('/center/myorder',{})"
        >查看我的订单</span>
      </div>
    </div>

  </div>
</template>
<script>
import Step from '@/views/web/components/base/step.vue';
import Qrcode from '@/views/web/components/qrcode/qrcode.vue';
import {
  pay,
  payStyle,
  getOrderInfo,
  getPayStatus,
} from '@/api/apis';

export default {
  name: 'pay-order',
  data() {
    return {
      name: 'pay-order',
      isSuccess: false, // 是否支付成功
      qrcodeWidth: 225, // 二维码宽高
      code: '', // 听课码
      isShowPament: 0,
      paylist: [],
      isShowPayList: false,
      goodsType: 3,
      stepIndex: 1, // 0
      stepList: [
        {
          id: 1,
          title: '填写核对订单信息',
          activeTitle: '',
        },
        {
          id: 2,
          title: '支付订单',
          activeTitle: '',
        },
        {
          id: 3,
          title: '支付成功',
          activeTitle: '',
        },
      ],
      orderId: '',
      order: {
        orderId: '',
        paymoney: '',
        title: '',
        payUrl: '',
        orderCode: '',
      },
      payParamList: null,
      payParam: {
        orderId: this.orderId,
        payChannelType: '',
      },
      payChannelType: '', // 支付类型
      payChannelTypeName: '', // 支付名称
      timer: null,
      endTime: 5, // 5分钟没支付弹出提示框
      ewmUpdateTimes: null,
      expireTime: 0, // 存储当前选中支付类型的数据
      courseId: '',
      type: '', // 订单类型
    };
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.ewmUpdateTimes);
    clearInterval(this.timer);
    next();
  },
  watch: {
    isSuccess() {
      if (this.isSuccess) {
        this.stepIndex = 2;
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.orderId = this.$route.query.orderId;
      this.courseId = this.$route.query.courseId;

      this.isSuccess = this.$route.query.success || false;
      this.code = this.$route.query.tkm || '';
      // this.startGetPayType()
      // 查询订单详情
      if (!this.token) {
        return;
      }

      this.getOrderInfoFn();
      if (!this.isSuccess) {
        // 获取支付方式
        this.payStyleFn();
      }
    },
    startTimes() {
      // 开启多个定时器
      this.expireTime = this.payParamList[`${this.payChannelType}_PAY_TIME`];
      if (this.expireTime) {
        // 如果存在支付倒计时
        clearInterval(this.ewmUpdateTimes);
        this.ewmUpdateTimes = setInterval(() => {
          this.payFn();
        }, parseInt(this.expireTime, 10) * 1000 * 60);
      }
    },
    changeQrcode(url) {
      this.order.payUrl = '';
      this.$nextTick(() => {
        this.order.payUrl = url;
      });
    },
    getOrderInfoFn() {
      // 查询订单详情
      getOrderInfo({ orderId: this.orderId }).then((res) => {
        if (res.data.code === '0000') {
          console.log(res);
          this.type = res.data.data.goodsType;
          this.order.title = res.data.data.goodsName;
          this.order.paymoney = res.data.data.amount;
          this.order.orderCode = res.data.data.orderCode;
          this.courseId = res.data.goodsId;
        } else if (res.data.code !== '0002') {
          this.$message({
            message: '订单获取失败，请稍后再试',
            type: 'warning',
          });
        }
      }).catch((err) => {
        console.log(err);
        this.$message({
          message: '订单获取失败，请稍后再试',
          type: 'warning',
        });
      });
    },
    payStyleFn() {
      // 根据渠道查询支付方式
      payStyle().then((res) => {
        if (res.data.code === '0000') {
          console.log(res);
          this.paylist = res.data.data;
          this.payParamList = res.data.payParam;
          // this.isShowPayList = !res.data.flag;
          if (res.data.flag === '0') {
            this.isShowPayList = false;

            this.payChannelType = 'AXB';

            this.payChannelTypeName = this.payParamList.AXB_PAY;
          } else {
            this.payChannelType = this.paylist[0].payType;

            this.payChannelTypeName = this.payParamList[`${this.payChannelType}_PAY`];

            this.isShowPayList = true;
          }
          // this.isShowPayList = true;
          this.payFn();
          // this.isShowPayList = true;
        } else if (res.data.code !== '0002') {
          this.$message({
            message: '支付方式获取失败，请稍后再试',
            type: 'warning',
          });
        }
      }).catch((err) => {
        console.log(err);
        this.$message({
          message: '支付方式获取失败，请稍后再试',
          type: 'warning',
        });
      });
    },
    routerGo(path, query) {
      this.$router.replace({ path, query });
    },
    checkPayType(item) {
      this.payChannelType = item.payType;
      this.payChannelTypeName = this.payParamList[`${this.payChannelType}_PAY`];
      this.payFn();
    },
    payFn() {
      // 生成支付二维码  H5+'WAP'
      this.payParam.orderId = this.orderId;
      this.payParam.payChannelType = this.payParamList[this.payChannelType] || '';
      pay(this.payParam).then((res) => {
        if (res.data.code === '0000' && res.data.data) {
          this.order.payUrl = res.data.data.code_url;
          this.order.payChannelType = this.payChannelType;
          this.changeQrcode(this.order.payUrl);
          this.startGetPayType();

          // 生成二维码成功 开启定时器更新二维码
          // this.startTimes();
        } else if (res.data.code !== '0002') {
          this.$message({
            message: '统一下单失败，请稍后再试',
            type: 'warning',
          });
        }
      }).catch((err) => {
        console.log(err);
        this.$message({
          message: '统一下单失败，请稍后再试',
          type: 'warning',
        });
      });
    },
    open() {
      clearInterval(this.timer);
      this.$confirm('支付超时，是否成功付款?', '提示', {
        confirmButtonText: '我已付款',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.startGetPayType();
      }).catch(() => {
        // this.startGetPayType();
        console.log('取消');
      });
    },
    startGetPayType() {
      // 开启轮询 查询是否支付成功
      // let nums = this.endTime * 60; //
      // let curnum = 0;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        // curnum += 1;
        if (this.isSuccess) {
          clearInterval(this.timer);
        } else {
          this.getPayStatusFn();
        }
        // else if (curnum > nums) {
        // this.open();
        // }
      }, 1000);
    },
    getPayStatusFn() {
      // 生成支付二维码
      getPayStatus({ orderId: this.orderId }).then((res) => {
        if (res.data.code === '0000') {
          this.code = res.data.tkm;
          this.isSuccess = true;
          this.stepIndex = 2;
          // 支付成功清除定时器
          clearInterval(this.timer);
          clearInterval(this.ewmUpdateTimes);
        }
      }).catch((err) => {
        // this.open();
        console.log(err);
      });
    },
  },
  components: {
    Step,
    Qrcode,
  },
};
</script>
<style scoped>
  /*支付类型*/
  .paylist{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden\0;
  }
  .paylist .item{
    display: block;
    width: 126px;
    height: 50px;
    line-height: 50px;
    margin-right: 20px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 60% auto;
    margin-top: 20px;
    font-size: 0;
    border: 1px solid #fff;
    float: left\0;
  }
  .paylist .item.ZFB{
    background-image: url('./imgs/zfb.png');
  }
  .paylist .item.WX{
    background-image: url('./imgs/wx.png');
  }
  .paylist .item.active{
    border: 1px solid #d4d4d4;
  }

  .contain{
    width: 520px;
    margin: 0 auto;
    font-size: 16px;
    color: #444444;
    letter-spacing: 0;
    text-align: left;
  }
  .top-step{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    overflow: hidden\0;
  }
  .step-box{
    width: 340px;
    float: right\0;
  }
  .payment{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 20px;
  }
  .payment .item{
    width: 225px;
    height: 270px;
  }
  .money{
    color: #FB683C;
    margin-right: 40px;
  }
  .order-detail{
    color: #868686;
    cursor: pointer;
  }
  .order-box p{
    margin-bottom: 10px;
  }
  .title{
    margin-bottom: 40px;
    margin-top: 30px;
  }
  .btn-img{
    height: 60px;
    cursor: pointer;
    margin-bottom: 40px;
  }
  .tip{
    text-align: center;
    line-height: 22px;
    font-size: 14px;
    margin-top: 20px;
  }
  .tip .wx{
    color: #189648;
  }
  .tip .zfb{
    color: #00a0e9;
  }

  /*支付成功*/
  .contain.success{
    width: 380px;
  }
  .icon-success{
    padding-left: 100px;
    height: 80px;
    display: block;
    background: url('./imgs/icon-success.png') no-repeat center left;
    background-size:80px 80px;
    font-size: 50px;
    font-weight: bold;
    margin-bottom: 20px;
    margin-top: 170px;
  }
  .code{
    font-size: 40px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .code span{
    color: #FB683C;
  }
  .tel-box{
    font-size: 16px;
    color: #F91E1E;
    margin-bottom: 80px;
  }
  .btns{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    color: #FB683C;
    margin-bottom: 170px;
    overflow: hidden\0;
    text-align: center\0;
  }
  .btns span{
    cursor: pointer;
    margin-right: 80px\0;
    display: inline-block\0;
  }
</style>
