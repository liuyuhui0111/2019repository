<template>
  <div v-if="showList.length>0" class="index">
    <cube-scroll ref="indexScroll"
    :data="showList"
    :scrollEvents="['scroll-end']"
    @scroll-end="scroll">
    <!-- logo -->
    <div class="white">
    <div class="logo">
      <img :src="COMMON_COMP_DATA.logoUrl" alt="">
      <span>
        {{ COMMON_COMP_DATA.productName }}
      </span>
    </div>
    </div>
    <!-- banner -->
    <div v-if="bannerList.length>0" class="banner-box">
      <Banner :list="bannerList"></Banner>
    </div>

    <div class="content-bg">

      <!-- nav -->
      <div class="nav-box">
        <IndexNav @navclick="navclick"></IndexNav>
      </div>

      <img @click="routerGo('/interests')" src="./imgs/viptip.png" alt="" class="viptip">

      <!-- 线下公开课 -->
      <div v-if="showCourseOfflineList.length>0" class="card offline">
        <BaseTitle title="公开课"
        @moreclick="moreclick"
        moreurl="0"></BaseTitle>
        <div class="pl15">
        <div v-for="(item,index) in showCourseOfflineList"
        class="item"
        :key="index">
          <ClassCard
                  @cardClick="cardClick(item.courseOfflineEntity,index,1)"
                  :item="item.courseOfflineEntity">

          </ClassCard>
        </div >
        </div>
      </div>


      <!-- 大家都在学 -->
      <div v-if="showCourseOnlineList.length>1" class="card">
        <BaseTitle title="大家都在学"
        @moreclick="moreclick"
        moreurl="1"></BaseTitle>
        <div class="online-box">
          <div v-for="(item,index) in showCourseOnlineList"
          class="item"
          :key="index">
            <ClassCard @cardClick="cardClick(item,index,2)" :item="item"
            typeClass="col"></ClassCard>
          </div >
        </div>
      </div>


      <!-- 新鲜出炉 -->
      <div v-if="getNewCourseListList.length>0" class="card">
        <BaseTitle title="新鲜出炉"
        @moreclick="moreclick"
        moreurl="2"></BaseTitle>
        <div class="online-box">
          <div v-for="(item,index) in getNewCourseListList"
          class="item"
          :key="index">
            <ClassCard @cardClick="cardClick(item,index,3)" :item="item"
            typeClass="col"></ClassCard>
          </div >
        </div>
      </div>


      <!-- 优质课程推荐 -->
      <div v-if="getGroomCourseListList.length>0" class="card">
        <BaseTitle title="优质课程推荐"
        moreurl=""></BaseTitle>
        <div class="online-box">
          <div v-for="(item,index) in getGroomCourseListList"
          class="item"
          :key="index">
            <ClassCard @cardClick="cardClick(item,index,4)" :item="item"
            typeClass="col"></ClassCard>
          </div >
        </div>
      </div>

      <!-- <div class="tips">
            <span>
              没有更多了~
            </span>
          </div> -->


    </div>
  </cube-scroll>
  <!-- 返回顶部 -->
  <BackTop @backTop="scrollToTop"
  :isShowBackTop="isShowBackTop"></BackTop>
  </div>
</template>
<script>
import {
  showFoucusPic,
  showCourseOffline,
  showCourseOnline,
  // showTeacher,
  getNewCourseList,
  getGroomCourseList,
} from '@/api/apis';
import Banner from './banner.vue';
import IndexNav from './nav.vue';
import BaseTitle from '@/views/components/title.vue';
import ClassCard from '@/views/components/card.vue';


export default {
  name: 'index',
  data() {
    return {
      name: 'index',
      bannerList: [], // 轮播图
      showCourseOfflineList: [], // 线下公开课
      showCourseOnlineList: [], // 大家都在学
      getNewCourseListList: [], // 新鲜出炉
      getGroomCourseListList: [], // 推荐课程
      isShowBackTop: false, // 返回顶部
      showList: [],
    };
  },
  mounted() {
    this.init();
  },
  components: {
    Banner,
    IndexNav,
    BaseTitle,
    ClassCard,
  },
  activated() {
    this.$nextTick(() => {
      /*eslint-disable*/
      this.$refs.indexScroll && this.$refs.indexScroll.refresh();
      /* eslint-enable */
    });
  },
  methods: {
    init() {
      // 获取轮播图
      this.showFoucusPicFn();
      // 获取线下公开课
      this.showCourseOfflineFn();
      // // 首页大家都在学
      this.showCourseOnlineFn();
      // // 首页新鲜出炉列表
      this.getNewCourseListFn();
      // // 首页推荐课程列表
      this.getGroomCourseListFn();
    },
    scroll(pos) {
      if (pos.y < -this.scrollInitHeight) {
        this.isShowBackTop = true;
      } else {
        this.isShowBackTop = false;
      }
    },
    scrollToTop() {
      this.$refs.indexScroll.scrollTo(0, 0, 300);
      this.isShowBackTop = false;
    },

    moreclick(moreurl) {
      if (moreurl === '0') {
        this.ysxy_columnClick({ LocationName: '线下公开课程查看全部', columnTitle: '' });
      } else if (moreurl === '1') {
        this.ysxy_columnClick({ LocationName: '大家都在学查看全部', columnTitle: '' });
      } else if (moreurl === '2') {
        this.ysxy_columnClick({ LocationName: '新鲜出炉查看全部', columnTitle: '' });
      }
      // 查看更多
      let moreData = [{ path: '/open-class' },
        { path: '/online-class', query: { hot: 1 } },
        { path: '/online-class' },
      ];
      this.routerGo(moreData[moreurl].path, moreData[moreurl].query);
    },
    navclick(item) {
      this.ysxy_columnClick({ LocationName: item.title, columnTitle: '课程分类' });
      this.routerGo(item.path);
    },
    showFoucusPicFn() {
      // 获取轮播图
      showFoucusPic({ type: '0' }).then((res) => {
        this.showList.push(true);
        if (res.data.list) {
          /*eslint-disable*/
          res.data.list.forEach((item)=>{
            item.image = item.pic;
          })
          /* eslint-enable */
          this.bannerList = res.data.list;
        }
      }).catch((err) => {
        this.showList.push(true);
        console.log(err);
      });
    },
    showCourseOfflineFn() {
      // 线下公开课
      showCourseOffline({ pageSize: 2 }).then((res) => {
        this.showList.push(true);
        if (res.data.list) {
          /*eslint-disable*/
          res.data.list.forEach((item)=>{
              item.courseOfflineEntity.teacherName = item.teacherName;
              item.courseOfflineEntity.type = item.type;
          })
          /* eslint-enable */
          this.showCourseOfflineList = res.data.list.slice(0, 2);
        }
      }).catch((err) => {
        this.showList.push(true);
        console.log(err);
      });
    },
    showCourseOnlineFn() {
      // 大家都在学
      showCourseOnline({ pageSize: 6 }).then((res) => {
        this.showList.push(true);
        if (res.data.list) {
          /*eslint-disable*/
          res.data.list.forEach((item)=>{
              item.pic = item.bannerUrl;
          })
          let list = res.data.list;
          let num = parseInt(list.length/2,10)*2>6 ? 6 : parseInt(list.length/2,10)*2;
          /* eslint-enable */
          this.showCourseOnlineList = list.slice(0, num);
        }
      }).catch((err) => {
        this.showList.push(true);
        console.log(err);
      });
    },

    getNewCourseListFn() {
      // 新鲜出炉
      getNewCourseList({ pageSize: 2 }).then((res) => {
        this.showList.push(true);
        if (res.data.list) {
          let { list } = res.data;
          /*eslint-disable*/
          list.forEach((item) => {
              item.pic = item.bannerUrl;
          });
          /* eslint-enable */
          this.getNewCourseListList = res.data.list.slice(0, 2);
        }
      }).catch((err) => {
        this.showList.push(true);
        console.log(err);
      });
    },

    getGroomCourseListFn() {
      // 推荐课程
      getGroomCourseList({ pageSize: 4 }).then((res) => {
        this.showList.push(true);
        let { list } = res.data;
        if (res.data.list) {
          /*eslint-disable*/
          list.forEach((item) => {
              item.pic = item.bannerUrl;
          });
          /* eslint-enable */
          this.getGroomCourseListList = res.data.list.slice(0, 4);
        }
      }).catch((err) => {
        this.showList.push(true);
        console.log(err);
      });
    },


  },
};
</script>
<style scoped>
 /* .tips{
    display: block;
    width: 100%;
    color: #868686;
    text-align: center;
    font-size: 12px;
    padding: 7px 0 30px 0;
    height: 20px;
    line-height: 20px;
    position: relative;
  }*/
  .white{
    background: #fff;
    padding: 4px 0;
  }
  .index{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 50%;
    transform: translate(-50%,0);
    box-sizing:border-box;
  }
  /*no 的属性不会被转为rem*/
  [data-dpr="0"] .index{
    max-width: 750px; /*no*/
  }
  .viptip{
    display: block;
    width: 100%;
    margin-bottom: 7px;
  }
  .index:after{
    content: "";
    display: block;
    width: 100%;
    position: fixed;
    bottom: 0px;
    height: 200px;
    background: #f1f1f1;
  }
  .logo{
    display: block;
    /*width: 28px;*/
    height: 28px;
    margin: 4px auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo img{
    width: 28px;
    height: 100%;
  }
  .logo span{
    font-size: 17px;
    color: #444444;
    font-weight: 600;
    margin-left: 5px;
  }
  .banner-box{
    background: #fff;
  }
  .content-bg{
    display: block;
    box-sizing:border-box;
    padding: 0 15px;
    background: #f1f1f1;
    min-height: 100%;
    padding-bottom: 58px;
  }
  .nav-box{
    position: relative;
    background: #fff;
    width: 100%;
    /*自动编译为rem 可以写1px*/
    /* border: 1px solid #D4D4D4; */
    border-radius: 4px;
    top: -5px;
    z-index: 10;
  }
  .card{
    background: #FFFFFF;
    /* border: 1px solid #D4D4D4; */
    border-radius: 4px;
    margin-bottom: 7px;
    padding-top: 7px;
  }
  .class-title{
    text-align: center;
    border-bottom: 1px solid #D4D4D4;
    font-size: 12px;
    line-height: 30px;
    font-weight: bold;
  }
  .item{
    padding: 10px 10px 0 10px;
  }
  .online-box{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 10px 10px 0 10px;
  }
  .online-box .item{
    padding: 0;
    width: 155px;
    margin-bottom: 15px;
  }
  .offline{
    /*padding-bottom: 10px;*/
  }
  .pl15{
    padding: 0 15px;
  }
  .offline .item{
    padding: 15px 0;
    border-bottom: 1px solid #d8d8d8;
  }
  .offline .item:nth-last-child(1){
    border: none;
  }
</style>
