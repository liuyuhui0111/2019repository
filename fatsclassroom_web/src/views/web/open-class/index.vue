<template>
  <div class="open-class common-container-width">
    <div v-if="list.length<1 && isShowPage" class="empty">
      暂时还没有公开课哦~去看看<span
      class="pointer"
      @click="routerGo('/online-class')">录播课程</span>吧
    </div>
    <ul class="list-box" v-if="list.length>0">
        <li v-for="(item,index) in list"
        :class="{liEmpty:item==null}"
        :key="index">
          <Card
          v-if="item != null"
          @classClick="classClick"
          :type="cardType"
          :titleStyle="titleStyle"
          :classData="item"></Card>
        </li>
    </ul>

    <el-pagination
      v-if="total>list.length"
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :pager-count="pagerCount"
      prev-text="上一页"
      next-text="下一页"
      :page-size="pageSize"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import Card from '@/views/web/components/card/card.vue';
import { initList } from '@/assets/utils/util';
import {
  offlineCourseList,
} from '@/api/apis';

export default {
  name: 'open-class',
  data() {
    return {
      name: 'open-class',
      cardType: 'offline',
      titleStyle: {
        color: '#444',
        fontSize: '16px',
      },
      pageSize: 12, // 一页最多展示的条数
      pagerCount: 11, // 11页以上显示...
      total: 0,
      isShowPage: false,
      pageNum: 1,
      list: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 获取公开课列表
      this.offlineCourseListFn('init');
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.offlineCourseListFn();
    },

    offlineCourseListFn(type) {
      if (type === 'init') {
        this.pageNum = 1;
      }
      this.isShowPage = false;
      this.list = [];
      let { pageNum } = this;
      let { pageSize } = this;
      // 获取公开课列表
      offlineCourseList({ pageNum, pageSize }).then((res) => {
        if (res.data.list.length > 0) {
          this.list = res.data.list;
          this.list = initList(this.list, 4);
        }
        this.total = res.data.total;
        this.isShowPage = true;
      }).catch((err) => {
        console.log(err);
      });
    },
    routerGo(path) {
      this.$router.push({ path });
    },

    classClick(item) {
      this.$router.push({ path: '/detail', query: { cid: item.id } });
    },
  },
  components: {
    Card,
  },
};
</script>
<style scoped>
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
  .list-box{
    min-height: 500px;
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
</style>
