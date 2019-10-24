<template>
<div class="classTitle">
    <span :style="{color:color}">{{ title }}</span>
</div>
</template>

<script>
export default {
  name: 'classTitle',
  props: {
    title: String, // 分类名称
    color: String, // 字体颜色
  },
};
</script>

<style lang="less" scoped>
.classTitle{
    width: 100%;
    height: 45px;
    border-bottom: .5px solid #D8D8D8;
    background-color: #fff;
    padding: 0 15px;
    line-height: 45px;
    margin-top: 7px;
    span{
        font-size: 14px;
        color: #444444;
    }
}
</style>
