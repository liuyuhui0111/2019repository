<template>
  <div v-if="list.length>0" class="nav">
    <div v-for="(item,index) in list"
    class="item"
    :class="{active:navindex == index}"
    @click="navClick(item,index)"
    :key="index">
      <span>{{item.text}}</span>
    </div >
  </div>
</template>
<script>
export default {
  name: 'basenav',
  data() {
    return {
      name: 'basenav',
      navindex: 0,
    };
  },
  props: {
    list: { // 标题内容
      type: Array,
      default: () => [],
    },
    curindex: { // 标题内容
      type: [String, Number],
      default: () => 0,
    },
  },
  mounted() {
    this.navindex = this.curindex;
  },
  watch: {
    $route() {
      this.navindex = this.curindex;
    },
  },
  methods: {
    navClick(item, index) {
      this.$emit('navClick', item, index);
      if (item.path) {
        this.routerReplace(item.path);
      } else {
        this.navindex = index;
      }
    },
  },
};
</script>
<style scoped>
.nav{
    display: flex;
    width: 100%;
    height: 40px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
    background: #fff;
  }
  .nav .item{
    width: 50%;
    text-align: center;
    font-size: 0;
    position: relative;
  }
  .nav .item span{
    font-size: 14px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    position: relative;
  }
  .nav .active span{
    color: #FB683C;
  }
  .nav .active:after{
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    height: 3px;
    background: #FB683C;
    border-radius: 100px;
    bottom: 0;
    left: 0;
  }
</style>
