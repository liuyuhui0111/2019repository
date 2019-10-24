<template>
  <div class="base-img" :style="imgStyle">
    <slot>
      <template v-if="lazy">
      <img @click="click"
      v-if="src || defaultSrc"
      :alt="alt"
      v-lazy="src || defaultSrc">
      </template>
       <template v-else>
         <img @click="click"
          v-if="src || defaultSrc"
          :alt="alt"
          :src="src || defaultSrc">
       </template>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'baseImg',
  data() {
    return {
      name: 'baseImg',
      imgStyle: {
        paddingTop: '10%',
      },
    };
  },
  props: {
    width: { // 标题内容
      type: Number,
      default: () => 1,
    },
    height: { // 更多
      type: Number,
      default: () => 1,
    },

    src: { // 更多
      type: String,
      default: () => '',
    },
    defaultSrc: { // 更多
      type: String,
      default: () => '',
    },
    alt: { // 更多
      type: String,
      default: () => '',
    },
    lazy: {
      type: Boolean,
      default: () => true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let top = `${(this.height / this.width) * 100}%`;
      this.imgStyle = {
        paddingTop: top,
      };
    },
    click() {
      this.$emit('click');
    },
  },
};
</script>
<style scoped>
    .base-img{
      position: relative;
      width: 100%;
    }
    .base-img img{
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
    }
</style>
