<template>
  <div class="success">
    <div v-if="isShowPage" class="bgfff">
      <img src="./imgs/success.png" alt="" class="icon-suc">
      <p class="suc-mes">支付成功</p>
      <p v-if="curorderData.tkm" class="code active">听课凭借码：{{curorderData.tkm}}</p>
      <div class="item">
        <span>商品名称</span>
        <p>{{curorderData.goodsName}}</p>
      </div>
      <div class="item">
        <span>支付方式</span>
        <p>{{curorderData.payChannelName}}</p>
      </div>
       <div class="item noborder">
        <span>订单编号</span>
        <p>{{curorderData.orderCode}}</p>
      </div>
       <div class="item noborder">
        <span>订单时间</span>
        <p>{{curorderData.createTime}}</p>
      </div>
       <div class="item money">
        <span>订单金额</span>
        <p class="active">{{curorderData.amount}}元</p>
      </div>
    </div>
    <div v-if="isShowPage" class="btns">
      <span v-if="curorderData.goodsType != 3"
      @click="goClass"
      class="back">返回课程</span>
      <span v-if="curorderData.goodsType == 3"
      @click="goClass"
      class="back">查看会员权益</span>
      <span @click="routerReplace('/center/myorder')" class="goorder">查看我的订单</span>
    </div>


  </div>
</template>
<script>
import {
  getPayStatus,
  queryOrderById,
  getUserInfo,
} from '@/api/apis';

export default {
  name: 'success',
  data() {
    return {
      name: 'success',
      isShowPage: false,
      orderId: '',
      timer: null,
      curcurorderData: {},
    };
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    next();
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.orderId = this.$route.query.orderId;
      this.getPayStatusFn();
    },
    goClass() {
      if (this.curorderData.goodsType === 2) {
        // 公开课
        this.routerReplace('/detail', { cid: this.curorderData.goodsId });
      } else if (this.curorderData.goodsType === 1) {
        // 线上课
        this.routerReplace('/online-detail', { cid: this.curorderData.goodsId });
      } else {
        // 会员
        this.routerReplace('/residualEquity');
      }
    },
    async queryOrderByIdFn() {
      let res = await queryOrderById({ orderId: this.orderId });
      if (res.data.code === '0000') {
        // 支付成功刷新用户信息
        if (res.data.list[0].goodsType === 3) {
          let userRes = await getUserInfo();
          if (userRes.data.code === '0000') {
            let user = userRes.data.leaguerList;
            this.setUsers(user);
          }
        }
        this.isShowPage = true;
        this.curorderData = JSON.parse(JSON.stringify(res.data.list[0]));
      }
    },
    getPayStatusFn() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        getPayStatus({ orderId: this.orderId }).then((res) => {
          if (res.data.code === '0000') {
            this.queryOrderByIdFn();
            // 支付成功清除定时器
            clearInterval(this.timer);
            this.timer = null;
          }
        }).catch((err) => {
          // this.open();
          console.log(err);
        });
      }, 1000);
    },
  },
};
</script>
<style scoped>
  .code{
    font-weight: bold;
    text-align: center;
    font-size: 17px;
    margin-bottom: 15px;
  }
  .bgfff{
    overflow: hidden;
    padding: 0 15px;
    box-sizing:border-box;
  }
  .icon-suc{
    display: block;
    width: 65px;
    margin: 30px auto 20px auto;
  }
  .suc-mes{
    text-align: center;
    font-size: 20px;
    color: #333333;
    margin-bottom: 15px;
  }
  .item{
    color: #868686;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    box-sizing:border-box;
    border-top: 1px solid #f1f1f1;
    padding: 10px 0;
  }
  .item.noborder{
    border: none;
  }
  .item.money{
    padding: 15px 0;
  }
  .item.money .active{
    color: #FB683C;
    font-size: 17px;
    font-weight: bold;
  }
  .item span{
    width: 100px;
    text-align: left;
  }
  .item p{
    width: 250px;
    text-align: right;
  }

  .btns{
    overflow: hidden;
    margin: 30px auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 345px;
  }
  .btns span{
    display: block;
    width: 165px;
    height: 47px;
    line-height: 47px;
    text-align: center;
    font-size: 18px;
    border: 1px solid #FB683C;
    box-sizing:border-box;
    color: #fff;
    background: #FB683C;
  }
  .btns .back{
    color: #FB683C;
    background: #fff;
  }
</style>
