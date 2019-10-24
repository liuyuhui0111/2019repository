<template>
  <div class="question common-expertlist">
    <div class="header">
      <div @click="$emit('back')" class="back">
        <span class="iconfont iconfanhui"></span>
        返回
      </div>
      <div @keyup.enter="init" class="inpbox">

        <el-input v-model="searchVal"
        placeholder="搜索专家"></el-input>
        <span @click="init" class="iconfont iconsousuo"></span>
      </div>
      <span @click="ChangeOrderFn()" class="btn-sub">确定转单给此专家</span>
    </div>
    <div class="contain common-scroll-bar">

     <div v-for="(item,index) in list"
     class="item"
     @click="curindex=index"
     :class="{on:curindex == index}"
     :key="index">
        <div class="userbox labelbox">
          <img class="label" :src="item.headImg" :alt="item.name">
          <div class="intro">
            <div class="name">
              <h1>{{item.name}}</h1>
              <p>评分:<span class="score">{{item.score ?
              parseFloat(item.score).toFixed(2) : '0.00'}}</span>
              &nbsp;| 回答:
              <span class="score">{{item.answerNum}}次</span>
              </p>
            </div>
            <div class="company">
              {{item.company}} | 从业{{item.workYears}}年
            </div>
            <div class="qualification">
              资格认证：{{item.company}}
            </div>
          </div>
        </div>
        <div class="labelbox">
          <span class="label">擅长行业:</span>
          <div class="ellipsis3">
            <span v-for="(eitem,eindex) in item.expertTradeList"
            :key="eindex">{{eitem}}</span>
          </div>
        </div>
         <div class="labelbox">
          <span class="label">擅长领域:</span>
          <div class="ellipsis2">
          <span v-for="(eitem,eindex) in item.expertFieldList"
            :key="eindex">{{eitem}}</span>
          </div>
        </div>
         <div class="labelbox">
          <span class="label">擅长税种:</span>
          <div class="ellipsis2">
          <span v-for="(eitem,eindex) in item.expertTaxCategoryList"
            :key="eindex">{{eitem}}</span>
          </div>
        </div>

     </div >


    </div>
  </div>
</template>
<script>
import {
  getExpertInfoList,
  ChangeOrder,
} from '@/api/apis';

export default {
  name: 'expertlist',
  data() {
    return {
      name: 'expertlist',
      list: [],
      searchVal: '',
      curindex: -1,
    };
  },
  mounted() {
    this.init();
  },
  props: {
    mesid: { // 咨询单id
      type: String,
      default: () => '',
    },
    expertid: { // 专家id
      type: String,
      default: () => '',
    },
    targetId: { // 用户id
      type: String,
      default: () => '',
    },

  },
  methods: {
    async init() {
      /* eslint-disable */
      this.curindex = -1;
      let params={
        name:this.searchVal,
        distributorId:this.curUserData.distributorId
      }
      let res = await getExpertInfoList(params);
      console.log(res);
      if(res.data.code === '0000'){
        let curlist = res.data.data;
        curlist.forEach((item)=>{
          item.expertFieldList = item.expertField?item.expertField.split(',') : [];
          item.expertTaxCategoryList = item.expertTaxCategory?item.expertTaxCategory.split(','):[];
          item.expertTradeList = item.expertTrade?item.expertTrade.split(','):[];
        })
        this.list = curlist;
        console.log(this.list)

      }else{
        this.list=[]
      }
      /* eslint-enable */
    },
    async ChangeOrderFn() {
      if (this.curindex === -1) {
        this.$message('请选择专家');
        return;
      }
      let params = {
        questionId: this.mesid,
        fromExpertID: this.expertid,
        toExpertID: this.list[this.curindex].id,
        userId: this.targetId,

      };
      let res = await ChangeOrder(params);
      console.log(res);
      if (res.data.code === '0000') {
        this.$emit('success', this.list[this.curindex]);
      } else {
        this.$message(`转单失败，错误原因：${res.data.message}`);
      }
    },

  },
};
</script>
<style>
  .common-layout-index .common-expertlist .el-input__inner{
    font-size: 12px;
  }
</style>
<style scoped>

.iconsousuo{
  cursor: pointer;
}
.labelbox{
  position: relative;
  padding-left: 66px;
  font-size: 12px;
color: #666666;
}
.userbox{
  margin-bottom: 16px;
}
.labelbox .label{
  position: absolute;
  left: 0;
  text-align: right;
  width: 54px;
}
.labelbox .label img{
  width: 50px;
  height: 50px;
  border-radius: 100%;
  border: 1px solid #ccc;
}
.labelbox .ellipsis3{
      height: 48px;
    line-height: 16px;
    overflow: hidden;
    margin-bottom: 8px;
    max-height: 48px;
}
.labelbox .ellipsis2{
  height: 32px;
  max-height: 32px;
  line-height: 16px;
  overflow: hidden;
  margin-bottom: 8px;
}
.name{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.name h1{
  font-size: 14px;
color: #333333;
font-weight: bold;
margin-bottom: 6px;
}
.name .score{
  color: #33C8DF;
}
.name p{
  display: flex;
  height: 16px;
  line-height: 16px;
}
.company{
  color: #333333;
  margin-bottom: 4px;
}
.inpbox{
  background: #fff;
  margin: 11px auto;
  width: 211px;
  height: 28px;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:0 10px;
  box-sizing:border-box;
  font-size: 12px;
}
.btn-sub{
  display: block;
  height: 30px;
   line-height: 30px;
  color: #fff;
  text-align: center;
  font-size: 14px;
  background: #33C8DF;
  cursor: pointer;
  border-radius: 4px;
  padding: 0 20px;
}
.header .btn-sub{
  position: absolute;
  right: 30px;
  top: 10px;
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
  bottom: 0px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  padding:16px 25px;
  box-sizing:border-box;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}
.contain .item{
  display: block;
  width: 49%;
  height: 250px;
  overflow: hidden;
  border: 1px solid #D5D5D5;
border-radius: 4px;
position: relative;
margin-bottom: 10px;
cursor: pointer;
box-sizing:border-box;
padding: 16px 20px;
}
.contain .item.on,
.contain .item:hover{
  border-color: #33C8DF;
}
.contain .item.on:after{
  content:"";
  position: absolute;
  width: 24px;
  height: 24px;
  background: url('./img/checked.png') no-repeat right bottom;
  -webkit-background-size: 24px 24px;
  background-size: 24px 24px;
  right: 0;
  bottom: 0;
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
