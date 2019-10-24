<template>
  <div v-if="detailData" class="common-h5-index h5page">
    <img class="banner" :src="detailData.pic" alt="detailData.title">
    <div class="nav">
      <span v-for="(item,index) in navlist"
      :class="{active:cuindex === index}"
      @click="changeTab(index,item)"
      :key="index">{{item.text}}</span>
    </div>
    <div class="contain-box">
        <div class="teacher-box">
          <img :src="detailData.headPic" :alt="detailData.teacherName">
          <p class="name">{{detailData.teacherName}}</p>
          <p class="intro" v-html="detailData.teacherIntroduction"></p>
        </div>
        <div id="kcxx" class="title">课程信息</div>
        <div class="item">
          <p>课程天数：{{getDay}} 天</p>
          <p>课程价格：{{detailData.price}} 元</p>
          <p>培训对象：{{detailData.trainObject}}</p>
          <p>培训时间：{{getTime}}</p>
          <p>培训地点：{{detailData.address}}</p>
          <p>咨询电话：{{detailData.hotline}}</p>
        </div>
        <div id="kcjs" class="title">课程介绍</div>
        <div class="item" v-html="detailData.introduce"></div>
        <div id="kcdg" class="title">课程大纲</div>
        <div class="item" v-html="detailData.outline"></div>
        <div id="kcjh" class="title">课程计划</div>
        <div class="item" v-html="detailData.outline"></div>
        <span @click="goSignUp"
        :class="{gray:detailData.state==1||detailData.state==2}"
        class="btn-sub">在线报名</span>
    </div>
  </div>
</template>
<script>
import {
  findOfflineCourseById,
} from '@/api/apis';
import { formatDate } from '@/assets/utils/timefn';
import { setScrollTop, getUrlParam } from '@/assets/utils/util';

export default {
  name: 'h5page',
  data() {
    return {
      name: 'h5page',
      detailData: null,
      courseId: '',
      cuindex: 0,
      navlist: [
        {
          text: '课程信息',
          id: 'kcxx',
        },
        {
          text: '课程介绍',
          id: 'kcjs',
        },
        {
          text: '课程大纲',
          id: 'kcdg',
        },
        {
          text: '课程计划',
          id: 'kcjh',
        },
      ],
    };
  },
  mounted() {
    this.init();
  },
  beforeCreate() {
    // alert('1')
  },
  computed: {
    getDay() {
      let day = (this.detailData.endTime - this.detailData.startTime) / (24 * 60 * 60 * 1000);

      return parseInt(day, 10) + 1;
    },
    getTime() {
      return `${formatDate(this.detailData.startTime)}~${formatDate(this.detailData.endTime)}`;
    },
  },
  methods: {
    init() {
      this.courseId = parseInt(this.$route.query.cid, 10);
      const code = getUrlParam('code');
      if (code) {
        this.getTokenByCode();
      }
      // 初始化二维码
      // 获取详情内容
      this.findOfflineCourseByIdFn();
    },
    goSignUp() {
      const code = getUrlParam('code');
      // 在线报名
      if (this.detailData.state === '1' || this.detailData.state === '2') {
        return;
      }

      if (!code || !this.token) {
        this.login();
        return;
      }
      if (this.courseId) {
        this.$router.push({ path: '/h5/signup', query: { cid: this.courseId } });
      }
    },
    changeTab(index, item) {
      this.cuindex = index;
      this.scrollToDom(item);
    },
    scrollToDom(item) {
      // 滚动条滚动到指定元素位置
      const obj = document.getElementById(item.id);
      if (obj) {
        const top = obj.offsetTop;
        setScrollTop(top);
      }
    },
    findOfflineCourseByIdFn() {
      // 获取公开课详情
      if (this.courseId) {
        findOfflineCourseById({ id: this.courseId }).then((res) => {
          if (res.data.code === '0000') {
            this.detailData = res.data.data;
          } else if (res.data.code !== '0002') {
            this.$message({
              message: '公开课详情获取失败，请稍后再试',
              type: 'warning',
            });
          }
        }).catch((err) => {
          console.log(err);
          this.$message({
            message: '公开课详情获取失败，请稍后再试',
            type: 'warning',
          });
        });
      }
    },
  },
};
</script>

<style scoped>
  .h5page{
    display: block;
    width: 100%;
    padding-bottom: 70px;
    position: relative;

  }
  .banner{
    display: block;
    width: 100%;
    max-height: 177px;
  }
  .nav{
    border-bottom: 1px solid #d4d4d4;
    height: 39px;
    line-height: 39px;
    margin-bottom: 10px;
  }
  .nav span{
    font-size: 13px;
    letter-spacing: 0;
    display: block;
    position: relative;
    height: 100%;
    width: 25%;
    box-sizing:border-box;
    box-sizing:border-box;
    border-bottom: 3px solid #fff;
    text-align: center;
    float: left;
  }
  .nav span.active{
    color: #FB683C;
    border-bottom: 3px solid #FB683C;
  }
  .contain-box{
    display: block;
    width: 100%;
    box-sizing:border-box;
    padding-left: 15px;
    font-size: 12px;
    color: #444444;
    letter-spacing: 0;
  }
  .teacher-box{
    padding-left: 75px;
    position: relative;
    min-height: 60px;
    line-height: 16px;
  }
  .teacher-box img{
    position: absolute;
    width: 60px;
    height: 60px;
    left: 0;
    top: 0;
  }
  .name{
    font-weight: bold;
    margin-bottom: 5px;
  }
  .title{
    display: block;
    width: 100%;
    position: relative;
    box-sizing:border-box;
    border-bottom: 1px solid #d4d4d4;
    padding-bottom: 10px;
    padding-left: 8px;
    margin: 15px 0 10px 0;
    font-size: 13px;
    font-weight: bold;
  }
  .title:before{
    content: "";
    position: absolute;
    width: 3px;
    height: 14px;
    left: 0;
    background: #FB683C;
    top: 2px;
    border-radius: 3px;
  }
  .btn-sub{
    display: block;
    width: 193px;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    text-align: center;
    font-size: 16px;
    position: fixed;
    bottom: 0;
    left: 50%;
    margin-left: -96px;
  }
  .item{
    width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
    padding-right: 15px;
  }
  .item img{
    width: 100%;
    height: auto;
  }
  .gray{
    background: #ccc;
  }
</style>
