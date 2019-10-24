<template>
  <div class="common-layout-header">
    <div class="logo">
      <div class="logo-box">
        <img src="@/assets/icon/logo_img.png" class="logo-img">
        <img src="@/assets/icon/logo_text.png" class="logo-text">
      </div>
      <span>专家端</span>
    </div>
    <div class="user-info">
      <el-popover
        placement="bottom"
        popper-class="common-layout-header-dialog-tipbox"
        width="120"
        trigger="hover"
      >
        <div class="user" slot="reference">
          <img class="avatar" :src="curUserData.headImg" alt="">
        </div>
        <div class="user-op">
          <div class="op" @click="logout">退出登录</div>
        </div>
      </el-popover>
      <div class="info">{{curUserData.account}}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .common-layout-header {
    background-color: #313134;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 24px;
  }
  .logo {
    white-space: nowrap;
    .logo-box {
      display: inline-block;
    }
    img {
      height: 34px;
      display: inline-block;
      vertical-align: top;
    }
    .logo-img {
      width: 34px;
    }
    span {
      display: inline-block;
      vertical-align: top;
      color: #e8e8e8;
      margin-left: 10px;
    }
  }
  .user, .info {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    color: #e8e8e8;
  }
  .user {
    cursor: pointer;
  }
  .info {
    margin-left: 5px;
  }
  .avatar {
    width: 26px;
    height: 26px;
    background-color: #f3f3f3;
    border: 1px solid #e8e9e9;
    border-radius: 50%;
  }
  .op {
    height: 50px;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    transition: color .3s;
    &:hover {
      color: #39A9FF;
    }
  }
</style>
