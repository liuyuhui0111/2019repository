<template>
  <div class="my-signin">
    <Title title="我的报名"></Title>
    <div v-if="classList.length>0" class="table-box">
     <!-- eslint-disable -->
       <el-table
      :data="classList"
      border
      style="width: 100%">
        <el-table-column
        v-for="(item,index) in titleList"
        v-if="item.value == 'titleBox'"
        align="center"
        width="188px"
        :key="index"
        :prop="item.value"
        :label="item.text">
        <template slot-scope="scope">
          <div class="img">
            <baseImg
            :width="219"
            :height="130"
            :src="scope.row.pic">
            </baseImg>
          </div>
          <div style="margin-left: 10px">{{ scope.row.title }}</div>
        </template>
      </el-table-column>
      
      <el-table-column
        v-for="(item,index) in titleList"
        v-if="item.value != 'titleBox'"
        align="center"
        :key="index"
        :prop="item.value"
        :label="item.text">
        <template slot-scope="scope">
        <div v-if="item.value != 'startTime'">
          {{scope.row[item.value]}}
        </div>
        <div v-else>
          {{scope.row.startTime}}~{{scope.row.endTime}}
        </div>
      </template>
      </el-table-column>
      </el-table>
      <!-- eslint-enable -->
    </div>
    <div v-else class="table-box empty">
      暂无报名课程
    </div>
    <el-pagination
    v-if="total>queryMyApplicationParam.pageSize"
    @current-change="handleCurrentChange"
    layout="prev, pager, next"
    :pager-count="pagerCount"
    prev-text="上一页"
    next-text="下一页"
    :page-size="queryMyApplicationParam.pageSize"
    :total="total">
  </el-pagination>
  </div>
</template>
<script>
import mixin from './js/mixin';
import { queryMyApplication } from '@/api/apis';

export default {
  name: 'my-signin',
  mixins: [mixin],
  data() {
    return {
      name: 'my-signin',
      total: 0,
      pagerCount: 11,

      queryMyApplicationParam: {
        pageSize: 5,
        pageNum: 1,
      },
      titleList: [
        {
          text: '预约课程',
          value: 'titleBox',
          width: '',
        },
        {
          text: '称呼',
          value: 'name',
          width: '',
        },
        {
          text: '公司',
          value: 'company',
          width: '',
        },
        {
          text: '预约手机号',
          value: 'phone',
          width: '',
        },
        {
          text: '上课时间',
          value: 'startTime',
          width: '',
        },
        {
          text: '上课地点',
          value: 'address',
          width: '',
        },
      ],
      classList: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 获取个人中心我的报名页面
      this.queryMyApplicationFn('init');
    },
    getTime(classItem) {
      if (classItem.startTime && classItem.endTime) {
        // 计算上课时间
        return `${classItem.startTime}-${classItem.endTime}`;
      }
      return '';
    },
    initlist(list) {
      /*eslint-disable*/ 
            list.forEach((item) => {
                item.time = this.getTime(item);
            });
          /* eslint-enable */
      return list;
    },
    handleCurrentChange(val) {
      this.queryMyApplicationParam.pageNum = val;
      this.queryMyApplicationFn();
    },
    queryMyApplicationFn(t) {
      // 个人中心我的报名
      if (t === 'init') {
        this.queryMyApplicationParam.pageNum = 1;
      }
      queryMyApplication(this.queryMyApplicationParam).then((res) => {
        if (res.data.code === '0000') {
          this.classList = this.initlist(res.data.list);
          this.total = res.data.total;
        }
      }).catch((err) => {
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
.table-box {
    margin-bottom: 20px;
    min-height: 512px;
}
  .table-box .img{
    width: 131px;
    height: 78px;
    display: block;
    margin: 0 auto;
      }
</style>
