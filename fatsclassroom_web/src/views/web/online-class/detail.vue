<template>
  <div class="online-class-detail common-container-width">
    <div v-if="detail != null && !isShowErrorTips">
    <div style="display:none;" id="detailTitle">{{detail.title}}</div>
      <div class="play-box">
        <div v-if="typelist.length>0" class="typelist">
          <span v-for="(item,index) in typelist"
          class="pointer"
          @click="routerGo(item)"
          v-show="item.name"
          :key="index">
            {{item.name}}
            <i>&gt;</i>
          </span>
          <span>{{detail.title}}</span>
        </div>
        <div class="contain">
        <!-- 预览播放图 -->
          <div class="img-box" ref="imgBox">
            <div v-show="isShowIframe && !isShowIframeImg" class="iframe-box">
              <iframe
              id="playBox"
              allowfullscreen
              :width="iframe.width"
              :height="iframe.height"
              :src="curUrl"
               frameborder="0"></iframe>
            </div>
            <img v-show="!isShowIframe || isShowIframeImg"
            @click="play()"
            :src="detail.bannerUrl" :alt="detail.title">
            <!-- 评价 购买弹层 -->
            <div v-show="(isShowDialogToBuy ||
             isShowDialogTomes ||
             isShowDialogCode == 1002 ||
             isShowDialogCode == 1004 ||
             isShowDialogToIn) && !isShowIframe"
             class="dialog">
              <span class="el-icon-close"
              @click="isShowIframe=true;"
              ></span>
              <div v-show="isShowDialogToIn" class="dialog-buy">
                  <div class="title">
                    权益消耗提醒
                    <p></p>
                  </div>
                  <p>继续观看本课程会消耗您1次录播课程观看权益(剩余{{consumeNum}}次)</p>

                  <div class="btns">
                    <span @click="isShowDialogToIn = false" class="btn-buy">
                      取消
                    </span>
                    <span @click="continueShow" class="btn-sub">继续观看</span>
                  </div>
              </div>

              <div v-show="isShowDialogCode == 1002" class="dialog-buy">
                  <div class="title">
                    VIP会员专享课程
                    <p>可尊享更多特权与服务</p>
                  </div>
                  <p>还有{{
                  detail.courseVideoEntity[0].isTry === 1 ?
                   detail.courseVideoEntity.length - 1 :
                   detail.courseVideoEntity.length
                   }}个章节未学习</p>
                  <p>您已购的观看次数已经消耗完</p>
                  <div class="btns">
                    <span @click="goFree('/order')" class="btn-buy">
                      ￥{{detail.price}}购买课程
                    </span>
                    <span @click="goFree('/interests')" class="btn-sub">会员续费

                    </span>
                  </div>
              </div>

              <div v-show="isShowDialogCode == 1004" class="dialog-buy">
                  <div class="title">
                    VIP会员专享课程
                    <p>可尊享更多特权与服务</p>
                  </div>
                  <p>还有{{
                  detail.courseVideoEntity[0].isTry === 1 ?
                   detail.courseVideoEntity.length - 1 :
                   detail.courseVideoEntity.length
                   }}个章节未学习</p>
                  <p></p>
                  <div class="btns">
                    <span @click="goFree('/order')" class="btn-buy">
                      ￥{{detail.price}}购买课程
                    </span>

                  </div>
              </div>


              <div v-show="isShowDialogToBuy" class="dialog-buy">
                  <div class="title">
                    VIP会员专享课程
                    <p>可尊享更多特权与服务</p>
                  </div>
                  <p>还有{{
                  detail.courseVideoEntity[0].isTry === 1 ?
                   detail.courseVideoEntity.length - 1 :
                   detail.courseVideoEntity.length
                   }}个章节未学习</p>

                  <div class="btns">
                    <span @click="goFree('/order')" class="btn-buy">
                      ￥{{detail.price}}购买课程
                    </span>
                    <span @click="goFree('/interests')" class="btn-sub">开通会员免费学</span>
                  </div>
              </div>

              <div v-show="isShowDialogTomes" class="dialog-mes">
                <div class="title">
                  听完课程，给个评价吧
                </div>
                <div class="form">
                  <div class="rate-box">
                    <div class="item">
                      <span class="label">课程内容</span>
                      <el-rate
                        v-model="rate.contentScore"
                        :colors="['#FB683C', '#FB683C', '#FB683C', '#FB683C', '#FB683C']">
                      </el-rate>
                    </div>
                    <div class="item">
                      <span class="label">演讲水平</span>
                      <el-rate
                        v-model="rate.speakingLevel"
                        :colors="['#FB683C', '#FB683C', '#FB683C', '#FB683C', '#FB683C']">
                      </el-rate>
                    </div>
                     <div class="item">
                      <span class="label">听课流畅</span>
                      <el-rate
                        v-model="rate.classFluently"
                        :colors="['#FB683C', '#FB683C', '#FB683C', '#FB683C', '#FB683C']">
                      </el-rate>
                    </div>
                  </div>

                  <!-- 留言框 -->
                  <div class="textarea">
                    <span>其他建议</span>
                    <textarea v-model.trim="rate.otherTips" placeholder="提出您的建议，帮助我们改进"></textarea>
                  </div>
                </div>

                <span @click="insertEvaluateFn" class="btn-sub">提交</span>

              </div>
            </div>
          </div>
        <!-- 章节列表 -->
          <div class="list-box">
            <p>共{{
                  detail.courseVideoEntity[0].isTry === 1 ?
                   detail.courseVideoEntity.length - 1 :
                   detail.courseVideoEntity.length
                   }}章节&nbsp;
            ({{getTime(detail.courseVideoEntity)}})</p>
            <ul class="list common-scroll-bar">
              <li v-for="(item,index) in detail.courseVideoEntity"
              :class="{active:index===curIndex}"
              @click="changeVideo(item,index)"
              :key="index">
                <div class="minute-box">
                  <span class="icon-play"></span>
                  <span v-if="index==0" class="name">{{item.name}}</span>
                  <span v-else>第{{index}}章 </span>
                  <span class="minite"> {{getMinite(item.videoMinute)}}</span>
                </div>
                <div v-if="index>0" class="title">{{item.name}}</div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 收藏评论按钮 -->
        <div class="btns">
          <span
          v-show="detail.isColl"
          :class="{active:detail.isColl}"
          @click="collectFn"
           class="icon-coll">已收藏</span>
           <span class="icon-coll"
           @click="collectFn"
            v-show="!detail.isColl">
             收藏
           </span>
          <span @click="showDialog(0)"
          class="icon-mes">评价</span>
        </div>
      </div>

      <!-- 课程详情 资料下载 课程评价 -->
      <div class="tab-box">
        <span v-for="(item,index) in tablist"
        @click="curTabIndex=index"
        :class="{active:index === curTabIndex}"
        :key="index">
          {{item.name}}
        </span>
      </div>
      <div class="tab-contain">
        <template v-if="curTabIndex == 0">
          <h3>课名： {{detail.title}}</h3>

          <baseTitle v-if="detail.courseBrief" title="课程简介"></baseTitle>
          <div class="item" v-html="transferStringFn(detail.courseBrief)"></div>

          <baseTitle title="课程大纲"></baseTitle>
          <div class="item" v-html="transferStringFn(detail.courseOutline)"></div>

          <baseTitle title="老师简介"></baseTitle>
          <div class="item-box">
            <div class="photo">
                <baseImg
                  :width="130"
                  :height="130"
                  :src="detail.teacherAvatar"
                  :defaultSrc="defaultUrl"
                  :alt="detail.teacherName">
                </baseImg>
            </div>
            <div class="item">
              <p class="name">{{detail.teacherName}}</p>
              <p v-html="transferStringFn(detail.teacherBrief)"></p>
            </div>
          </div>

          <baseTitle title="老师教授课程"></baseTitle>
          <div class="teacherCourseList">
            <span v-for="(item,index) in teacherCourse"
            @click="routerGo(item,'/online-detail')"
            :key="index">{{item.title}}</span >
          </div>

        </template>
        <!-- 资料下载 -->
        <template v-if="curTabIndex == 1">
            <div v-if="detail.coursePreviewEntity && detail.coursePreviewEntity.length>0"
            class="previewIframe-box">
              <div class="previewIframe">
                <iframe
                :src="detail.coursePreviewEntity[0].previewUrl"
                frameborder="0"></iframe>
              </div>
            </div>

            <!-- <Preview :list="detail.coursePreviewEntity"></Preview> -->
            <div v-if="detail.courseFileEntity
            && detail.courseFileEntity.length>0"
            class="download-box">
              <div v-for="(item,index) in detail.courseFileEntity"
              :key="index"
              :class="{'is-pdf':item.fileType === '.pdf'}"
              class="icon-pdf">
                {{item.fileName}}
                <div class="fr">
                  {{(item.fileSize/1024).toFixed(1)}}M
                  <a
                  @click="download(item.downloadUrl)"
                  :class="{gray:!(isCanDownLoad || detail.payType != '1')}"
                  class="btn-sub">下载</a>
                </div>
              </div>
            </div>
          <div class="empty" v-else>
              没有可下载资料
          </div>
        </template>

        <!-- 评价列表 -->
        <template v-if="curTabIndex == 2">
          <div class="good-box">
            <div class="nav">
              <div class="item">
                <span class="active">{{goodDeg}}%</span>
                <p>好评度</p>
              </div>
              <div class="item"
               v-for="(item,index) in goodlist"
               :key="index">
                <el-radio v-model="getEvaluateListParams.isGood"
                @change="radioChange"
                :label="item.value">{{item.name}}
                <span v-if="index==0">({{allNum}})</span>
                <span v-if="index==1">({{goodNum}})</span>
                <span v-if="index==2">({{medNum}})</span>
                <span v-if="index==3">({{badNum}})</span>
                </el-radio>
               </div>
            </div>
            <ul class="eva-list">
              <li v-for="(item,index) in getEvaluateListList"
              :key="index">
                <div class="photo">
                  <baseImg
                  :width="130"
                  :height="130"
                  :src="detail.userAvatar"
                  :defaultSrc="defaultUrl"
                  :alt="detail.userId">
                </baseImg>

                </div>
                <div class="item">
                  <el-rate
                    v-model="item.rate"
                    disabled
                    :colors="['#FB683C', '#FB683C', '#FB683C', '#FB683C', '#FB683C']">
                  </el-rate>
                  <p v-if="item.otherTips">{{item.otherTips}}</p>
                </div>
              </li >
            </ul>

            <el-pagination
              v-if="getEvaluateListTotal>getEvaluateListList.length"
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              :pager-count="pagerCount"
              prev-text="上一页"
              next-text="下一页"
              :page-size="getEvaluateListParams.pageSize"
              :total="getEvaluateListTotal">
            </el-pagination>

          </div>
        </template>
      </div>
    </div>
    <div v-if="isShowErrorTips">
        <div class="errorTipsBox">
            <span class="el-icon-warning
"></span>
      <p>
        您查看的课程已下架 <br>
        <span class="small">您可以返回上一页浏览其他页面</span> <br>
        <span @click="routerBack" class="pointer">返回上一页</span>
      </p>
        </div>
    </div>
  </div>
</template>
<script>
import {
  getCourse,
  getVideoUrl,
  insertEvaluate,
  getGoodEvaluateCount,
  getEvaluateList,
  initCourseRecord,
  saveMyCollection,
  equityConsume,
  videorights,
  downloadPower,
} from '@/api/apis';
import baseTitle from '@/views/web/components/base/base-title.vue';
import { transferString } from '@/assets/utils/util';

const defaultPhotoUrl = require('@/views/imgs/default.png');

export default {
  name: 'online-class-detail',
  data() {
    return {
      name: 'online-class-detail',
      isShowErrorTips: false, // 是否展示已下架模块
      isShowDialogToBuy: false, // 是否显示购买弹窗
      isShowDialogTomes: false, // 是否显示评价弹窗
      isShowDialogToIn: false, // 消耗权益弹窗
      defaultUrl: defaultPhotoUrl, // 默认头像
      rate: { // 评分 内容  水平 流畅 其他意见
        contentScore: 5,
        speakingLevel: 5,
        classFluently: 5,
        otherTips: '',
      },
      isShowIframeImg: true,

      detail: null,
      url: '', // 视频播放地址
      curIndex: 0, // 当前播放章节
      isShowIframe: false,
      curUrl: '',
      iframe: {
        width: '100%',
        height: '100%',
      },
      curTabIndex: 0,
      tablist: [
        { name: '课程详情' },
        { name: '资料下载' },
        { name: '课程评价' },
      ],
      typelist: [],
      courseId: '', // 课程id
      type: '1', // 课程类型1线上视频课 2公开课 3线上专题课
      videoId: '', // 视频id
      getEvaluateListParams: {
        isGood: '',
        pageSize: 20,
        pageNum: 1,
      },
      pagerCount: 11, // 最多多少页出现...
      getEvaluateListTotal: 0,
      getEvaluateListList: [], // 评价列表
      goodNum: 0, // 好评数
      medNum: 0, // 好评数
      badNum: 0, // 好评数
      allNum: 0, // 好评数
      goodlist: [ // 好评度
        {
          name: '全部评价',
          value: '',
          total: 0,
        },
        {
          name: '好评',
          value: '0',
        },
        {
          name: '中评',
          value: '1',
        },
        {
          name: '差评',
          value: '2',
          total: 0,
        },
      ],
      initCourseRecordTimer: {},
      saveMyCollectionParam: { // 收藏参数
        courseId: '', // 课程id
        onOffType: '1', // 线上线下0 : 公开课； 1 录播课
      },
      sec: 0, // 已经播放时间  秒为单位
      curPlayItem: null,
      curPlayIndex: 0,
      teacherCourse: [],
      isCanRequest: true,
      consumeNum: '',
      isCanDownLoad: false, // 是否能下载资料
      isShowDialogCode: '',
    };
  },
  beforeRouteLeave(to, from, next) {
    Object.keys(this.initCourseRecordTimer).forEach((key) => {
      clearInterval(this.initCourseRecordTimer[key]);
    });
    next();
  },
  watch: {
    $route() {
      this.init();
    },
    token() {
      if (this.token) {
        this.downloadPowerFn();
      }
    },
  },

  mounted() {
    this.init();
  },
  computed: {
    goodDeg() {
      if (this.allNum !== 0) {
        return parseInt((this.goodNum / this.allNum) * 100, 10);
      }
      return 0;
    },
  },
  methods: {
    init() {
      // 获取公开课详情
      this.courseId = parseInt(this.$route.query.cid, 10) || '';
      this.getCourseFn();
      // 获取评价列表
      this.getEvaluateListFn('init');
      // 获取好评总次数
      this.getGoodEvaluateCountFn();
      // 已经播放时间
      this.sec = this.$route.query.sec || 0;
      // 获取文件下载权限
      this.downloadPowerFn();
    },
    downloadPowerFn() {
      if (!this.token) {
        return;
      }
      downloadPower({ courseId: this.courseId }).then((res) => {
        if (res.data.code === '2001') {
          this.isCanDownLoad = true;
        } else {
          this.isCanDownLoad = false;
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    routerBack() {
      this.$router.go(-1);
    },
    transferStringFn(str) {
      return transferString(str) || '';
    },
    getMinite(min) {
      let hour = parseInt(min / 60, 10) > 9 ? parseInt(min / 60, 10)
        : `0${parseInt(min / 60, 10)}`;
      let minite = min % 60 > 9 ? (min % 60) : `0${min % 60}`;
      return `${hour}:${minite}:00`;
    },
    download(url) {
      if (!this.token) {
        this.confirm();
      } else if (this.detail.payType !== '1' || (url && this.isCanDownLoad)) {
        // 可以下载 或者是免费课程
        window.open(url);
      } else {
        this.$message({
          message: '请先购买课程，再下载材料哦！',
          type: 'warning',
        });
      }
    },
    continueShow() {
      if (this.isCanRequest) {
        this.isCanRequest = false;
      } else {
        return;
      }
      // 消耗权益继续观看
      equityConsume({ equityNum: 1, courseType: 0, courseId: this.courseId }).then((res) => {
        this.isCanRequest = true;
        if (res.data.code === '0000') {
          this.isShowDialogToIn = false;
          this.startPlay();
        } else if (res.data.code !== '0002') {
          this.$message({
            message: '消耗权益失败，请重试',
            type: 'warning',
          });
        }
      }).catch((err) => {
        this.isCanRequest = true;
        console.log(err);
        this.$message({
          message: '消耗权益失败，请重试',
          type: 'warning',
        });
      });
    },
    routerGo(item, path) {
      if (!path) {
        let query = item.id ? { nid: item.id } : {};
        this.$router.push({ path: '/online-class', query });
      } else {
        // 在新标签页打开
        this.openBlank(path, { cid: item.id });
      }
    },
    goFree(path) {
      // 免费学  立即购买
      if (!this.token) {
        this.confirm();
        // this.$message({
        //   message: '您还没有登录，请先登录',
        //   type: 'warning',
        // });
        return;
      }
      this.$router.push({
        path,
        query: {
          cid: this.courseId,
          type: this.type,
        },
      });
    },
    collectFn() {
      // 点击收藏
      this.saveMyCollectionParam.courseId = this.courseId;
      this.saveMyCollectionFn();
    },
    saveMyCollectionFn() {
      // 收藏 如果未登录  提示去登陆
      if (!this.token) {
        this.confirm();
        // this.$message({
        //   message: '您还没有登录，请先登录',
        //   type: 'warning',
        // });
        return;
      }
      if (this.isCanRequest) {
        this.isCanRequest = false;
      } else {
        return;
      }

      saveMyCollection(this.saveMyCollectionParam).then((res) => {
        this.isCanRequest = true;
        if (res.data.code === '0000') {
          // res.data.type 0 取消收藏 1收藏
          this.detail.isColl = res.data.type === '1';
          if (this.detail.isColl) {
            // 收藏埋点
            this.ysxy_collect({
              contentTitle: this.detail.title,
              contentId: this.detail.id,
              contentKind: '线上',
              contentType: this.detail.price === '0' ? '免费' : '收费',
              contentPrice: this.detail.price,
            });
          }
        }
      }).catch((err) => {
        this.isCanRequest = true;
        console.log(err);
        this.$message({
          message: '服务器错误，请稍后再试',
          type: 'warning',
        });
      });
    },
    initCourseRecordFn() {
      // 同步播放请求定时器
      if (this.initCourseRecordTimer[this.videoId]) {
        clearInterval(this.initCourseRecordTimer[this.videoId]);
      }

      this.initCourseRecordTimer[this.courseId] = setInterval(() => {
        initCourseRecord({
          course_id: this.courseId,
          video_id: this.videoId,
        }).then((res) => {
          if (res.data.code === '0001') {
            clearInterval(this.initCourseRecordTimer[this.videoId]);
          }
        });
      }, 60 * 1000);
    },
    getGoodEvaluateCountFn() {
      // 获取好评总次数
      if (this.courseId) {
        getGoodEvaluateCount({ courseId: this.courseId }).then((res) => {
          if (res.data.code === '0000' && res.data.evaluate) {
            this.goodNum = parseInt(res.data.evaluate.goodNum, 10);
            this.medNum = parseInt(res.data.evaluate.medNum, 10);
            this.badNum = parseInt(res.data.evaluate.badNum, 10);
            this.allNum = parseInt(res.data.evaluate.allNum, 10);
          }
        }).catch((err) => {
          console.log(err);
          this.$message({
            message: '获取好评次数失败，请稍后再试',
            type: 'warning',
          });
        });
      }
    },

    getVideoUrlFn() {
      // 获取视频地址

      let { courseId, videoId } = this;
      if (videoId && courseId) {
        getVideoUrl({ courseId, videoId }).then((res) => {
          if (res.data.code === '0000') {
            this.curUrl = res.data.videoUrl;
            this.isShowIframe = true;
            this.getList();
          }
        }).catch((err) => {
          console.log(err);
          this.isShowIframe = false;
          this.$message({
            message: '获取视频播放地址失败，请稍后再试',
            type: 'warning',
          });
        });
      }
    },
    startPlay() {
      // 播放埋点
      this.ysxy_videoPlay({
        contentTitle: this.detail.title,
        contentId: this.detail.id,
        contentTime: this.getTime(this.detail.courseVideoEntity),
        mainTeacher: this.detail.teacherName,
        contentPrice: this.detail.price,
      });
      // 开始播放
      this.isShowIframeImg = false;
      this.courseId = this.curPlayItem.courseId;
      this.videoId = this.curPlayItem.id;
      this.getVideoUrlFn();
      this.curIndex = this.curPlayIndex;
      // 开启同步播放记录
      this.initCourseRecordFn();
    },
    changeVideo(item, index) {
      this.curPlayItem = item;
      this.curPlayIndex = index;
      if (item.isTry === 0 && this.detail.payType === '1') {
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
        this.confirm('该章节需要登录才可以继续观看');
        // this.$message({
        //   message: '该章节需要登录才可以继续观看',
        //   type: 'warning',
        // });
      }
    },
    checkUserIsCanPlay() {
      // 判断用户是否登录
      if (!this.token) {
        this.confirm('该章节需要登录才可以继续观看');
        return;
      }
      if (this.token) {
        // token 存在  查看是否可以播放  去购买  消耗权益提醒
        // 查询视频播放权限code"1000";可以观看   "1001";
        // 不是会员   "1002";//没有权限
        videorights({ courseId: this.courseId }).then((res) => {
          if (res.data.code === '1000') {
            // 可以观看
            this.startPlay();
          } else if (res.data.code === '1001') {
            this.showDialog(2);
          } else if (res.data.code === '1003') {
            // 消耗权益
            this.showDialog(1);
            this.consumeNum = res.data.consumeNum || 0;
          } else if (res.data.code === '1002') {
            //
            this.showDialog(3);
          } else if (res.data.code === '1004') {
            this.showDialog(4);
          }
        }).catch((err) => {
          console.log(err);
          this.$message({
            message: '服务器错误，请稍后再试',
            type: 'warning',
          });
        });
      }
    },
    showDialog(type) {
      if (!this.token) {
        this.confirm();
        return;
      }
      this.isShowIframe = false;
      // this.isShowIframeImg = false;
      this.isShowDialogTomes = false;
      this.isShowDialogToBuy = false;
      this.isShowDialogToIn = false;
      this.isShowDialogCode = '';
      if (type === 0) {
        // 展示评论
        this.isShowDialogTomes = true;
      } else if (type === 1) {
        // 展示消耗权益
        this.isShowDialogToIn = true;
      } else if (type === 2) {
        // 展示购买
        this.isShowDialogToBuy = true;
      } else if (type === 3) {
        // 展示购买
        this.isShowDialogCode = '1002';
      } else if (type === 4) {
        // 展示购买
        this.isShowDialogCode = '1004';
      }
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
    getTime(list) {
      let num = 0;
      list.forEach((item, index) => {
        if (!(index === 0 && item.isTry === 1)) {
          num += parseInt(item.videoMinute, 10);
        }
      });
      return `${parseInt(num / 60, 10)}小时${num % 60}分钟`;
    },
    getList() {
      // 获取顶部面包屑
      this.typelist = [
        {
          id: '',
          name: '在线学习',
        },
        {
          id: this.detail.direction,
          name: this.detail.directionName,
        },
        {
          id: this.detail.major,
          name: this.detail.majorName,
        },
        // {
        //   id: this.detail.category,
        //   name: this.detail.categoryName,
        // },
      ];
    },
    radioChange() {
      this.getEvaluateListFn('init');
      this.getGoodEvaluateCountFn();
    },
    handleCurrentChange(val) {
      this.getEvaluateListParams.pageNum = val;
      this.getEvaluateListFn();
      this.getGoodEvaluateCountFn();
    },
    insertEvaluateFn() {
      // 提交课程评价
      console.log(this.detail);

      if (!this.rate.otherTips) {
        this.$message({
          message: '请填写评价内容',
          type: 'warning',
        });
        return;
      }
      if (this.rate.otherTips.length < 2 || this.rate.otherTips.length > 50) {
        this.$message({
          message: '评价内容应该在2-50个字符内',
          type: 'warning',
        });
        return;
      }
      let params = {
        courseId: this.courseId,
        ...this.rate,
      };
      if (this.courseId) {
        if (this.isCanRequest) {
          this.isCanRequest = false;
        } else {
          return;
        }
        insertEvaluate(params).then((res) => {
          this.isCanRequest = true;
          if (res.data.code === '0000') {
            // 评价埋点
            this.ysxy_comment({
              contentTitle: this.detail.title,
              contentId: this.detail.id,
              contentKind: '线上',
              contentType: this.detail.price === '0' ? '免费' : '收费',
              contentPrice: this.detail.price,
            });
            // console.log(res);
            this.isShowIframe = true;
            this.$message({
              message: '评价成功',
              type: 'success',
            });
            this.getEvaluateListFn('init');
            this.getGoodEvaluateCountFn();
          } else if (res.data.code === '0012') {
            this.$message({
              message: '已经评价过该课程,不允许重复评价',
              type: 'success',
            });
          }
        }).catch((err) => {
          this.isCanRequest = true;
          console.log(err);
          this.$message({
            message: '提交课程评价失败，请稍后再试',
            type: 'warning',
          });
        });
      }
    },
    getEvaluateListFn(t) {
      if (t === 'init') {
        this.getEvaluateListParams.pageNum = 1;
      }
      // 获取评价列表
      if (this.courseId) {
        getEvaluateList(
          {
            courseId: this.courseId,
            ...this.getEvaluateListParams,
          },
        ).then((res) => {
          if (res.data.code === '0000') {
            this.getEvaluateListTotal = res.data.total;
            this.getEvaluateListList = res.data.list;
            /*eslint-disable*/
                        this.getEvaluateListList.forEach((item) => {
                            item.rate = parseInt((item.contentScore +
                              item.speakingLevel +
                              item.classFluently) / 3, 10);
                        });
                        /* eslint-enable */
          }
        }).catch((err) => {
          console.log(err);
          this.$message({
            message: '评价列表获取失败',
            type: 'warning',
          });
        });
      }
    },
    getCourseFn() {
      // 获取公开课详情
      if (this.courseId) {
        getCourse({ id: this.courseId }).then((res) => {
          if (res.data.code === '0000') {
            /*eslint-disable*/
            // favorite字段，是否收藏 0否 1是 默认0
            res.data.course.isColl = res.data.favorite;
            this.detail = res.data.course;
            this.teacherCourse = res.data.teacherCourse;
            // 详情页展示埋点
            this.ysxy_detailView({
              contentTitle: this.detail.title,
              contentId: this.detail.id,
              mainTeacher:this.detail.teacherName,
              contentKind: '线上',
              contentType: this.detail.price === '0' ? '免费' : '收费',
              contentPrice: this.detail.price,
            });
                       /* eslint-enable */
            if (this.detail) {
              this.getList();
              if (!this.isShowIframe) {
                this.play(true);
              }
            }
          } else if (res.data.code === '7001') {
            this.isShowErrorTips = true;
          }
        }).catch((err) => {
          console.log(err);
          this.$message({
            message: '录播课详情获取失败，请稍后再试',
            type: 'warning',
          });
        });
      }
    },
  },
  components: {
    baseTitle,
    // Preview,
  },
};
</script>
<style scoped>
.errorTipsBox{
  width: 200px;
    margin: 0 auto;
    position: relative;
    padding-left: 70px;
    line-height: 22px;
    margin-top: 200px;
    font-size: 18px;
}
.errorTipsBox .small{
  font-size: 14px;
}
.errorTipsBox .el-icon-warning
{
  position: absolute;
    left: 0;
    font-size: 60px;
    color: #ccc;
}
.errorTipsBox .pointer{
  color: #FB683C;
  font-size: 14px;
}
.minite{
  float: right;
}
.teacherCourseList span{
  margin-right: 20px;
  cursor: pointer;
}
.teacherCourseList span:hover{
  color: #FB683C;
}
.empty{
  padding: 20px 0;
  font-size: 16px;
}
.eva-list .empty{
  margin-top: 0;
}
/*下载*/
.previewIframe-box{
  width: 100%;
  height: 710px;
  overflow-x: auto;
  overflow-y: hidden;
}
.previewIframe{
  display: block;
  width: 1040px;
  height: 700px;
  transform: scale(0.85);
  transform-origin: 0 0;
}
.downLoadIframe{
  width: 100%;
  height: 200px;
}
.downLoadIframe iframe,
.previewIframe iframe{
  width: 100%;
  height: 100%;
}
.download-box{
  margin-top: 20px;
}
.icon-pdf{
  /*border-bottom: 1px solid #D4D4D4;*/
  padding-top: 20px;
  padding-bottom: 20px;
  display: block;
  position: relative;
  width: 100%;
  box-sizing:border-box;
  min-height: 30px;
  line-height: 30px;
  padding-left: 33px;
  background: url('./imgs/excel.png') no-repeat left 26px;
  background-size:23px auto;
  font-size: 16px;
color: #444444;
text-align: left;
overflow: hidden;
}
.icon-pdf .is-pdf{
  background-image:url('./imgs/pdf4.png');
}
.icon-pdf:hover{
  background-color:#eee;
}
.icon-pdf .fr{
  float: right;
  position: relative;
  padding-right: 118px;
}
.icon-pdf .fr .btn-sub{
  margin: 0;
  position: absolute;
  right: 0;
  top: 0;
  text-decoration: none;
}
/*评价列表*/
.good-box .nav{
  display: flex;
  background: #F7F7F7;
  align-items: center;
  justify-content: flex-start;
  height: 54px;

  margin-top: 20px;
  overflow: hidden\0;
}
.good-box .nav .item{
  margin-left: 40px;
  text-align: center;
  line-height: 54px\0;
  float: left\0;
}
.good-box .nav .item:nth-child(1){
  line-height: 20px\0;
  margin-top: 10px\0;
}
.good-box .nav .active{
  color: #FB683C;
}
/*购买 评价弹窗*/
.dialog{
  background: rgba(0,0,0,0.75);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 5;
}
.dialog-mes .title{
  margin-top: 40px;
  margin-bottom: 30px;
  font-size: 16px;
  text-align: center;
}
.dialog-buy {
  text-align: center;
}
.dialog-buy .title{
  font-size: 26px;
  margin-bottom: 88px;
  margin-top: 70px;
}
.dialog-buy .title p{
  font-size: 14px;
  padding-top: 10px;
}
.dialog-buy .btns{
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 314px;
  margin: 30px auto;
  overflow: hidden\0;
}
.dialog-buy .btn-sub,
.dialog-buy .btn-buy{
  width: 142px;
  height: 30px;
  box-sizing:border-box;
  color: #FB683C;
  border: 1px solid #FB683C;
  margin: 0;
  text-align: center;
  line-height: 28px;
  cursor: pointer;
  border-radius: 30px;
  float: left\0;
}
.dialog-buy .btn-buy{
  margin-right: 20px\0;
}
.dialog-buy .btn-sub{
  color: #Fff;
}

.rate-box .item{
  position: relative;
  padding-left: 106px;
  margin-bottom: 20px;
}
.rate-box .item .label{
  position: absolute;
  left: 20px;
  top: 0;
  font-size: 14px;
}
.dialog-mes .form{
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  overflow: hidden\0;
  width: 560px\0;
  margin: 0 auto\0;
}
.rate-box{
  float: left\0;
}
.dialog-mes .form .textarea{
  float: right\0;
}
.textarea{
  width: 286px;
  height: 188px;
}
.textarea textarea{
  display: block;
  width: 100%;
  height: 158px;
  background: #F7F7F7;
border: 1px solid #D4D4D4;
border-radius: 4px;
box-sizing:border-box;
padding: 10px 20px;
margin-top: 10px;
 outline: none;
 color: #444;
 font-size: 14px;
}


/*顶部播放盒子*/
.iframe-box{
  width: 100%;
  height: 100%;
}
.play-box{
  display: block;
  width: 100%;
  background: #363636;
  height: 480px;
  padding: 20px 0px 20px 30px;
  box-sizing:border-box;
  color: #fff;
  font-size: 14px;
}
.typelist{
  letter-spacing: -0.34px;
  text-align: center;
  margin-bottom: 20px;
  text-align: left;
}
.contain{
  width: 100%;
  position: relative;
  display: block;
  padding-left: 640px;
  height: 360px;
  box-sizing:border-box;
}
.img-box{
  position: absolute;
  left: 0;
  top: 0;
  width: 640px;
  height: 360px;
}
.img-box img{
  display: block;
  width: 640px;
  height: 360px;
  cursor: pointer;
}
.list-box{
  width: 100%;
}
.list-box p{
  padding-left: 30px;
  margin-bottom: 20px;
}
.list{
  display: block;
  width: 100%;
  height: 320px;
  overflow-y: auto;
  overflow-x: hidden;
}
.list li{
  display: block;
  position: relative;
  padding: 20px 30px;
  width: 100%;
  background: #555555;
  border: 1px solid #383838;
  border-radius: 2px;
  line-height: 20px;
  color: #fff;
  box-sizing:border-box;
  margin-bottom: 20px;
  cursor: pointer;
}
.list li.active{
  color: #FB683C;
}
.list li .icon-play{
  display: block;
  width: 20px;
  height: 20px;
  background: url('./imgs/icon-play-off.png') no-repeat top left;
  float: left;
  margin-right: 10px;
}
.list li.active .icon-play{
  background-image: url('./imgs/icon-play-on.png');
}
.list li .title{
  text-align: left;
  clear: both;
  margin-top: 10px;
}
.btns{
  text-align: left;
  overflow: hidden;
  margin-top: 20px;
}
.icon-mes,
.icon-coll{
  display: block;
  float: left;
  padding-left: 30px;
  background: url('./imgs/icon-coll-off.png') no-repeat left center;
  min-height: 20px;
  cursor: pointer;
}
.icon-mes{
  background-image: url('./imgs/icon-mes.png');
  margin-left: 40px;
}
.icon-coll.active{
  color: #FB683C;
  background-image: url('./imgs/icon-coll-on.png');
}
/*课程详情 资料下载 课程评价*/
.tab-box{
  display: block;
  width: 100%;
  border-bottom: 1px solid #d4d4d4;
  margin-top: 30px;
  overflow: hidden;
  font-size: 16px;
  color: #444;
}
.tab-box .active{
  color: #FB683C;
}
.tab-box span{
  display: block;
  float: left;
  position: relative;
  cursor: pointer;
  width: 70px;
  margin-right: 40px;
  padding-bottom: 10px;
}
.tab-box .active:after{
  content: "";
  display: block;
  width: 64px;
  height: 3px;
  position: absolute;
  bottom: 0;
  left: 0;
  background: #FB683C;
  border-radius: 100px;
}
.tab-contain h3{
  margin-top: 20px;
  color: #444444;
  font-size: 16px;
}
.title-box{
  margin-top: 30px;
  margin-bottom: 22px;
}
.tab-contain .item{
  font-size: 14px;
  line-height: 22px;
}
.tab-contain .item-box{
  min-height: 107px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 10px;
  position: relative\0;
  padding-left: 127px\0;

}
.eva-list .photo,
.tab-contain .item-box .photo{
  width: 107px;
  height: 107px;
  border-radius: 100%;
  overflow: hidden;
    flex-shrink:0;
  flex-grow:0;
   margin-right: 30px;
   position: absolute\0;
   left: 0;
   top: 0;
}
.eva-list .photo{
  position: absolute;
  width: 80px;
  height: 80px;
  left: 0;
  top: 0;
}
.eva-list li{
  display: block;
  align-items: center;
  margin-top: 30px;
  overflow: hidden;
  position: relative;
  min-height: 80px;
  padding-left: 100px;
  box-sizing:border-box;
}
.eva-list .item p{
  margin-top: 10px;
  line-height: 16px;
}

.tab-contain .item-box .item{
  flex-grow:0;
  display: inline-block;
}
.tab-contain .name{
  font-weight: bold;
  margin-bottom: 10px;
}
.gray{
  background: #ccc;
}
</style>
