
<template>
  <div>
     <!--    <div class="itembox1">
      <div>id: <input type="text" v-model="params.id"></div>
      <div>name: <input type="text" v-model="params.name"></div>
      <div>icon: <input type="text" v-model="params.icon"></div>
      <div>account: <input type="text" v-model="params.account"></div>
      <div>channelFrom: <input type="text" v-model="params.channelFrom"></div>
      <div>fromAddress: <input type="text" v-model="params.fromAddress"></div>
      <div>fromName: <input type="text" v-model="params.fromName"></div>
      <div>fromContent: <input type="text" v-model="params.fromContent"></div>
      <div>companyLocation: <input type="text" v-model="params.companyLocation"></div>
      <div>accountId: <input type="text" v-model="params.accountId"></div>
      <div>distributorId: <input type="text" v-model="params.distributorId"></div>
      <div>token: <input type="text" v-model="curUserData.token"></div>
    </div>-->
    <span class="itemsub" @click="init(params)">初始化聊天</span>

    <div v-if="curUserData.token && isShowMessage" class="mask">
      <message @hide="isShowMessage = false;" ref="message"></message>
    </div>
  </div>
</template>

<script>
import message from '@/components/message.vue';

export default {
  name: 'init',
  components: {
    message,
  },
  data() {
    return {
      params: {
        accnout: '13311110000',
        accnoutId: '13311110000',
        account: '13311110000',
        channelFrom: 1624,
        companyLocation: 'http://test.5ifapiao.com:8888/course-110102019#/index?',
        distributorId: '30c59a46658b4c8e91385e0dae5ffa65',
        fromAddress: 'http://test.5ifapiao.com:8888/course-110102019#/index?',
        fromContent: '首页',
        fromName: '优税学院',
        host: 'http://test.5ifapiao.com:8888',
        icon: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1372494972,1692060958&fm=26&gp=0.jpg',
        id: '13311110000',
        name: '13311110000',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWNlbnNlIjoibWFkZSBieSBoZWF2ZW4iLCJ1c2VyX25hbWUiOiIxMzAxMDEwMTAxMVBQIiwic2NvcGUiOlsic2VydmVyIl0sInVzZXJUeXBlIjoiUCIsImV4cCI6MTU3MTgzNTk5NywidXNlcklkIjoxMDAwMDAwMDkwLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXSwianRpIjoiNGJmOWI4NTgtNTU0Mi00MTAzLTgxNTktZGEyYWEwYWQ0MDYzIiwiY2xpZW50X2lkIjoiZmF0YyJ9.olAgjtfpMXdG0lWiaHyat_hNOfhfo-24BQImsQzTBxw',
      },
      isShowMessage: true,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init(data) {
      let params = data || this.$route.query;
      if (!params.token) {
        this.$message('参数不对，请核对传入参数,toekn distributorId channelFrom 必填项');
        return;
      }
      /*eslint-disable*/ 
      
      for (let key in params) {
        params[key] = decodeURIComponent(params[key]);
      }
      this.isShowMessage = true;
      this.setcurUserDataFn(params);
      // http://10.1.31.83:8080/#/init?distributorId=25c05c1966e14404aeeab6b77009750c&fromAddress=1&channelFrom=1624&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWNlbnNlIjoibWFkZSBieSBoZWF2ZW4iLCJ1c2VyX25hbWUiOiJsODQ5NjQzMDhAMTYzLmNvbUNQIiwic2NvcGUiOlsic2VydmVyIl0sInVzZXJUeXBlIjoiQyIsImV4cCI6MTU2NzYwMTMxOCwidXNlcklkIjoxNjQ1LCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXSwianRpIjoiM2QxMDE2ZjctNWU1Mi00MTNjLTgwMjEtMGVkZjQwZjA0ZWI5IiwiY2xpZW50X2lkIjoiZmF0YyJ9.ntMFXgb9S7HQz7uKXFVHYWWDP9IvwHVgvPZ5YUylcos
      /* eslint-enable */
    },
  },
};
/* eslint-enable */
</script>
<style scope>
.mask{
    width: 100%;
    height: 100%;
    max-width: 550px;
    max-height: 600px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 3px 0 #ccc;
}
.itembox1 div{
  margin: 10px 0;
}
.itemsub{
  background: #f1f1f1;
  padding: 10px 30px;
  margin: 10px auto;
  cursor: pointer;
  display: block;
  text-align: center;
  width: 50%;
}
</style>
