<template>
  <div class="title-box">
    <slot>
        <span v-if="title" class="title">{{title}}</span>
    </slot>
    <slot name="more">
        <span v-if="more" @click="moreClick" class="more">{{more}}</span>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'base-title',
  data() {
    return {
      name: 'base-title',
    };
  },
  props: {
    title: { // 标题内容
      type: String,
      default: () => '',
    },
    more: { // 更多
      type: String,
      default: () => '',
    },

  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
    },
    moreClick() {
      this.$emit('moreClick');
    },
  },
};
</script>
<style scoped>
    .title-box{
        font-size: 16px;
        color: #444;
        display: block;
        width: 100%;
        height: 100%;
        line-height: 22px;
        padding-bottom: 10px;
        padding-left: 13px;
        border-bottom: 1px solid #D4D4D4;
        box-sizing:border-box;
        position: relative;
    }
    .title-box:before{
        content: "";
        position: absolute;
        width: 3px;
        height: 17px;
        background: #FB683C;
        border-radius: 100px;
        left: 0;
        top: 2px;
    }
    .title{
        font-size: 1em;
        font-weight: bold;
    }
    .more{
        font-size: 1em;
    color: #868686;
    position: relative;
    float: right;
    padding-right: 13px;
    cursor: pointer;
    }
  .more:after{
    content: "";
    display: block;
    width: 7px;
    height: 12px;
    background: url('./imgs/more.png') no-repeat top left;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -6px;
  }
</style>
