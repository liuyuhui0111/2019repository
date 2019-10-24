<template>
  <div class="base-title">
    <slot :title="title" name="title">
      <div v-if="title"
      class="title">{{title}}</div>
    </slot>
    <slot :more="moreurl" name="more">
      <div v-if="moreurl"
      @click="emit('moreclick',moreurl)"
      class="more">查看更多</div>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'BaseTitle',
  data() {
    return {
    };
  },
  props: {
    title: { // 标题内容
      type: String,
      default: () => '',
    },
    moreurl: { // 更多跳转地址
      type: String,
      default: () => '',
    },
  },
};
</script>
<style scoped>
  .base-title{
    display: block;
    width: 100%;
    box-sizing:border-box;
    padding: 0px 10px;
    line-height: 30px;
    height: 30px;
    overflow: hidden;
    font-size: 15px;
  }
  .base-title .title{
    float: left;
    font-weight: bold;
    padding-left: 8px;
    position: relative;
  }
  .base-title .title:before{
    content: "";
    position: absolute;
    display: block;
    width: 3px;
    height: 14px;
    top: 8px;
    left: 0px;
    background: #FB683C;
    border-radius: 3px;
  }
  .base-title .more{
    float: right;
    color: #868686;
    position: relative;
    padding-right: 11px;
    font-size: 12px;
  }
  .base-title .more:after{
    content: "";
    display: block;
    position: absolute;
    width: 8px;
    height: 8px;
    right: 0;
    top: 10px;
    background: url('./imgs/more.png') no-repeat center center;
    background-size: 100% auto;
  }
</style>
