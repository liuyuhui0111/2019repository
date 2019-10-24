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
  <div style="text-align: left;">
    <h1>Web SDK Vue CLI</h1>
    <p class="rong-input">
      <span>appkey:</span>
      <input type="text" v-model="params.appkey" size="20">
    </p>
    <p class="rong-input">
      <span>token:</span><input type="text" size="110" v-model="params.token">
    </p>
    <p class="rong-input">
      <span>navi:</span>
      <input type="text" size="50" v-model="params.navi"><i>此配置项仅针对私有部署，
      公有云请置空，格式为 10.10.10.10:8080</i>
    </p>
    <p class="rong-input">
      <span></span>
      <button @click="init">初始化客服</button>
    </p>
    <div class="rong-show-box">
      <h3>初始化以及消息接收:</h3>
    </div>
    <message ref="message" :params="params" :targetId="targetId"></message>


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
      // OA2LMom6eh4yO54ocyIAAnu4IalNLTguBim2CTjn4e34UNHhvR3lkMaXLj5yBngBWXTiCIyduk8=
      // NJg/IXsoY3sQNALYyJngIQdm41ql470fWXNt1SMYMf/BUZ/zIIhgzVHaJvLyo150OU7uh01wkqeUJU0pAMr8Qg==
      params: {
        appkey: 'sfci50a7s3uzi',
        token: 'ZRKvopltKvtz1Ueqp5Jk3RuqK+4nGFDGLN4mmc6ePN30HV4wUNiXczEOAeMLh4y/Ra3C92d9h5oLOE0XFf0seg==',
        navi: '',
      },
      targetId: '001',
    };
  },
  mounted() {
    // this.init();
  },
  methods: {

    init() {
      this.$refs.message.init();
    },


  },
};
/* eslint-enable */
</script>
