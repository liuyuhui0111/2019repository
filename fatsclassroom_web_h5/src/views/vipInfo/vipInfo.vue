<template>
    <div class="empty" v-if="vipTypeList.length<1 && isShowPage">
        会员信息获取失败，请稍后再试
    </div>

    <div v-else class="vipInfo_outer vipInfo-vipInfo">
        <!-- nav start -->
        <cube-scroll
                ref="scroll"
                :data="vipTypeList"
                direction="horizontal"
                :class="{tac:isRenew}"
                class="horizontal-scroll-list-wrap nav_outer">
            <ul>
                <li
                        @click="tavsClick(index,item.id)"
                        :class="{active:tabsActive==index}"
                        :key="index" v-for="(item,index) in vipTypeList"
                        class="list-item">
                    <div class="itens_content">
                        <span>{{ item.name }}</span>
                        <span class="price">
                        <span>￥</span>
                        <span style="font-size: 29px">{{ item.fee }}</span>
                    </span>
                    </div>
                </li>
            </ul>
        </cube-scroll>
        <!-- nav end -->
        <div class="btns_outer">
            <div class="attention">
                <i class="icon-tishi"></i>
                <span>注：会员有效期为1年</span>
            </div>
            <div class="btns">
                <span @click="goOrder" class="joinBtn">{{ isRenew?'续费会员':'加入会员' }}</span>
                <span v-if="isqimoChatClickFlag" @click="qimoChatClickFn" class="zixunBtn">
                    <i class="icon-zixun"></i>
                    <span>咨询</span>
                </span>
            </div>
        </div>
        <!-- main start -->
        <div class="content_outer">
            <div class="title_outer">
                <div>
                    <span>会员特权</span>
                    <i class="icon-class"></i>
                </div>
            </div>
            <div class="coutent_info">
                <div
                        :class="{opacity: v.tickType == 1}"
                        :key="index"
                        v-for="(v,index) in vipInfoData.equityDtoList"
                        class="list_outer">
                    <img :src="v.pictureUrl" alt="">
                    <span>{{ v.name }}</span>
                </div>
            </div>
        </div>
        <!-- main end -->
        <div v-show="courseList != ''" class="content_outer">
            <div class="title_outer">
                <div>
                    <span>精品网络课程免费听</span>
                    <i class="icon-class"></i>
                </div>
                <div @click="clickMore" class="more">
                    <span>查看更多></span>
                </div>

            </div>
            <div class="course_info">
                <div
                        v-for="(v,index) in courseList"
                        :key="index"
                        class="course_item">
                    <img @click="clickCourse(v.id)" :src="v.bannerUrl" alt="">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
/* eslint-disable prefer-destructuring */


import { queryList, queryListDetialById } from '@/api/apis';
import { getSystem } from '@/assets/utils/util';

export default {
  name: 'vipInfo',
  data() {
    return {
      vipTypeList: [], // nav  tabs
      tabsActive: 0,
      vipInfoData: {},
      lodingShow: false,
      isShowPage: false,
      courseList: [], // 指定具体课程
      vipTypeId: '',
      isRenew: false,

    };
  },
  mounted() {
    this.isShowPage = false;
    this.queryListFn();
  },
  methods: {
    showBtn() {
      if (getSystem().ios) {
        window.location.href = `tel:${this.COMMON_COMP_DATA.phone}`;
        return;
      }
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: `确定拨打电话: ${this.COMMON_COMP_DATA.phone} 吗?`,
        confirmBtn: {
          text: '呼叫',
          active: true,
          disabled: false,

        },
        cancelBtn: {
          text: '取消',
          active: false,
          disabled: false,

        },
        onConfirm: () => {
          // 点击确定
          window.location.href = `tel:${this.COMMON_COMP_DATA.phone}`;
        },
        onCancel: () => {
          // 点击取消
        },
      }).show();
    },
    // 查询会员权益列表
    queryListFn() {
      // const that = this;
      this.lodingShow = false;
      queryList().then((res) => {
        this.isShowPage = true;
        if (res.data.code === '0000') {
          if (this.token && this.commonUserData && this.commonUserData.leaguerLevelId) {
            console.log(this.commonUserData);
            this.isRenew = true;
            res.data.list.forEach((item) => {
              if (item.id === this.commonUserData.leaguerLevelId) {
                res.data.list = [item];
              }
            });
          }
          this.tavsClick(0, res.data.list[0].id);
          this.lodingShow = true;
          this.vipTypeList = res.data.list;
          if (res.data.list.length > 0) {
            this.vipInfoData = this.vipTypeList[0];
          }
        }
      }).catch((err) => {
        this.isShowPage = true;
        console.log(err);
      });
    },
    // 指定课程
    queryListDetialByIdFn(id) {
      queryListDetialById({ pageSize: 4, pageNum: 1, id }).then((res) => {
        console.log(res);
        if (res.data.code === '0000') {
          this.courseList = res.data.list;
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    // 点击tabs
    tavsClick(index, id) {
      this.tabsActive = index;
      this.vipTypeId = id;
      this.vipInfoData = this.vipTypeList[index];
      this.queryListDetialByIdFn(id);
    },
    // 购买课程
    goOrder() {
      // vuex
      this.setOrderData({ item: this.vipInfoData, formData: { type: '3' } });
      this.$router.push({ path: '/order' });
    },
    // 查看更多
    clickMore() {
      this.$router.push({ path: `/vipclass?id=${this.vipTypeId}` });
    },
    // 课程详情
    clickCourse(id) {
      this.$router.push({ path: `/online-detail?cid=${id}` });
    },
    // 调客服
    qimoChatClick() {
      window.qimoChatClick();
    },
  },
};
</script>
<style lang="less">
    .vipInfo-vipInfo .cube-scroll-content {
        display: inline-block;
    }
</style>
<style lang="less" scoped>
    .empty {
        font-size: 16px;
        padding: 60px 0;
        text-align: center;
    }

    .vipInfo_outer {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        /*overflow: scroll;*/
        /*-webkit-overflow/-scrolling: touch;//这个属性可以实现，手指离开屏幕会惯性滑动一段距离*/
        div {
            box-sizing: border-box;
        }
        .nav_outer {
            padding: 15px 0;
            padding-bottom: 10px;
            background-color: #fff;
            &.tac {
                display: flex;
                justify-content: center;
            }
            ul {
                display: flex;
                justify-content: space-around;
                padding-right: 15px;
                li {
                    width: 107px;
                    height: 121px;
                    border: 1px solid #CCCCCC;
                    border-radius: 7px;
                    margin-left: 15px;
                    &.active {
                        border: 1px solid #FB683C;
                        background-color: rgb(254, 239, 235);
                        span {
                            color: #444444;
                            &.price {
                                display: block;
                                span {
                                    color: #FB683C;
                                }
                                color: #FB683C;
                            }
                        }
                    }
                    .itens_content {
                        width: 100%;
                        height: 100%;
                        padding: 15px 13.5px 19px;
                        box-sizing: border-box;
                        position: relative;
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        font-size: 15px;
                    }
                    span {
                        color: #444444;
                        &.price {
                            display: block;
                            span {
                                color: rgb(251, 177, 154);
                            }
                            color: rgb(251, 177, 154);
                        }
                    }
                }
            }
        }
        .btns_outer {
            width: 100%;
            padding: 15px 30px;
            padding-top: 0;
            background-color: #fff;
            .attention {
                color: #868686;
                font-size: 12px;
                display: flex;
                align-items: center;
                .icon-tishi {
                    display: inline-block;
                    width: 15px;
                    height: 15px;
                    background: url("img/tishi.png") no-repeat;
                    -webkit-background-size: 100%;
                    background-size: 100%;
                    margin-right: 5px;
                }
            }
            .btns {
                width: 100%;
                height: 47px;
                display: flex;
                border: .5px solid #FB683C;
                margin-top: 10px;
                .joinBtn {
                    flex: 1;
                    text-align: center;
                    line-height: 47px;
                    background-color: #FB683C;
                    border-radius: 2px 0 0 2px;
                    font-size: 18px;
                    color: #fff;
                }
                .zixunBtn {
                    width: 78.5px;
                    text-align: center;
                    font-size: 14px;
                    color: #FB683C;
                    line-height: 47px;
                    .icon-zixun {
                        display: inline-block;
                        width: 18px;
                        height: 18px;
                        background: url("img/zixun.png") no-repeat;
                        -webkit-background-size: 100%;
                        background-size: 100%;
                        position: relative;
                        top: 3px;
                    }
                }

            }
        }
        .link {
            background-color: rgb(241, 241, 241);
            height: 7px;
            width: 100%;
        }
        .content_outer {
            background-color: #fff;
            margin-top: 7px;
            .title_outer {
                width: 100%;
                padding: 15px 30px;
                display: flex;
                justify-content: space-between;
                .more {
                    span {
                        color: #868686;
                        font-size: 12px;
                    }
                }
                .icon-class {
                    display: inline-block;
                    width: 24px;
                    height: 12px;
                    background: url("img/huiyuantequan.png") no-repeat;
                    -webkit-background-size: 100%;
                    background-size: 100%;
                    margin-left: 5px;
                }
                span {
                    display: inline-block;
                    /*padding: 10px 0;*/
                    font-size: 16px;
                    color: #444444;
                    font-weight: 600;
                    font-family: "PingFangSC-Medium";
                }
                .red {
                    color: #f91e1e;
                    padding: 0;
                }
            }
            .coutent_info {
                width: 100%;
                margin-top: 10px;
                padding: 15px 15px;
                overflow: hidden;
                .list_outer {
                    width: calc(100% / 4);
                    overflow: hidden;
                    padding: 0 15px;
                    text-align: center;
                    height: 103px;
                    float: left;
                    font-size: 12px;
                    color: #444;
                    display: flex;
                    flex-direction: column;
                    /*justify-content: space-between;!**!*/
                    align-items: center;
                    opacity: .5;
                    &.opacity {
                        opacity: 1;
                    }
                    span {
                        /*margin-left: 16px;*/
                        color: #444;
                        margin-top: 10px;
                        line-height: 18px;
                    }
                    img {
                        border-radius: 50%;
                        border: none;
                        overflow: hidden;
                        width: 40px;
                        height: 40px;

                    }
                }
            }
            .course_info {
                width: 100%;
                padding: 0 24px;
                padding-bottom: 9px;
                background-color: #fff;
                overflow: hidden;
                margin-bottom: 25.5px;
                .course_item {
                    width: 50%;
                    height: 102px;
                    padding: 6px;
                    float: left;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .btn_outer {
                width: 100%;
                margin-top: 50px;
                text-align: center;
                img {
                    width: 193px;
                    height: 40px;
                    cursor: pointer;
                }
            }
        }
    }
</style>
