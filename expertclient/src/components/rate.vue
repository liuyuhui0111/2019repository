<template>
  <div class="dialog-box-componet">
    <div class="title">请对本次服务进行评价</div>
    <div class="ratebox">
        <div class="label">评星：</div>
        <div class="rate">
          <el-rate
            v-model="rateParam.rateVal"
            :colors="colors">
          </el-rate>
        </div>
        <div>{{rateMap[rateParam.rateVal]}}</div>
     </div>
     <div class="tagbox">
       <div v-for="(item,index) in rateTagMap"
       @click="tagClick(item,index)"
       v-show="!isShowTag(item)"
       class="item"
       :class="{on:item.active}"
       :key="index">
        {{item.text}}
       </div >
     </div>
     <div class="inp">
       <el-input
      type="textarea"
      placeholder="请填写对专家的评价"
      v-model.trim="rateParam.rateMes"
      rows="5"
      resize="none"
      maxlength="100"
      show-word-limit
      ></el-input>

     </div>

     <span @click="sub()" class="btn-sub">提交</span>
  </div>
</template>
<script>
import { expertEvaluate } from '@/api/apis';

export default {
  name: 'rate',
  data() {
    return {
      name: 'rate',
      rateParam: { // 评分信息
        rateVal: 5,
        rateTag: [0, 0, 0],
        rateMes: '', // 评价信息
      },
      reqflag: false,
      colors: ['#33C8DF', '#33C8DF', '#33C8DF'],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.rateParam = { // 评分信息
        rateVal: 5,
        rateTag: [0, 0, 0],
        rateMes: '', // 评价信息
      };
      this.reqflag = false;
      /*eslint-disable*/ 
      this.rateTagMap.forEach((item) => {
        item.active = false;
      });
      /* eslint-enable */
    },
    tagClick(item) {
      /*eslint-disable*/ 
      item.active = !item.active;
       /* eslint-enable */
    },
    isShowTag(item) {
      // 显示那些tag
      return item.rate.indexOf(this.rateParam.rateVal) === -1;
    },
    async sub() {
      // 防止连续提交
      if (this.reqflag) return;
      // 提交评价
      let flag = false;
      let ids = [];
      this.rateTagMap.forEach((item) => {
        // 如果是选中状态 且包含当前分值 push
        if (item.active
          && (item.rate.indexOf(this.rateParam.rateVal) !== -1)) {
          ids.push(item.id);
          flag = true;
        }
      });
      if (!flag && !this.rateParam.rateMes && this.rateParam.rateVal < 5) {
        this.$message('请选择标签或评论专家的服务');
        return;
      }
      let params = {
        account: this.curUserData.id,
        evaluateContent: this.rateParam.rateMes,
        evaluateFlag: ids.join(','),
        evaluateScore: this.rateParam.rateVal,
        expertName: this.curTargetUserData.name,
        expertAccount: this.curTargetUserData.expertAccount,
        distributorId: this.curUserData.distributorId,
        questionId: this.curTargetUserData.id,
      };
      if (this.isCanRequest) {
        this.isCanRequest = false;
      } else {
        return;
      }
      let res = await expertEvaluate(params);
      this.isCanRequest = true;
      if (res.data.code === '0000') {
        this.$message('提交评价成功');
        this.$emit('success');
        this.reqflag = true;
        // this.hideMessage(2000);
      } else {
        this.$message(res.data.message);
      }
    },


  },
};
</script>
<style scoped>
/*评价*/
.dialog-box-componet .title{
  font-size: 18px;
color: #333333;
font-weight: bold;
margin-bottom: 24px;
text-align: center;
}
.dialog-box-componet .ratebox{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  margin-bottom: 16px;
}
.dialog-box-componet .rate{
  margin-right: 25px;
}
.dialog-box-componet .tagbox{
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.dialog-box-componet .tagbox .item{
  display: block;
   height: 25px;
  line-height: 25px;
  text-align: center;
  border: 1px solid #D8D8D8;
border-radius: 4px;
border-radius: 4px;
font-size: 12px;
color: #666666;
margin-right: 8px;
cursor: pointer;
padding: 0 10px;
}
.dialog-box-componet .tagbox .item.on{
  color: #33C8DF;
  border-color: #33C8DF;
}
.dialog-box-componet .inp{
  border: 1px solid #D8D8D8;
border-radius: 4px;
border-radius: 4px;
margin-top: 16px;
margin-bottom: 32px;
}
.common-message .dialog-box-componet .btn-sub{
   margin: 0 auto;
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
  margin-bottom: 24px;
}
</style>
