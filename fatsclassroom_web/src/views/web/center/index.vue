<template>
  <div v-if="isShowPage" class="center common-container-width">
    <!-- 侧栏导航 -->
    <div class="aside">
      <img class="photo" :src="user.src" alt="头像">
      <p class="name">{{user.name}}</p>
      <p class="level" @click="routerGo('/interests')">{{subString(user.level) || "用户"}}</p>
      <p v-if="user.dueTime" class="time">{{user.dueTime}}</p>
      <p class="usertip" v-if="user.effective==0">您的会员已到期</p>
      <ul class="navlist">
        <li v-for="(item,index) in userNav"
        :class="{active:item.href === navindex}"
        @click="changeNav(item,index)"
        :key="index">
        <span :class="item.icon"></span>
          <span>
            {{item.text}}
          </span>
        </li >
      </ul>
    </div>
    <!-- 主体展示区域 -->
    <div v-if="isShowPage" class="contain">
        <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/assets/utils/timefn';
// import { getTokenFn } from '@/assets/utils/util';
import { queryPersonalMap } from '@/api/apis';
import mixin from './js/mixin';

const defaultUrl = require('@/views/imgs/default.png');

export default {
  name: 'web-center',
  mixins: [mixin],
  data() {
    return {
      name: 'center', // default 组件不执行获取token
      isShowPage: false, // false
      user: {
        name: '',
        level: '', // 会员等级
        src: defaultUrl,
        dueTime: '', // 到期时间
        effective: '',
      },
      navindex: '',
      userNav: [
        {
          text: '个人中心',
          value: '0',
          icon: 'icon-preson',
          href: '/center/preson',
        },
        {
          text: '我的课程',
          value: '1',
          icon: 'icon-myclass',
          href: '/center/myclass',
        },
        {
          text: '我的收藏',
          value: '2',
          icon: 'icon-mycol',
          href: '/center/mycol',
        },
        {
          text: '我的报名',
          value: '3',
          icon: 'icon-signin',
          href: '/center/signin',
        },
        {
          text: '我的订单',
          value: '4',
          icon: 'icon-myorder',
          href: '/center/myorder',
        },
        {
          text: '个人设置',
          value: '5',
          icon: 'icon-myset',
          href: '/center/myset',
        },
      ],
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      // 当前路由

      this.navindex = this.$route.path;
      if (this.$route.path === '/center/detail') {
        this.navindex = '/center/myorder';
      }
    },
    token() {
      if (this.token) {
        this.queryPersonalMapFn();
      }
    },
  },
  computed: {
    getTime() {
      let time = this.user.dueTime || 0;
      return `${formatDate(time)}到期`;
    },
  },
  methods: {
    init() {
      // 获取个人中心页面
      this.navindex = this.$route.path;
      if (this.$route.path === '/center/detail') {
        this.navindex = '/center/myorder';
      }
      this.queryPersonalMapFn();
      // if (!this.token) {
      //   this.$router.replace('/index');
      // }
    },
    routerGo(path) {
      if (path) {
        this.$router.push({ path });
      }
    },
    changeNav(item) {
      this.navindex = item.href;
      this.$router.replace({ path: item.href });
    },
    queryPersonalMapFn() {
      // 个人中心页面
      queryPersonalMap().then((res) => {
        if (res.data.code === '0000') {
          this.isShowPage = true;
          this.user.dueTime = res.data.leaguerList.dueTime;
          this.user.effective = res.data.leaguerList.effective;
          this.setCenterData(res.data);
          if (this.commonUserData) {
            this.user.name = this.commonUserData.userName || '';
            this.user.level = this.commonUserData.leaguerLevelName || '';
          }
        }
      }).catch((err) => {
        this.$message({
          message: '获取个人数据失败，请稍后再试',
          type: 'warning',
        });
        console.log(err);
      });
    },

  },
};
</script>
<style scoped>
.navlist{
  margin-top: 10px;
}
.usertip{
  text-align: center;
  font-size: 14px;
  padding: 10px 0;
}
.contain{
  /*background: #ccc;*/
  width: 100%;
  min-height: 620px;
  padding-left: 40px;
  box-sizing:border-box;
  width: auto\0;
}
.center{
/*  display: flex;
  align-items: flex-start;
  justify-content: space-between;*/
  overflow: hidden\0;
  padding-left: 177px;
  position: relative;
  box-sizing:border-box;
  padding-bottom: 20px;
}
  .aside{
    width: 177px;
    background: #F7F7F7;
    border: 1px solid #D4D4D4;
    padding: 20px 0;
    box-sizing:border-box;
    font-size: 16px;
    color: #444444;
    letter-spacing: 0;
    position: absolute;
    left: 0;
    top: 0;
    }
  .photo{
    display: block;
    width: 70%;
    height: auto;
    margin:0 auto 10px auto;
  }
  .name{
    text-align: center;
    font-size: 14px;
  }
  .level{
    font-size: 12px;
    color: #Fff;
    text-align: center;
    background: #FB683C;
    border-radius: 100px;
    display: block;
    width: 64px;
    height: 21px;
    line-height: 21px;
    margin: 10px auto 6px auto;
  }
  .time{
    font-size: 14px;
    text-align: center;
  }
  .navlist li{
    display: block;
    position: relative;
    height: 42px;
    line-height: 42px;
    text-align: left;
    box-sizing:border-box;
    cursor: pointer;
    margin-bottom: 20px;
    overflow: hidden;
    padding-left: 60px;
  }
  .navlist li.active{
    background: #FB683C;
    color: #Fff;
  }
  .navlist li span{
    font-size: 16px;
  }
  .icon-preson,
  .icon-myclass,
  .icon-mycol,
  .icon-signin,
  .icon-myorder,
  .icon-myset{
    display: block;
    position: absolute;
    left: 30px;
    top: 8px;
    width: 25px;
    height: 25px;
    background: url('./imgs/icon-preson.png') no-repeat center center;
    background-size: 19px auto;
    /*top: 6px\0;*/
  }
  .navlist li.active .icon-preson{
    background-image: url('./imgs/icon-preson-on.png');
  }
  .icon-myset{
    background-image: url('./imgs/icon-myset.png');
  }
  .navlist li.active .icon-myset{
    background-image: url('./imgs/icon-myset-on.png');
  }

  .icon-myorder{
    background-image: url('./imgs/icon-myorder.png');
  }
  .navlist li.active .icon-myorder{
    background-image: url('./imgs/icon-myorder-on.png');
  }

  .icon-signin{
    background-image: url('./imgs/icon-signin.png');
  }
  .navlist li.active .icon-signin{
    background-image: url('./imgs/icon-signin-on.png');
  }

  .icon-mycol{
    background-image: url('./imgs/icon-mycol.png');
  }
  .navlist li.active .icon-mycol{
    background-image: url('./imgs/icon-mycol-on.png');
  }

  .icon-myclass{
    background-image: url('./imgs/icon-myclass.png');
    /*top: 8px\0;*/
  }
  .navlist li.active .icon-myclass{
    background-image: url('./imgs/icon-myclass-on.png');
  }
</style>
