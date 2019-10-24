
<template>
  <!--   <div>
      <div class="itembox1">
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
    </div>
    <span class="itemsub" @click="init">初始化聊天</span> -->
    <div>

    <div v-if="curUserData.token" class="mask">
      <message ref="message"></message>
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
        id: 'l849643088@163.com',
        name: '测试用户',
        icon: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1372494972,1692060958&fm=26&gp=0.jpg',
        account: 'l849643088@163.com',
        channelFrom: '1624',
        fromAddress: 'http://test.5ifapiao.com:8888/course-430100004#/index',
        fromName: '优税学院',
        fromContent: 'http://test.5ifapiao.com:8888/course-430100004#/index',
        companyLocation: 'http://test.5ifapiao.com:8888/course-430100004#/index',
        accountId: 'l849643088@163.com',
        distributorId: 0,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWNlbnNlIjoibWFkZSBieSBoZWF2ZW4iLCJ1c2VyX25hbWUiOiJsODQ5NjQzMDhAMTYzLmNvbUNQIiwic2NvcGUiOlsic2VydmVyIl0sInVzZXJUeXBlIjoiQyIsImV4cCI6MTU2NjkxMTY4MiwidXNlcklkIjo2OTksImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJqdGkiOiI3ZDAwMzg1Yy1mMmQxLTQxMGQtYTMzZi0wMDZiMjExNTU4ZWMiLCJjbGllbnRfaWQiOiJmYXRjIn0.LJP4639v9-QT9rKAn2m9H6qoFJQewbPheTUShIBlKW0',
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (!this.$route.query.token) {
        this.$message('参数不对，请核对传入参数,toekn distributorId channelFrom 必填项');
        return;
      }
      /*eslint-disable*/ 
      let params = this.$route.query;
      for (let key in params) {
        params[key] = decodeURIComponent(params[key]);
      }
      
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /*background: rgba(0,0,0,0.5);*/
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
