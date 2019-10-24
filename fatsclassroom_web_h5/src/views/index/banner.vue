<template>
  <div class="banner common-index-banner">
      <template v-if="list.length==1">
        <baseImg
        :width="756"
        :height="240"
        :lazy="lazy"
        @click="swiperClick(list[0],0)"
        :src="list[0].pic"
        :alt="list[0].title">
        </baseImg>
      </template>
      <template v-if="list.length>1">
      <cube-slide ref="slide"
      :loop="options.loop"
      :auto-play="options.autoPlay"
      :interval="options.interval"
      :options="{eventPassthrough:'vertical'}"
      :data="list">
        <cube-slide-item
        v-for="(item, index) in list"
        :key="index"
        @click.native="swiperClick(item, index)">
             <baseImg
        :width="756"
        :height="240"
        :lazy="lazy"
        @click="swiperClick(item,index)"
        :src="item.pic"
        :alt="item.title">
        </baseImg>
        </cube-slide-item>

          <template slot="dots" slot-scope="props">
          <span class="norem-dot"
          :class="{active: props.current === index}"
          v-for="(item, index) in props.dots"
          :key="index"></span>
        </template>
      </cube-slide>

      </template>
    </div>
</template>
<script>

export default {
  name: 'banner',
  data() {
    return {
      name: 'banner',
      lazy: false,
      flag: true,
      options: {
        loop: true,
        autoPlay: true,
        interval: 5000,
      },
    };
  },
  props: {
    list: { // 轮播图数据
      type: Array,
      default: () => [],
    },
  },
  // watch: {
  //   $route() {
  //     this.$nextTick(() => {
  //       /*eslint-disable*/
  //       this.$refs.slide && this.$refs.slide.refresh();
  //       /* eslint-enable */
  //     });
  //   },
  // },
  methods: {
    swiperClick(swiperItem, index) {
      if (swiperItem.url && this.flag) {
        this.ysxy_columnClick({ LocationName: `运营位${index + 1}`, columnTitle: '首页bannan' });
        this.flag = false;
        // 如果存在href 跳转
        window.location.href = swiperItem.url;
      }
    },
  },
};
</script>
<style>
 .common-index-banner .cube-slide-dots{
  position: absolute;
  bottom:0px;
  width: 100%;
  height: 30px;
  text-align: center;
  font-size: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
 }
 .common-index-banner .cube-slide-dots .norem-dot{
   position: relative;
  display: block;
  padding: 0;
  margin:0 2px;
  background: #D8D8D8;
  width: 6px;
  height: 6px;
  border-radius: 6px;
  overflow: hidden;

 }
 .common-index-banner .cube-slide-dots > span.active{
  background: #FB683C;
 }
</style>
