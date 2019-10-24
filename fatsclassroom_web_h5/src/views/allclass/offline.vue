<template>
  <div v-if="isShowPage" class="allclass common-allclass-index">
      <basenav curindex="1" :list="navlist"></basenav>
            <!-- 公开课 -->
             <div v-if="list.length<1 && isShowPage" class="emptybg">
            <div class="empty" >
              <span class="icon-empty"></span>
              <template>
                  <p><span class="active">先去学习一下录播课吧！</span></p>
              </template>
            </div>
            </div>

      <div v-if="list.length>0" class="view-wrapper">
        <cube-scroll
            ref="scroll"
            :data="list"
            :options="options"
            :scrollEvents="['scroll-end']"
            @scroll-end="scroll"
            @pulling-up="onPullingUp">
          <!-- 上拉加载 -->
          <!-- 展示区域 -->
          <!-- 顶部导航 -->

          <div class="list">
          <div v-for="(item,index) in list" class="item"
          :key="index">
            <ClassCard  @cardClick="cardClick"
            :item="item" page="list"></ClassCard>
          </div >

          </div>
          <div v-if="list.length>14" class="h80"></div>
          <template slot="pullup" slot-scope="props">
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
  offlineCourseList,
} from '@/api/apis';
import ClassCard from '@/views/components/card.vue';
import basenav from '@/views/components/nav.vue';

export default {
  name: 'allclass',
  components: {
    ClassCard,
    basenav,
  },
  data() {
    return {
      tips: '没有更多了~',
      infinite: true,
      type: '2', // 1线上课 2线下公开课
      offset: 200,
      navlist: [
        {
          text: '录播课',
          type: '1',
          path: '/online-class',
        },
        {
          text: '公开课',
          type: '2',
          path: '/open-class',
          active: true,
        },
      ],
      list: [], // 课程列表  公开课 线上课共用
      pageNum: 1, // 页面
      pageSize: 15, // 每页条数
      total: 0, // 总条数
      isShowPage: false, // 是否展示页面
      pullUpLoad: true,
      pullUpLoadThreshold: 100,
      pullUpLoadMoreTxt: '上拉加载',
      pullUpLoadNoMoreTxt: '没有更多了~',
      customPullDown: false,
      isShowBackTop: false, // 返回顶部
    };
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
  activated() {
    this.$nextTick(() => {
      /*eslint-disable*/
      this.$refs.scroll && this.$refs.scroll.refresh();
      /* eslint-enable */
    });
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.pageNum = 1;
      this.total = 0;
      this.list = [];
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
      this.$refs.scroll.scrollTo(0, 0, 300, 'ease-in');
      this.isShowBackTop = false;
    },
    onPullingUp(t) {
      // 公开课列表
      let opt = { isHideLoading: true };
      if (t === 'init') {
        this.pageNum = 1;
        opt = {};
      }
      if (this.list.length >= this.total && t !== 'init') {
        this.$refs.scroll.forceUpdate();
        return;
      }
      let { pageNum } = this;
      let { pageSize } = this;
      offlineCourseList({ pageNum, pageSize }, opt).then((res) => {
        if (res.data.list.length > 0) {
          /*eslint-disable*/
              res.data.list.forEach((item)=>{
                item.type='2';
                item.learner = item.signUpManNum;
              })
          if(t==='init'){
            this.list = res.data.list;
          }else{
            this.list = this.list.concat(res.data.list);
          }

          this.pageNum += 1;
          if (this.list.length >= res.data.total && t !== 'init') {
            this.$refs.scroll && this.$refs.scroll.forceUpdate();
          }
        } else {
          this.$refs.scroll && this.$refs.scroll.forceUpdate();
        }
        this.total = res.data.total;
        this.isShowPage = true;
         /* eslint-enable */
      }).catch((err) => {
        console.log(err);
      });
    },

  },
};
</script>
<style>
  .common-allclass-index .cube-pullup-wrapper .before-trigger{
    color: #868686;
    font-size: 12px;
    text-align: center;
  }
</style>
<style scoped>
.emptybg{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 47px;
}
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
  .allclass{
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 50px;
    left: 0;
    right: 0;
    box-sizing:border-box;
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
    background: url('./imgs/icon-empty.png') no-repeat center center;
    background-size: 50px 50px;
  }
  .empty p{
    line-height: 24px;
    margin-top: 15px;
  }
  .list{
    border-bottom: 1px solid #d4d4d4;
    padding-left: 15px;
    display: block;
    width: 100%;
    box-sizing:border-box;
    background: #fff;
  }
  .list .item{
    width: 100%;
    padding: 15px 15px 15px 0;
    border-bottom: 1px solid #d4d4d4;
    box-sizing:border-box;
  }
  .list .item:nth-last-child(1){
    border-bottom: none;
  }
  .view-wrapper{
    position: fixed;
    top: 47px;
    bottom: 50px;
    width: 100%;
    box-sizing:border-box;
  }
  .list-box{
    display: block;
    position: relative;
    width: 100%;
    min-height: 100%;
  }
</style>
