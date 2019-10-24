<template>
  <div class="allclass common-allclass-index">

    <!-- 顶部导航 -->
    <basenav curindex="0" :list="navlist"></basenav>


    <div class="nav-box">
      <OnlineNav v-if="onlineNavList.length>0"
      ref="OnlineNav"
      @changeNav="changeNav"
      :listData="listData"
      :navlistData="onlineNavList"></OnlineNav>
    </div>
      <!-- 线上课 -->
      <div v-show="list.length<1 && isShowPage" class="emptybg">
      <div class="empty" >
        <span class="icon-empty"></span>
        <template v-if="allCount>0">
          <p>没有搜索到相关课程~ <br>
          <span class="active">换个条件试试吧！</span></p>
        </template>
        <template v-else>
          <p @click="routerReplace('/open-class')">暂无录播课程~ <br>
          <span class="active">先去学习一下公开课吧！</span></p>
        </template>
      </div>
      </div>
      <div v-if="list.length>0" class="view-wrapper">
        <cube-scroll
            ref="onlinescroll"
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
            <ClassCard @cardClick="cardClick"
            className="online-page"
            :item="item" page="list">
            </ClassCard>
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
  getCourseList,
  getCategoryList,
} from '@/api/apis';
import ClassCard from '@/views/components/card.vue';
import basenav from '@/views/components/nav.vue';
import OnlineNav from '@/views/allclass/onlinenav.vue';

export default {
  name: 'allclass',
  components: {
    ClassCard,
    OnlineNav,
    basenav,
  },
  data() {
    return {
      type: '2', // 1线上课 2线下公开课
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
        },
      ],
      list: [], // 课程列表  公开课 线上课共用
      pageNum: 1, // 页面
      pageSize: 15, // 每页条数
      total: 0, // 总条数
      isShowPage: false, // 是否展示页面
      offset: 200,
      onlineNavList: [], // 线上课导航
      params: { // 线上课筛选字段
        type: 1, // 课程类型 1：视频课 2：专题课
        payType: '', // 付费状态 0 免费 1付费 ''全部
        categoryId: '', // 分类id
        boolean: 0, // boolean == 1 那么查询最热  否则查询最新~~~~
        difficult: '', // 难度 初1 中2高3 ''全部
        learnType: '', // 类型全部'' 1 思维建立  2技能精进 3优秀实践
      },
      pullUpLoad: true,
      pullUpLoadThreshold: 100,
      pullUpLoadMoreTxt: '上拉加载',
      pullUpLoadNoMoreTxt: '没有更多了~',
      customPullDown: false,
      listData: [
        {
          text: '方向专业',
          value2: '',
          value1: '',
          active: false,
        }, {
          text: '价格',
          value: '',
          active: false,
        }, {
          text: '类型',
          value: '',
          active: false,
        }, {
          text: '最新', //
          value: 0,
          active: false,
        },
      ],
      isShowBackTop: false, // 返回顶部
      allCount: 0,
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
    // 首页跳转最新最热  更新数据
    this.params.boolean = parseInt(this.$route.query.hot, 10) || 0;
    if (this.params.boolean !== this.listData[3].value) {
      if (this.params.boolean === 0) {
        this.$set(this.listData, 3, {
          text: '最新', //
          value: 0,
          active: false,
        });
      } else {
        this.$set(this.listData, 3, {
          text: '最热', //
          value: 1,
          active: false,
        });
      }
      this.onPullingUp('init');
    } else {
      this.$nextTick(() => {
        /*eslint-disable*/
        this.$refs.onlinescroll && this.$refs.onlinescroll.refresh();
        /* eslint-enable */
      });
    }
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.pageNum = 1;
      this.total = 0;
      this.list = [];
      // this.$refs.cubelist.reset();
      this.params.categoryId = this.$route.query.nid || ''; // 方向专业id
      this.params.boolean = parseInt(this.$route.query.hot, 10) || 0; // 热度  0最新 1最热
      // 获取在线课程导航
      this.getCategoryListFn();
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
      this.$refs.onlinescroll.scrollTo(0, 0, 300, 'ease-in');
      this.isShowBackTop = false;
    },
    initListData(navlist) {
      let list = navlist || this.onlineNavList;
      // 初始化导航状态
      if (this.params.boolean === 1) {
        this.listData[3].text = '最热';
        this.listData[3].value = 1;
      }
      if (this.params.categoryId) {
        // 如果存在id  查询一级目录 二级目录
        list.forEach((item) => {
          if (item.id === parseInt(this.params.categoryId, 10)) {
            // 找到id
            this.listData[0].value1 = item.pid;
            this.listData[0].text = item.name;
            if (item.id === item.pid) {
              // 如果相等  是一级目录
              this.listData[0].value2 = '';
            } else {
              this.listData[0].value2 = item.id;
            }
          }
        });
      }
    },
    changeNav(navlist) {
      // 筛选数据
      this.params.boolean = navlist[3].value;
      this.params.payType = navlist[1].value;
      this.params.learnType = navlist[2].value;

      if (!navlist[0].value1) {
        // 全部类别
        this.params.categoryId = '';
      } else if (!navlist[0].value2) {
        this.params.categoryId = navlist[0].value1;
      } else {
        this.params.categoryId = navlist[0].value2;
      }
      this.onPullingUp('init');
    },
    onPullingUp(t) {
      // 公开课列表
      let opt = { isHideLoading: true };
      if (t === 'init') {
        this.pageNum = 1;
        this.list = [];
        this.isShowPage = false;
        opt = {};
        this.isShowBackTop = false;
      }
      if (this.list.length >= this.total && t !== 'init') {
        this.$refs.onlinescroll.forceUpdate();
        return;
      }
      let { pageNum } = this;
      let { pageSize } = this;
      // this.total = 0;
      getCourseList({
        pageNum,
        pageSize,
        ...this.params,
      }, opt).then((res) => {
        if (res.data.code === '0000') {
          this.isShowPage = true;
          this.pageNum += 1;
          if (res.data.list.length > 0) {
            /*eslint-disable*/
              res.data.list.forEach((item) => {
                item.pic = item.bannerUrl;
              });
             if(t==='init'){

              this.list = JSON.parse(JSON.stringify(res.data.list));
             }else{
              this.list = this.list.concat(res.data.list);
             }


            if (this.list.length >= res.data.total && t !== 'init') {
              this.$refs.onlinescroll.forceUpdate();
            }

            if (t === 'init') {
              // 初始化情况下  更新srcoll 滚动到顶部
              this.$refs.onlinescroll && this.$refs.onlinescroll.refresh();
            }
          } else {
            this.$refs.onlinescroll && this.$refs.onlinescroll.forceUpdate();
          }
           /* eslint-enable */
          this.total = res.data.total;
          this.allCount = res.data.allCount || 0;
        }
      }).catch((err) => {
        console.log(err);
        // this.$message('线上课列表获取失败，请稍后再试');
      });
    },
    getCategoryListFn() {
      // 获取线上课程导航列表
      this.onlineNavList = [];
      getCategoryList().then((res) => {
        if (res.data.code === '0000') {
          this.onlineNavList = res.data.list;
          this.initListData(res.data.list);
        }
      }).catch((err) => {
        console.log(err);
        // this.$message('获取线上课程导航列表失败,请稍后再试');
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
  top: 84px;
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
    top: 83px;
    bottom: 50px;
    width: 100%;

  }
  .list-box{
    display: block;
    position: relative;
    width: 100%;
    min-height: 100%;
  }
  .nav-box{
    height: 36px;
    display: block;
    width: 100%;
    position: relative;
    border-bottom: 1px solid #d4d4d4;
    background: #fff;
  }
</style>
