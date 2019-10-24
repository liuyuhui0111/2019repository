<template>
  <div>
    <div class="hangye">
      <p class="sortTitle">
        <span></span>
        {{title}}
      </p>
      <!-- eslint-disable -->
      <ul class="sortHangYe">
        <li 
          v-for="item in hangyeSort"
          :key="item.id" 
          :class="item.activeLi?'active':'unActive'"
          @click="item.activeLi=!item.activeLi, updateStatus()">
          {{item.name}}</li>
      </ul>
      <!-- eslint-enable -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    hangyeSort: Array,
  },
  data() {
    return {
      aaa: '',
    };
  },
  methods: {
    updateStatus() {
      this.$emit('dataUpdate', this.hangyeSort);
    },
  },
};
</script>
<style lang="scss" scoped>
  .hangye{
    .sortTitle{
      height: 16px;
      line-height: 16px;
      margin: 20px 0 0 20px;
      font-weight: 700;
      :nth-child(1){
        display: inline-block;
        height: 100%;
        width: 4px;
        vertical-align: top;
        background: #33C8DF;
      }
      // :nth-child(2){
      //   display: inline-block;
      //   height: 100%;
      //   width: 200px;
      //   vertical-align: top;
      // }
    }
    .sortHangYe{
      margin-top: 20px;
      overflow: hidden;
      li{
        // float: left;
        display: inline-block;
        padding: 5px 10px;
        margin:0 10px;
        cursor:pointer;
      }
      .active{
        background: #E0F8FC;
        border-radius: 4px;
        border-radius: 4px;
      }
      .unActive{
        background: #FFF;
        border-radius: 4px;
        border-radius: 4px;
      }
    }
    }
</style>
