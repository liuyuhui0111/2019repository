<template>
    <div class="sub_outer">
        <span @click="childMethod" class="sub-btn">{{ btnName }}</span>
    </div>
</template>

<script>
/* eslint-disable no-eval */

export default {
  name: 'myButton',
  props: {
    btnName: String,
    eventName: String,
  },
  methods: {
    childMethod() {
      eval(`this.$parent.${this.eventName}();`);
    },
  },
};
</script>

<style lang="less" scoped>
    .sub_outer {
        margin-top: 41px;
        width: 100%;
        padding: 10px 15px;
        box-sizing: border-box;
        padding-top: 0;
        .sub-btn {
            background: #FB683C;
            border-radius: 4px;
            display: block;
            width: 100%;
            height: 47px;
            text-align: center;
            line-height: 47px;
            color: #fff;
            font-size: 18px;
        }
    }
</style>
