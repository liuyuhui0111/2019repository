<template>
  <div class="my-mycol">
    <Title title="我的收藏"
    @navclick="navclick"
    :list="list"></Title>

  <div v-if="queryMycollectionListList.length>0"
  class="collist-box">
    <div class="item"
    @click="routerGo(item)"
    v-for="(item,index) in queryMycollectionListList"
    :key="index">
        <baseImg
        :width="219"
        :height="130"
        :src="item.pic || item.bannerUrl"
        :alt="item.title">
        </baseImg>
      <!-- <img :src="item.pic || item.bannerUrl" :alt="item.title"> -->
      <p class="title">{{item.title}}</p>
      <p class="teacher">
        <span class="name">{{item.teacherName}}</span>
        <span class="num"
        v-if="queryMycollectionListParam.onOffType === '1'"
        >{{item.learnNum}}人已学</span>
        <span class="num" v-else>{{item.learnNum}}人报名</span>
      </p>
    </div >
  </div>
  <div v-if="queryMycollectionListList.length<1 && isShowPage"
  class="collist-box">
    <div class="empty">
      还没有收藏过 {{list[queryMycollectionListParam.onOffType].text}}
    </div>
  </div>

  <el-pagination
    v-if="total>queryMycollectionListParam.pageSize"
    @current-change="handleCurrentChange"
    layout="prev, pager, next"
    :pager-count="pagerCount"
    prev-text="上一页"
    next-text="下一页"
    :page-size="queryMycollectionListParam.pageSize"
    :total="total">
  </el-pagination>


  </div>
</template>
<script>
import mixin from './js/mixin';
import { queryMycollectionList } from '@/api/apis';

export default {
  name: 'my-mycol',
  mixins: [mixin],
  data() {
    return {
      name: 'my-mycol',
      isShowPage: false,
      pagerCount: 11,

      list: [
        {
          text: '公开课',
          value: '0',
        },
        {
          text: '录播课',
          value: '1',
        },
      ],
      queryMycollectionListList: [],
      total: 0,
      queryMycollectionListParam: {
        pageSize: 12,
        pageNum: 1,
        onOffType: '0', // 线上线下标识0 : 公开课； 1 录播课
        type: '1', // 录播课必填：课程类型 1 精品课 2专题课
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.queryMycollectionListFn('init');
    },
    routerGo(item) {
      if (this.queryMycollectionListParam.onOffType === '0') {
        // 公开课
        // this.$router.push({ path: '/detail', query: { cid: item.courseId } });
        this.openBlank('/detail', { cid: item.courseId });
      } else {
        // 录播课
        // this.$router.push({ path: '/online-detail', query: { cid: item.courseId } });
        this.openBlank('/online-detail', { cid: item.courseId });
      }
    },
    navclick(item) {
      this.isShowPage = false;
      this.queryMycollectionListParam.onOffType = item.value;
      this.queryMycollectionListFn('init');
    },
    handleCurrentChange(val) {
      this.queryMycollectionListParam.pageNum = val;
      this.queryMycollectionListFn();
    },
    queryMycollectionListFn(t) {
      if (t === 'init') {
        this.queryMycollectionListParam.pageNum = 1;
      }
      this.queryMycollectionListList = [];
      queryMycollectionList(this.queryMycollectionListParam).then((res) => {
        this.isShowPage = true;
        if (res.data.code === '0000') {
          console.log(res);
          this.queryMycollectionListList = res.data.list;
          this.total = res.data.total;
        }
      }).catch((err) => {
        this.isShowPage = true;
        this.$message({
          message: '获取报名列表失败，请稍后再试',
          type: 'warning',
        });
        console.log(err);
      });
    },
  },
};
</script>
<style scoped>
.empty{
  display: block;
    width: 100%;
    text-align: center;
    font-size: 18px;
    height: 100%;
    line-height: 400px;
}
  .collist-box{
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;
    font-size: 16px;
    color: #444444;
    letter-spacing: 0;
    padding-top: 20px;
    overflow: hidden\0;
    flex-wrap: wrap;
    width: 786px;

  }
  .title{
    font-weight: bold;
  }
  .collist-box .item{
    width: 219px;
    margin-bottom: 20px;
    margin-right: 43px;
    cursor: pointer;
    float: left\0;
    box-sizing:border-box;
  }
  .collist-box .item .title{
    margin-top: 10px;
  }

  .collist-box .teacher{
    font-size: 14px;
color: #868686;
display: flex;
justify-content: space-between;
align-items: center;
margin: 10px 0;
overflow: hidden\0;
  }
  .num{
    float: right\0;
  }
  .name{
    float: left\0;
  }
</style>
