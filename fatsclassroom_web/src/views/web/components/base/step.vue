<template>
  <div class="step">
      <div class="item"
      :class="{active:index <= active}"
      v-for="(item,index) in stepList"
      :style="itemStyle"
      :key="index">
        <span :class="{last:index==active}" class="line"></span>
        <div class="step-head">
          {{item.id}}
        </div>
        <div v-if="item.activeTitle == '' || index > active" class="step-title">
          {{item.title}}
        </div>
        <div v-if="item.activeTitle != '' && index <= active" class="step-active-title">
          {{item.activeTitle}}
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name: 'step',
  data() {
    return {
      name: 'step',
      itemStyle: { width: '33%' },
    };
  },
  props: {
    type: { // 步骤条类型
      type: String,
      default: () => 'order',
    },
    stepList: { // 步骤条数据
      type: Array,
      default: () => [],
    },
    active: {
      type: Number,
      default: () => 0,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.itemStyle.width = `${100 / this.stepList.length}%`;
    },
  },
};
</script>
<style scoped>
  .step{
    width: 100%;
    height: 100%;
    font-size: 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    position: relative;
    overflow: hidden\0;
  }

  .step-head{
    margin: 0 auto 10px auto;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: #fff;
    background: #C0C0C0;
    border-radius: 100%;
  }

  .step .item{
    float: left\0;
    text-align: center;
    position: relative;
    font-size: 12px;
    color: #444;
    letter-spacing: 0;
  }
  .step .active .line,
  .step:before{
    content: "";
    position: absolute;
    width: 100%;
    height: 6px;
    background: #C0C0C0;
    top: 7px;
    left: 0;
    z-index: -1;
    border-radius: 6px;
    box-sizing:border-box;
  }
  .step .active .line{
    background: #FB683C;
    border-radius: 0;
    width: 101%;
  }
  .step .active:nth-child(1) .line{
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }
  .step .active .line.last{
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  .step .active .step-head{
    background: #FB683C;
  }
  .active .step-active-title,
  .active .step-title{
    color: #FB683C;
    min-height: 20px;
    line-height: 20px;
  }

</style>
