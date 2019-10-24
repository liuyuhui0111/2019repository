<template>
  <div class="my-preson">
    <Title title="我的课程"
    @navclick="navclick"
    :list="list"></Title>
    <div class="study-box">
      <template v-if="curList=='0'">
        <!-- 最近在学 -->
        <!-- 已学完 未学完 -->
        <div class="nav-box">
          <span v-for="(item,index) in navlist"
          :class="{active:queryClassListParam.isComplete === item.value}"
          @click="navBoxChange(item,index)"
          :key="index">
          {{item.text}}
          </span >
        </div>

        <ul v-if="queryClassListList.length>0" class="contain-box">
            <li v-for="(item,index) in queryClassListList"
            :key="index">
              <div class="img-box">
              <div class="img">
                <baseImg
                :width="219"
                :height="130"
                :src="item.bannerUrl"
                :alt="item.title">
                </baseImg>
              </div>
                <div class="item">
                  <p class="title">
                    {{item.title}}
                  </p>
                  <p class="type">
                    <span>{{item.categoryName}}</span>
                    <span class="num">{{item.learnNum}}人在学</span>
                  </p>
                  <el-progress
                  :status="item.progress == 100?'success':null"
                  :percentage="item.progress"></el-progress>
                </div>
              </div>
              <div class="btn-box">
                <span @click="delFn(item)" class="btn-del"></span>
                <span @click="goStudy(item)"
                class="btn-sub">继续学习</span>
              </div>
            </li >
        </ul>

        <div class="empty"
        v-if="isShowPage && queryClassListList.length<1">
          暂无{{emptyTipText}}课程
        </div>
        <el-pagination
        v-if="total>queryClassListParam.pageSize"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :pager-count="pagerCount"
        prev-text="上一页"
        next-text="下一页"
        :page-size="queryClassListParam.pageSize"
        :total="total">
      </el-pagination>
      </template>
    </div>
    <template v-if="curList=='1'">
      <!-- 专题课 -->
      <div class="empty"
      v-if="isShowPage && masterList.length<1">
        暂无专题课课程
      </div>
    </template>
  </div>
</template>
<script>
import mixin from './js/mixin';
import { queryClassList, removeClass } from '@/api/apis';

export default {
  name: 'my-preson',
  mixins: [mixin],
  data() {
    return {
      name: 'my-preson',
      emptyTipText: '',
      curList: 0,
      total: 0,
      list: [
        {
          text: '最近在学',
          value: '0',
        },
        // {
        //     text: '专题课',
        //     value: '1',
        // },
      ],
      queryClassListParam: {
        isComplete: '',
        pageNum: 1,
        pageSize: 5,
      },
      navlist: [
        {
          text: '全部',
          value: '',
        },
        {
          text: '进行中',
          value: '0',
        },
        {
          text: '已学完',
          value: '1',
        },
      ],
      masterList: [],
      queryClassListList: [],
      isShowPage: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.queryClassListFn('init');
    },
    goStudy(item) {
      // 继续学习
      this.$router.push({
        path: '/online-detail',
        query: {
          cid: item.id,
          sec: item.duration,
        },
      });
    },
    delFn(item) {
      removeClass({ courseId: item.id }).then((res) => {
        if (res.data.code === '0000') {
          this.$message({
            message: '删除成功',
            type: 'success',
          });
          this.queryClassListFn('init');
        }
      }).catch((err) => {
        this.$message({
          message: '删除失败，请稍后再试',
          type: 'warning',
        });
        console.log(err);
      });
    },
    navclick(item, index) {
      console.log(item);
      this.curList = index;
    },
    navBoxChange(item) {
      this.emptyTipText = item.text === '全部' ? '' : item.text;
      this.queryClassListParam.isComplete = item.value;
      this.isShowPage = false;
      this.queryClassListFn();
    },
    handleCurrentChange(val) {
      this.queryClassListParam.pageNum = val;
      this.queryClassListFn();
    },
    queryClassListFn(t) {
      // 个人中心我的报名
      if (t === 'init') {
        this.queryClassListParam.pageNum = 1;
      }
      this.queryClassListList = [];
      queryClassList(this.queryClassListParam).then((res) => {
        this.isShowPage = true;
        if (res.data.code === '0000') {
          /*eslint-disable*/ 
                  res.data.list.forEach((item)=>{
                    if(this.queryClassListParam.isComplete == '1'){
                      item.progress = 100;
                    }else if(isNaN(parseInt(item.proportion))){
                      item.progress = 0;
                    }else{
                      item.progress = parseInt(item.proportion) <= 100
                      ?parseInt(item.proportion):100;
                    }
                    
                  })
                  /* eslint-enable */
          this.queryClassListList = res.data.list;
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
  .nav-box{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden\0;
  }
  .nav-box span{
    padding: 20px 0;
    font-size: 16px;
    color: #444444;
    letter-spacing: 0;
    margin-right: 40px;
    cursor: pointer;
    float: left\0;
  }
  .active,
  .nav-box span.active{
    color: #FB683C;
  }
  .title{
    font-size: 16px;
    color: #444444;
    letter-spacing: 0;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .type{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 20px;
    overflow: hidden\0;
  }
  .type span{
    float: left\0;
  }
  .type span.num{
    float: right\0;
  }

  .img-box,
  .contain-box li{
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden\0;
    width: 100%\0;
  }
  .btn-box{
    width: 148px;
    float: right\0;
  }
  .btn-box .btn-sub{
    margin: 0 0 0 40px;
  }
  .contain-box li{
    margin-bottom: 30px;
  }
  .img-box{
    justify-content: flex-start;
    width: 600px;
    color: #444;
    float: left\0;
  }
  .num{
    color: #868686;
    margin-right: 50px;
  }
  .img-box .img{
    width: 210px;
    margin-right: 20px;
    float: left\0;
  }
  .img-box .item{
    width:340px;
    float: left\0;
  }
  .btn-del{
    display: block;
    width: 30px;
    height: 30px;
    background: url('./imgs/btn-del.png') no-repeat center center;
    float: left;
    cursor: pointer;
  }
</style>
