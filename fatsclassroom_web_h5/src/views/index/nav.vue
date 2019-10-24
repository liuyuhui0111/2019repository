<template>
  <div class="nav">
    <div class="item"
    v-for="(item,index) in navlist"
    @click="emit('navclick',item)"
    :key="index">
    <span :class="item.icon"></span>
    <p>{{item.title}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'IndexNav',
  data() {
    return {
      navlist: [
        {
          icon: 'icon-online',
          title: '录播课',
          path: '/online-class',
        },
        {
          icon: 'icon-offline',
          title: '公开课',
          path: '/open-class',
        },
      ],
    };
  },
};
</script>
<style scoped>
  .nav{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-bottom: 15px;
  }
  .item{
    width: 50%;
    text-align: center;
    display: block;
    float: left;
    font-size: 14px;
  }
  .item .icon-offline,
  .item .icon-online{
    display: block;
    width: 55px;
    height: 55px;
    background: url('./imgs/icon-online.png') no-repeat center center;
    background-size: 55px 55px;
    margin: 15px auto 5px auto;
  }
  .item .icon-offline{
    background-image: url('./imgs/icon-offline.png');
  }
</style>
