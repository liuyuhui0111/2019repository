<template>
  <div class="ask">
    <div class="head">
      <ul>
        <li>
          <span class="headImg">
            <img src="./../../assets/icon/img10.png" alt />
          </span>
          <img class="headIcon headIconFirst" src="./../../assets/icon/img18.png" alt />
          <span class="titleName">总咨询数</span>
          <h1>{{consultingNum}}</h1>
        </li>
        <li>
          <span class="headImg">
            <img src="./../../assets/icon/img11.png" alt />
          </span>
          <img class="headIcon" src="./../../assets/icon/img17.png" alt />
          <span class="titleName">综合评分</span>
          <h1>{{score}}</h1>
        </li>
        <li>
          <span class="headImg">
            <img src="./../../assets/icon/img12.png" alt />
          </span>
          <img class="headIcon" src="./../../assets/icon/img2.png" alt />
          <span class="titleName">登录总时长（小时）</span>
          <h1>{{totalTime}}</h1>
        </li>
      </ul>
    </div>
    <div class="content">
      <el-checkbox
                  v-if="expertType*1 === 2"
                  v-model="turnOrdered"
                  class="turnOrder"
                  @change="turnOrderChange">
                  已转单
      </el-checkbox>
      <el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
        <!-- eslint-disable -->
        <el-tab-pane :label="'咨询中（' + askingCount + '）' " name="first">
          <BasicTable 
                    :treeType="treeType" 
                    :tableOptions="tableOptions" 
                    :tableData="askingData"
                    :fatherDetail="fatherDetail">
          </BasicTable>
        </el-tab-pane>
        <el-tab-pane :label="'已结束（'+ completeCount +'）'" name="second">
          <BasicTable 
                    :treeType="treeType" 
                    :tableOptions="tableOptions" 
                    :tableData="askingData"
                    :fatherDetail="fatherDetail">
          </BasicTable>
        </el-tab-pane>
        <!-- eslint-enable -->
      </el-tabs>
    </div>
    <!-- 底部分页区域 -->
      <!-- v-if="total>=10" -->
      <div class="footTool"
        >
        <div class="pagination">
          <el-pagination
            background
            small
            @size-change="handleSizeChange"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-sizes="[10, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
      <!-- style="width:50%;height:50%;position: relative;" -->
      <div v-if="detailsToView" >
        <Meslog :mesid="mesid" @back="watchBack"></Meslog>
      </div>

  </div>
</template>
<script>
import './public.scss';
import basicTable from '@/components/table/basic-table.vue';
import meslog from '@/components/meslog.vue';
import date from '@/utils/date';
import { getIMList, getHeadInfo } from '@/api/askingMange/index';

export default {
  components: {
    BasicTable: basicTable,
    Meslog: meslog,
  },
  data() {
    return {
      title: '',
      consultingNum: '',
      score: '',
      totalTime: '',
      expertType: '', // 专家类型
      askingType: '1', // 咨询表格类型
      askingCount: 0,
      completeCount: 0,
      treeType: {
        type: 'operate',
        detail: {
          buttonTxt: '查看咨询记录',
        },
      },
      askingDataAll: [], // 全部咨询中数据
      askingData: [], // 未转单咨询中数据
      completeDataAll: [], // 全部已结束资询数据
      completeData: [], // 未转单--已结束咨询数据
      tableOptions: [
        {
          label: '咨询单ID',
          prop: 'code',
        },
        {
          label: '提问者',
          prop: 'account',
        },
        {
          label: '咨询开始时间',
          prop: 'beginTime',
        },
        {
          label: '问题描述',
          prop: 'questionDesc',
        },
      ],
      activeName: 'first', // tabs切换
      pageSize: 10,
      currentPage: 1,
      total: 0,
      turnOrdered: false, // 是否转单
      mesid: '', // 当前资询单 id
      detailsToView: false, // 资询记录隐藏
      userInfo: null,
    };
  },
  mounted() {
    this.expertType = this.curUserData.type || 0;
    this.titleInit();
    this.initAsking();
    // this.initComplete();
  },
  methods: {
    // 获取页面头部统计数据
    async titleInit() {
      this.consultingNum = 0;
      this.score = 0;
      this.totalTime = 0;
      let params = {
        id: this.curUserData.id || '',
        account: this.curUserData.account || '',
      };
      let res = await getHeadInfo(params);
      if (res.data.code === '0000') {
        this.consultingNum = res.data.data.totalAnswerNum || 0;
        this.score = res.data.data.score || 0;
        this.totalTime = res.data.data.totalTime || 0;
      } else {
        this.$message({
          message: res.data.message,
          type: 'error',
        });
      }
    },
    // 获取咨询中的列表数据
    async initAsking() {
      let params = {
        expertId: this.curUserData.id || '',
        status: this.askingType || '1',
        page: this.currentPage || 1,
        rows: this.pageSize || 10,
        exchange: this.turnOrdered ? '1' : '0',
      };
      let res = await getIMList(params);
      res = res.data;
      if (res.code === '0000') {
        /* eslint-disable */ 
        this.askingData = res.data.list.map((item) => {
          item.beginTime = date(item.beginTime, 'yyyy-MM-dd hh:mm:ss');
          item.account = item.account.slice(0 , 3) + "****" + item.account.slice(-4);
          return item;
        });
        this.askingCount = res.data.consultingNum;
        this.completeCount = res.data.endConsultNum;
        /* eslint-enable */
        this.total = this.askingType === '1' ? res.data.consultingNum : res.data.endConsultNum;
      } else {
        this.$message({
          message: res.data.message,
          type: 'error',
        });
        this.askingData = [];
        this.askingCount = 0;
        this.total = 0;
      }
    },
    // 切换tabs
    handleClick(val) {
      this.currentPage = 1; // 初始化第一页
      this.askingType = val === 'first' ? '1' : '2';
      this.initAsking();
    },
    turnOrderChange(val) {
      this.currentPage = 1; // 初始化第一页
      this.turnOrdered = val;
      this.initAsking();
    },
    // 查看咨询记录
    fatherDetail(row) {
      this.mesid = row.id;
      this.detailsToView = true;
    },
    watchBack() {
      this.detailsToView = false;
    },
    currentChange(val) {
      this.currentPage = val;
      this.initAsking();
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.initAsking();
    },
    timeFormat(val) {
      let arr = [];
      let str = '';
      arr = val.split('T');
      /* eslint-disable */ 
      str = arr[0] + '   ' + arr[1].split('.')[0];
      /* eslint-enable */
      return str;
    },
  },
  watch: {
    activeName(n) {
      this.total = n === 'first' ? this.askingData.length : this.completeData.length;
    },
  },
};
</script>
<style lang="scss" scoped>
.ask {
  background: #F2F4F8;
  .head {
    width: 100%;
    background: #f0f2f5;
    overflow: hidden;
    margin:0 10px 10px 0;
    padding: 0;

    ul {
      width: 100%;
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      li {
        display: inline-block;
        width: 32%;
        height: 80px;
        // margin: 0 1% 10px 0;
        border-left: 6px solid #0fc5f4;
        background: #fff;
        border-radius: 4px;
        text-align: center;
        line-height: 80px;
        position: relative;
        .headImg{
          display: block;
          width: 25px;
          height: 15px;
          position: absolute;
          top: 0;
          right: 15%;
          box-sizing: border-box;
          img{
            display: inline-block;
            position: absolute;
            width: 100%;
            height: 100%;
          }
        }
        .headIcon{
          display: inline-block;
          width: 28px;
          height: 28px;
          vertical-align: middle;
          margin-right: 15px;
        }
        .headIconFirst{
          width: 30px;
          height: 24px;
        }
        .titleName {
          font-size: 16px;
          color: #666666;
          margin-right: 23px;
          vertical-align: middle;
        }
        h1 {
          display: inline-block;
          font-size: 28px;
          vertical-align: middle;
          color: #333;
        }
        &:nth-child(2) {
          border-left: 6px solid #f4c500;
        }
        &:nth-child(3) {
          right: 0;
          border-left: 6px solid #1ed69e;
        }
      }
    }
  }
  .content{
    position: relative;
    padding: 0 10px 20px 10px;
    background: #fff;
    .turnOrder{
      position: absolute;
      right: 30px;
      top:11px;
    }
  }
  .footTool{
    padding: 0 10px 20px 10px;
    background: #fff;
    overflow: hidden;
    /deep/.el-select>.el-input{
      height: 22px!important;
    }
    /deep/.el-select .el-input .el-select__caret {
    line-height: 22px!important;
    }
  }
}
</style>
