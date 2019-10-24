<template>
  <div class="open-class common-container-width">
    <!-- 站内搜索框 -->
    <div class="search-inweb">
        <input v-model="searchVal" type="text">
        <span @click="getSearchListFn('init')" class="btn-search-sub">站内搜索</span>
    </div>

    <!-- 专题 课程tab -->
    <div class="tab-box">
        <span v-for="(item,index) in tablist"
        @click="changeTab(index)"
        :class="{active:index == tabindex}"
        :key="index">
            {{item.text}} ( {{getSearchListData[item.type].total}} )
        </span>
    </div>

    <!-- 搜索结果 -->
    <div class="contain-box">
      <!-- 结果展示 -->
      <div class="contain">
          <div v-if="getSearchListData[searchResultType].list.length<1 && isShowPage" class="empty">
            天了噜，0个“{{searchVal}}”相关的结果。
          </div>
          <div v-show="searchResultType == 'online'" class="search-list-box">
              <ul v-if="getSearchListData.online.list.length>0 &&
              searchResultType == 'online'"
              class="list-box">
                <li v-for="(item,index) in getSearchListData.online.list"
                :key="index">
                  <Card v-if="item != null" :type="cardType"
                  @classClick="classClick"
                  :searchVal="searchVal"
                  :titleStyle="titleStyle"
                  :classData="item"></Card>
                </li>
              </ul>
          </div>
          <div v-show="searchResultType == 'offline'" class="search-list-box">
              <ul v-if="getSearchListData.offline.list.length>0 &&
              searchResultType == 'offline'"
              class="list-box">
                <li v-for="(item,index) in getSearchListData.offline.list"
                :key="index">
                  <Card v-if="item != null" :type="cardType"
                  @classClick="classClick"
                  :searchVal="searchVal"
                  :titleStyle="titleStyle"
                  :classData="item"></Card>
                </li>
              </ul>
          </div>
        <el-pagination
          v-if="getSearchListData[searchResultType].list.length>0
          && getSearchListData[searchResultType].total>pageSize"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :pager-count="pagerCount"
          prev-text="上一页"
          next-text="下一页"
          :page-size="pageSize"
          :total="getSearchListData[searchResultType].total">
        </el-pagination>

        <!-- 新课程推荐 -->
          <div v-if="newlist.length>0" class="new-list-box">
            <p class="title">最新课程推荐</p>
              <ul class="list-box">
                <li v-for="(item,index) in newlist"
                :key="index">
                  <Card v-if="item != null" type="search-online"
                  @classClick="routerGoOnline"
                  :titleStyle="titleStyle"
                  :classData="item"></Card>
                </li>
              </ul>
          </div>
      </div>
    <!-- 右侧热门搜索 -->
      <div class="aside">
      <!-- 热门词 -->
        <div class="hot-word">
          <p class="title">热门搜索词</p>
          <span v-for="(item,index) in hotWordList"
          @click="routerGo(item.word,1)"
          :key="index">{{item.word}}</span>
        </div>
        <!-- 热门搜索 -->
        <div class="hot-search">
          <p class="title">热门搜索</p>
          <ul class="hot-search-list">
            <li v-for="(item,index) in hotSearchList"
            @click="routerGo(item)"
            :key="index">
              <span class="rank">{{index+1}}</span>
              <p>{{item.title}}</p>
            </li>
          </ul>
        </div>
      </div>

    </div>


  </div>
</template>
<script>
import Card from '@/views/web/components/card/card.vue';
import {
  getSearchList,
  getHighWordList,
  getCourseList,
  getHighTitleList,
} from '@/api/apis';

export default {
  name: 'open-class',
  data() {
    return {
      name: 'open-class',
      cardType: 'search-online',
      searchVal: '',
      getCourseListPageSize: 10,
      getCourseListPageNum: 1,
      pageNum: 1,
      pageSize: 10,
      pagerCount: 11,
      titleStyle: {
        color: '#444',
        fontSize: '16px',
      },
      tabindex: 0, // 当前选中tab index
      tablist: [ // tab列表
        { text: '录播课', value: 0, type: 'online' },
        { text: '公开课', value: 1, type: 'offline' },
      ],
      hotWordList: [],
      hotSearchList: [],
      getSearchListList: [], // 搜索结果列表
      getSearchListListByOpen: [], // 公开课列表

      newlist: [], // 最新课程推荐,
      isShowPage: false,
      getSearchListData: {
        online: {
          total: 0,
          list: [],
        },
        offline: {
          total: 0,
          list: [],
        },
      },
      searchResultType: 'online',
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.searchVal = this.$route.query.val;
      this.init();
    },
  },
  methods: {
    init() {
      this.searchVal = this.$route.query.val;
      this.tabindex = this.$route.query.tab || 0;
      this.changeTab(this.tabindex);
      // 搜索结果
      this.getSearchListFn('init');
      // 获取热门搜索词
      this.getHighWordListFn();
      // 获取热门文章
      this.getHighTitleListFn();
      // 查询最新课程列表
      this.getCourseListFn();
      // 初始化热门搜索排名
      // this.initHotSearchList();
    },
    routerGo(item, type) {
      if (type === 1) {
        this.$router.push({ path: '/search', query: { val: item } });
      } else if (item.type === 1) {
        // 录播课程
        this.$router.push({
          path: '/online-detail',
          query: {
            cid: item.id,
            fromRoute: 'search0',
          },
        });
      } else {
        // 公开课程
        this.$router.push({
          path: '/detail',
          query: {
            cid: item.id,
            fromRoute: 'search0',
          },
        });
      }
    },
    classClick(item) {
      console.log(item);
      this.ysxy_searchResultClick({
        keyWord: this.searchVal,
        contentId: item.id,
        contentTitle: item.title,
      });
      if (this.tabindex === 1) {
        // 公开课
        this.$router.push({ path: '/detail', query: { cid: item.id } });
      } else {
        // 录播课
        this.$router.push({ path: '/online-detail', query: { cid: item.id } });
      }
    },
    routerGoOnline(item) {
      // 在线课程推荐
      this.$router.push({
        path: '/online-detail',
        query: {
          cid: item.id,
          fromRoute: 'search1',
        },
      });
    },
    getCourseListFn() {
      // 查询最新课程列表
      let pageNum = this.getCourseListPageNum;
      let pageSize = this.getCourseListPageSize;
      let params = {
        boolean: 2,
        pageNum,
        pageSize,
      };
      getCourseList(params).then((res) => {
        if (res.status === 200) {
          this.newlist = res.data.list;
        }
        console.log('=======================', res.data.list);
      }).catch((err) => {
        console.log(err);
      });
    },
    getHighTitleListFn() {
      // 获取热门文章
      getHighTitleList().then((res) => {
        if (res.data.code === '0000') {
          this.hotSearchList = res.data.list;
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    getHighWordListFn() {
      // 获取热门搜索词
      getHighWordList().then((res) => {
        if (res.data.code === '0000') {
          this.hotWordList = res.data.list;
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getSearchListFn();
    },
    getSearchListFn(t) {
      // 搜索
      if (t === 'init') {
        this.pageNum = 1;
      }
      let { pageNum } = this;
      let title = this.searchVal;
      let { pageSize } = this;
      if (!title) {
        return;
      }
      getSearchList({ title, pageNum, pageSize }).then((res) => {
        let hasResult = false;
        if (res.data.code === '0000') {
          this.$set(this.getSearchListData, 'online', res.data.online);
          this.$set(this.getSearchListData, 'offline', res.data.offLine);
          this.isShowPage = true;
          if (res.data.online.list.length > 0 || res.data.offLine.list.length > 0) {
            hasResult = true;
          }
        }

        // 搜索结果埋点
        this.ysxy_sendSearchRequest({
          keyWord: this.searchVal,
          hasResult,
        });
      }).catch((err) => {
        // 搜索结果埋点
        this.ysxy_sendSearchRequest({
          keyWord: this.searchVal,
          hasResult: false,
        });
        console.log(err);
      });
    },
    changeTab(index) {
      this.tabindex = index;
      this.searchResultType = this.tablist[index].type;
      this.cardType = `search-${this.searchResultType}`;
    },
    initHotSearchList() {
      let list = this.hotSearchList;
      this.hotSearchList = list.sort((a, b) => (a.rank < b.rank ? -1 : 1));
    },

  },
  components: {
    Card,
  },
};
</script>
<style scoped>
  .empty{
    color: #868686;
    padding-bottom: 60px;
    font-size: 16px;
  }
  .empty span{
    color: #FB683C;
  }
  .list-box{
  }
  .list-box li{
    display: block;
    margin-bottom: 30px;
  }
  /*站内搜索*/
  .search-inweb{
    width: 680px;
    height: 42px;
    line-height: 42px;
    position: relative;
    box-sizing:border-box;
    margin: 40px auto;
    padding-right: 100px;
  }
  .search-inweb input{
    display: block;
    width: 100%;
    height: 100%;
    line-height: 42px;
    border: 1px solid #D4D4D4;
    padding-left: 20px;
    box-sizing:border-box;
    border-right: none;
    outline: none;
    font-size: 16px;
    color: #444;
  }

  .search-inweb .btn-search-sub{
    position: absolute;
    right: 0;
    width: 100px;
    height: 100%;
    background: #FB683C;
    font-size: 16px;
    color: #FFFFFF;
    right: 0;
    top: 0;
    text-align: center;
    cursor: pointer;
  }


  /*专题课程tab*/
  .tab-box{
    display: block;
    height: 54px;
    line-height: 54px;
    background: #F7F7F7;
    font-size: 0;
    margin-bottom: 20px;
    text-align: left;
  }
  .tab-box span{
    display: inline-block;
    font-size: 16px;
    color: #444444;
    letter-spacing: 0;
    margin-left: 40px;
    cursor: pointer;
  }
  .tab-box span.active{
    color: #FB683C;
  }
  .contain-box{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    overflow: hidden\0;
  }
  /*右侧热门搜索*/
  .aside{
    width: 255px;
    margin-left: 30px;
    font-size: 14px;
    color: #444444;
    letter-spacing: 0;
    flex-shrink: 0;
    float: right\0;
  }
  .title,
  .aside .title{
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: bold;
  }
 .contain{
    max-width: 710px;
    width: 100%;
    flex-shrink:1;
    float: left\0;
  }
  .hot-word{
    font-size: 0;
    text-align: left;
  }
  .hot-word span{
    display: inline-block;
    font-size: 14px;
    color: #FB683C;
    padding-right: 60px;
    padding-bottom: 20px;
    cursor: pointer;
  }
  .hot-word span:nth-child(2n+1){
    margin-right: 0;
  }
  .hot-search-list li {
    display: block;
    position: relative;
    padding-left: 30px;
    margin-bottom: 20px;
    line-height: 20px;
    cursor: pointer;
  }
  .hot-search-list li .rank{
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    color: #Fff;
    background: #8EB9F5;
    left: 0;
    top: 0;
  }
  .hot-search-list li:nth-child(1) .rank{
    background: #F54545;
  }
  .hot-search-list li:nth-child(2) .rank{
    background: #FF8547;
  }
  .hot-search-list li:nth-child(3) .rank{
    background: #FFAC38;
  }
</style>
