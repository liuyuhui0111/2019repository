<template>
  <div class="title-box">
    <slot>
        <p v-if="title" class="title">{{title}}</p>
    </slot>
    <slot name="more">
        <ul v-if="list.length>0" class="list">
            <li v-for="(item,index) in list"
            @click="navclick(item,index)"
            :class="{active:index == navIndex}"
            :key="index">{{item.text}}</li >
        </ul>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'base-title',
  data() {
    return {
      name: 'base-title',
      navIndex: -1,
    };
  },
  props: {
    title: { // 标题内容
      type: String,
      default: () => '',
    },
    list: { // 列表
      type: Array,
      default: () => [],
    },
    curIndex: { // 当前选中那个
      type: Number,
      default: () => 0,
    },

  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.navIndex = this.curIndex;
    },
    navclick(item, index) {
      this.navIndex = index;
      this.$emit('navclick', item, index);
    },
  },
};
</script>
<style scoped>
  .title-box{
    font-size: 16px;
    color: #444444;
    letter-spacing: 0;
    width: 100%;
  }
  .title-box .title{
    margin: 20px 0;
    font-weight: bold;
  }
  .list{
    display: block;
    width: 100%;
    border-bottom: 1px solid #D4D4D4;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden\0;
  }
  .list li{
    padding-bottom: 10px;
    position: relative;
    margin-right: 40px;
    cursor: pointer;
    float: left\0;
  }
  .list li.active{
    color: #FB683C;
  }
  .list li.active:after{
    content: "";
    position: absolute;
    width: 100%;
    height: 3px;
    border-radius: 3px;
    background: #FB683C;
    left: 0;
    bottom: 0;
  }
</style>
