<template>
    <div>
        <div class="success">
            <succeed :tkm="tkm"></succeed>
            <div v-if="tkm != ''" class="describe_outer">
                <span>听课前请通过凭借码签到入场听课~</span>
                <span>凭借码可在我的学习或我的预约报名中查看！</span>
            </div>
            <div v-else class="describe_outer">
                <span>请保持手机畅通，稍后课程顾问会联系您哒~</span>
            </div>
        </div>
        <my-btn @routerBack="routerBack" eventName="routerBack" btnName="查看预约报名记录"></my-btn>
    </div>

</template>
<script>
import succeed from './succeed.vue';

export default {
  name: 'success',
  data() {
    return {
      name: 'success',
      tkm: '',
    };
  },
  components: {
    succeed,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let tkm = JSON.parse(window.sessionStorage.getItem('openCourseTkm'));
      if (tkm) {
        this.tkm = tkm;
      } else {
        this.tkm = '';
      }
    },
    routerBack() {
      this.$router.push({ path: '/center/signin' });
    },
  },
};
</script>
<style lang="less" scoped>
    .success {
        width: 100%;
        text-align: center;
        font-size: 14px;
        /*color: #FB683C;*/
        line-height: 20px;
        letter-spacing: -0.68px;
        background-color: #fff;
        padding-bottom: 30px;
        .describe_outer {
            text-align: center;
            color: #888888;
            font-size: 14px;
            span{
                display: block;
            }
        }

    }

    .icon-success {
        display: block;
        width: 160px;
        padding-left: 50px;
        background: url('./img/icon-success.png') no-repeat left center;
        background-size: 40px 40px;
        font-size: 25px;
        color: #444444;
        letter-spacing: 0;
        height: 40px;
        box-sizing: border-box;
        margin: 0 auto 15px auto;
    }

    .back-btn {
        font-size: 17px;
        color: #FB683C;
        line-height: 25px;
    }
</style>
