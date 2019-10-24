<style>
.rong-input span {
  display: inline-block;
  width: 60px;
}
.rong-show-box {
  /*border: 1px solid lightgray;*/
  padding: 10px;
}
.rong-show-box h3, .rong-show-box p {
  margin: 5px 0;
}

</style>
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
    <!-- <div class="itembox1">token: <input type="text" v-model="params.token"></div> -->
  <!-- <span class="itemsub" @click="init">初始化聊天</span> -->
    <div v-if="curUserData.token" class="mask">
      <message ref="message"></message>

    </div>
  </div>
</template>

<script>
import message from '@/components/message.vue';

export default {
  name: 'landing-page',
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
    // this.init();
    // window.vue.setcurUserDataFn({
    //   id: 'l849643088@163.com',
    //   name: '测试用户',
    //   icon: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1372494972,1692060958&fm=26&gp=0.jpg',
    //   account: 'l849643088@163.com',
    // });
    console.log(this.curUserData);
  },
  methods: {
    init() {
      /*eslint-disable*/ 
      window.vue.setcurUserDataFn(this.params);
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
  background: rgba(0,0,0,0.5);
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
