<template>
  <div class="question common-message">
    <div class="header">
      <div @click="backFn()" class="back">
        <span class="iconfont iconfanhui"></span>
        返回
      </div>
      请将用户提交的问题进行分类
    </div>
    <div class="contain common-scroll-bar">
      <div class="questionstr">
        <span>问题描述： </span>{{questionStr}}
      </div>
      <template v-if="getTradeListRes.length>0">
        <div class="title">
          所属行业
        </div>
        <div class="titlebox">
          <span v-for="(item,index) in getTradeListRes"
          :class="{on:item.active}"
          @click="item.active = !item.active"
          :key="index">{{item.name}}</span >
        </div>
      </template>
       <template v-if="getFieldListRes.length>0">
        <div class="title">
          所属领域
        </div>
        <div class="titlebox">
          <span v-for="(item,index) in getFieldListRes"
          :class="{on:item.active}"
          @click="item.active = !item.active"
          :key="index">{{item.name}}</span >
        </div>
      </template>
       <template v-if="getTaxCategoryListRes.length>0">
        <div class="title">
          所属税种
        </div>
        <div class="titlebox">
          <span v-for="(item,index) in getTaxCategoryListRes"
          :class="{on:item.active}"
          @click="item.active = !item.active"
          :key="index">{{item.name}}</span >
        </div>
      </template>
    </div>
    <div class="footer">
      <span @click="questionSortFn()" class="btn-sub">提交</span>
    </div>
  </div>
</template>
<script>
import {
  getTradeList,
  getFieldList,
  getTaxCategoryList,
  questionSort,
  getQuestionById,
} from '@/api/apis';

export default {
  name: 'question',
  data() {
    return {
      name: 'question',
      list: [],
      getTradeListRes: [],
      getFieldListRes: [],
      getTaxCategoryListRes: [],
      checkRes: {
        trade: '',
        field: '',
        taxCategory: '',
      }, // 存储已经选过的行业信息
    };
  },
  props: {
    questionStr: {
      type: String,
      default: () => '',
    },
    mesid: {
      type: String,
      default: () => '',
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      /* eslint-disable */
      let res = await getQuestionById({id:this.mesid});
      if(res.data.code === '0000'){
        this.checkRes = res.data.data;
      }
      getTradeList().then((res) => {
        
        if (res.data.code === '0000') {
          res.data.data.forEach((item) => {
            if(this.checkRes.trade 
            && this.checkRes.trade.indexOf(item.id) !== -1){
              item.active = true;
            }else{
              item.active = false;
            }
            
          });
          this.getTradeListRes = res.data.data;
        }
      });
      getFieldList().then((res) => {
        if (res.data.code === '0000') {
          res.data.data.forEach((item) => {
            if(this.checkRes.field 
            && this.checkRes.field.indexOf(item.id) !== -1){
              item.active = true;
            }else{
              item.active = false;
            }
          });
          this.getFieldListRes = res.data.data;
        }
      });
      getTaxCategoryList().then((res) => {
        if (res.data.code === '0000') {
          res.data.data.forEach((item) => {
            if(this.checkRes.taxCategory 
            && this.checkRes.taxCategory.indexOf(item.id) !== -1){
              item.active = true;
            }else{
              item.active = false;
            }
          });
          this.getTaxCategoryListRes = res.data.data;
        }
      });
      
    },
    initList(){
      this.getTradeListRes.forEach((item)=>{
        item.active = false;
      });
      this.getFieldListRes.forEach((item)=>{
        item.active = false;
      });
      this.getTaxCategoryListRes.forEach((item)=>{
        item.active = false;
      });
      /* eslint-enable */
    },
    checkQuestion() {
      let trade = '';
      let field = '';
      let taxCategory = '';

      this.getTradeListRes.forEach((item) => {
        if (item.active) {
          trade += `,${item.id}`;
        }
      });
      trade = trade ? trade.substr(1) : '';

      this.getFieldListRes.forEach((item) => {
        if (item.active) {
          field += `,${item.id}`;
        }
      });
      field = field ? field.substr(1) : '';

      this.getTaxCategoryListRes.forEach((item) => {
        if (item.active) {
          taxCategory += `,${item.id}`;
        }
      });
      taxCategory = taxCategory ? taxCategory.substr(1) : '';
      return {
        flag: trade && field,
        trade, // 行业
        field, // 领域
        taxCategory, // 税种
      };
    },
    async questionSortFn() {
      let checkParam = this.checkQuestion();
      if (this.checkRes.trade === checkParam.trade
        && this.checkRes.field === checkParam.field
        && this.checkRes.taxCategory === checkParam.taxCategory) {
        // 如果都相等  代表没做修改  直接隐藏
        this.$emit('back');
        return;
      }
      if (!checkParam.flag) {
        // 如果没有选中
        this.$message('所属行业、所属领域为必选项');
      } else {
        let params = {
          id: this.mesid, // 咨询单id
          trade: checkParam.trade, // 行业
          field: checkParam.field, // 领域
          taxCategory: checkParam.taxCategory, // 税种
        };
        let res = await questionSort(params);
        if (res.data.code === '0000') {
          this.$emit('success');
          this.initList();
        } else {
          this.$message(res.data.message);
        }
      }
    },
    async backFn() {
      if (this.checkQuestion().field
        || this.checkQuestion().taxCategory
        || this.checkQuestion().trade) {
        if (this.checkRes.trade === this.checkQuestion().trade
            && this.checkRes.field === this.checkQuestion().field
            && this.checkRes.taxCategory === this.checkQuestion().taxCategory) {
          // 如果都相等  代表没做修改  直接隐藏
          this.$emit('back');
          return;
        }
        let res = await this.$$confirm('您还没有提交信息，确定要退出吗？');
        if (res.code === '0000') {
          this.$emit('back');
        }
      } else {
        this.$emit('back');
      }
    },
  },
};
</script>
<style>
  .common-dialog-message-box .el-button--small, .el-button--small.is-round{
    padding: 0 20px;
  }
</style>
<style scoped>
/*w问题列表*/
.title,.titlebox{
  padding: 0 30px;
  box-sizing:border-box;
  position: relative;
}
.title{
  font-weight: bold;
  font-size: 14px;
color: #333333;
padding-left: 42px;
line-height: 20px;
margin: 16px 0;
}
.title:before{
  content: "";
  position: absolute;
  width: 4px;
  height: 16px;
  background: #33C8DF;
  left: 30px;
  top: 2px;
}
.titlebox span{
  display: inline-block;
  font-size: 12px;
color: #333333;
padding: 4px 6px;
margin-right:24px;
cursor: pointer;
}
.titlebox span:hover,
.titlebox span.on{
  background: #E0F8FC;
border-radius: 4px;
border-radius: 4px;
color: #0898AD;
}
/*问题描述*/
.questionstr{
  padding: 10px 30px 10px 100px;
  position: relative;
  font-size: 14px;
color: #333333;
line-height: 20px;
text-align: left;
background: #FFFDF2;
}
.questionstr span{
  position: absolute;
  left: 30px;
  top: 10px;
}
.btn-sub{
  margin: 10px auto;
  display: block;
   width: 68px;
  height: 30px;
   line-height: 30px;
  color: #fff;
  text-align: center;
  font-size: 14px;
  background: #33C8DF;
  cursor: pointer;
  border-radius: 4px;
}
.question{
  position: absolute;
  top:0;
  left: 68px;
  bottom: 0;
  right: 0;
  background: #fff;
  z-index: 100;
}
.contain{
  position: absolute;
  top: 50px;
  bottom: 50px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}
.question .footer,
.question .header{
  background: #F5F5F5;
  position: absolute;
  height: 50px;
  line-height: 50px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 16px;
color: #333333;
}
.question .header{
  top: 0;
}
.question .footer{
  bottom: 0;
}
.question .header .back{
  position: absolute;
  left: 30px;
  cursor: pointer;
}
</style>
