<template>
    <div class="basicTable">
        <el-table
            :data="tableData"
            border
            ref="commonTable"
            element-loading-text="正在拼命加载中"
            header-align="center"
            :empty-text="blankWarn">
            <el-table-column
                v-for="(item, index) in tableOptions"
                :key="index"
                :width="item.width"
                :min-width="item.minWidth ? item.minWidth : '0'"
                :label="item.label"
                :prop="item.prop"
                align="center"
                show-overflow-tooltip>
                <template slot="header" v-if="item.filter">
                    <span>{{ item.label }}</span>
                    <i class="el-icon-arrow-down"></i>
                </template>
                <template slot-scope="props" >
                  <!-- 表格展开 -->
                  <span v-if="index === 0 && treeType.expand">
                    <i
                      class="iconfont el-icon-arrow-up tableExpand"
                      v-show="props.row.tableExpand"
                      @click="expandTab(props.row,'1',props.$index)"
                    ></i>
                    <!-- 表格收起 -->
                    <i
                      class="iconfont el-icon-arrow-down tableExpand"
                      v-show="!props.row.tableExpand"
                      @click="expandTab(props.row,'0',props.$index)"
                    ></i>
                  </span>
                  <span>{{props.row[item.prop] |emptyFilter}}</span>
                </template>
                <div v-if="item.father">
                    <el-table-column
                        v-for="(j,jdex) in item.children"
                        :key="jdex"
                        :label="j.label"
                        align="center"
                        :prop="j.prop"
                        show-overflow-tooltip>
                    </el-table-column>
                </div>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                min-width="120"
                v-if="treeType.type === 'operate'">
                <template slot-scope="props">
                    <a
                        v-if="treeType.detail"
                        @click="toDetail(props.row, props.$index)"
                        class="czBtn detailButton"
                        >{{treeType.detail.buttonTxt}}</a>
                    <a
                        v-if="treeType.del"
                        @click="toDel(props.row, props.$index)"
                        class="czBtn"
                        style="marginLeft:15px;"
                        >删除</a>
                    <a
                        v-if="treeType.edit"
                        @click="toEdit(props.row, props.$index)"
                        class="czBtn"
                        style="marginLeft:15px;"
                        >编辑</a>
                    <a
                        v-if="treeType.forbid"
                        @click="toForbid(props.row, props.$index)"
                        class="czBtn"
                        style="marginLeft:15px;"
                        >{{forbidText}}</a>
                </template>
            </el-table-column>
            <el-table-column v-if="treeType.expand" type="expand" width="1">
              <template slot-scope="props">
                <slot name="expand" :expandData="JSON.stringify(props.row)"></slot>
              </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
  props: {
    treeType: Object,
    tableData: Array,
    tableOptions: Array,
    fatherDetail: Function,
    fatherDel: Function,
    fatherEdit: Function,
    fatherForbid: Function,
  },
  data() {
    return {
      blankWarn: '暂无数据',
      forbidText: '禁用',
    };
  },
  methods: {
    /*eslint-disable*/
    expandTab(row, control, index) {
      row.tableExpand = !row.tableExpand;
      this.toogleExpand(row, control, index);
    },
    /* eslint-enable */
    // 展开行
    /*eslint-disable*/
    toogleExpand(row, control, rowIndex) {
      let $table = this.$refs.commonTable;
      // this.enterListData.map(item => {
        //   if (row.id != item.id && rowIndex != 0) {
          //     $table.toggleRowExpansion(item, false);
      //   }
      // });
      if (control === '1') {
        $table.toggleRowExpansion(row, false);
      } else {
        // this.getInsideList(rowIndex, row.ssflmc)
        $table.toggleRowExpansion(row, true);
      }
    },
    /* eslint-enable */
    toDetail(row, rowIndex) {
      if (!this.fatherDetail) return;
      this.fatherDetail(row, rowIndex);
    },
    // 删除
    toDel(row, rowIndex) {
      if (!this.fatherDel) return;
      this.fatherDel(row, rowIndex);
    },
    // 编辑
    toEdit(row, rowIndex) {
      if (!this.fatherEdit) return;
      this.fatherEdit(row, rowIndex);
    },
    // 禁用
    toForbid(row, rowIndex) {
      if (!this.fatherForbid) return;
      this.fatherForbid(row, rowIndex);
    },
  },
  filters: {
    emptyFilter(val) {
      if (val === null) return '/';
      return val;
    },
  },
};
</script>
<style lang="scss" scoped>
  .basicTable{
    .tableExpand{
      // float: left;
      // margin-left: 5px;
      margin-right: 15px;
      cursor: pointer;
    }
    .czBtn{
      color: #666;
      cursor: pointer;
    }
    .detailButton{
      cursor: pointer;
      &:hover{
        color: #33C8DF;
      }
    }
    .el-form-item{
      margin-bottom: 0!important;
      display: block!important;
    }
  }
</style>
