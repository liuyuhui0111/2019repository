<template>
    <div v-if="isShowPage" class="vipInfo_outer common-openCourses-openCoursesDetails">
    <template v-if="detailData.effective == 0">
      <div class="empty">
        课程已失效
      </div>
    </template>
    <template v-else>


        <!--banner start-->
        <div class="banner_outer">
            <!--<baseImg-->
                    <!--:width="310"-->
                    <!--:height="200"-->
                    <!--:src="detailData.pic">-->
            <!--</baseImg>-->
            <img :src="detailData.pic" alt="">
        </div>
        <!--banner end-->
        <!--title start-->
        <div class="title_outer">
            <div class="tit-left">
                <span class="title">
                     <!-- <span v-show="detailData.payType !== '0'" class="vip_tip">
                            VIP免费
                        </span> -->
                    {{ detailData.title }}
                </span>

            </div>
            <div class="tit-right">
                <span v-if="detailData.price > 0" class="red">￥{{ detailData.price }}</span>
                <span v-else class="green">免费</span>
                <div class="collect_box" @click="collectFn">
                    <i v-if="!isColl" class="icon-dark"></i>
                    <i v-else class="icon-bright"></i>
                    <span v-if="!isColl">收藏</span>
                    <!--bright-->
                    <span v-else style="color:#FB683C;">已收藏</span>
                </div>

            </div>
        </div>
        <!--title end-->
        <div class="link"></div>
        <!-- nav start -->
        <div :class="{fixed:isFixed}" ref="topTab" v-if="detailData" class="nav_outer">
            <ul>

                <li
                        @click="tavsClick(v.id)"
                        v-for="(v,index) in vipTypeList"
                        :key="index"
                        :class="{active:tabsActive==v.id}"
                        v-show="index==0 || detailData[v.key].length>1"
                >
                    <span>{{ v.name }}</span>
                    <div class="dbb-link"></div>
                </li>
            </ul>
        </div>
        <!-- nav end -->

        <!-- 课程信息 start -->
        <course-info :class="{mt44:isFixed}" :detailData="detailData" ref="child"></course-info>
        <!-- 课程信息 end -->

        <!--footer start-->

        <div class="footer_outer">
            <!--<span @click="goVip">开通会员免费学</span>-->
            <!--:class="{flex1: detailData.payType === '0'}"-->
            <div v-if="isqimoChatClickFlag" style="width: 80px;">
                <span @click="qimoChatClickFn"
                      class="item_consult">
                    <i class="icon-consult"></i>
                    咨询
                </span>
            </div>

            <span
                    :class="{'item_member':isQy && detailData.price > 0}"
                    @click="onlineSignFn"
                    class="item_course">
                    报名
                </span>
            <span v-show="!isQy && detailData.price > 0" @click="goVip" class="item_member">
                    会员免费学
                </span>
        </div>
        <!--footer end-->
      </template>
    </div>
</template>
<script>

import courseInfo from '@/views/components/courseInfo.vue';
import { findOfflineCourseById, saveMyCollection, queryEquity } from '@/api/apis';
import { getSystem } from '@/assets/utils/util';


export default {
  name: 'vipInfo',
  data() {
    return {
      vipTypeList: [
        { name: '课程信息', id: 0, key: '' },
        { name: '课程介绍', id: 1, key: 'introduce' },
        { name: '课程大纲', id: 2, key: 'outline' },
        { name: '课程计划', id: 3, key: 'plan' },
      ], // nav  tabs
      tabsActive: 0,
      imgUrl: 'http://pic14.nipic.com/20110529/7570613_004640647181_2.jpg',
      courseId: '',
      detailData: '',
      isColl: '', // 是否收藏
      saveMyCollectionParam: { // 收藏参数
        courseId: '', // 课程id
        onOffType: '0', // 线上线下0 : 公开课； 1 线上课
      },
      isShowPage: false,
      oldScrollTop: 0, // 吸顶
      isFixed: false,
      isQy: false,
    };
  },
  components: {
    courseInfo,
  },
  created() {

  },
  mounted() {
    this.init();
  },
  computed: {},
  destroyed() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    init() {
      this.courseId = parseInt(this.$route.query.cid, 10);
      // 滚动事件
      window.addEventListener('scroll', this.onScroll);
      this.findOfflineCourseByIdFn();
      if (this.token) {
        console.log('登录');
        this.queryEquityFn();
      }
    },
    // 获取详情
    findOfflineCourseByIdFn() {
      findOfflineCourseById({ id: this.courseId }).then((res) => {
        if (res.data.code === '0000' && res.data.data) {
          this.isShowPage = true;
          this.isColl = res.data.isFavorite && res.data.isFavorite.code === '8888';
          this.detailData = res.data.data;
          this.ysxy_detailView({
            contentTitle: this.detailData.title,
            contentId: this.detailData.id,
            mainTeacher: this.detailData.teacherName,
            contentSource: this.fromRoute,
            contentKind: '线下',
            contentType: this.detailData.price === '0' ? '免费' : '付费',
            contentPrice: this.detailData.price,
          });
          // 自定义分享
          this.initWxShareFn();
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    // 查询权益
    queryEquityFn() {
      queryEquity({ courseType: 1 }).then((res) => {
        if (res.data.code === '0000') {
          console.log(res);
          if (res.data.totalType === undefined || res.data.consumeNum <= 0) {
            this.isQy = false;
          } else {
            this.isQy = true;
          }
        }
      }).catch((err) => {
        console.log(err);
        this.$message('获取权益信息失败，请稍后再试');
      });
    },


    // 滚动事件 吸顶
    onScroll() {
      let scrollTop = window.pageYOffset
                    || document.documentElement.scrollTop
                    || document.body.scrollTop;
      let { offsetTop } = this.$refs.topTab;
      if (offsetTop !== 0) {
        this.oldScrollTop = offsetTop;
      }
      if (scrollTop > this.oldScrollTop) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    qimoChatClick() {
      window.qimoChatClick();
    },
    // 报名
    onlineSignFn() {
      if (this.detailData.state !== '0') {
        this.$message('课程已结束');
        return;
      }

      if (!this.token) {
        console.log('未登录');
        this.confirmLogin();
        return;
      }
      window.sessionStorage.setItem('openCourseDetailData', JSON.stringify(this.detailData));
      this.$router.push({ path: `/signup?cid=${this.courseId}` });
    },
    // 收藏
    collectFn() {
      // 点击收藏
      this.saveMyCollectionParam.courseId = this.courseId;
      this.saveMyCollectionFn();
    },
    initWxShareFn() {
      this.$nextTick(() => {
        this.wxShareTitle = this.detailData.title;
        // this.wxShareDesc = this.$route.meta.wxShareDesc || '默认描述信息';
        this.wxShareDesc = (document.querySelector('#shareDesc')
                        && document.querySelector('#shareDesc').innerText)
                        || window.location.href;
        this.wxShareUrl = window.location.href;
        this.wxShareImage = this.detailData.pic;
        this.wxShareFn(() => {
          this.ysxy_share({
            contentTitle: this.detailData.title,
            contentId: this.detailData.id,
            contentKind: '线下',
            contentType: this.detailData.price === '0' ? '免费' : '付费',
            contentPrice: this.detailData.price,
          });
        });
      });
    },
    saveMyCollectionFn() {
      // 收藏 如果未登录  提示去登陆
      if (!this.token) {
        console.log('未登录');
        this.confirmLogin();
        return;
      }

      saveMyCollection(this.saveMyCollectionParam).then((res) => {
        if (res.data.code === '0000') {
          if (res.data.type === '0') {
            this.isColl = false;
            this.$message('已取消收藏!');
          } else {
            this.ysxy_collect({
              contentTitle: this.detailData.title,
              contentId: this.detailData.id,
              contentKind: '线上',
              contentType: this.detailData.price === '0' ? '免费' : '付费',
              contentPrice: this.detailData.price,
            });
            this.isColl = true;
            this.$message('收藏成功!');
          }
        } else {
          this.$message(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    // 跳转会员介绍
    goVip() {
      this.$router.push({ path: '/interests' });
    },
    // 拨打电话弹框
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
          this.collPhone();
        },
        onCancel: () => {
          // 点击取消
        },
      }).show();
    },
    collPhone() {
      window.location.href = `tel:${this.COMMON_COMP_DATA.phone}`;
    },

    // 点击tabs
    tavsClick(index) {
      this.tabsActive = index;
      this.$refs.child.scrollToDom(index);
    },
  },
};
</script>
<style lang="less" scoped>
    .empty{
      font-size:14px;
      text-align: center;
      padding:40px 0;
    }
    .vipInfo_outer {
        width: 100%;
        height: 100%;
        position: relative;
        div {
            box-sizing: border-box;
        }
        .fixed {
            position: fixed;
            top: 0;
            left: 0;
            margin: 0;
            z-index: 2000;
        }
        .mt44 {
            margin-top: 51px;
        }
        .header_outer {
            width: 100%;
            text-align: center;
            background-color: #fff;

            span {
                display: inline-block;
                font-size: 17px;
                color: #444;
                padding: 10px;
            }
        }
        .banner_outer {
            width: 100%;
            height: 200px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .title_outer {
            width: 100%;
            min-height: 75px;
            padding: 10px 15px;
            display: flex;
            background-color: #fff;
            flex-direction: column;
            justify-content: space-between;
            .tit-left {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow: hidden;
                flex: 1;
                .title {
                    line-height: 16px;
                    .vip_tip {
                        display: inline-block;
                        width: 60px;
                        height: 18px;
                        font-size: 10px;
                        color: #fff;
                        text-align: center;
                        line-height: 20px;
                        background: #FB683C;
                        border-radius: 8px;
                        transform: scale(0.9);
                    }
                }
                span {
                    font-size: 14px;
                    color: #444;
                    /*white-space: nowrap;*/
                    /*overflow: hidden;*/
                    /*text-overflow: ellipsis;*/
                    word-wrap: break-word;
                    word-break: break-all;
                    /*overflow: hidden;*/
                }

            }
            .tit-right {
                /*width: 38px;*/
                display: flex;
                /*flex-direction: column;*/
                align-items: center;
                justify-content: space-between;
                .collect_box {
                    display: flex;
                    /*flex-direction: column;*/
                    align-items: center;
                    /*justify-content: center;*/
                }
                .red {
                    color: #F91E1E;
                    font-size: 17px;
                }
                .green {
                    color: #2DAF53;
                    font-size: 17px;
                }
                span {
                    font-size: 12px;
                    color: #868686;
                    margin-left: 3px;
                }
                i {
                    display: inline-block;
                    width: 17px;
                    height: 17px;
                }
                .icon-dark {
                    background: url("img/shoucang.png");
                    background-size: 100% 100%;
                }
                .icon-bright {
                    background: url("img/shoucang2.png");
                    background-size: 100% 100%;
                }
            }
        }
        .nav_outer {
            width: 100%;
            height: 44px;
            background-color: #fff;
            border-bottom: 1px solid #d4d4d4;
            ul {
                display: block;
                overflow: hidden;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: space-around;
                li {
                    box-sizing: border-box;
                    height: 100%;
                    text-align: center;
                    line-height: 40px;
                    padding: 0 12px;
                    position: relative;
                    cursor: pointer;
                    &.active {
                        .dbb-link {
                            position: absolute;
                            bottom: 0;
                            left: 12px;
                            width: calc(100% - 24px);
                            height: 3px;
                            background-color: #fb683c;
                            border-radius: 4px;
                            //   border-bottom: 3px solid #fb683c;
                        }
                        span {
                            color: #fb683c;
                            white-space: nowrap;
                        }
                    }

                    span {
                        font-size: 14px;
                        white-space: nowrap;
                    }
                }
            }
        }
        .footer_outer {
            width: 100%;
            height: 50px;
            position: fixed;
            bottom: 0;
            left: 0;
            background-color: #fff;
            display: flex;
            border-top: 1px solid #D8D8D8;
            .item_consult {
                /*width: 80px;*/
                display: block;
                /*line-height: 80px;*/
                text-align: center;
                color: #FB683C;
                font-size: 14px;
                &.flex1 {
                    flex: 1;
                }
                .icon-consult {
                    width: 15px;
                    height: 15px;
                    display: inline-block;
                    /*line-height: 50px;*/
                    position: relative;
                    top: 3px;
                    background: url("img/zixun2.png") no-repeat;
                    -webkit-background-size: 100%;
                    background-size: 100%;
                }
            }
            .item_course {
                background: #FF825E;
            }
            .item_member {
                background: #FB683C;
            }
            span {
                flex: 1;
                color: #fff;
                font-size: 18px;
                text-align: center;
                line-height: 50px;
            }
        }
        .link {
            background-color: rgb(241, 241, 241);
            height: 7px;
            width: 100%;
        }
    }
</style>
