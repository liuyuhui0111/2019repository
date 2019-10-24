<template>
  <div class="assess">
    <div class="head">
      <span style="margin-right:10px;">评价：</span>
      <!-- eslint-disable -->
      <el-select
                v-model="starSelect"
                @change='starChange'
                style="width:100px;"
                placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- eslint-enable -->
    </div>
    <!-- eslint-disable -->
    <div class="content">
      <BasicTable
                :treeType="treeType"
                :tableOptions="tableOptions"
                :tableData="tableData">
      </BasicTable>
    </div>
    <!-- eslint-enable -->
    <!-- 底部分页区域 -->
      <!-- v-if="total>=10" -->
      <div class="footTool"
        v-if="total>=10">
        <div class="pagination">
          <el-pagination
            background
            small
            @size-change="handleSizeChange"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-sizes="[10, 30, 50]"
            :page-size="rows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
  </div>
</template>
<script>
import basicTable from '@/components/table/basic-table.vue';
/* eslint-disable */
import { getEvaluate } from '@/api/assessMange/index';
/* eslint-enable */
export default {
  components: {
    BasicTable: basicTable,
  },
  data() {
    return {
      title: '',
      starSelect: '全部',
      options: [{
        label: '全部',
        value: '全部',
        id: '-1',
      }, {
        label: '5星',
        value: '5星',
        id: '5',
      }, {
        label: '4星',
        value: '4星',
        id: '4',
      }, {
        label: '3星',
        value: '3星',
        id: '3',
      }, {
        label: '2星',
        value: '2星',
        id: '2',
      }, {
        label: '1星',
        value: '1星',
        id: '1',
      }],
      treeType: {
        type: 'normal',
        detail: true,
      },
      tableData: [],
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
          label: '评价',
          prop: 'evaluateContent',
        },
        {
          label: '标签',
          prop: 'evaluateFlag',
        },
      ],
      currentPage: 1,
      rows: 10,
      total: 0,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let params = {
        expertAccount: JSON.parse(window.sessionStorage.getItem('curUserData')).account,
        evaluateScore: this.filterStar(this.starSelect),
        page: this.currentPage,
        rows: this.rows,
      };
      let res = await getEvaluate(params);
      /* eslint-disable */
      if(res.data.code === '0000'){
        this.tableData = res.data.data.list.map((item) => {
          item.evaluateFlag = this.dealFlag(item.evaluateFlag);
          // item.evaluateContent = this.dealContent(item.evaluateContent);
          item.account = item.account.slice(0 , 3) + "****" + item.account.slice(-4);
          return item;
        });
        this.total = res.data.data.total;
        /* eslint-enable */
        console.log('获取到的评价列表数据', res);
      } else {
        this.tableData = [];
        this.total = 0;
      }
    },
    starChange() {
      this.init();
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.rows = val;
      this.init();
    },
    currentChange(val) {
      this.currentPage = val;
      this.init();
    },
    dealFlag(val) {
      if (!val) return '/';
      let str = '';
      if (val.length === 1) {
        str = this.rateTagMap[val * 1 - 1].text;
      } else {
        let tempArr = val.split(',');
        console.log(tempArr);
        tempArr.map((item) => {
          str += `${this.rateTagMap[item * 1 - 1].text}、`;
          return item;
        });
        str = str.slice(0, str.length - 1);
      }
      return str;
    },
    dealContent(val) {
      if (!val) return '/';
      return this.rateMap[val];
    },
    filterStar(val) {
      let target = '';
      this.options.map((item) => {
        if (item.label === val) {
          target = item.id;
        }
        return item;
      });
      return target;
    },
  },
};
</script>
<style lang="scss" scoped>
body {
  background: #f0f2f5;
}
.assess {
  padding:20px;
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
