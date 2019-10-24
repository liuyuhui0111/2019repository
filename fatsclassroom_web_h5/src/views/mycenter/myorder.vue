<template>
  <div class="learnlist">

    <!-- 顶部导航 -->
    <basenav @navClick="navClick" curindex="0"
             :list="navlist"></basenav>

    <div v-show="list.length<1 && isShowPage"
         class="emptybg">
      <div class="empty">
        <span class="icon-empty"></span>
        <p @click="routerReplace('/index')">暂无相关订单记录哦~ <br>
          <span class="active">现在去下单</span></p>
      </div>
    </div>


    <div v-if="list.length>0" class="view-wrapper">
      <cube-scroll
        ref="learnlistScroll"
        :data="list"
        :options="options"
        :scrollEvents="['scroll-end']"
        @scroll-end="scroll"
        @pulling-up="onPullingUp">
        <!-- 上拉加载 -->
        <!-- 展示区域 -->
        <div class="list">
          <div style="margin-top: 10px;" v-for="(item,index) in list" :key="index">
            <!-- 订单编号 -->
            <div class="orderbox">
              <p>
                <span class="type" :class="'type'+item.type">{{typeMap[item.type]}}</span>
                <span class="order">订单编号：{{item.orderCode}}</span>
              </p>
              <span class="status">{{statusType[item.status]}}</span>
            </div>
            <div class="item">
              <template v-if="item.type != '3'">
                <ClassCard @cardClick="cardClick"
                           :item="item" page="list">
                  <template slot-scope="props"
                            slot="title">
                    <div class="title">
                      {{props.item.title}}
                    </div>
                  </template>
                  <template slot-scope="props"
                            slot="onlineIntro">
                    <div class="ordermoney">
                      ￥{{props.item.price}}
                    </div>
                  </template>
                </ClassCard>
              </template>
              <template v-else>
                <div class="vipbox">
                  <div class="img-box">
                    <img src="./imgs/ordervipbg.png">
                    <span class="title">{{item.title}}</span>
                  </div>
                  <div class="intro">
                    <p class="vtitle ellipsis2">{{item.title}}</p>
                    <p class="vprice">{{item.price}}</p>
                  </div>
                </div>

              </template>
              <div v-if="item.type != '2'" class="timebox">
                有效期：1年（有效期至{{item.time}}）
              </div>

              <div v-if="item.type == '2'" class="addressbox">
                {{item.orderItems[0].address}}
              </div>

              <div v-if="item.type == '2'" class="datebox">
                {{item.orderItems[0].startTime}}~{{item.orderItems[0].endTime}}
              </div>


              <div class="moneybox">
                <div class="tkm">
                  <template v-if="item.orderItems[0].tkm">
                    听课凭借码：<span>{{item.orderItems[0].tkm}}</span>
                  </template>
                </div>
                <div class="amount">实付：<span>￥{{item.amount}}</span></div>
              </div>

              <div v-if="statusType[item.status] == '待支付' && item.expireDate>0" class="btnbox">
                <span>剩余{{getMinite(item.expireDate)}}</span>
                <span
                  v-show="item.payChannelType != 'AXB'
                  && item.payChannelType != 'ZFB'
                  && item.payChannelType != 'NATIVE'"
                  @click="routerGo('/order',{orderId:item.orderId})"
                  class="btn-gobuy">立即支付</span>
              </div>
              <div v-if="statusType[item.status] == '待支付' && item.expireDate<=0" class="btnbox">
                订单已取消
              </div>


            </div>
          </div>
        </div>
        <div v-if="list.length>14" class="h80"></div>
        <template slot="pullup" slot-scope="props">
          <div v-if="props.isPullUpLoad" class="tips">
            加载中...
          </div>
          <div v-show="list.length>14" v-else class="tips">
            <span v-show="list.length>14">
              没有更多了~
            </span>
          </div>
        </template>
      </cube-scroll>
      <!-- 返回顶部 -->
      <BackTop @backTop="scrollToTop"
               :isShowBackTop="isShowBackTop"></BackTop>
    </div>


  </div>
</template>
<script>
import {
  queryOrderList,
} from '@/api/apis';
import ClassCard from '@/views/components/card.vue';
import basenav from '@/views/components/nav.vue';
import { timeStampToHour } from '@/assets/utils/timefn';

export default {
  name: 'learnlist',
  components: {
    ClassCard,
    basenav,
  },
  data() {
    return {
      type: '1', // 1线上课 2线下公开课
      typeMap: {
        1: '录播课',
        2: '公开课',
        3: '会员',
      },
      navlist: [
        {
          text: '全部订单',
          value: '',
        },
        {
          text: '待支付',
          value: '1',
        },
        {
          text: '已支付',
          value: '3',
        },
        {
          text: '已取消',
          value: '6',
        },
      ],
      list: [],
      isShowPage: false,
      pageNum: 1, // 页面
      pageSize: 15, // 每页条数
      total: 0, // 总条数
      pullUpLoad: true,
      pullUpLoadThreshold: 100,
      pullUpLoadMoreTxt: '上拉加载',
      pullUpLoadNoMoreTxt: '没有更多了~',
      isShowBackTop: false, // 返回顶部
      statusType: { // 课程状态
        1: '待支付',
        2: '待支付',
        3: '交易完成',
        7: '交易完成',
        6: '订单已取消',
      },
      params: {
        pay_status: '', // 支付状态 1已支付 2 支付中 3 未支付 4 支付失败 5 支付中
        status: '', // 订单状态 1未付款  2 付款中 3 已付款 4 退款中 5 已退款 6 已取消
        goods_type: '', // 商品类型  1 单课 2 学习卡 3 会员卡 4 优惠活动
        user_type: '', // 用户类型  1 个人 2企业
      },
    };
  },

  watch: {
    $route() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  computed: {
    options() {
      return {
        pullUpLoad: this.pullUpLoadObj,
        scrollbar: false,
      };
    },
    pullUpLoadObj() {
      return this.pullUpLoad ? {
        threshold: parseInt(this.pullUpLoadThreshold, 10),
        txt: {
          more: this.pullUpLoadMoreTxt,
          noMore: this.pullUpLoadNoMoreTxt,
        },
      } : false;
    },
  },
  methods: {
    init() {
      this.pageNum = 1;
      this.total = 0;
      this.isShowPage = false;
      this.list = [];
      // 获取在线课程导航
      this.onPullingUp('init');
    },
    getMinite(min) {
      if (min > 0) {
        return timeStampToHour(min);
      }
      return '';
    },
    navClick(item) {
      console.log(item);
      this.params.status = item.value;
      this.onPullingUp('init');
    },
    scroll(pos) {
      if (pos.y < -this.scrollInitHeight) {
        this.isShowBackTop = true;
      } else {
        this.isShowBackTop = false;
      }
    },
    scrollToTop() {
      this.$refs.learnlistScroll.scrollTo(0, 0, 300);
      this.isShowBackTop = false;
    },
    onPullingUp(t) {
      let opt = { isHideLoading: true };
      if (t === 'init') {
        this.pageNum = 1;
        opt = {};
        this.list = [];
        this.isShowPage = false;
        this.isShowBackTop = false;
      }
      /*eslint-disable*/
                if (this.list.length >= this.total && t !== 'init') {
                    this.$refs.learnlistScroll && this.$refs.learnlistScroll.forceUpdate();
                    return;
                }
                let {pageNum} = this;
                let {pageSize} = this;
                // this.total = 0;
                queryOrderList({
                    page: pageNum,
                    limit: pageSize,
                    ...this.params,
                }, opt).then((res) => {
                    if (res.data.code === '0000') {
                        this.isShowPage = true;
                        this.pageNum += 1;
                        let curlist = res.data.list.records || [];
                        if (curlist.length > 0) {
                            curlist.forEach((item) => {
                                if (!item.orderItems[0]) {
                                    item.orderItems = [{}];
                                }
                                item.id = item.orderItems[0] && item.orderItems[0].goodsId;
                                item.orderId = item.orderItems[0].orderId;
                                item.type = item.orderItems[0].goodsType;
                                item.pic = item.orderItems[0].pictureUrl;
                                item.price = item.orderItems[0].price;
                                item.time = item.orderItems[0].termOfValidity && item.orderItems[0].termOfValidity.split('|')[1];
                                item.title = item.orderItems[0].goodsName;
                            });

                            this.list = this.list.concat(curlist);

                            if (this.list.length >= res.data.total && t !== 'init') {
                                this.$refs.learnlistScroll && this.$refs.learnlistScroll.forceUpdate();
                            }

                            if (t === 'init') {
                                // 初始化情况下  更新srcoll 滚动到顶部
                                this.$refs.learnlistScroll && this.$refs.learnlistScroll.refresh();
                            }
                        } else {
                            this.$refs.learnlistScroll && this.$refs.learnlistScroll.forceUpdate();
                        }
                        /* eslint-enable */
          this.total = res.data.total;
        }
      }).catch((err) => {
        console.log(err);
        // this.$message('最近学习列表获取失败，请稍后再试');
      });
    },


  },
};
</script>
<style scoped>
  .vipbox {
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .vipbox .img-box {
    width: 41%;
    position: relative;
  }

  .vipbox img {
    width: 100%;
    height: 83px;
  }

  .vipbox .title {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #Fff;
  }

  .vipbox .intro {
    width: 55.69%;
    color: #444;
    font-size: 13px;
    text-align: left;

  }

  .vipbox .intro .vtitle {
    height: 40px;
    line-height: 20px;
  }

  .h80 {
    height: 57px;
    display: block;
    position: relative;
    overflow: hidden;
  }

  .emptybg {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 41px;
  }

  .addressbox,
  .datebox,
  .timebox {
    font-size: 14px;
    line-height: 20px;
    color: #868686;
    text-align: left;
    box-sizing: border-box;
    padding-left: 20px;
    background: url('./imgs/icon-tip.png') no-repeat center left;
    -webkit-background-size: 15px 15px;
    background-size: 15px 15px;
    margin-top: 10px;
  }

  .addressbox {
    background-image: url('./imgs/address.png');
  }

  .datebox {
    background-image: url('./imgs/date.png');
  }

  .moneybox {
    color: #444;
    font-size: 13px;
    line-height: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: right;
    margin-top: 15px;
  }

  .moneybox span {
    font-size: 16px;
  }

  .btnbox {
    margin-top: 15px;
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: flex-end;
    color: #666666;
    font-size: 13px;
  }

  .btnbox .btn-gobuy {
    width: 96px;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    border: 1px solid #FB683C;
    text-align: center;
    color: #FB683C;
    font-size: 14px;
    font-weight: bold;
    border-radius: 15px;
    margin-left: 15px;
  }

  .tips {
    display: block;
    width: 100%;
    color: #868686;
    text-align: center;
    font-size: 12px;
    padding: 7px 0 30px 0;
    height: 20px;
    line-height: 20px;
    position: absolute;
    bottom: 0;
  }

  .codebox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    margin-top: 20px;
  }

  .codebox .code i {
    font-style: normal;
    font-weight: bold;
    color: #FB683C;
  }

  .codebox .type0 {
    color: #2DAF53; /*未上课*/
  }

  .codebox .type1 {
    color: #F91E1E; /*待上课*/
  }

  .codebox .type2 {
    color: #ccc; /*已上课*/
  }

  .view-wrapper {
    position: fixed;
    width: 100%;
    top: 41px;
    left: 0;
    bottom: 0px;
    right: 0;
  }

  .empty {
    padding-top: 103px;
    font-size: 17px;
    color: #868686;
    text-align: center;
  }

  .icon-empty {
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 4px;
    margin: 0 auto;
    background: url('./imgs/icon-empty.png') no-repeat center center;
    background-size: 50px 50px;
  }

  .empty p {
    line-height: 24px;
    margin-top: 15px;
  }

  .empty p .active {
    color: #FB683C;
  }

  .list {
    width: 100%;
    box-sizing: border-box;
    margin-top: 7px;
  }

  .list .orderbox {
    padding: 0 15px;
    background-color: #fff;
    box-sizing: border-box;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    color: #444;
    border-bottom: 1px solid #d8d8d8;
  }

  .list .orderbox p {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .list .orderbox .type {
    background: rgba(251, 104, 60, 0.15);
    border-radius: 3px;
    line-height: 21px;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    color: #FB683C;
    margin-right: 5px;
    display: inline;
    padding: 2px 8px;
  }

  .list .orderbox .type2 {
    color: #3C68FB;
    background: rgba(60, 104, 251, 0.15);
  }

  .list .orderbox .type3 {
    color: #D48B10;
    background: rgba(212, 139, 16, 0.15);
  }

  .list .orderbox .status {
    color: #FB683C;
  }

  .list .item {
    width: 100%;
    background: #fff;
    border-bottom: 10px solid #f1f1f1;
    padding: 15px;
    box-sizing: border-box;
  }

  .list .item:nth-last-child(1) {
    border-bottom: none;
  }

  .ordermoney {
    color: #444444;
    font-size: 13px;
    padding-top: 25px;
  }
</style>
