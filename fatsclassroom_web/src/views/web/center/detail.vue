<template>
  <div v-if="orderInfo" class="my-order-detail">
  <Title title="我的订单"></Title>
    <h3>订单信息</h3>
    <div class="order-box">
        <div class="item">
            <p>下单时间：{{orderInfo.createTime}}</p>
            <p>订单编号：{{orderInfo.orderCode}}</p>
            <p>订单金额：¥{{amount}}</p>
            <!-- <p>优惠信息：无</p> -->
            <div v-if="orderInfo.goodsType == '1'">
            <p v-if="sTime">生效时间：{{sTime}}</p>
            <p v-if="eTime">结束时间：{{eTime}}</p>
            </div>
            <div v-if="orderInfo.goodsType == '2'">

            <p v-if="orderInfo.phone">预约手机号：{{orderInfo.phone}}</p>
            <p v-if="tkm">听课码：{{tkm}}</p>
            <p v-if="orderInfo.startTime">上课时间：{{orderInfo.startTime}}
            ~
            {{orderInfo.endTime}}
            </p>
            <p v-if="orderInfo.address">上课地点：{{orderInfo.address}}</p>

          </div>


            <p v-if="(type==1 || type==2) && buyEndTime==''">订单状态：订单已取消</p>
            <p v-else-if="type">订单状态：{{statusType[type]}}</p>
            <p v-if="orderInfo.payChannelName">支付方式：{{orderInfo.payChannelName}}</p>

            <!-- <p>取消时间：{{getTime(0,true)}}</p> -->
        </div>
        <div class="btns">
            <template v-if="type=='6'">
                <p class="cancel">订单已取消</p>
            </template>
            <template v-else-if="type=='3'">
                <span @click="goStudy()"
                v-if="orderInfo.goodsType == '1'"
                class="btn-sub">去学习</span>
                <span class="offlinetips"
                v-if="orderInfo.goodsType == '2'">
                  别忘记听课哦~
                </span>
               <!--  <span v-if="orderInfo.goodsType == '2' && tkm">
                  听课码：{{tkm}}
                </span> -->
            </template>
            <template v-else-if="type=='1' || type=='2'">
                <template v-if="buyEndTime==''">
                  订单已取消
                </template>
                <template v-else>
                  <p>请在{{buyEndTime}}内完成支付，逾期将取消订单</p>
                  <span
                    v-show="
                      orderInfo.payChannelType != 'JSAPI'
                      &&
                      orderInfo.payChannelType != 'MWEB'"
                    @click="goBuy()" class="btn-sub">立即支付</span>
                  <p @click="confirmCancel" class="cancel pointer">取消订单</p>
                </template>
            </template>
            <template v-else>
              {{statusType[type]}}
            </template>
        </div>
    </div>
    <div class="list">
        <div class="theader">
            <span class="w43">课程信息</span>
            <span class="w16">数量</span>
            <span class="w16">小计（元）</span>
            <span class="w20">有效期</span>
        </div>
        <classItem :item="orderInfo">
        <div slot="price"
        slot-scope="props"
         class="num">{{props.item.count}}</div>
         <div slot-scope="props" slot="status">
             ￥{{props.item.price}}
         </div>
        <div class="active"
        slot-scope="props"
         slot="options">
            {{getDay(props.item.termOfValidity)}}天
        </div>
        </classItem>
    </div>
  </div>
</template>
<script>
import { queryMyApplication, queryOrderById, updateOrderById } from '@/api/apis';
import classItem from '@/views/web/center/class-item.vue';
import mixin from './js/mixin';
import { formatDate, timeStampToHour } from '@/assets/utils/timefn';

export default {
  name: 'my-order-detail',
  mixins: [mixin],
  data() {
    return {
      name: 'my-order-detail',
      orderId: '',
      type: 1,
      tkm: '',
      orderInfo: null,

      buyEndTime: '', // 最后付款时间
      sTime: '', // 生效时间
      eTime: '', // 到期时间
      amount: '', // 订单金额
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.orderId = this.$route.query.orderId;

      console.log(this.tkm);
      // 查询订单详情
      this.queryOrderByIdFn();
    },
    goBuy() {
      if (!this.buyEndTime) {
        this.$message({
          message: '该订单已过期，不可以再付款',
          type: 'warning',
        });
        return;
      }
      this.$router.push({ path: '/pay-order', query: { orderId: this.orderId } });
    },
    confirmCancel() {
      this.$confirm('确认取消该订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'common-conifrm-box',
        confirmButtonClass: 'common-confirm-sub',
        cancelButtonClass: 'common-confirm-cancel',
        type: 'warning',
      }).then(() => {
        this.updateOrderByIdFn();
      }).catch(() => {
        console.log('取消');
      });
    },
    updateOrderByIdFn() {
      // 取消订单
      updateOrderById({ id: this.orderId }).then((res) => {
        if (res.data.code === '0000') {
          console.log(res);
          this.type = 6;
        } else if (res.data.code !== '0002') {
          this.$message({
            message: '取消订单失败，请稍后再试',
            type: 'warning',
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    getDay(time) {
      if (!time) return '';
      let stime = time.split('|')[0];
      let etime = time.split('|')[1];
      let curt = new Date(etime).getTime() - new Date(stime).getTime();
      return curt / (1000 * 60 * 60 * 24);
    },
    queryOrderByIdFn() {
      // 查询订单详情
      queryOrderById({ orderId: this.orderId }).then((res) => {
        if (res.data.code === '0000' && res.data.list.length > 0) {
          this.orderInfo = res.data.list[0] || {};
          this.amount = res.data.amount;
          /*eslint-disable*/ 
          if (this.orderInfo.termOfValidity) {
            // 计算生效时间   过期时间
            let oftime = this.orderInfo.termOfValidity;
            this.sTime = oftime.split('|')[0];
            this.eTime = oftime.split('|')[1];
          }
          
          if (this.orderInfo.expireDate) {
            let time = this.orderInfo.expireDate;
            time = time || 0;
            time = isNaN(time) ? 0 : parseInt(time);
            this.buyEndTime = `${timeStampToHour(time)}`;
          }
          this.type = this.orderInfo.status || '';
          this.tkm = this.orderInfo.tkm || '';
          /* eslint-enable */
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    getTime(time, type) {
      /*eslint-disable*/ 
      if (time === undefined) {
        return '';
      }
      time = new Date(time).getTime();
      return `${formatDate(time, type)}`;
       /* eslint-enable */
    },
    goStudy() {
      this.$router.push({ path: '/online-detail', query: { cid: this.orderInfo.goodsId } });
    },
    queryMyApplicationFn(t) {
      // 获取订单详情
      if (t === 'init') {
        this.queryMyApplicationParam.pageNum = 1;
      }
      queryMyApplication(this.queryMyApplicationParam).then((res) => {
        if (res.data.code === '0000') {
          this.classList = this.initlist(res.data.list);
          this.total = res.data.total;
        }
      }).catch((err) => {
        this.$message({
          message: '获取报名列表失败，请稍后再试',
          type: 'warning',
        });
        console.log(err);
      });
    },
  },
  components: {
    classItem,
  },
};
</script>
<style scoped>
.offlinetips{
  line-height: 100px;
}
.theader{
    overflow: hidden;
    display: flex;
    align-items: center;
    margin-top: 60px;
    margin-bottom: 10px;
}
.theader span{
    display: block;
    float: left\0;
    text-align: center;
}
.w43{
    width: 50%;
}
.theader .w43{
    text-align: left;
}
.w16{
    width: 15%;
}
.w20{
    width: 20%;
}

.btns{
    width: 255px;
}
h3{
    font-size: 16px;
}
.cancel{
    color: #868686;
}
.order-box{
    margin-top: 20px;
    overflow: hidden;
    position: relative;
    padding-right: 255px;
    box-sizing:border-box;
    width: 100%;
    color: #444;
}
.order-box p{
    margin-bottom: 10px;
    font-size: 14px;
}
.order-box .btns{
    position: absolute;
    right: 0;
    width: 255px;
    text-align: center;
    top: 0;
}
.active{
font-size: 14px;
color: #FB683C;
letter-spacing: 0;
}
</style>
