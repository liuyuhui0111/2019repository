<template>
  <div class="learnlist">


    <div class="empty" v-show="list.length<1 && isShowPage">
      <span class="icon-empty"></span>
      <p @click="routerReplace('/open-class')">还没有报名公开课哦~ <br>
      <span class="active">现在去报名</span></p>
    </div>
    <div v-if="list.length>0" class="view-wrapper">
      <cube-scroll
          ref="siginScroll"
          :data="list"
          :options="options"
          :scrollEvents="['scroll-end']"
          @scroll-end="scroll"
          @pulling-up="onPullingUp">
        <!-- 上拉加载 -->
        <!-- 展示区域 -->
        <div class="list">
        <div v-for="(item,index) in list" class="item"
        :key="index">
          <div class="tel">
            报名时间：{{item.signUp.substr(0,item.signUp.length-3)}} &nbsp;&nbsp;手机号：{{item.phone}}
          </div>
          <ClassCard @cardClick="cardClick"
          :item="item" page="list">
          <template slot-scope="props"
          slot="onlineIntro">
            <div class="col-box">
              <span v-if="props.item.tkm" class="tkm">听课凭借码：<i>{{props.item.tkm}}</i></span>
              <span class="money"
              :class="{free:props.item.price==0}">
              {{props.item.price==0?'免费':'￥'+props.item.price}}</span>
            </div>
          </template>
          </ClassCard>
          <div class="address">
            上课地点：{{item.address}}
          </div>
          <div class="time">
            上课时间：
            {{item.startTime.substr(0,item.startTime.length-3)}}
            ~
            {{item.endTime.substr(0,item.endTime.length-3)}}
          </div>


        </div >

        </div>
        <template slot="pullup" slot-scope="props">
        <div v-if="list.length>14" class="h80"></div>
        <div v-if="props.isPullUpLoad" class="tips">
          加载中...
        </div>
        <div v-else class="tips">
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
  queryMyApplication,
} from '@/api/apis';
import ClassCard from '@/views/components/card.vue';

export default {
  name: 'learnlist',
  data() {
    return {
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
    };
  },
  components: {
    ClassCard,
  },
  watch: {
    $route() {
      this.init();
    },
  },
  mounted() {
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
      if (!this.token) {
        return;
      }
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
      this.$refs.siginScroll.scrollTo(0, 0, 300);
      this.isShowBackTop = false;
    },
    onPullingUp(t) {
      let opt = { isHideLoading: true };
      if (t === 'init') {
        this.pageNum = 1;
        opt = {};
      }
      if (this.list.length >= this.total && t !== 'init') {
        this.$refs.siginScroll.forceUpdate();
        return;
      }
      let { pageNum } = this;
      let { pageSize } = this;
      // this.total = 0;
      queryMyApplication({
        pageNum,
        pageSize,
      }, opt).then((res) => {
        if (res.data.code === '0000') {
          this.isShowPage = true;
          this.pageNum += 1;
          if (res.data.list.length > 0) {
            /*eslint-disable*/ 
            res.data.list.forEach((item)=>{
              item.type = "2";
            })
             
            

            if (this.list.length >= res.data.total && t !== 'init') {
              this.$refs.siginScroll.forceUpdate();
            }

            if (t === 'init') {
              this.list = res.data.list;
              // 初始化情况下  更新srcoll 滚动到顶部
              this.$refs.siginScroll && this.$refs.siginScroll.refresh();
            }else{
              this.list = this.list.concat(res.data.list);
            }
          } else {
            this.$refs.siginScroll && this.$refs.siginScroll.forceUpdate();
          }
           /* eslint-enable */
          this.total = res.data.total;
        }
      }).catch((err) => {
        console.log(err);
        this.$message('我的报名列表获取失败，请稍后再试');
      });
    },


  },
};
</script>
<style scoped>
.h80{
  height: 57px;
  display: block;
  position: relative;
  overflow: hidden;
}
.tips{
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
.time,
.address,
.tel{
  font-size: 12px;
  color: #868686;
  line-height: 20px;
  position: relative;
}
.tel{
  padding-bottom: 15px;
  border-bottom: 1px solid #d8d8d8;
  margin-bottom: 15px;
  font-size: 13px;
  color: #444444;
}
.address{
  margin-top: 15px;
  margin-bottom: 5px;
}
.time,.address{
  padding-left: 20px;
  background: url('./imgs/icon-address.png') no-repeat left center;
  background-size: 15px 15px;
}
.time{
  background-image: url('./imgs/icon-date.png');
}

.classtype2,
.classtype1{
  color: #FB683C;
  margin-right: 3px;
  font-weight: bold;
}
.classtype2{
  color: #659FE3;
}
.col-box{
  overflow: hidden;
  overflow: hidden;
  line-height: 20px;
  vertical-align: center;
  padding-top: 15px;
}

.col-box .tkm{
  font-size: 12px;
  color: #444;
}
.col-box .tkm i{
  font-size: 16px;
  color: #FB683C;
  font-weight: bold;
  position: relative;
  top: 1px;
}
.money{
  color: #444;
  font-size: 13px;
  float: right;
}
.money.free{
  color: #2DAF53;
}
.view-wrapper{
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.empty{
    padding-top: 103px;
    font-size: 17px;
    color: #868686;
    text-align: center;
  }
  .icon-empty{
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 4px;
    margin: 0 auto;
    background: url('./imgs/offline-empty.png') no-repeat center center;
    background-size: 50px 50px;
  }
  .empty p{
    line-height: 24px;
    margin-top: 15px;
  }
  .empty p .active{
    color: #FB683C;
  }
   .list{

    display: block;
    width: 100%;
    box-sizing:border-box;
    background: #fff;
  }
  .list .item{
    border-top: 7px solid #f1f1f1;
    width: 100%;
    padding: 15px;
    box-sizing:border-box;
  }
  .list .item:nth-last-child(1){
    border-bottom: none;
  }
</style>
