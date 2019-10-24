<template>
  <div class="my-order">
    <Title title="我的订单"
    @navclick="navclick"
    :list="list"></Title>

    <template v-if="curNav === 0">
        <!-- 会员订单 -->
        <div class="vip-box my-order-box">
            <div class="title">
                <span>会员开通记录</span>
                <!-- <span class="tip">您的会员已到期</span> -->

            </div>
             <!-- eslint-disable -->
            <div class="list">
              <el-table
              border
              :data="vipList">

               <el-table-column
               v-for="(item,index) in vipListTheader"
               :align="item.align"
               v-if="item.prop != 'status'"
                  :key="index"
                :prop="item.prop"
                :label="item.label">

                </el-table-column>


                <el-table-column
               v-for="(item,index) in vipListTheader"
               :align="item.align"
               v-if="item.prop == 'status'"
                  :key="index"
                :prop="item.prop"
                :label="item.label">
                <template slot-scope="scope">
                <div v-if="scope.row.status === 1 ||
                scope.row.status === 2">
                  <div v-if="getTime(scope.row.expireDate) == ''">
                      订单已取消
                  </div>
                  <div v-else>
                      {{statusType[scope.row.status]}}
                  </div>
                </div>
                <div v-else>
                  {{statusType[scope.row.status]}}
                </div>

                </template>
                </el-table-column>


                <el-table-column
                width="200"
                align="center"
                fixed="right"
                prop="cz"
                label="操作">
                <template slot-scope="scope">
                    <div v-if="scope.row.status === 1 ||
                    scope.row.status === 2">
                      <div v-if="getTime(scope.row.expireDate) == ''">
                          ----
                      </div>
                      <div v-else>
                          <p>剩余：{{getTime(scope.row.expireDate)}}</p>
                          <span
                            v-show="scope.row.payChannelType != 'JSAPI'
                              &&
                             scope.row.payChannelType != 'MWEB'"
                            class="pointer btn-sub"
                            @click="goBuy(scope.row)">立即支付</span>
                      </div>
                    </div>
                    <div v-else>
                      ----
                    </div>
                </template>
                </el-table-column>

              </el-table>

            </div>
             <!-- eslint-enable -->
            <!-- <div class="foot">
            <p>客服QQ：<a :href="aside.qq" target="_blank">QQ交谈</a></p>
            <p>客服热线：{{aside.tel}}</p>
            <p>服务时间：{{aside.time}}</p>
            </div> -->
        </div>
    </template>

    <template v-if="curNav !== 0">
        <div class="theader">
            <span v-if="curNav!=2" class="item w43">订单信息</span>
            <span v-if="curNav==2" class="item w30">订单信息</span>
            <span v-if="curNav==2" class="item w16">听课码</span>
            <span class="item w16">订单金额</span>
            <div @click="isShowTypeList = !isShowTypeList"
            :class="{active:isShowTypeList}"
             class="item w16 pointer">{{typelist[typeIndex].text}}
              <span class="icon-triangle"></span>
              <div class="list" v-show="isShowTypeList">
                <span v-for="(item,index) in typelist"
                @click.stop="checkType(item,index)"
                :key="index">
                  {{item.text}}
                </span >
              </div>
            </div>
            <span class="item w20">操作</span>
        </div>
        <div class="my-order-box">
        <ul
        v-if="orderlist.length>0">
          <li v-for="(item,index) in orderlist"
          :key="index">

            <classItem
            @imgClick="goDetail"
            @goStudy="goStudy"
            @buy="goBuy"
            @cancel="confirmCancel"
            :goodstype="queryOrderListParam.goods_type"
            :index="index"
            :item="item"></classItem>
            <div class="time">
              下单时间：{{item.orderDate}} &nbsp;&nbsp;&nbsp;&nbsp;
              订单编号:{{item.orderCode}}
            </div>
          </li>
        </ul>
        <ul class="empty" v-if="orderlist.length<=0 && isShowList">
          暂无数据
        </ul>
        </div>
    </template>


     <el-pagination
        v-if="list[curNav].total>list[curNav].pageSize"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :pager-count="pagerCount"
        prev-text="上一页"
        next-text="下一页"
        :page-size="list[curNav].pageSize"
        :total="list[curNav].total">
      </el-pagination>

  </div>
</template>
<script>
import mixin from './js/mixin';
import classItem from '@/views/web/center/class-item.vue';
import { timeStampToHour } from '@/assets/utils/timefn';
import { queryOrderList, updateOrderById } from '@/api/apis';

export default {
  name: 'my-order',
  mixins: [mixin],
  data() {
    return {
      name: 'my-order',
      isShowList: false,
      pagerCount: 11,
      aside: {
        qq: '', // 侧栏QQ
        tel: '',
        time: '',
      },
      curTypeListIndex: 0,
      typelist: [
        {
          value: '',
          text: '全部订单',
        },
        {
          value: '3',
          text: '交易成功',
        },
        {
          value: '2',
          text: '等待付款',
        },
        // {
        //   value: '4',
        //   text: '退款中',
        // },
        // {
        //   value: '5',
        //   text: '已退款',
        // },
        {
          value: '6',
          text: '订单已取消',
        },
      ],
      curNav: 0,
      list: [
        {
          text: '会员订单',
          value: 3,
          pageNum: 1,
          pageSize: 5,
          total: 0,
        },
        {
          text: '录播课订单',
          value: 1,
          pageNum: 1,
          pageSize: 5,
          total: 0,
        },
        {
          text: '公开课订单',
          value: 2,
          pageNum: 1,
          pageSize: 5,
          total: 0,
        },
      ],
      vipListTheader: [
        {
          label: '订单编号',
          prop: 'orderCode',
          align: 'center',
        },
        {
          label: '会员类型',
          prop: 'goodsName',
          align: 'center',
        },
        {
          label: '下单时间',
          prop: 'orderDate',
          align: 'center',
        },
        {
          label: '生效时间',
          prop: 'buyTime',
          align: 'center',
        },
        {
          label: '结束时间',
          prop: 'dueTime',
          align: 'center',
        },
        {
          label: '支付状态',
          prop: 'status',
          align: 'center',
        },

      ],
      vipList: [],
      onlineList: [],
      offlineList: [],

      orderlist: [], // 订单列表

      isShowTypeList: false,
      typeIndex: 0,
      isShowPage: true,
      queryOrderListParam: { // 查询订单列表参数

        pay_status: '', // 支付状态 1已支付 2 支付中 3 未支付 4 支付失败 5 支付中
        status: '', // 订单状态 1未付款  2 付款中 3 已付款 4 退款中 5 已退款 6 已取消
        goods_type: 3, // 商品类型  1 线上 2 线下 3 会员
        user_type: '', // 用户类型  1 个人 2企业
        page: 1, // 页码
        limit: 5, // 条数
      },
      endTimer: null, // 定时器计算截止付款时间

    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    console.log('清除定时器');
    clearInterval(this.endTimer);
  },
  methods: {
    init() {
      this.aside.qq = this.COMMON_COMP_DATA.qq;
      this.aside.tel = this.COMMON_COMP_DATA.tel;
      this.aside.time = this.COMMON_COMP_DATA.time;
      this.queryOrderListFn('init');
    },
    confirmCancel(item, index) {
      this.$confirm('确认取消该订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'common-conifrm-box',
        confirmButtonClass: 'common-confirm-sub',
        cancelButtonClass: 'common-confirm-cancel',
        type: 'warning',
      }).then(() => {
        this.updateOrderByIdFn(item, index);
      }).catch(() => {
        console.log('取消');
      });
    },
    updateOrderByIdFn(item, index) {
      console.log(index);
      // 取消订单
      updateOrderById({ id: item.id }).then((res) => {
        if (res.data.code === '0000') {
          // item.status = '6';
          this.queryOrderListFn();
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    queryOrderListFn(t) {
      if (t === 'init') {
        this.list[this.curNav].pageNum = 1;
      }
      this.orderlist = [];
      this.isShowList = false;
      this.queryOrderListParam.page = this.list[this.curNav].pageNum;
      this.queryOrderListParam.limit = this.list[this.curNav].pageSize;
      this.queryOrderListParam.status = this.typelist[this.typeIndex].value;
      queryOrderList(this.queryOrderListParam).then((res) => {
        this.isShowPage = true;
        this.isShowList = true;
        if (res.data.code === '0000') {
          this.list[this.curNav].total = res.data.total;
          this.initOrderList(res.data.list.records);
        }
      }).catch((err) => {
        this.isShowPage = true;
        this.isShowList = true;
        this.$message({
          message: '获取订单列表失败，请稍后再试',
          type: 'warning',
        });
        console.log(err);
      });
    },
    initOrderList(orderlist) {
      /*eslint-disable*/
            orderlist.forEach((item) => {
                // item.expireDate = 1000 * 60 * 60 * 24;
                item.expireDate = item.expireDate || 0;
                item.expireDate = isNaN(item.expireDate) ? 0 : parseInt(item.expireDate)
                if (this.curNav === 0) {
                  if(item.orderItems && item.orderItems[0].termOfValidity){
                    let time = item.orderItems[0].termOfValidity;
                    item.buyTime = time.split('|')[0];
                    item.dueTime = time.split('|')[1];;
                  }else{
                    item.buyTime = '----';
                    item.dueTime = '----';
                  }
                }
            });

      if (this.curNav === 0) {
        this.vipList = orderlist;
      } else {
        this.orderlist = orderlist;
      }
      this.startTimer();
       /* eslint-enable */
    },
    startTimer() {
      let timeStep = 1000 * 60; // 间隔时间 /秒
      clearInterval(this.endTimer);
      /*eslint-disable*/
            this.endTimer = setInterval(() => {
                if (this.curNav === 0) {
                    let arr = [].concat(this.vipList);
                    arr.forEach((item) => {

                        item.expireDate -= timeStep;
                    });
                    this.vipList = [].concat(arr);
                } else {
                    let arr = [].concat(this.orderlist);
                    arr.forEach((item) => {
                        item.expireDate -= timeStep;
                    });
                    this.orderlist = [].concat(arr);
                }
            }, timeStep);
            /* eslint-enable */
    },
    checkType(item, index) {
      this.isShowTypeList = false;
      this.typeIndex = index;
      this.queryOrderListFn('init');
    },
    goStudy(item) {
      if (item.goodsType === 1) {
        // 去录播课详情
        this.$router.push({ path: '/online-detail', query: { cid: item.goodsId } });
      } else if (item.goodsType === 2) {
        // 去公开课详情
        this.$router.push({ path: '/detail', query: { cid: item.goodsId } });
      }
    },
    goDetail(item) {
      let query = {
        orderId: item.id,
      };
      if (item.status) {
        query.status = item.status;
      }
      if (item.orderItems && item.orderItems[0].tkm) {
        query.tkm = item.orderItems[0].tkm;
      }
      this.$router.push({ path: '/center/detail', query });
    },
    goBuy(item) {
      console.log(item.orderCode);
      if (!item.expireDate || item.expireDate <= 0) {
        this.$message({
          message: '该订单已过期，不可以再付款',
          type: 'warning',
        });
        return;
      }
      this.$router.push({ path: '/pay-order', query: { orderId: item.id } });
    },
    getTime(time) {
      if (!time) {
        return '';
      }
      return `${timeStampToHour(time)}`;
    },
    handleCurrentChange(val) {
      this.list[this.curNav].pageNum = val;
      this.queryOrderListFn();
    },
    navclick(item, index) {
      this.isShowTypeList = false;
      this.curNav = index;
      this.queryOrderListParam.goods_type = item.value;
      this.queryOrderListFn('init');
    },
  },
  components: {
    classItem,
  },
};
</script>
<style scoped>
.empty{
  text-align: center;
  line-height: 60px;
  font-size: 22px;
}
.time{
  margin-top: 10px;
  margin-bottom: 20px;
}
.btn-sub{
    margin: 0 auto;
}
.theader{
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 10px;
    height: 22px;
    line-height: 20px;
}
.theader .item{
    display: block;
    float: left\0;
    text-align: center;
    position: relative;
}

.theader .item .icon-triangle{
  position: relative;
  display: inline-block;
  top: 0px;
  margin-left: 5px;
  -webkit-transform:rotate(0deg);
  -ms-transform:rotate(0deg);
  -o-transform:rotate(0deg);
  transform:rotate(0deg);
  transition: transform 0.3s;
}
.theader .item.active .icon-triangle{
  top: -2px;
  -webkit-transform:rotate(180deg);
  -ms-transform:rotate(180deg);
  -o-transform:rotate(180deg);
  transform:rotate(180deg);
}
.theader .item .list{
  position: absolute;
  width: 100%;
  text-align: center;
  background: #fff;
  top: 10px;
}
.theader .item .list span{
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
}
.w43{
    width: 50%;
}
.theader .item.w30{
  width: 35%;
  text-align: left;
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
.vip-box{
    margin-top: 40px;
    font-size: 16px;
    color: #444444;
    letter-spacing: 0;
    width: 100%;
}
.list{
    margin-top: 20px;
    font-size: 12px;
}
.title{
    font-weight: bold;
}
.vip-box .title{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.vip-box .title .tip{
  color: #F91E1E;
}
.foot{
  margin-top: 30px;
}
.foot p{
  margin-bottom: 10px;
}
.foot a{
  color: #FB683C;
}
.my-order-box{
  min-height: 500px;
}
</style>
