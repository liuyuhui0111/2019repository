<template>
  <div v-show="scrollTop>innerHeight || isShowBackTop"
  @click="backTop"
   class="backtop"></div>
</template>
<script>
import { getScrollTop, setScrollTop } from '@/assets/utils/util';

export default {
  name: 'BackTop',
  data() {
    return {
      timer: null,
      scrollTop: 0,
      innerHeight: 700,
    };
  },
  props: {
    isShowBackTop: {
      type: Boolean,
      default: () => false,
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    },
  },
  methods: {
    init() {
      this.initScroll();
    },
    initScroll() {
      // 监听滚动条事件 判断当前滚动条位置
      this.innerHeight = window.innerHeight;
      const oThis = this;
      this.scrollTop = getScrollTop();
      window.addEventListener('scroll', () => {
        const scorllTop = getScrollTop();
        clearTimeout(this.timer);
        oThis.timer = setTimeout(() => {
          oThis.scrollTop = scorllTop;
        }, 300);
      }, false);
    },
    backTop() {
      this.scrollTop = 0;
      setScrollTop(0);
      this.emit('backTop');
    },
  },
};
</script>
<style scoped>
  .backtop{
    position: fixed;
    right: 5px;
    bottom: 88px;
    width: 30px;
    height: 30px;
    background: url('./imgs/icon-backtop.png') no-repeat center center;
    background-size: 100% 100%;
    z-index: 999;
  }
</style>
