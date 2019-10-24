<template>
    <div class="card">

      <!-- 公开课程模块 -->
      <div v-if="type == 'offline'" class="offline">
        <div class="item"
          :class="{pointer:classData.id}"
          @click="classClick(classData)"
        >
        <!-- :src="classData.pic" -->
          <div class="img-box">
            <baseImg
            :width="219"
            :height="130"
            :src="getSmallUrl(classData.pic)"
            :alt="classData.title">
            </baseImg>

            <div class="card-mask"
              :class="{red:classData.state == 1}"
              v-if="classData.state == 1 || classData.state == 2">
              <span v-if="classData.state == 1">已截止</span>
              <span v-if="classData.state == 2">已结束</span>
            </div>
          </div>

            <p class="title ellipsis2"
            :style="titleStyle"
            :title="classData.title">{{classData.title}}</p>
        </div>
          <p class="teacher ellipsis">主讲师：
          <span :class="{pointer:classData.teacherId}"
          @click="teacherClick(classData)">{{classData.teacherName}}</span>
          {{classData.address + classData.city}}</p>
          <p class="time">上课时间：{{getClassTime(classData)}}</p>
          <div v-if="type != '1'" class="free-box">
            <span class="freeType1 fl">￥{{classData.price}}</span>
            <span class="person fr">
              {{classData.signUpManNum}}人已报名
            </span>
          </div>


      </div>

       <!-- 首页公开课程模块 -->
      <div v-if="type === '1'" class="offline">
        <div class="item"
          :class="{pointer:classData.id}"
          @click="classClick(classData)"
        >

             <div class="img-box">
            <baseImg
            :width="219"
            :height="130"
            :src="getSmallUrl(classData.courseOfflineEntity.pic)"
            :alt="classData.title">
            </baseImg>

            <div class="card-mask"
              :class="{red:classData.state == 1}"
              v-if="classData.state == 1 || classData.state == 2">
              <span v-if="classData.state == 1">已截止</span>
              <span v-if="classData.state == 2">已结束</span>
            </div>
          </div>
            <p class="title ellipsis2"
            :style="titleStyle"
            :title="classData.title">{{classData.courseOfflineEntity.title}}</p>
        </div>
          <p class="teacher ellipsis">主讲师：
          <span :class="{pointer:classData.teacherId}"
          @click="teacherClick(classData)">{{classData.teacherName}}</span>
          {{classData.courseOfflineEntity.address + classData.courseOfflineEntity.city}}</p>
          <p class="time">上课时间：{{getClassTime(classData.courseOfflineEntity)}}</p>
          <div v-if="type != '1'" class="free-box">
            <span class="freeType1 fl">￥{{classData.price}}</span>
            <span class="person fr">
              {{classData.signUpManNum}}人已学习
            </span>
          </div>
      </div>

      <!-- 在线课程模块 -->
      <div
        v-if="
          type === '2'
          ||
          type === '3'
          ||
          type === '4'
          ||
          type === 'online-list'"
          class="online">
        <div class="item"
          :class="{pointer:classData.id}"
          @click="classClick(classData)"
        >

            <baseImg
            :width="219"
            :height="130"
            :src="classData.bannerUrl"
            :alt="classData.title">
            </baseImg>
            <p class="title ellipsis2" :title="classData.title">{{classData.title}}</p>
        </div>
        <p class="onlinetips" v-if="type === 'online-list'">
              {{diflist[classData.difficult]}} |{{getTime()}} |
             {{classData.learnNum}}人已学
            </p>
          <div class="free-box">
            <span class="fl" :class="[
            {free:classData.price == 0},
            {freeType1:classData.price != 0},
            ]">￥{{classData.price == 0 ? '免费' : classData.price}}</span>
            <span v-if="type !== 'online-list'" class="person fr">
              {{classData.learnNum}}人已学习
            </span>
          </div>

      </div>

       <!-- 搜索结果课程模块 -->
      <div v-if="type === 'search'
      || type === 'search-online'
      || type === 'search-offline'" class="search-box">
        <!--  -->
        <div v-if="type === 'search-offline'"
        @click="classClick(classData)"
        class="item">

            <div class="img">
            <baseImg
            :width="219"
            :height="130"
            :src="getSmallUrl(classData.bannerUrl || classData.pic)"
            :alt="classData.title">
            </baseImg>

            </div>

            <div class="intro">
               <p class="title ellipsis2"
               :title="classData.title" v-html="searchValToHtml(classData.title,searchVal)"></p>
               <p class="time">上课时间：{{searchVal}}{{getClassTime(classData)}}</p>
               <p class="class-intro ellipsis2">
                上课地点 {{classData.address + classData.city}}
               </p>
               <p class="type"><span class="freeType1">￥{{classData.price}}</span></p>
             <!--   <p v-html="classData.introduce" class="class-intro ellipsis2">
               </p> -->
            </div>
        </div>
        <div v-if="type === 'search-online'"
        @click="classClick(classData)"
        class="item">
            <div class="img">
            <baseImg
            :width="219"
            :height="130"
            :src="classData.bannerUrl || classData.pic"
            :alt="classData.title">
            </baseImg>

            </div>
            <div class="intro">
               <p class="title ellipsis2"
               :title="classData.title"
               v-html="searchValToHtml(classData.title,searchVal)"></p>
               <p class="time">
                  {{getTime()}} |
                  {{classData.learnNum}}人已学 |
                  {{classData.price == 0 ? '免费' : classData.price}}
               </p>
               <p v-html="classData.courseIncome" class="class-intro ellipsis2">
               </p>
               <p class="type">来自分类:{{classData.type == '1' ? '视频课' : '专题课'}}</p>
            </div>
        </div>
        <!-- 右侧老师头像 名称 -->
        <div class="teacher-box">
          <div class="photo">
            <baseImg
              :width="1"
              :height="1"
              :src="classData.teacherAvatar||classData.headPic"
              :alt="classData.teacherName">
            </baseImg>
            </div>
          <span class="name">{{classData.teacherName}}</span>
        </div>
      </div>

       <!-- 搜索结果专题模块 -->
      <div v-if="type === 'search1'" class="search-box">
        <!--  -->
        <div @click="classClick(classData)" class="item">

            <div class="img">
            <baseImg
            :width="219"
            :height="130"
            :src="classData.bannerUrl"
            :alt="classData.title">
            </baseImg>

            </div>

            <div class="intro">
               <p class="title ellipsis2"
               :title="classData.title">{{classData.title}}</p>
               <p class="time">
                  {{classData.classNum}}门课程 |
                  <!-- {{getTime}}小时 -->
               </p>
               <p class="class-intro ellipsis2">
                 {{classData.intro}}
               </p>
               <p class="type">来自分类:{{classData.type}}</p>
            </div>
        </div>
        <!-- 右侧老师头像 名称 -->
        <div class="teacher-box">
          <p>{{classData.freeTxt}}</p>
          <span class="money">￥{{classData.price}}</span>
        </div>
      </div>


    </div>
</template>
<script>
import { formatDate } from '@/assets/utils/timefn';


export default {
  name: 'card',
  data() {
    return {
      name: '课程组件',
      time: '',
      defaultUrl: `${window.location.origin}/banner.png`,
      diflist: {
        1: '初级',
        2: '中级',
        3: '高级',
      },
    };
  },
  props: {
    type: { // 卡片类型，online录播课程/offline公开课程
      type: String,
      default: () => 'offline',
    },
    classData: { // 卡片数据
      type: Object,
      default: () => null,
    },
    titleStyle: {
      type: Object,
      default: () => null,
    },
    searchVal: {
      type: String,
      default: () => '',
    },

  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
    },
    getSmallUrl(str) {
      return `${str.substr(0, str.lastIndexOf('.'))}_0.5${str.substr(str.lastIndexOf('.'), str.length)}`;
    },
    getTime() {
      let list = this.classData.courseVideoEntity;
      let num = 0;
      list.forEach((item, index) => {
        if (!(index === 0 && item.isTry === 1)) {
          num += parseInt(item.videoMinute, 10);
        }
      });
      return `${num}分钟`;
    },
    getClassTime(item) {
      if (!(item.startTime && item.endTime)) {
        return '';
      }
      return `${formatDate(item.startTime)}-${formatDate(item.endTime)}`;
    },
    teacherClick(item) {
      this.$emit('teacherClick', item);
    },
    classClick(item) {
      this.$emit('classClick', item, this.type);
    },
  },

};
</script>
<style scoped>
.img-box{
  position: relative;
}
.card-mask{
  position: absolute;
  width: 100%;
  height: 130px;
  line-height: 130px;
  font-size: 16px;
color: #FFFFFF;
letter-spacing: 0;
top: 0;
    left: 0;
    text-align: center;
    background: rgba(0,0,0,0.6);
}
.card-mask.red{
color: #F91E1E;

}
.onlinetips{
  font-size: 14px;
color: #868686;
margin-bottom: 10px;
}
  .card{
    width: 100%;
    letter-spacing: 0;
  }
  .card .item{
    /*min-height: 160px\0;*/
  }

  .title{
    font-size: 16px;
    padding-top: 10px;
    margin-bottom: 10px;
  }
  .offline{
    width: 219px;
    font-size: 14px;
    color: #868686;
  }
  .offline .title{
    color: #FB683C;
    height: 50px;
  }
  .offline .time{
    padding: 10px 0;
  }
  .online{
    width: 219px;
    font-size: 14px;
    color: #444;
  }
  .online .title{
    height: 40px;
    line-height: 20px;
    font-size: 14px;
  }
  .free-box{
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
  }
  .free-box>.fl{
    float: left\0;
  }
  .free-box>.fr{
    float: right\0;
  }
  .free{
    color: #2DAF53;
  }
  .freeType1{
    color: #F91E1E;
  }

  /*搜索结果页面*/

  .search-box{
    width: 100%;
    box-sizing:border-box;
    position: relative;
    padding-right: 67px;
  }
  .teacher-box{
    position: absolute;
    width: 60px;
    right: 0;
    top: 0;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 100%;
  }
  .teacher-box .photo{
    display: block;
    width: 60px;
    height: 60px;
    border-radius: 100%;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .teacher-box .name{
    font-size: 14px;
  }

  .search-box .item{
    display: flex;
    align-items: flex-start;
    justify-content: space-start;
    cursor: pointer;
    overflow: hidden\0;
  }
  .search-box .item .img{
    width: 250px;
    float: left\0;
    margin-right: 20px\0;
  }
  .search-box .intro{
    padding: 0 20px;
    font-size: 14px;
    letter-spacing: 0;
    color: #444;
    width: 330px;
    overflow-x: hidden;
  }
  .search-box .title{
    padding: 0;
    font-size: 16px;
  }
  .search-box .type,
  .search-box .time{
    color: #868686;
    margin-bottom: 10px;
  }
  .search-box .class-intro{
    max-height: 40px;
    line-height: 20px;
    margin-bottom: 10px;
  }
  .money{
    line-height: 30px;
    font-size: 14px;
    color: #FB683C;
  }
</style>
