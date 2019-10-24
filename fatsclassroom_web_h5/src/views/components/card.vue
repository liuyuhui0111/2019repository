<template>
  <div class="class-card">
    <div class="card-box"
    @click="emit('cardClick',item)"
    :class="[typeClass,page,className]">
      <!-- 首页公开课 -->
      <template v-if="item">
        <div class="img-box">
          <baseImg
            :width="310"
            :height="184"
            :src="getSmallUrl(item.pic)">
          </baseImg>
          <!-- 公开课已过期 已截止标识 -->
          <template v-if="item.state==1">
            <span class="classstop">报名已截止</span>
          </template>
          <template v-else-if="item.state==2">
            <span class="classstop">报名已结束</span>
          </template>
           <template v-else-if="item.type == '2'">
            <span class="siginstop">报名中</span>
          </template>
          <template v-if="item.price && item.price!='0' &&
          item.leaguerFreeFlag==1
          && item.type == '1'">
            <span class="icon-vip"></span>
          </template>
        </div>
        <div class="intro">

          <div

          class="title ellipsis2">
            <slot name="title" :item="item">
              {{item.title}}
            </slot>
          </div>
          <!-- 公开课展示信息 -->
          <template v-if="item.type == '2'">
            <slot name="onlineIntro" :item="item">
            <div class="teacher ellipsis">
              <span class="icon-teacher" v-if="item.teacherName">{{
              (item.teacherName && item.teacherName.length>6)
                ? item.teacherName.substr(0,5)+'...'
                : item.teacherName
              }}</span>
              <span class="address">
                {{item.address + item.city}}
              </span>
            </div>
            <div class="time ellipsis">
              <span v-if="page=='list'" class="money"
              :class="{free:item.price==0}">{{item.price==0?'免费':'￥'+item.price}}</span>
              <span>{{getTime()}}</span>
              <span v-if="item.learner != undefined"
              class="learnNum">{{getLearner(item.learner)}}人已报</span>

            </div>

            </slot>
          </template>

          <!-- 线上课数据 -->
          <template v-if="item.type == '1'">
            <slot name="onlineIntro" :item="item">
              <div class="price"
            :class="{onlinelist:item.type == '1'}">
                <span class="money"
              v-if="item.leaguerFreeFlag==0 || item.price==0"
              :class="{free:item.price==0}">{{item.price==0?'免费':'￥'+item.price}}</span>
              <span class="money vipfree"
              v-if="item.leaguerFreeFlag!=0
              && item.price!=0">{{'￥'+item.price}}</span>
                <span v-if="item.learnNum != undefined"
                class="learnNum">{{getLearner(item.learnNum)}}人已学</span>
              </div>
            </slot>
          </template>

        </div>
      </template>

      <!-- 首页大家都在学 -->
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/assets/utils/timefn';

export default {
  name: 'ClassCard',
  data() {
    return {
      name: '课程组件',
    };
  },
  props: {
    item: { // 课程对象
      type: Object,
      default: () => null,
    },
    typeClass: { // 排列样式
      type: String,
      default: () => 'row',
    },
    page: { // 页面
      type: String,
      default: () => '',
    },
    className: { // 页面
      type: String,
      default: () => '',
    },
  },
  methods: {
    getTime() {
      let { item } = this;
      return `${formatDate(item.startTime, 'mm-dd')}~${formatDate(item.endTime, 'mm-dd')}`;
    },
    getSmallUrl(str) {
      // 获取列表缩略图
      if (this.item.type === '2') {
        return `${str.substr(0, str.lastIndexOf('.'))}_0.5${str.substr(str.lastIndexOf('.'), str.length)}`;
      }
      return str;
    },
    getLearner(num) {
      if (num === undefined) {
        return 0;
      }
      return num > 10000 ? `${(num / 10000).toFixed(1)}万` : num;
    },
  },
};
</script>
<style scoped>
.class-card{
  display: block;
  width: 100%;
}
.icon-vip{
  display: block;
  width: 44px;
  height: 14px;
  background: url('./imgs/vip.png') no-repeat center center;
  -webkit-background-size: 100% auto;
  background-size: 100% auto;
  position: absolute;
  right: 5px;
  top: 0;
}
.vipfree i{
  font-style: normal;
  display: inline-block;
  background: #FF7700;
border-radius: 4px;
border-radius: 4px;
width: 50px;
height: 18px;
line-height: 18px;
text-align: center;
font-size: 10px;
color:#fff;
margin-left: 5px;
}
.card-box{
  position: relative;
  width: 100%;
  box-sizing:border-box;
  overflow: hidden;
}
.card-box .img-box{
  width: 41%;
  float: left;
  position: relative;
}
.card-box.list .img-box,
.card-box.row .img-box{
  width: 41%;
}
.card-box .img-box .siginstop,
.card-box .img-box .classstop{
  position: absolute;
  display: block;
  width: 100%;
  text-align: center;
  height: 25px;
  line-height: 25px;
  background-image: linear-gradient(-180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.40) 86%);
  font-size: 12px;
  color: #ccc;
  bottom: 0;
  left: 0;
  z-index: 10;
  font-weight: bold;
}
.card-box .img-box .siginstop{
  color: #FF754C;
}
.card-box .intro{
  float: right;
  width: 55.69%;
  color: #868686;
  font-size: 12px;
}
.online-page .onlinelist{
  padding-top: 25px;
}

.card-box.row .intro{
  width: 55.69%;
}

.card-box.list .intro{
  width: 55.69%;
  padding-top: 0;
}
.title{
  width: 100%;
  height: 42px;
  line-height: 21px;
  overflow: hidden;
  font-size: 14px;
  color: #444;
  font-weight:300;
}
.time,
.teacher{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3px;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
}

.icon-teacher,
.address{
  padding-left: 12px;
  background: url('./imgs/icon-address.png') no-repeat left center;
  background-size: 12px auto;
}
.icon-teacher{
  background-image: url('./imgs/icon-teacher.png');
}

.col .intro,
.col .img-box{
  float: none;
  width: 100%;
}
.col .title{
  margin-top: 10px;
  margin-bottom: 5px;
}
.intro .price,
.card-box.list .price{
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  font-size: 0;
}

.money{
  color: #FB683C;
  font-size: 14px;
  font-weight: bold;
  float: left;
}

.money.free{
  color: #2DAF53;
  font-weight: normal;
}
.learnNum{
  color: #868686;
  float: right;
  font-size: 12px;
}
</style>
