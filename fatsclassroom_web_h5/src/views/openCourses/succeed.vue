<template>
    <div class="succeed">
        <div class="icon-succeed"></div>
        <span class="tit">报名成功</span>
        <span v-show="tkm != ''" class="text">听课凭借码:{{ tkm }}</span>
    </div>
</template>

<script>
export default {
  name: 'succeed',
  props: {
    tkm: String,
  },
};
</script>

<style lang="less" scoped>
    .succeed {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 30px 0 10px;
        .icon-succeed {
            width: 65px;
            height: 65px;
            background: url("img/chenggong.png") no-repeat;
            -webkit-background-size: 100%;
            background-size: 100%;
        }
        .tit {
            font-size: 20px;
            color: #333333;
            margin-top: 20px;
        }
        .text {
            color: #FB683C;
            font-size: 17px;
            margin-top: 15px;
        }

    }
</style>
