<template>
  <div class="invoice common-order-invoice">
    <div class="bg"></div>
    <div class="tip">
      请填写要开具的发票信息
    </div>
    <div class="form-box">
    <!-- <cube-checker
    v-model.trim="invoiceForm.invoiceType"
    :options="invoiceFormData.invoiceType"
    type="radio" /> -->

    <div class="item">
      <p class="label">抬头类型</p>
      <cube-checker
    v-model.trim="invoiceForm.titleType"
    :options="invoiceFormData.titleType"
    type="radio" />
    </div>

    <!--<div class="item">-->
      <!--<p class="label">开票项目</p>-->
      <!--<cube-checker-->
    <!--v-model.trim="invoiceForm.content"-->
    <!--:options="invoiceFormData.content"-->
    <!--type="radio" />-->
    <!--</div>-->

    <div class="item inp">
      <span class="label">发票抬头</span>
      <div class="dib">
        <cube-textarea v-model="invoiceForm.title"
        :indicator="indicator"
        placeholder="请输入发票抬头"></cube-textarea>
       <!--  <cube-input v-model.trim="invoiceForm.title"
      placeholder="请输入发票抬头"></cube-input> -->
      </div>

    </div>


     <div v-if="invoiceForm.titleType === '1'" class="item inp">
      <span class="label"> &nbsp;税号</span>
      <div class="dib">
         <cube-input v-model.trim="invoiceForm.taxNo"
      placeholder="请输入纳税人识别码"></cube-input>
      </div>
    </div>


     <div class="item inp">
      <span class="label">收票人手机</span>
      <div class="dib">
         <cube-input v-model.trim="invoiceForm.mobile"
         type="number"
      placeholder="请输入收票人手机"></cube-input>
      </div>
    </div>


     <div class="item inp noborder">
      <span class="label">收票人邮箱</span>
      <div class="dib">
         <cube-input v-model.trim="invoiceForm.email"
      placeholder="请输入收票人邮箱"></cube-input>
      </div>
    </div>

    </div>
    <span class="btn-sub btn-sub-full" @click="save">保存</span>
  </div>
</template>
<script>
import {
  validByPhone,
  validByEmail,
  validByPersonNo,
} from '@/assets/utils/validator';

export default {
  name: 'invoice',
  data() {
    return {
      indicator: false,
      invoiceFormData: {
        invoiceType: [
          {
            value: '0',
            text: '普通发票',
          },
          {
            value: '1',
            text: '增值税专用发票',
          },
        ],
        titleType: [
          {
            value: '0',
            text: '个人',
          },
          {
            value: '1',
            text: '企业',
          },
        ],
        content: [
          {
            value: '商品明细',
            text: '商品明细',
          },
          {
            value: '商品类别',
            text: '商品类别',
          },
        ],
      },
      invoiceForm: {
        titleType: '0', // 0个人 1单位

        title: '', // 抬头
        invoiceType: '0', // 发票类型 0.普票 1.专票
        content: '',
        taxNo: '', // 纳税人识别号
        classType: '',
        mobile: '',
        email: '',
        createType: '0', // 开票方式 0.电子 1.纸票
        contactAddress: '',
        contactProvince: '',
        contactCity: '',
        contactCounty: '',
        bankNo: '', // 开户账户
        address: '', // 注册地址
        phone: '', // 注册电话
        bankName: '', // 开户行
        contactName: '', // 收票人姓名
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.vuexInvoiceData
        && this.commonUserData
        && this.vuexInvoiceData[this.commonUserData.userName]) {
        this.invoiceForm = { ...this.vuexInvoiceData[this.commonUserData.userName] };
      }
    },
    save() {
      if (!this.checkForm()) {
        // 校验失败
        return;
      }

      let obj = {};
      if (this.commonUserData && this.commonUserData.userName) {
        obj[this.commonUserData.userName] = this.invoiceForm;
        this.setVuexInvoiceData(obj);
        this.setvuexInvoiceTitle(this.invoiceForm.title);
      }

      this.routerReplace('/order', {
        isOpenInvoice: true,
      });
    },

    checkForm() {
      // 校验表单
      if (!this.invoiceForm.title) {
        this.$message('请填写发票抬头');
        return false;
      }

      if (this.invoiceForm.title.length < 2 || this.invoiceForm.title.length > 50) {
        this.$message('发票抬头请控制在2-50字内');
        return false;
      }

      if (this.invoiceForm.titleType === '1') {
        // 校验单位信息
        if (!this.invoiceForm.taxNo) {
          this.$message('请填写纳税人识别号');
          return false;
        }
        if (!validByPersonNo(this.invoiceForm.taxNo)) {
          this.$message('纳税人识别号格式错误，请重新填写');
          return false;
        }
      }

      if (!this.invoiceForm.mobile) {
        this.$message('请填写收票人手机号');
        return false;
      }

      if (!validByPhone(this.invoiceForm.mobile)) {
        this.$message('手机号格式错误，请重新填写');
        return false;
      }

      if (!this.invoiceForm.email) {
        this.$message('请填写收票人邮箱');
        return false;
      }

      if (!validByEmail(this.invoiceForm.email)) {
        this.$message('邮箱格式错误，请重新填写');
        return false;
      }


      return true;
    },

  },
};
</script>
<style>
  .common-order-invoice .cube-checker-item_active,
  .common-order-invoice .cube-checker-item{
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #868686;
    border-radius: 15px;
    font-size: 12px;
    color: #444444;
    padding: 0 30px;
    margin: 0;
    margin-right: 10px;
  }
  .common-order-invoice .cube-checker-item_active{
    background: rgba(255,233,226,1);
    border-color: #FB683C;
    color: #FB683C;
  }
  .common-order-invoice .cube-input:after,
  .common-order-invoice .cube-textarea-wrapper:after,
  .common-order-invoice .cube-checker-item_active:after{
    display: none;
  }

  .common-order-invoice .cube-input input,
  .common-order-invoice .cube-input{
    height: 24px;
    line-height: 24px;
    color: #444;
    font-size: 17px;
    display: block;
    margin: 0;
    padding: 0;
    box-sizing:border-box;
  }
  .common-order-invoice .cube-textarea-wrapper{
    height: 24px;
  }
  .common-order-invoice .cube-textarea-wrapper textarea{
    font-style: normal;
    color: #444;
    font-size: 18px;
  }
  .common-order-invoice .cube-textarea_expanded{
    height: 48px;
  }
  .common-order-invoice .cube-textarea{
    padding: 0;
  }

</style>
<style scoped>
.invoice{
  font-size: 14px;
}
.bg{
  background: rgba(241,241,241);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
}
.tip{
  line-height: 44px;
  height: 44px;
  border-bottom: 1px solid #d8d8d8;
  margin-top: 7px;
  background: #fff;
  box-sizing:border-box;
  padding: 0 15px;
  color: #868686;
}
.form-box{
  background: #fff;
  padding: 0 0 0 15px;
}
.item{
  display: block;
  position: relative;
  color: #444;
  font-size: 17px;
  border-bottom: 1px solid #d8d8d8;
  padding: 10px 0;
  overflow: hidden;
}
.item .label{
  position: relative;
  padding-left: 8px;
  padding-bottom: 10px;
  line-height: 24px;
}
.item .label:before{
  content: "*";
  color: #FC1806;
  font-size: 17px;
  display: block;
  position: absolute;
  left: 0;
  line-height: 30px;
}
.dib{
  width: 252px;
  padding-right: 15px;
  box-sizing:border-box;
  text-align: left;
  display: block;
  float: right;
}
.noborder{
  border: none;
}
</style>
