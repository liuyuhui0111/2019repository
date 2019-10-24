<template>
  <div class="login">
      <VPExpert>VPExpert</VPExpert>
      <VPExpert></VPExpert>
  </div>
</template>
<script>
// import {
//   login, reg,
// } from '@/api/apis';

export default {
  name: 'login',
  data() {
    return {
      name: 'login',

      boolTrue: true,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {

    },

  },
};
</script>
<style scoped>
.photo{
  width: 150px;
  height:150px;
}
.photo img{
  width:100%;
  height: 100%;
}
</style>
