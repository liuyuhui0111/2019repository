<template>
  <div class="my-preson">
    <Title title="个人中心"></Title>
    <div class="study-list">
        <p class="nav">
        <span>最近在学</span>
        <span class="classNum">总看课数</span>
        </p>
        <div class="box">
        <ul v-if="commonCenterData &&
        commonCenterData.videoList.length>0"
        class="list-box">
            <li v-for="(item,index) in commonCenterData.videoList"
            :key="index">
            <div @click="routerGo(item)" class="img pointer">
            <baseImg
            :width="219"
            :height="130"
            :src="item.bannerUrl">
            </baseImg>
            </div>
                <router-link
                v-if="commonCenterData.videoList.length<2"
                tag="span"
                to="/online-class"
                class="icon-add">
                    去学习
                </router-link >
            </li>
        </ul>
        <div class="empty" v-else>
             <ul class="list-box">
                <li>
                    <router-link
                    tag="span"
                    to="/online-class"
                    class="icon-add">
                        去学习
                    </router-link >
                </li>
            </ul>
        </div>
        <div v-if="commonCenterData.classNum>=0"
        class="classNum">{{commonCenterData.classNum}}
        </div>
        </div>
    </div>

    <div v-if="commonCenterData && commonCenterData.tips=='0'" class="center-tips">
        <p>请注意！您购买的课程权益已退回，下次购买课程可直接消耗。 </p>
    </div>


    <div class="btns">
        <Title title="我的权益"></Title>
        <div v-if="commonCenterData.leaguerList.effective==0">
            <router-link tag="span" class="pointer"
             to="/interests">您的会员已到期，去续费</router-link>
        </div>
        <div
        v-if="commonCenterData &&
        commonCenterData.leaguerList &&
        commonCenterData.leaguerList.leaguerRightList &&
        commonCenterData.leaguerList.leaguerRightList.length>0"
        class="btn-list">
            <div
            class="item"
            v-for="(item,index) in commonCenterData.leaguerList.leaguerRightList"
            :class="{gray:commonCenterData.leaguerList.effective==0}"
            :key="index">
                <span class="icon">
                    <img :src="item.pictureUrl" :alt="item.name">
                </span>
                <span class="name ellipsis" :title="item.name">{{item.name}}</span>
                <span v-if="item.type==2" class="free">
                    {{item.value == -1 ? '全部免费' : '剩余'+item.value+'次'}}
                </span>
                <span v-if="item.type==1 && item.value == 0"
                class="free">尚未开通</span>

                <span v-if="item.type==3" class="free">
                    {{item.value == -1 ? '全部公开课' : '剩余'+item.value+'次'}}
                </span>
                <span v-if="item.type==4"
                class="free">全部公开课</span>

                <span v-if="item.type==6" class="free">
                    {{'可观看'+item.value+'门'}}
                </span>
                <span v-if="item.type==7"
                class="free">{{'剩余'+item.value+'次'}}</span>
                <!-- 2.本地财税公开课
                    设置次数：剩余X次；
                    全部：全部公开课
                    公开课  type 3 设置次数  4 全部
                    1.精品网络课程
                    设置门数：剩余X次’
                    指定课程：可观看X门；
                     录播课  6 指定课程  7 设置门数 -->
            </div >
        </div>
         <div v-else>
            <router-link tag="span" class="pointer"
             to="/interests">开通会员，尊享豪华特权，去看看</router-link>
        </div>
    </div>
  </div>
</template>
<script>
import mixin from './js/mixin';

export default {
  name: 'my-preson',
  mixins: [mixin],
  data() {
    return {
      name: 'my-preson',
      classNum: 0, // 总看课数
      btnList: [],
      studyList: [],
      isShowTips: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
    },
    navclick() {

    },
    routerGo(item) {
      if (item.isCanPlay) {
        this.$message({
          message: 'sorry！你访问的课程已下架',
          type: 'warning',
        });
        return;
      }
      this.$router.push({ path: '/online-detail', query: { cid: item.courseId } });
    },
  },
};
</script>
<style scoped>
.center-tips{
    display: block;
    width: 100%;
    background: #fffbe6;
    padding: 10px 20px;
    box-sizing:border-box;
}
.empty{
    /*padding-bottom: 20px;*/
}
.box,
.nav{
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    font-size: 14px;
    margin-bottom: 10px;
    padding-right:20px;
    overflow: hidden\0;
}
.classNum{
    width: 150px;
    text-align: center;
    float: right\0;
}
.box .classNum{
    line-height: 77px\0;
}
.box{
    padding: 20px 20px 0 20px;
    box-sizing:border-box;
    background: #F7F7F7;
border: 1px solid #D4D4D4;
}
.box .img{
    width: 130px;
    margin-right: 40px;
    float: left;
}
.box li {
    overflow: hidden;
    margin-bottom: 20px;
    float: left;
}
.icon-add{
    display: block;
    width: 131px;
    height: 78px;
    line-height: 78px;
    padding-left: 60px;
    box-sizing:border-box;
    background: url('./imgs/icon-add.png') no-repeat 20px 30px;
    background-color: #E6E6E6;
    float: left;
    cursor: pointer;
}
.btn-list{
    padding-left: 64px;
    text-align: center;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow: hidden\0;
}
.icon{
    display: block;
    width: 80px;
    height: 80px;
    background: #ccc;
    margin: 0 auto;
}
.btn-list .item{
    min-width: 25%;
    float: left\0;
    margin-bottom: 20px;
}
.btn-list .name{
    font-weight: bold;
    display: block;
    font-size: 16px;
    margin: 10px 0;
}
.list-box{
    overflow: hidden\0;
    width: 400px\0;
    float: left\0;
}
.gray{
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);

    filter: grayscale(100%);

    filter: gray;
}
</style>
