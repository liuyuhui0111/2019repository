<template>
  <div class="mycenter">
    <template v-if="!token">
      <!-- 未登录 -->
      <div class="login-box">
        <div class="photo"></div>
        <div @click="login"
      class="nologin">登录/注册</div>
      </div>
    </template>

    <template v-if="token && commonUserData && !commonUserData.leaguerLevelId">
      <!-- 已登录 非会员-->
      <div class="login-box">
        <div class="photo"></div>
        <div class="userbox">
          <p class="name">{{commonUserData.userName}}</p>
          <p class="btnbox">
            <span class="tip">加入会员尊享特权服务！</span>
            <span @click.stop="routerGo('/interests')" class="btn-addvip">加入会员</span>
          </p>
        </div>
      </div>
    </template>

     <template v-if="token
     && commonUserData
     && commonUserData.leaguerLevelId
     && commonUserData.effective!=0">
      <!-- 已登录 会员-->
      <div class="login-box vipbg">
        <div class="photo"></div>
        <div class="userbox">
          <p class="name">{{commonUserData.userName}}</p>
          <p class="btnbox">
            <span class="tip">{{getTime(commonUserData.dueTime)}}
             {{commonUserData.leaguerLevelName}}到期</span>

          </p>
        </div>
      </div>
    </template>


     <template v-if="token && commonUserData
     && commonUserData.leaguerLevelId
     && commonUserData.effective==0">
      <!-- 已登录 会员过期 需要续费-->
      <div class="login-box vipbg">
        <div class="photo"></div>
        <div class="userbox">
          <p class="name">{{commonUserData.userName}}</p>
          <p class="btnbox">
            <span class="tip">{{getTime(commonUserData.dueTime)}} 会员已到期</span>
            <span @click.stop="routerGo('/interests')" class="btn-vip">去续费</span>
          </p>
        </div>
      </div>
    </template>


    <div class="list">
      <div v-for="(item,index) in list"
      class="item"
      :class="item.iconClass"
      v-show="isVip(item)"
      @click="itemClick(item)"
      :key="index">
      {{item.text}}
      </div>
    </div>
    <div v-if="token" class="loginout">
      <span @click="loginoutFn" class="active">
        退出登录
      </span>
    </div>
  </div>
</template>
<script>
// import { formatDate } from '@/assets/utils/timefn';

export default {
  name: 'mycenter',
  data() {
    return {
      list: [
        {
          iconClass: 'icon-vipinvo',
          text: '查看会员剩余权益',
          path: '/residualEquity',
        },
        {
          iconClass: 'icon-order',
          text: '我的订单',
          path: '/center/myorder',
        },
        {
          iconClass: 'icon-sigin',
          text: '我的预约报名',
          path: '/center/signin',
        }, {
          iconClass: 'icon-col',
          text: '我的收藏',
          path: '/center/mycol',
        },
      ],
    };
  },

  methods: {

    itemClick(item) {
      if (item.path === '/residualEquity') {
        if (this.token && this.commonUserData && this.commonUserData.leaguerLevelId) {
          this.routerGo(item.path);
        } else {
          this.routerGo('/interests');
        }
      } else {
        this.routerGo(item.path);
      }
    },
    getTime(time) {
      return time.split(' ')[0];
    },
    isVip(item) {
      if (item.path !== '/residualEquity') {
        return true;
      }
      return this.token && this.commonUserData && this.commonUserData.leaguerLevelId;
    },
  },
  mounted() {
    if (!this.token || !this.commonUserData || !this.commonUserData.leaguerLevelId) {
      this.list.shift();
    }
  },
};
</script>
<style scoped>
.mycenter{
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  padding-bottom: 120px;
  overflow-y: auto;
}
.login-box{
  display: flex;
  height: 115px;
  border-bottom: 7px solid #f1f1f1;
  background: #fff;
  align-items: center;
  justify-content: flex-start;
}
.login-box.vipbg{
  background: url('./imgs/vipbg.png') no-repeat left top;
  background-size: 100% auto;
}
.photo{
  display: block;
  width: 105px;
  height: 105px;
  background: url('./imgs/default.png') no-repeat center center;
  background-size: 75px 75px;
}
.nologin{
  display: block;
  font-size: 18px;
  color: #333;
}
.userbox{
  flex: 1;
  padding-right: 15px;
}
.userbox .name{
  font-size: 18px;
  color: #333333;
  margin-bottom: 5px;
  font-weight: bold;
}
.login-box.vipbg .userbox .name{
  color: #fff;
}
.userbox .btnbox{
  display: flex;
  color: #FB683C;
  font-size: 12px;
  align-items: center;
  justify-content: space-between;
  line-height: 22px;
}
.userbox .btnbox .btn-addvip{
  width: 72px;
  height: 24px;
  line-height: 24px;
  box-sizing:border-box;
  text-align: center;
  border: 1px solid #FB683C;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}
.btn-vip{
  width: 60px;
  height: 24px;
  line-height: 24px;
  border-radius: 15px;
  box-sizing:border-box;
  text-align: center;
  background: #fff;
  color: #FB683C;
  font-size: 12px;
  font-weight: bold;
}

.login-box.vipbg .userbox .tip{
  height: 22px;
  line-height: 22px;
  color: #Fff;
  padding-left: 22px;
  background: url('./imgs/icon-vip.png') no-repeat center left;
  background-size: 17px 17px;
}


.list{
  box-sizing:border-box;
  width: 100%;
  border-bottom: 1px solid #f1f1f1;
  font-size: 17px;
  color: #444;
  background: #fff;
}
.list .item{
  display: block;
  position: relative;
  background: url('./imgs/icon-order.png') no-repeat 15px center;
  background-size: 24px 24px;
  padding: 0px 15px 0px 49px;
  box-sizing:border-box;
  height: 55px;
  line-height: 55px;
  border-bottom: 1px solid #d4d4d4;
}
.list .item.icon-sigin{
  background-image: url('./imgs/icon-sigin.png');
}
.list .item.icon-col{
  background-image: url('./imgs/icon-col.png');
  border:none;
}
.list .item.icon-vipinvo{
  background-image: url('./imgs/icon-vipinvo.png');
}
.loginout{
  position: fixed;
  bottom:80px;
  text-align: center;
  display: block;
  width: 100%;
  height: 24px;
  line-height: 24px;
  font-size: 17px;
}
.loginout .active{
  font-weight: 500;
}
</style>
