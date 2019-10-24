<template>
  <div class="common-order-index">
    <div v-if="commonUserData" class="user">
      尊敬的{{commonUserData.userName}} ，您正在购买：
    </div>
    <!-- 商品展示 -->
    <div class="goodsbox">
      <template v-if="goodsType!=3">
        <div v-if="item" class="itembox">
        <!-- @cardClick="cardClick" -->
          <ClassCard
          :item="item" page="list">
          <template slot-scope="props"
          slot="onlineIntro">
            <span class="money" :class="'goodsType'+goodsType">￥{{props.item.price}}</span>
          </template>
          </ClassCard>
        </div>
        <!-- 线上课 -->
        <div v-if="time" class="timebox">
          课程有效期: 1年 &nbsp;（有效期至{{time}}）
        </div>
        <!-- 公开课地址 -->
        <div v-if="classTime && goodsType==2" class="classTimebox">
          <p class="address ellipsis">{{
            goodsData.address+' ' +
            goodsData.city+' ' +
            goodsData.county
            }}</p>
          <p class="classTime ellipsis">
            {{classTime}}
          </p>
        </div>
      </template>

      <template v-if="goodsType==3">
        <!-- 会员下单 -->
        <div class="vipbox">
          <div class="vipinfo">
            <p class="name ellipsis">{{orderData.item.name}}</p>
            <p class="intro ellipsis2">{{orderData.item.introduce}}</p>
            <p class="money">￥<span>{{orderData.item.fee}}</span></p>
          </div>
          <div class="viptime">
            会员有效期：1年（有效期至{{time}}）
          </div>
        </div>
      </template>
    </div>

    <!-- 报名信息公开课 -->
    <div v-if="goodsType==2 && goodsData.name" class="signbox">
        <span>报名信息</span>
        {{goodsData.name}} {{goodsData.phone}} <br>
        {{goodsData.company}}
    </div>


    <!-- 发票信息 -->

    <div v-if="!orderId" class="invoicebox ellipsis">
      <span class="label" @click="isOpenInvoice = !isOpenInvoice"
      :class="{on:isOpenInvoice}">
        开具发票
      </span>
      <div v-if="!isOpenInvoice" class="title">

        <span class="ellipsis">本次不开具发票</span>
      </div>
      <div @click="routerGo('/invoice',{'orderId':orderId})" class="title icon-more" v-else>
        <span class="ellipsis">{{invoiceForm.title||'个人'}}</span>
      </div>
    </div>
    <div v-else class="invoicebox ellipsis">
      <span>发票信息</span>
      <div class="title">
        <span class="ellipsis">{{invoiceForm.title||'本次不开具发票'}}</span>
      </div>
    </div>


    <!-- 支付方式 -->

    <div class="paybox">
    <classTitle title="支付方式"></classTitle>
      <div class="item">
      <cube-checkbox position="right"
      v-model="payStyle">
        <div class="invoiceTip">
            微信支付
        </div>
      </cube-checkbox>
      </div>
    </div>


    <div class="xybox">
      注意：提交订单则表示您同意 <span @click="isShowXy=true">《用户付费协议》</span>
    </div>
    <div class="mask" v-show="isShowXy">
    <div class="xypagebox">
      <xypage @sub="xySub"></xypage>
    </div>
    </div>


    <!-- 支付按钮 -->
    <div v-if="goodsData && goodsData.price" class="btns">
      <span class="price">实付金额：<i>￥{{goodsData.price}}</i></span>
      <span @click="goBuy" class="sub">立即支付</span>
    </div>

  </div>
</template>
<script>
import {
  getOrderInfo,
  createOrderInfo,
  // pay,
} from '@/api/apis';
import ClassCard from '@/views/components/card.vue';
import xypage from '@/views/components/xypage.vue';
import { formatDate } from '@/assets/utils/timefn';
import {
  getSystem,
  replaceCode,
} from '@/assets/utils/util';

export default {
  name: 'myorder',
  components: {
    ClassCard,
    xypage,
  },
  data() {
    return {
      isShowXy: false, // 协议
      isOpenInvoice: false, // 是否开发票
      payStyle: true,
      hollowStyle: true,
      shape: 'circle',
      checked: '', //
      orderId: '', // orderid
      goodsType: 0, // 3会员 2公开课 1线上课
      goodsId: '', // 商品id
      item: null, // 商品card组件数据
      time: '', // 到期日期
      classTime: '', // 上课时间
      invoiceForm: { title: '' }, // 抬头
      goodsData: {},
      createOrderInfoParam: {
        goodsType: '', // 1线上视频课 2公开课 3线上专题课
        ids: [], // 课程id列表
        right: '', // 是否消耗权益  1是 0否
        invoiceInfo: { // 发票相关
        },
      },
    };
  },
  watch: {
    payStyle(newval) {
      if (!newval) {
        this.payStyle = true;
      }
    },
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 664bae2a1537470eb20f20d707e1ac34  线上课
      // 32b215ccf5e344b8a317fff6296da9f0  公开课
      // alert()
      this.orderId = this.$route.query.orderId;
      this.isOpenInvoice = this.$route.query.isOpenInvoice;
      if (this.isOpenInvoice) {
        // 设置发票信息
        if (this.vuexInvoiceData
          && this.commonUserData
          && this.vuexInvoiceData[this.commonUserData.userName]) {
          this.invoiceForm = { ...this.vuexInvoiceData[this.commonUserData.userName] };
        }
      }
      // this.payFn();
      // return;
      if (!this.orderId && !this.orderData.item) {
        this.routerReplace('/index');
      }
      if (!this.orderId && this.orderData) {
        console.log(this.orderData);
        this.initCreateOrder();
      } else {
        this.getOrderInfoFn();
      }
    },

    initCreateOrder() {
      this.goodsType = parseInt(this.orderData.formData.type, 10);
      /*eslint-disable*/
      if(this.goodsType === 2){
      // 公开课报名信息
        this.orderData.item.name = this.orderData.formData.name;
        this.orderData.item.phone = this.orderData.formData.phone;
        this.orderData.item.company = this.orderData.formData.company;

        // 订单参数
        this.createOrderInfoParam = {
          goodsType: this.orderData.formData.goodsType,
          id: this.orderData.formData.id,
          ids: this.orderData.formData.ids,
          right: '0',
          invoiceInfo: {},
        };
      }else if(this.goodsType === 1){
        let year = 365 * 24 *60 *60*1000;
        this.orderData.item.endTime = new Date().getTime() + year;
        // 线上课
        this.createOrderInfoParam = {
          goodsType:'1',
          id:'',
          ids:[{id:this.orderData.item.id}],
          right:'0',
          invoiceInfo: {},
        }
      }else if(this.goodsType === 3){
        // 会员
        let year = 365 * 24 *60 *60*1000;
        this.orderData.item.endTime = new Date().getTime() + year;
        this.orderData.item.price = this.orderData.item.fee;
        this.time = formatDate(this.orderData.item.endTime, 'yy年mm月dd日');
        this.createOrderInfoParam = {
          goodsType:'3',
          id:'',
          ids:[{id:this.orderData.item.id}],
          right:'0',
          invoiceInfo: {},
        }
      }
      /* eslint-enable */
      this.getGoodsById(this.orderData.item);
    },
    xySub() {
      this.isShowXy = false;
    },
    async goBuy() {
      // 立即购买 校验是否有发票
      if (this.orderId) {
        this.payFn();
        return;
      }
      if (!this.isOpenInvoice) {
        // 不开发票 清除发票信息
        this.invoiceForm = {};
      } else if (!this.invoiceForm.title) {
        this.$message('请完善发票信息');
        return;
      }

      this.createOrderInfoParam.invoiceInfo = this.invoiceForm;
      this.createOrderInfoParam.invoiceInfo.titleType = `${parseInt(this.createOrderInfoParam.invoiceInfo.titleType, 10) + 1}`;

      let orderRes = await createOrderInfo(this.createOrderInfoParam);
      if (orderRes.data.code === '0000') {
        this.orderId = orderRes.data.data;
        // 去支付
        this.payFn();
      }
      // this.routerReplace('/pay-order',{orderId:this.orderId});
    },
    async payFn() {
      this.setOrderData({});
      let url = '';
      let { orderId } = this;
      let payChannelType = '';
      let returnUrl = replaceCode(false, `/order/success?orderId=${orderId}`);
      returnUrl = encodeURIComponent(returnUrl);
      console.log(returnUrl);
      if (!getSystem().wx) {
        // 不是微信
        payChannelType = 'MWEB';
      } else {
        payChannelType = 'JSAPI';
      }


      url = `${window.COMMON_ENV.SSO_URL}/api-gateway/aosp-payment/h5/pay?orderId=${orderId}&payChannelType=${payChannelType}&returnUrl=${returnUrl}`;
      console.log(url);
      // let flag = confirm(`确定跳转支付么${url}`);
      // if (!flag) return;

      if (url) {
        window.location.replace(url);
      }
    },
    async getOrderInfoFn() {
      // 获取订单信息
      let res = await getOrderInfo({ orderId: this.orderId });
      if (res.data.code === '0000') {
        this.goodsType = res.data.data.goodsType;
        if (this.goodsType === 3) {
          // 会员 设置goodsData
          this.setOrderData({
            item: {
              name: res.data.goodsData.name,
              introduce: res.data.goodsData.introduce,
              fee: res.data.data.amount,
            },
          });
          let year = 365 * 24 * 60 * 60 * 1000;
          this.time = formatDate(new Date().getTime() + year, 'yy年mm月dd日');
          res.data.goodsData.price = res.data.data.amount;
          this.getGoodsById(res.data.goodsData);
        } else if (this.goodsType === 1) {
          res.data.data.price = res.data.data.amount;
          res.data.data.pic = res.data.goodsData;
          res.data.data.title = res.data.data.goodsName;
          this.getGoodsById(res.data.data);
        } else {
          this.getGoodsById(res.data.goodsData);
        }
        this.goodsId = parseInt(res.data.goodsId, 10);
        if (res.data.invoiceData && res.data.invoiceData.title) {
          // 发票信息存在
          this.invoiceForm = JSON.parse(JSON.stringify(res.data.invoiceData));
        } else {
          this.invoiceForm = {};
        }
      }
    },
    getGoodsById(goodsData) {
      console.log(goodsData);
      this.goodsData = JSON.parse(JSON.stringify(goodsData));
      switch (this.goodsType) {
        case 3:
          this.setVipOrder(goodsData);
          break;
        case 2:
          this.setOpenClassOrder(goodsData);
          break;
        case 1:
          this.setOnlineClassOrder(goodsData);
          break;
        default:
          this.$message('商品类型获取出错，请刷新页面重试');
      }
    },
    setOpenClassOrder(goodsData) {
      // 公开课
      let itemData = {
        pic: goodsData.pic,
        id: goodsData.offlineCourseId || goodsData.id,
        price: goodsData.price,
        title: goodsData.title,
        type: '2',
      };
      this.classTime = `${formatDate(goodsData.startTime, 'yy年mm月dd日')}~${formatDate(goodsData.endTime, 'yy年mm月dd日')}`;
      this.item = JSON.parse(JSON.stringify(itemData));
    },
    setOnlineClassOrder(goodsData) {
      // 线上课
      let itemData = {
        pic: goodsData.pic || goodsData.bannerUrl,
        id: goodsData.courseId || goodsData.id,
        price: goodsData.price,
        title: goodsData.title,
        type: '1',
      };
      let year = 365 * 24 * 60 * 60 * 1000;
      this.time = formatDate(new Date().getTime() + year, 'yy年mm月dd日');
      this.item = JSON.parse(JSON.stringify(itemData));
    },
    setVipOrder(goodsData) {
      // 会员
      console.log(goodsData);
    },
  },
};
</script>
<style>
  .common-order-index .cube-checkbox{
    padding: 0;
  }
</style>
<style scoped>
  .xypagebox{
    position: fixed;
    background: #fff;
    width: 325px;
    height: 443px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 5px 5px 0 0;
    box-shadow: 0 1px 0 0 #D8D8D8;
  }
  .signbox{
    padding: 15px;
    background: #fff;
    border-bottom: 7px solid #f1f1f1;
    padding-left: 103px;
    position: relative;
    box-sizing:border-box;
    color: #868686;
    font-size: 14px;
    text-align: left;
    line-height: 20px;
    min-height: 40px;
  }
  .signbox span{
    position: absolute;
    left: 15px;
    color: #444444;
    font-size: 17px;
    top: 15px;
  }

  .btns{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    background: #fff;
  }
  .btns span{
    display: block;
    width: 50%;
    height: 50px;
    text-align: center;
  }
  .btns .price{
    font-size: 14px;
  }
  .btns .price i{
    font-size: 18px;
    color: #FB683C;
  }
  .btns .sub{
    background: #FB683C;
    color: #fff;
  }
  .common-order-index{
    padding-bottom: 50px;
  }
  .xybox{
    font-size: 12px;
    color: #868686;
    padding: 10px 15px;
  }
  .xybox span{
    color: #FE6732;
  }
  .paybox{
    background: #fff;
    border-bottom: 7px solid #f1f1f1;
  }
  .paybox p{
    display: block;
    padding: 0 15px;
    line-height: 44px;
    height: 44px;
    font-size: 14px;
    color: #868686;
    border-bottom: 0.5px solid #d8d8d8;
  }
  .paybox .item{
    padding: 0 15px;
    font-size: 20px;
  }
  .invoicebox{
    height: 44px;
    line-height: 44px;
    overflow: hidden;
    padding: 0 15px;
    font-size: 17px;
    color: #333;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /*border-bottom: 7px solid #f1f1f1;*/
  }
  .invoicebox .label{
    padding: 0 30px;
    background: url('./imgs/icon-check-off.png') no-repeat left center;
    background-size: 15px 15px;
    display: flex;
    align-items: center;
    max-width: 130px;
    box-sizing:border-box;
  }
  .invoicebox .label.on{
    background-image: url('./imgs/icon-check-on.png');
  }
  .invoicebox .title{
    box-sizing:border-box;
    max-width: 220px;
    font-size: 14px;
    color: #868686;
    padding-right: 10px;
    height: 44px;
    line-height: 44px;
    display: flex;
    align-items: center;
  }
  .invoicebox .title span{
     display: block;
     width: 100%;
     overflow: hidden;
  }
  .vipbox{
    background: #fff;
  }
  .vipinfo{
    display: block;
    width: 345px;
    height: 150px;
    background: url('./imgs/ordervipbg.png') no-repeat center center;
    background-size: 100% auto;
    position: relative;
    box-sizing:border-box;
    padding: 15px;
    color: #fff;
  }
  .vipinfo .name{
    line-height: 28px;
    height: 28px;
    font-size: 20px;
    font-weight: bold;
  }

  .vipinfo .intro{
    font-size: 14px;
    margin-top: 7px;
    line-height: 20px;
    height: 40px;
    overflow: hidden;
  }
  .vipinfo .money{
    text-align: right;
    font-weight: bold;
    font-size: 17px;
    line-height: 45px;
  }
  .vipinfo .money span{
    font-size: 32px;
  }

  .viptime{
    line-height: 44px;
    height: 44px;
    color: #868686;
    font-size: 12px;
    padding-left: 20px;
    background: #fff;
    margin-top: 15px;
    border-top: 0.5px solid #d8d8d8;
    background: url('./imgs/icon-tip.png') no-repeat left center;
    background-size: 15px 15px;
    vertical-align: middle;
    display: flex;
    align-items: center;
  }


  .itembox{
    padding-right: 15px;
    border-bottom: 0.5px solid #d8d8d8;
    padding-bottom: 10px;
  }
  .classTimebox,
  .timebox{
    font-size: 14px;
    height: 44px;
    line-height: 44px;
    color: #868686;
    text-align: left;
    box-sizing:border-box;
    padding-left: 20px;
    background: url('./imgs/icon-tip.png') no-repeat center left;
    -webkit-background-size: 15px 15px;
    background-size: 15px 15px;
  }
  .classTimebox{
    padding: 15px 0;
    height: auto;
    line-height: 20px;
    background: none;
  }
  .classTimebox .classTime,
  .classTimebox .address{
    padding-left: 20px;
    height: 20px;
    margin-bottom: 5px;
     background: url('./imgs/address.png') no-repeat center left;
    -webkit-background-size: 15px 15px;
    background-size: 15px 15px;
    display: flex;
    align-items: center;
  }
  .classTimebox .classTime{
    margin-bottom: 0;
    background-image: url('./imgs/date.png');
  }
  .chkbox{
    font-size: 16px;
  }
  .user{
    height: 37px;
    line-height: 37px;
    padding-left: 15px;
    text-align: left;
    font-size: 14px;
color: #FB683C;
  }
  .invoiceTip{
    font-size: 17px;
    color: #444;
    padding-left: 30px;
    background: url('./imgs/wxpay.png') no-repeat left center;
    background-size: 20px;
    display: flex;
    align-items: center;
  }
  .goodsbox{
    background: #fff;
    padding: 15px 0 0 15px;
    border-bottom: 7px solid #f1f1f1;
  }
  .money{
    font-size: 17px;
    font-weight: bold;
  }
  .money.goodsType1,
  .money.goodsType2{
    padding-top: 20px;
  }
  .icon-more{
    background: url('./imgs/more.png') no-repeat right 18px;
    background-size: 8px 8px;
    display: block;
    vertical-align: center;
  }

</style>
