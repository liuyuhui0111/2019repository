<template>
  <div class="troubleSort">
    <h1>{{title}}</h1>
    <List :hangyeSort="hangyeSort" :title="title1" @dataUpdate="dataUpdate1"></List>
    <List :hangyeSort="lingyuSort" :title="title2" @dataUpdate="dataUpdate2"></List>
    <List :hangyeSort="shuizhongSort" :title="title3" @dataUpdate="dataUpdate3"></List>
    <div style="text-align:center;">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>
<script>
import List from './componts/list.vue';

export default {
  components: {
    List,
  },
  data() {
    return {
      title: '问题分类',
      title1: '所属行业',
      title2: '所属领域',
      title3: '所属税种',
      hangyeSort: [{
        name: '计算机/互联网/通信/电子',
        id: '001',
        activeLi: false,
      }, {
        name: '商贸企业',
        id: '002',
        activeLi: false,
      }, {
        name: '仓储物流',
        id: '003',
        activeLi: false,
      }, {
        name: '软件与高新技术',
        id: '004',
        activeLi: false,
      }, {
        name: '金融保险',
        id: '005',
        activeLi: false,
      }, {
        name: '建筑与房地产',
        id: '006',
        activeLi: false,
      }, {
        name: '农业',
        id: '007',
        activeLi: false,
      }, {
        name: '软件与高新技术业',
        id: '008',
        activeLi: false,
      }, {
        name: '软件与高新技术',
        id: '009',
        activeLi: false,
      }, {
        name: '金融保险',
        id: '010',
        activeLi: false,
      }, {
        name: '建筑与房地产',
        id: '011',
        activeLi: false,
      }, {
        name: '商贸企业',
        id: '012',
        activeLi: false,
      }, {
        name: '商贸企业',
        id: '013',
        activeLi: false,
      }],
      lingyuSort: [{
        name: '计算机/互联网/通信/电子',
        id: '001',
        activeLi: false,
      }, {
        name: '商贸企业',
        id: '002',
        activeLi: false,
      }, {
        name: '仓储物流',
        id: '003',
        activeLi: false,
      }, {
        name: '软件与高新技术',
        id: '004',
        activeLi: false,
      }],
      shuizhongSort: [{
        name: '计算机/互联网/通信/电子',
        id: '001',
        activeLi: false,
      }, {
        name: '商贸企业',
        id: '002',
        activeLi: false,
      }, {
        name: '仓储物流',
        id: '003',
        activeLi: false,
      }, {
        name: '软件与高新技术',
        id: '004',
        activeLi: false,
      }],
    };
  },
  methods: {
    dataUpdate1(val) {
      console.log(val);
    },
    dataUpdate2(val) {
      console.log(val);
    },
    dataUpdate3(val) {
      console.log(val);
    },
    submit() {
      console.log('行业', this.hangyeSort);
      console.log('领域', this.lingyuSort);
      console.log('税种', this.shuizhongSort);
    },
  },
};
</script>
<style lang="scss" scoped>
  .troubleSort{
    background: #fff;
  }
</style>
