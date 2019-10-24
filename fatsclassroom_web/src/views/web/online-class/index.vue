<template>
  <div class="online-class common-container-width">

    <div class="contain">
    <!-- 顶部导航 -->
      <OnlineNav @changeNav="changeNav"
      v-if="onlineNavListData.length>0 && showNav"
      :id="navCurId"
      :list="onlineNavListData"></OnlineNav>

      <div class="nav-list">
      <div class="group">
        <div class="item"
        :class="{active:navlist.type===item.value}"
        @click="navlist.type = item.value"
        v-for="(item,index) in navlist.typelist"
        :key="index">
          {{item.name}}
        </div>

      </div>
      <div class="group">

        <div class="item"
        :class="{active:item.value==navlist.payType}"
        @click="navlist.payType = item.value"
        v-for="(item,index) in navlist.freelist"
        :key="index">
          <el-radio v-model="navlist.freeindex"

          @change="radioChange"
          :label="item.value">{{item.name}}</el-radio>
        </div>

        </div>
      <div class="group">
        <div class="item tips">难度:</div>
        <div class="item"
        :class="{active:item.value===navlist.difficult}"
        @click="navlist.difficult = item.value"
        v-for="(item,index) in navlist.diflist"
        :key="index">
          {{item.name}}
        </div>
      </div>
      <div class="group">
         <div class="item mr0"
        :class="{active:item.value===navlist.boolean}"
        @click="navlist.boolean = item.value"
        v-for="(item,index) in navlist.hotlist"
        :key="index">
          {{item.name}}
        </div>
      </div>

      </div>
      <div v-if="list.length<1 && isShowPage" class="empty">
      <template v-if="allCount<=0">
         暂时还没有录播课程哦~去看看
        <span
        class="pointer"
        @click="routerGo('/open-class')">公开课</span>吧
      </template>
      <template v-else>
        当前查询条件暂无相关课程，换个条件试试吧！
      </template>

    </div>
      <div class="box">
      <ul v-if="list.length>0" class="list-box">
          <li v-for="(item,index) in list"
          :class="{liEmpty:item==null}"
          :key="index">
            <Card
            v-if="item"
            @classClick="classClick"
            :type="cardType"
            :titleStyle="titleStyle"
            :classData="item"></Card>
          </li>
      </ul>
    </div>
    <template v-show="list.length>0">
      <el-pagination
        v-if="total>list.length && isShowPagation"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :pager-count="pagerCount"
        prev-text="上一页"
        next-text="下一页"
        :page-size="pageSize"
        :total="total">
      </el-pagination>
      </template>
    </div>
  </div>
</template>
<script>
import Card from '@/views/web/components/card/card.vue';
import OnlineNav from '@/views/web/online-class/online-nav.vue';
import { initList } from '@/assets/utils/util';
import {
  getCourseList,
} from '@/api/apis';

export default {
  name: 'online-class',
  data() {
    return {
      name: 'online-class',
      cardType: 'online-list',
      navCurId: -1, // 当前选中的id
      isShowPage: false,
      isShowPagation: false,
      titleStyle: {
        color: '#444',
        fontSize: '16px',
      },
      pageSize: 12, // 一页最多展示的条数
      pagerCount: 11, // 11页以上显示...
      total: 0,
      navlist: {
        type: 1,
        typelist: [
          {
            name: '视频课',
            value: 1,
          },
          // {
          //     name: '专题课',
          //     value: 2,
          // },
        ],
        payType: '',
        freeindex: '',
        freelist: [
          {
            name: '全部课程',
            value: '',
          },
          {
            name: '只看免费',
            value: 0,
          },
        ],
        difficult: '',
        diflist: [
          {
            name: '全部',
            value: '',
          },
          {
            name: '初级',
            value: 1,
          },
          {
            name: '中级',
            value: 2,
          },
          {
            name: '高级',
            value: 3,
          },
        ],
        boolean: 0,
        hotlist: [
          {
            name: '最新',
            value: 0,
          },
          {
            name: '最热',
            value: 1,
          },
        ],
      },
      list: [],
      allCount: 0,
      showNav: false,
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    navlist: {
      handler() {
        this.getCourseListFn('init');
      },
      deep: true,
    },
    $route() {
      this.init();
    },
  },
  methods: {
    init() {
      // this.list = initList(this.list, 4);
      this.navCurId = parseInt(this.$route.query.nid, 10) || -1;
      this.showNav = true;

      this.navlist.boolean = this.$route.query.boolean || 0;
      // 获取录播课程列表
      this.getCourseListFn('init');
    },
    changeNav(nav) {
      console.log(nav);
      if (nav[2].id !== -1) {
        this.navCurId = nav[2].id;
      } else if (nav[1].id !== -1) {
        this.navCurId = nav[1].id;
      } else if (nav[0].id !== -1) {
        this.navCurId = nav[0].id;
      } else {
        this.navCurId = -1;
      }
      this.getCourseListFn('init');
    },

    handleCurrentChange(val) {
      this.pageNum = val;
      this.getCourseListFn();
    },
    getCourseListFn(t) {
      if (t === 'init') {
        this.pageNum = 1;
        this.isShowPagation = false;
      }
      let { pageNum } = this;
      let { pageSize } = this;
      let { type } = this.navlist;
      let { boolean } = this.navlist;
      let { payType } = this.navlist;
      let { difficult } = this.navlist;
      // this.total = 0;
      this.isShowPage = false;
      this.list = [];
      // 获取录播课
      getCourseList({
        pageNum,
        pageSize,
        payType,
        boolean,
        difficult,
        type,
        categoryId: this.navCurId === -1 ? '' : this.navCurId,
      }).then((res) => {
        if (res.data.code === '0000') {
          this.isShowPage = true;
          this.isShowPagation = true;
          if (res.data.list.length > 0) {
            this.list = res.data.list;
            this.list = initList(this.list, 4);
            console.log(this.list);
          } else {
            this.list = [];
          }
          this.total = res.data.total;
          if (this.allCount <= 0) {
            this.allCount = this.total;
          }
        }
      }).catch((err) => {
        console.log(err);
        this.$message({
          message: '录播课列表获取失败，请稍后再试',
          type: 'warning',
        });
      });
    },
    radioChange(val) {
      this.navlist.freeindex = val;
    },
    routerGo(path) {
      this.$router.push({ path });
    },
    classClick(item) {
      this.$router.push({ path: '/online-detail', query: { cid: item.id } });
    },
  },
  components: {
    Card,
    OnlineNav,
  },
};
</script>
<style scoped>
  .active{
    color: #FB683C;
  }
  .tips{
    color: #868686;
  }
  .liEmpty{
    display: block;
    height: 1px;
    width: 218px;
  }
  .empty{
    padding: 300px 0;
    text-align: center;
    font-size: 18px;
    color: #868686;
    letter-spacing: 0;
    line-height: 25px;
  }
  .empty span{
    color: #FB683C;
  }
  .box{
    min-height: 500px;
  }
  .list-box{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    overflow: hidden;

    width: 100%\0;
  }
  .list-box li{
    float: left\0;
    width: 219px\0;
    float: left\0;
    margin-right: 34px\0;
    min-height: 266px\0;
    display: block;
    margin-bottom: 30px;
    flex-grow:0;
  }
  .list-box li:nth-child(4n){
    margin-right: 0\0;
  }

  .nav-list{
    width: 100%;
    min-height: 54px;
    font-size: 16px;
    color: #444444;
    letter-spacing: 0;
    background: #F7F7F7;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 40px;
    box-sizing:border-box;
    margin: 30px 0 30px 0;
    overflow: hidden\0;
    margin-top: 20px\0;
    line-height: 54px\0;
  }
  .nav-list .group{
    text-align: center;
    float: left\0;
  }
  .nav-list .group .item{
    display: inline-block;
    margin-right: 40px;
    cursor: pointer;
  }
  .nav-list .group .item.tips{
    margin-right: 40px;
  }

  .nav-list .group .mr0:nth-last-child(1){
    margin-right: 0;
  }


</style>
