<template>
  <div class="aside-bar">
    <div class="avatar">
      <img :src="curUserData.headImg" alt="">
      <p>{{curUserData.name}}</p>
    </div>
    <ul class="nav-list">
      <li v-for="(item, index) in routerList"
      :class="{active:$route.path == item.path}"
       :key="index">
        <router-link :to="item.path">
          <i class="fi" :class="item.icon"></i>{{item.text}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routerList: [
        {
          path: '/askMange',
          icon: 'icon2zixunguanli',
          text: '咨询管理',
        },
        {
          path: '/assessMange',
          icon: 'icon2pingjiaguanli',
          text: '评价管理',
        },
        {
          path: '/set',
          icon: 'icon2gerenshezhi',
          text: '个人设置',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.aside-bar {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 210px;
  bottom: 0;
  background-color: #fff;
  text-align: center;
  padding-top: 30px;
  overflow-y: auto;
}
.avatar {
  font-size: 18px;
  color: #333;
  margin-bottom: 40px;
  img {
    width: 74px;
    height: 74px;
    border-radius: 50%;
    margin-bottom: 10px;
    border: 1px solid #e8e9e9;
    background-color: #f3f3f3;
  }
}
.nav-list {
  li {
    a {
      padding: 15px;
      font-size: 16px;
      display: block;
      color: #333;
      text-decoration: none;
      i {
        margin-right: 5px;
      }
      &:hover, &.active {
        background-color: #33C8DF;
        color: #fff;
      }
    }
  }
}
</style>
