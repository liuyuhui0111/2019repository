<template>
  <div class="views-lineOfCourses-lineOfCoursesDetails vipInfo_outer">
    <!-- nav start -->
    <div ref="topTab" v-show="isFixed" :class="{fixed:isFixed}" class="nav_outer">
      <ul>
        <li
          @click="tavsClick(index)"
          v-for="(v,index) in vipTypeList"
          :key="index"
          :class="{active:tabsActive==index}"
        >
          <div class="item_box">
            <span>{{ v }}</span>
            <div class="dbb-link"></div>
          </div>
        </li>
      </ul>
    </div>
    <!-- nav end -->
    <div v-if="!courseOut" class="coutent">
      <cube-scroll
        ref="scroll"
        :scrollEvents="['scroll']"
        @scroll="onScrollHandle"
        @pulling-up="onPullingUp"
        :options="options">

      <!--banner start-->
      <div class="banner_outer">
        <!--开通会员 弹框-->
        <!--<div v-show="isShowDialogToBuy" class="block_outer">-->
        <!--<div class="tip">-->
        <!--<span class="bigtext">开通会员或购买才可继续学习</span>-->
        <!--<span>还有{{ lengthNum }}个章节未学习</span>-->
        <!--</div>-->
        <!--<div class="btns">-->
        <!--<span @click="isShowDialogToBuy = false" class="cancel">取消</span>-->
        <!--<span @click="goVip" class="confirm">开通会员免费学</span>-->
        <!--</div>-->
        <!--</div>-->
        <!--消耗权益 弹框-->
        <!--<div v-show="isShowDialogToIn" class="block_outer">-->
        <!--<div class="tip">-->
        <!--<span class="bigtext">权益消耗提醒</span>-->
        <!--<span>观看本课会消耗您1次线上课程观看权益。</span>-->
        <!--<span>当前剩余: {{ consumeNum }}次</span>-->
        <!--</div>-->
        <!--<div class="btns">-->
        <!--<span @click="isShowDialogToIn = false" class="cancel">取消</span>-->
        <!--<span @click="continueShow" class="confirm">继续观看</span>-->
        <!--</div>-->
        <!--</div>-->
        <!--购买课程 弹框-->
        <!--<div v-show="consumeShow" class="block_outer">-->
        <!--<div class="tip">-->
        <!--&lt;!&ndash;<span class="bigtext">权益消耗提醒</span>&ndash;&gt;-->
        <!--<span class="bigtext">您购买的观看权益已消耗完,请去web端</span>-->
        <!--<span class="bigtext">购买课程或续费。</span>-->
        <!--</div>-->
        <!--<div class="btns">-->
        <!--<span @click="consumeShow = false" class="confirm">知道了</span>-->
        <!--</div>-->
        <!--</div>-->
        <!-- 没有权限 弹框 -->
        <!--<div v-show="goWebBuyShow" class="block_outer">-->
        <!--<div class="tip">-->
        <!--&lt;!&ndash;<span class="bigtext">权益消耗提醒</span>&ndash;&gt;-->
        <!--<span class="bigtext">-->
        <!--您已购买的{{ leaguerLevelName }}会员没有该课程的观看权限-->
        <!--</span>-->
        <!--<span class="bigtext">请去web端购买课程。</span>-->
        <!--</div>-->
        <!--<div class="btns">-->
        <!--<span @click="goWebBuyShow = false" class="confirm">知道了</span>-->
        <!--</div>-->
        <!--</div>-->
        <!--continueOnShow-->
        <div v-show="continueOnShow" class="block_outer">
          <div class="tip">
            <!--<span class="bigtext">权益消耗提醒</span>-->
            <span class="bigtext">流量消耗提醒</span>
            <span>您正在使用移动网络观看将产生流量费用。</span>
          </div>
          <div class="btns">
            <span @click="continueOnShow = false" class="cancel">取消</span>
            <span @click="continueOnFn" class="confirm">继续观看</span>
          </div>
        </div>
        <!--播放器-->
        <div v-show="isShowIframe && !isShowIframeImg" class="iframe-box">
          <iframe
            id="playBox"
            allowfullscreen
            :width="iframe.width"
            :height="iframe.height"
            :src="curUrl"
            frameborder="0"
            scrolling="no"
          ></iframe>
        </div>
        <img
          v-show="!isShowIframe || isShowIframeImg"
          @click="play()" :src="detail.bannerUrl" alt/>
        <img
          @click.stop="play()"
          v-show="!isShowIframe || isShowIframeImg"
          class="bf"
          src="./img/bf.png"
          alt
        />
      </div>
      <!--banner end-->
      <!--title start-->
      <div class="title_outer">
        <div class="tit-left">
          <span class="title">
            <span v-show="detail.payType !== '0' && detail.text !== ''" class="vip_tip"></span>
            {{ detail.title }}
          </span>
          <div class="tit-b">
            <div class="leftbox">
              <span v-if="detail.payType != 0" class="red">￥{{ detail.price }}</span>
              <span v-else class="green">免费</span>
              <span v-show="detail.payType !== '0' && detail.text !== ''" class="orange">
                <small @click="showTip()">
                  ?
                  <div v-show="tipShow" class="tip_outer">{{ detail.text }}</div>
                </small>
              </span>
            </div>

            <span>{{ getTime(detail.courseVideoEntity) }}分钟</span>
            <span>{{ detail.learnNum || 0 }}人已学</span>
            <div class="tit-right">
              <div class="collect_box" @click="collectFn">
                <i v-if="!isColl" class="icon-dark"></i>
                <i v-else class="icon-bright"></i>
                <span v-if="!isColl">收藏</span>
                <!--bright-->
                <span v-else style="color:#FB683C;">已收藏</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--title end-->
      <!-- nav start -->
      <div ref="topTab" id="scrollTopBox" :class="{fixed:isFixed}" class="nav_outer">
        <ul>
          <li
            @click="tavsClick(index)"
            v-for="(v,index) in vipTypeList"
            :key="index"
            :class="{active:tabsActive==index}"
          >
            <div class="item_box">
              <span>{{ v }}</span>
              <div class="dbb-link"></div>
            </div>
          </li>
        </ul>
      </div>
      <!-- nav end -->
      <!-- 课程信息 start -->
      <course-info
        :class="{mt44:isFixed}"
        :detailData="detail"
        v-show="tabShow == 0"
        ref="child">

      </course-info>
      <!-- 课程信息 end -->
      <!--章节 start-->
      <classTitle :class="{mt44:isFixed}" v-show="tabShow == 1" title="章节"></classTitle>
      <div v-show="tabShow == 1" class="section_outer">
        <ul>
          <li
            :class="{active:curIndex === index}"
            :key="index"
            @click="changeVideo(v,index)"
            v-for="(v,index) in detail.courseVideoEntity"
          >
            <div class="item-left">
              <i v-show="curIndex !== index" :class="v.icon"></i>
              <i
                v-show="curIndex === index && !isShowIframe"
                :class="{
                                        'icon-suoding1':(
                                            footerBtnShow
                                            &&
                                            v.isTry == 0
                                            &&
                                            token
                                            &&
                                            detail.payType !== '0'
                                            ),
                                        'icon-bofang1': (
                                            v.isTry == 1
                                            ||
                                            !token
                                            ||
                                            !footerBtnShow
                                            ||
                                            detail.payType == '0'
                                         )
                                     }"
              ></i>
              <i
                v-show="curIndex === index && isShowIframe && !isShowIframeImg"
                class="icon-zanting"
              ></i>
            </div>
            <div
              :class="{suoding:footerBtnShow
                                            &&
                                            v.isTry == 0
                                            &&
                                            token
                                            &&
                                            detail.payType !== '0'}"
              class="item-right"
            >
              <span class="item-name">{{ v.name }}</span>
              <span class="time">{{ getMinite(v.videoMinute) }}</span>
            </div>
          </li>
        </ul>
      </div>
      <!--<span v-show="tabShow == 1" class="footer_text">没有更多了~</span>-->
      <!--章节 end-->
      </cube-scroll>
    </div>

    <div v-else class="err_outer">
      <i class="icon-out"></i>
      <span>您查看的课程已下架,</span>
      <span>您可以返回首页浏览其它页面</span>
      <span @click="routerBack" class="back-btn">返回首页</span>
    </div>
    <!--footer start-->
    <div v-show="flagNum >= 2" class="footer_outer">
      <!--<span @click="goVip">开通会员免费学</span>-->
      <span
        v-if="isqimoChatClickFlag"
        @click="qimoChatClickFn"
        :class="{flex1:!footerBtnShow||consumeNum != 0 || detail.payType === '0'}"
        class="item_consult"
      >
          <i class="icon-consult"></i>
          咨询
        </span>
      <span
        @click="goOrder"
        v-show="
                            (footerBtnShow&&detail.payType !== '0')
                            &&
                            (consumeNum ==0 && detail.payType !== '0')"
        class="item_course"
      >购买课程</span>
      <span
        @click="goVip"
        v-show="
                            (footerBtnShow&&detail.payType !== '0')
                            &&
                            (consumeNum ==0 && detail.payType !== '0')"
        class="item_member"
      >会员免费学</span>
    </div>
    <!--footer end-->
  </div>
</template>
<script>
/* eslint-disable no-unused-vars,import/extensions,eqeqeq */

import courseInfo from '@/views/components/courseInfo.vue';

import {
  getCourse,
  getVideoUrl,
  initCourseRecord,
  saveMyCollection,
  equityConsume,
  videorights,
} from '@/api/apis';

export default {
  name: 'vipInfo',
  data() {
    return {
      flagNum: 0,
      isFixed: false, // 吸顶
      leaguerLevelName: '', // 当前用户会员类型
      blockShow: false,
      tabShow: 0,
      vipTypeList: ['详情', '章节'], // nav  tabs
      tabsActive: 0,
      courseId: '', // 课程id
      isColl: '', // 是否收藏
      detail: {}, // 课程详情数据
      saveMyCollectionParam: {
        // 收藏参数
        courseId: '', // 课程id
        onOffType: '1', // 线上线下0 : 公开课； 1 线上课
      },
      isShowIframe: false,
      iframe: {
        width: '100%',
        height: '100%',
      },
      curUrl: '',
      isShowIframeImg: true,
      sec: 0, // 已经播放时间  秒为单位
      videoId: '', // 视频id
      initCourseRecordTimer: {},
      curIndex: 0, // 当前播放章节
      curPlayItem: null,
      curPlayIndex: 0,
      consumeNum: 0,

      isCanRequest: true,

      isShowErrorTips: false, // 是否展示已下架模块
      isShowDialogToBuy: false, // 是否显示购买弹窗
      isShowDialogTomes: false, // 是否显示评价弹窗
      isShowDialogToIn: false, // 消耗权益弹窗
      goWebBuyShow: false, // 去购买
      consumeShow: false,

      continueOn: false, // 未使用wifi 是否播放
      continueOnShow: false, // 流量播放弹框
      courseOut: false,
      footerBtnShow: true, // 底部按钮
      tipShow: false, // tip提示
      oldScrollTop: 0, // 元素位置
      options: {
        // pullUpLoad: {
        //   threshold: 20,
        //   txt: { more: '哈哈哈', noMore: '没有更多了~' },
        // },
      },
    };
  },
  computed: {
    // options() {
    //   return {
    //     pullUpLoad: {
    //       threshold: 20,
    //       txt: { more: '哈哈哈', noMore: '没有更多了~' },
    //     },
    //   };
    // },
    lengthNum() {
      let flag = false;
      if (this.detail.courseVideoEntity) {
        this.detail.courseVideoEntity.forEach((item) => {
          if (item.isTry === 1) {
            flag = true;
          }
        });
        if (flag) {
          return this.detail.courseVideoEntity.length - 1;
        }
        return this.detail.courseVideoEntity.length;
      }
      return '';
    },
  },
  components: {
    courseInfo,
  },
  mounted() {
    if (this.commonUserData) {
      this.leaguerLevelName = this.commonUserData.leaguerLevelName;
    }
    this.init();
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    init() {
      // 获取公开课详情
      this.courseId = parseInt(this.$route.query.cid, 10) || '';
      // 调用公开课详情接口
      this.getCourseFn();
      // 已经播放时间
      this.sec = this.$route.query.sec || 0;
      // 滚动事件
      // window.addEventListener('scroll', this.onScroll);
    },
    // 上拉
    onPullingUp() {
      if (this.tabShow != '1') {
        return;
      }
      // 模拟更新数据
      setTimeout(() => {
      // 如果没有新数据
        this.$refs.scroll.forceUpdate();
      }, 1000);
    },
    // 滚动事件
    onScrollHandle(pos) {
      // console.log(pos);
      this.onScroll(pos);
      // this.pullDownY = pos.y;
      // if (pos.y > 0) {
      //   this.pullDownStyle = `top:${pos.y}px`;
      //   this.triggerSurpriseFlag = false;
      //   if (this.pullDownY > 90) {
      //     this.triggerSurpriseFlag = true;
      //   }
      // }
      // this.$refs.topHeader.style.opacity = this.headerStyle;
    },
    // 权益消耗弹框
    showQy() {
      this.$createDialog({
        type: 'confirm',
        title: '会员权益消耗提醒',
        content: `${'<span style="color:#444444;">本课程将消耗1次录播课观看权益!</span>'
                    + '<p style="color:#868686;">当前剩余：<span style="color:#FB683C;">'}${
          this.consumeNum
        }</span>次录播课观看权益</p>`,
        confirmBtn: {
          text: '消耗',
          active: true,
          disabled: false,
        },
        cancelBtn: {
          text: '取消',
          active: false,
          disabled: false,
        },
        onConfirm: () => {
          //  确认
          this.continueShow();
        },
        onCancel: () => {
          //  取消
        },
      }).show();
    },
    // 权益消耗完
    showQyWhole() {
      this.$createDialog({
        type: 'alert',
        title: '温馨提示',
        content:
                        '<span style="color:#444444;">您录播课的会员权益已用完,</span>'
                        + '<p style="color:#444444;display: block;text-align: center;">购买后才能继续学习！</p>',
        confirmBtn: {
          text: '知道了',
          active: true,
          disabled: false,
        },
        onConfirm: () => {
        },
        onCancel: () => {
          //  取消
        },
      }).show();
    },
    // 购买课程
    goOrder() {
      // vuex
      this.setOrderData({ item: this.detail, formData: { type: '1' } });
      this.$router.push({ path: '/order' });
    },
    // 调客服
    qimoChatClick() {
      window.qimoChatClick();
    },
    // 滚动事件 吸顶
    onScroll(pos) {
      let scrollTop = window.pageYOffset
                    || document.documentElement.scrollTop
                    || document.body.scrollTop;
      let { offsetTop } = this.$refs.topTab;
      if (offsetTop !== 0) {
        this.oldScrollTop = offsetTop;
      }
      // console.log(Math.abs(pos.y, 10), offsetTop);

      if (Math.abs(pos.y, 10) > this.oldScrollTop) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    initWxShareFn() {
      this.$nextTick(() => {
        // 微信分享
        this.wxShareTitle = this.detail.title;
        // this.wxShareDesc = this.$route.meta.wxShareDesc || '默认描述信息';
        this.wxShareDesc = (document.querySelector('#shareDesc')
                        && document.querySelector('#shareDesc').innerText)
                        || window.location.href;
        this.wxShareUrl = window.location.href;
        this.wxShareImage = this.detail.bannerUrl;
        this.wxShareFn(() => {
          this.ysxy_share({
            contentTitle: this.detail.title,
            contentId: this.detail.id,
            contentKind: '线上',
            contentType: this.detail.price === '0' ? '免费' : '付费',
            contentPrice: this.detail.price,
          });
        });
      });
    },
    getNetworkType() {
      // 获取网络状态,wifi net 流量
      let ua = navigator.userAgent;
      let networkStr = ua.match(/NetType\/\w+/)
        ? ua.match(/NetType\/\w+/)[0]
        : 'NetType/other';
      networkStr = networkStr.toLowerCase().replace('nettype/', '');
      let networkType;
      console.log(networkStr);
      switch (networkStr) {
        case 'wifi':
          networkType = 'wifi';
          break;
        case '5g':
          networkType = 'net';
          break;
        case '4g':
          networkType = 'net';
          break;
        case '3g':
          networkType = 'net';
          break;
        case '3gnet':
          networkType = 'net';
          break;
        case '2g':
          networkType = 'net';
          break;
        default:
          networkType = 'error';
      }
      return networkType;
    },
    // 会员免费学 tip
    showTip() {
      this.tipShow = !this.tipShow;
    },
    // 获取视频地址
    getVideoUrlFn() {
      let { courseId, videoId } = this;
      if (videoId && courseId) {
        getVideoUrl({ courseId, videoId })
          .then((res) => {
            if (res.data.code === '0000') {
              this.curUrl = res.data.videoUrl;
              this.isShowIframe = true;
            }
          })
          .catch((err) => {
            console.log(err);
            this.isShowIframe = false;
            // this.$message('获取视频播放地址失败，请稍后再试');
          });
      }
    },
    // 消耗权益继续观看
    continueShow() {
      if (this.isCanRequest) {
        this.isCanRequest = false;
      } else {
        return;
      }
      // 消耗权益继续观看
      equityConsume({ equityNum: 1, courseType: 0, courseId: this.courseId })
        .then((res) => {
          this.isCanRequest = true;
          if (res.data.code === '0000') {
            this.isShowDialogToIn = false;
            // 重定义icon图标
            for (let i = 0; i < this.detail.courseVideoEntity.length; i += 1) {
              if (!this.token) {
                // console.log('未登录');
                this.detail.courseVideoEntity[i].icon = 'icon-bofang';
              } else if (this.detail.courseVideoEntity[i].duration > 0) {
                if (this.detail.courseVideoEntity[i].isComplete === 1) {
                  this.detail.courseVideoEntity[i].icon = 'icon-wancheng';
                } else {
                  this.detail.courseVideoEntity[i].icon = 'icon-jilu';
                }
              } else {
                this.detail.courseVideoEntity[i].icon = 'icon-bofang';
              }
            }
            this.startPlay();
          } else {
            this.$message('消耗权益失败，请重试');
          }
        })
        .catch((err) => {
          this.isCanRequest = true;
          console.log(err);
          // this.$message('消耗权益失败，请重试');
        });
    },
    // 流量继续播放
    continueOnFn() {
      this.continueOnShow = false;
      this.continueOn = true;
      this.startPlay();
    },
    // 开始播放
    startPlay() {
      if (this.getNetworkType() === 'net' && !this.continueOn) {
        this.continueOnShow = true;
        return;
      }
      const totalTime = this.getTime(this.detail.courseVideoEntity);
      const alreadyTime = this.durationAll(this.detail.courseVideoEntity);
      this.ysxy_videoPlay({
        contentSource: this.fromRoute,
        contentId: this.detail.id,
        contentTitle: this.detail.title,
        contentTime: totalTime,
        isFinish: alreadyTime >= totalTime,
        playDuration: alreadyTime,
        contentPrice: this.detail.price,
        mainTeacher: this.detail.teacherName,
      });
      this.isShowDialogTomes = false;
      this.isShowDialogToBuy = false;
      this.isShowDialogToIn = false;
      this.goWebBuyShow = false;
      this.consumeShow = false;

      this.isShowIframeImg = false;
      this.courseId = this.curPlayItem.courseId;
      this.videoId = this.curPlayItem.id;
      this.getVideoUrlFn();
      this.curIndex = this.curPlayIndex;
      // 开启同步播放记录
      this.initCourseRecordFn();
    },
    // 视频播放时长
    durationAll(list) {
      let num = 0;
      if (list) {
        list.forEach((item, index) => {
          if (!(index === 0 && item.isTry === 1)) {
            num += parseInt(item.duration, 10);
          }
        });
      }
      if (num) {
        /*eslint-disable*/
                    return parseInt(num / 60);
                }
                return 0;
            },
            play(type) {
                if (this.sec > 0) {
                    // 计算当前播放秒数处在第几个播放时间段内
                    let flag = true;
                    let cursec = 0;
                    this.detail.courseVideoEntity.forEach((item, index) => {
                        cursec += parseInt(item.videoMinute, 10) * 60;
                        console.log(cursec);
                        if (this.sec <= cursec && flag) {
                            this.curIndex = index;
                            flag = false;
                        }
                    });
                } else {
                    // 如果当前播放时间小于0
                    this.curIndex = 0;
                }
                let item = this.detail.courseVideoEntity[this.curIndex];
                if (!type) {
                    this.isShowIframeImg = false;
                    this.changeVideo(item, this.curIndex);
                }
            },
            initCourseRecordFn() {
                // 同步播放请求定时器
                if (this.initCourseRecordTimer[this.videoId]) {
                    clearInterval(this.initCourseRecordTimer[this.videoId]);
                }

                this.initCourseRecordTimer[this.courseId] = setInterval(() => {
                    initCourseRecord({
                        course_id: this.courseId,
                        video_id: this.videoId
                    }).then(res => {
                        if (res.data.code === "0001") {
                            clearInterval(this.initCourseRecordTimer[this.videoId]);
                        }
                    });
                }, 60 * 1000);
            },
            changeVideo(item, index) {
                this.curPlayItem = item;
                this.curPlayIndex = index;
                if (item.isTry === 0 && this.detail.payType === "1") {
                    // 如果不是试听章节 且需要付费时 判断当前用户是否有听课权力
                    this.checkUserIsCanPlay();
                } else if (item.isTry === 1) {
                    // 如果是试听章节
                    this.startPlay();
                } else if (this.token) {
                    // 不是试听，但是免费的 登录后才可以观看
                    this.startPlay();
                } else {
                    // 未登录
                    this.confirmLogin();
                    // this.$message({
                    //   message: '该章节需要登录才可以继续观看',
                    //   type: 'warning',
                    // });
                }
            },
            showDialog(type) {
                if (!this.token) {
                    if (!this.token) {
                        console.log("未登录");
                        this.confirmLogin();
                        return;
                    }
                    return;
                }
                this.isShowIframe = false;
                // this.isShowIframeImg = false;
                this.isShowDialogTomes = false;
                this.isShowDialogToBuy = false;
                this.isShowDialogToIn = false;
                this.goWebBuyShow = false;
                this.consumeShow = false;
                if (type === 0) {
                    // 展示评论
                    this.isShowDialogTomes = true;
                } else if (type === 1) {
                    // 展示消耗权益
                    // this.isShowDialogToIn = true;
                    this.showQy();
                } else if (type === 2) {
                    // 展示购买
                    // this.isShowDialogToBuy = true;
                    this.$message("请购买观看!");
                } else if (type === 3) {
                    // this.goWebBuyShow = true;
                    this.$message("请购买观看!");
                } else if (type === 4) {
                    this.showQyWhole();
                }
            },
            checkUserIsCanPlay() {
                // 判断用户是否登录
                if (!this.token) {
                    this.confirmLogin();
                    return;
                }
                if (this.token) {
                    // token 存在  查看是否可以播放  去购买  消耗权益提醒
                    // 查询视频播放权限code"1000";可以观看   "1001";
                    // 不是会员   "1002";//没有权限
                    videorights({courseId: this.courseId})
                        .then(res => {
                            if (res.data.code === "1000") {
                                // 可以观看
                                this.startPlay();
                            } else if (res.data.code === "1001") {
                                this.showDialog(2);
                            } else if (res.data.code === "1002") {
                                this.showDialog(4);
                            } else if (res.data.code === "1003") {
                                // 消耗权益
                                this.consumeNum = res.data.consumeNum || 0;
                                this.showDialog(1);
                            } else if (res.data.code === "1004") {
                                // 购买课程
                                this.showDialog(3);
                            }
                            if (res.data.code === "0002") {
                                this.$message(res.data.message);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            // this.$message('服务器错误，请稍后再试');
                        });
                }
            },
            // 是否解锁  //初始化调用
            jurisdictionFn() {
                if (this.detail.payType === "1") {
                    if (!this.token) {
                        this.flagNum = 2

                        return;
                    }
                    videorights({courseId: this.courseId})
                        .then(res => {
                            this.flagNum = 2
                            this.consumeNum = res.data.consumeNum || 0;
                            if (res.data.code === "1000") {
                                this.footerBtnShow = false;
                            } else if (this.token) {
                                for (
                                    let i = 0;
                                    i < this.detail.courseVideoEntity.length;
                                    i += 1
                                ) {
                                    this.detail.courseVideoEntity[i].icon = "icon-suoding";
                                }
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            this.$message("服务器错误，请稍后再试");
                        });
                }else{
                    this.flagNum = 2
                }
            },
            // 收藏
            collectFn() {
                // 点击收藏
                this.saveMyCollectionParam.courseId = this.courseId;
                this.saveMyCollectionFn();
            },
            saveMyCollectionFn() {
                // 收藏 如果未登录  提示去登陆
                if (!this.token) {
                    console.log("未登录");
                    this.confirmLogin();
                    return;
                }

                saveMyCollection(this.saveMyCollectionParam)
                    .then(res => {
                        if (res.data.code === "0000") {
                            if (res.data.type === "0") {
                                this.isColl = false;
                                this.$message("已取消收藏!");
                            } else {
                                this.ysxy_collect({
                                    contentTitle: this.detail.title,
                                    contentId: this.detail.id,
                                    contentKind: "线上",
                                    contentType: this.detail.price === "0" ? "免费" : "付费",
                                    contentPrice: this.detail.price
                                });
                                this.isColl = true;
                                this.$message("收藏成功!");
                            }
                        } else {
                            this.$message(res.data.message);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        // this.$message('服务器错误，请稍后再试');
                    });
            },
            getCourseFn() {
                // 获取公开课详情
                if (this.courseId) {
                    getCourse({id: this.courseId})
                        .then(res => {
                            if (res.data.code === "0000") {
                                // /*eslint-disable*/
                                // favorite字段，是否收藏 0否 1是 默认0
                                this.isColl = res.data.favorite;
                                this.detail = res.data.course;
                                this.ysxy_detailView({
                                    contentTitle: this.detail.title,
                                    contentId: this.detail.id,
                                    mainTeacher: this.detail.teacherName,
                                    contentSource: this.fromRoute,
                                    contentKind: "线上",
                                    contentType: this.detail.price === "0" ? "免费" : "付费",
                                    contentPrice: this.detail.price
                                });
                                this.detail.text = "";
                                if (res.data.leaguerFree != "") {
                                    res.data.leaguerFree.forEach((item, index) => {
                                        if (index !== res.data.leaguerFree.length - 1) {
                                            this.detail.text += `${item.name}、`;
                                        } else {
                                            this.detail.text += item.name;
                                        }
                                    });
                                    this.detail.text += "可享受免费观看权益";
                                }

                                console.log(this.detail);
                                this.detail.courseVideoEntity.forEach(item => {
                                    if (!this.token) {
                                        console.log("未登录");
                                        item.icon = "icon-bofang";
                                    } else if (item.duration > 0) {
                                        if (item.isComplete == 1) {
                                            item.icon = "icon-wancheng";
                                        } else {
                                            item.icon = "icon-jilu";
                                        }
                                    } else {
                                        item.icon = "icon-bofang";
                                    }
                                });
                                this.jurisdictionFn();

                                if (this.detail) {
                                    // this.getList();
                                    if (!this.isShowIframe) {
                                        this.play(true);
                                    }
                                }
                            } else if (res.data.code === "7001") {
                                this.courseOut = true;
                            }
                            // 微信分享
                            this.initWxShareFn();
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            },
            // 课程时间
            getTime(list) {
                let num = 0;
                if (list) {
                    list.forEach((item, index) => {
                        if (!(index === 0 && item.isTry === 1)) {
                            num += parseInt(item.videoMinute, 10);
                        }
                    });
                }

                return num;
            },
            // 章节时间
            getMinite(min) {
                let hour =
                    parseInt(min / 60, 10) > 10
                        ? parseInt(min / 60, 10)
                        : `0${parseInt(min / 60, 10)}`;
                let minite = min % 60 >= 10 ? min % 60 : `0${min % 60}`;
                return `${hour}:${minite}:00`;
            },
            // 点击tabs
            tavsClick(index) {
                this.$refs.scroll.scrollTo(0, 0, 0);
                this.onScroll({x:0,y:0})
                if(index == 1){
                    this.options = {
                        pullUpLoad: {
                            threshold: 20,
                            txt: { more: '上拉加载~', noMore: '没有更多了~' },
                        },
                    };
                }else{
                    this.options = {}
                }
                this.tabsActive = index;
                this.tabShow = index;
            },
            // 跳转会员介绍
            goVip() {
                this.$router.push({path: "/interests"});
            },
            routerBack() {
                this.$router.push({path: "/index"});
            }
        },
        beforeDestroy() {
            Object.keys(this.initCourseRecordTimer).forEach(key => {
                clearInterval(this.initCourseRecordTimer[key]);
            });
        }
    };
</script>
<style>
  .views-lineOfCourses-lineOfCoursesDetails .courseInfo_outer{
    margin-bottom: 0;
    padding-bottom: 0;
  }
</style>
<style lang="less" scoped>
  .vipInfo_outer {
    width: 100%;
    height: 100vh;
    /*overflow: hidden;*/
    /*display: inline-block;*/
    position: relative;
    div {
      box-sizing: border-box;
    }
    .coutent{
      width: 100%;
      height: calc(100vh - 50px);
      overflow: hidden;
      display: inline-block;
      /*position: fixed;*/
      position: relative;
      /*margin-bottom: 65px;*/

      /*z-index: -1;*/
    }
    .cube-outer {
      width: 100%;
      /*height: 500px;*/
      position: relative;
      overflow: hidden;
      display: inline-block;
    }
    #playBox {
      width: 1px;
      min-width: 100%;
      *width: 100%;
      height: 1px;
      min-height: 100%;
      *height: 100%;
    }
    .err_outer {
      width: 100%;
      padding-top: 30%;
      text-align: center;
      font-size: 17px;
      .icon-out {
        display: inline-block;
        width: 50px;
        height: 50px;
        background: url("img/fenzu1454353443.png");
        -webkit-background-size: 100% 100%;
        background-size: 100% 100%;
      }
      span {
        display: block;
        line-height: 30px;
      }
      .back-btn {
        color: #fb683c;
      }
    }
    .fixed {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2000;
      margin-top: 0 !important;
    }
    .mt44 {
      margin-top: 59px;
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
      position: relative;
      .iframe-box {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        width: 100%;
        height: 100%;
      }
      .bf {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 48px;
        height: 48px;
        margin-top: -24px;
        margin-left: -24px;
      }
      .block_outer {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.75);
        text-align: center;
        z-index: 500;
        .tip {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-top: 25px;
          span {
            color: #fff;
            font-size: 14px;
            margin-top: 10px;
            display: inline-block;
          }
          .bigtext {
            font-size: 17px;
          }
        }
        .btns {
          margin-top: 20px;
          span {
            font-size: 14px;
            width: 126px;
            height: 32px;
            display: inline-block;
            text-align: center;
            line-height: 32px;
          }
          .cancel {
            border: 2px solid #fb683c;
            border-radius: 100px;
            color: #fb683c;
            box-sizing: border-box;
          }
          .confirm {
            background-color: #fb683c;
            border-radius: 100px;
            color: #fff;
            margin-left: 20px;
          }
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .title_outer {
      width: 100%;
      padding: 10px 15px;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      .tit-left {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .tit-b {
          width: 100%;
          margin-top: 10px;
          display: flex;
          align-items: center;

          justify-content: space-between;
          .leftbox {
            display: flex;
            align-items: center;
          }
          span {
            color: #868686;
            font-size: 12px;
          }
          padding-right: 10px;
          .red {
            color: #f91e1e;
            font-size: 17px;
          }
          .green {
            color: #2daf53;
            font-size: 17px;
          }
          .orange {
            color: #ff7700;
            small {
              position: relative;
              // top: -4px;
              margin-left: 8px;
              font-size: 8px;
              display: inline-block;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background-color: #faad14;
              color: #fff;
              text-align: center;
              line-height: 14px;
            }
            .tip_outer {
              z-index: 9999;
              width: 164px;
              position: absolute;
              padding: 5px 10px;
              left: -10px;
              top: 23px;
              background-color: rgba(0, 0, 0, 0.8);
              color: #fb683c;
              font-size: 12px;
              line-height: 15px;
              border-radius: 4px;
              &:after {
                content: "";
                position: absolute;
                left: 12px;
                top: -10px;
                width: 0;
                height: 0;
                border: 5px solid rgba(0, 0, 0, 0.8);
                border-left-color: transparent;
                border-top-color: transparent;
                // border-bottom-color: transparent;
                border-right-color: transparent;
              }
            }
          }
        }
        span {
          font-size: 14px;
          color: #444;
          line-height: 20px;
        }
        .vip_tip {
          display: inline-block;
          width: 60px;
          height: 18px;
          background: url(./img/vipTip.png) no-repeat;
          background-size: 100% 100%;
          position: relative;
          top: 4px;
        }
        .title {
          display: block;
          width: 100%;
          word-wrap: break-word;
          word-break: break-all;
          /*overflow: hidden;*/
        }
      }
      .tit-right {
        width: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .collect_box {
          display: flex;
          align-items: center;
        }
        span {
          font-size: 11px;
          color: #868686;
          margin-left: 3px;
          white-space: nowrap;
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
      border-bottom: 0.5px solid #d4d4d4;
      margin-top: 7px;
      ul {
        display: flex;
        height: 100%;
        li {
          flex: 1;
          height: 100%;
          text-align: center;
          line-height: 44px;
          padding: 0 40px;
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
          .item_box {
            height: 100%;
            width: 100%;
            position: relative;
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
      z-index: 99;
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: #fff;
      display: flex;
      /*border-top: 1px solid #D8D8D8;*/
      box-shadow: 0 -1px 0 0 #d4d4d4;
      .item_consult {
        flex: 0.55;
        color: #fb683c;
        display: inline-block;
        /*width: 80px;*/
        height: 100%;
        text-align: center;
        line-height: 50px;
        font-size: 14px;
        &.flex1 {
          flex: 1;
        }
        .icon-consult {
          width: 15px;
          height: 15px;
          display: inline-block;
          position: relative;
          top: 3px;
          /*line-height: 50px;*/
          background: url("img/zixun2.png") no-repeat;
          -webkit-background-size: 100%;
          background-size: 100%;
        }
      }
      .item_course {
        background: #ff825e;
      }
      .item_member {
        background: #fb683c;
      }
      span {
        flex: 1;
        color: #fff;
        font-size: 18px;
        text-align: center;
        line-height: 50px;
      }
      /*span {*/
      /*display: block;*/
      /*width: 100%;*/
      /*height: 100%;*/
      /*background-color: #FB683C;*/
      /*color: #fff;*/
      /*font-weight: 600;*/
      /*text-align: center;*/
      /*line-height: 48px;*/
      /*font-size: 17px;*/
      /*&:active {*/
      /*background-color: #d85a34;*/
      /*}*/
      /*}*/
    }
    .section_outer {
      width: 100%;
      padding: 0 15px;
      background-color: #fff;
      margin-top: 0;
      padding-right: 0;
      ul {
        width: 100%;
        li {
          display: flex;
          height: 57px;
          border-bottom: 0.5px solid #d8d8d8;
          align-items: center;
          padding-right: 15px;
          &:nth-last-child(1) {
            border-bottom: 0;
          }
          &.active {
            .item-right {
              span {
                color: #fb683c;
              }
            }
          }
          .item-left {
            width: 15px;
            margin-left: 10px;
            i {
              display: inline-block;
              width: 16px;
              height: 16px;
            }
            .icon-bofang {
              background: url("img/weiguankan.png");
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
            }
            .icon-zanting {
              background: url("img/zhengzaiguankan.png");
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
            }
            .icon-bofang1 {
              background: url("img/weiguankan.png");
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
            }
            .icon-jilu {
              background: url("img/weikanwan.png");
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
            }
            .icon-suoding {
              background: url("img/weijiesuo.png");
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
            }
            .icon-wancheng {
              background: url("img/yikanwan.png");
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
            }
            .icon-suoding1 {
              background: url("img/weijiesuo.png");
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
            }
          }
          .item-right {
            width: 100%;
            margin-left: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &.suoding {
              span {
                color: #868686;
              }
              .time {
                color: rgb(253, 182, 163);
              }
            }
            .item-name {
              display: inline-block;
              width: 230px;
            }
            span {
              display: block;
              font-size: 14px;
              color: #444444;
              line-height: 20px;
            }
            .time {
              margin-top: 5px;
              font-size: 14px;
              color: #fb683c;
            }
          }
        }
      }
    }
    .footer_text {
      display: block;
      font-size: 12px;
      color: #868686;
      text-align: center;
      margin-top: 15px;
      /*margin-bottom: 65px;*/
    }
  }
</style>
