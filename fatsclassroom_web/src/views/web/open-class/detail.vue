<template>
  <div class="open-class common-container-width common-open-class-detail">
    <div v-if="detailData" class="contain-box">
      <div style="display:none;" id="detailTitle">{{detailData.title}}</div>
      <div class="contain">
        <!-- 详情图片 分享 收藏 在线报名 免费学 -->
        <div class="img-box">
            <baseImg
            :width="219"
            :height="130"
            :src="detailData.pic"
            :alt="detailData.title">
            </baseImg>
          <!-- <img :src="detailData.pic" alt="detailData.title"> -->
          <div class="btns">
          <!-- 分享弹窗 -->
             <el-popover
                  placement="bottom"
                  trigger="click"
                  width="158"
                  v-model="showShare">
              <span slot="reference"
              @click="shareFn()" class="icon-share"></span>
              <div class="share-box">
                <div @click="copyFn" class="copy">
                  <textarea id="copy" v-model="copyurl"></textarea>
                 <p class="pointer"><span class="icon-copy"></span>
                 <span>复制链接</span></p>
                </div>
                <div class="wx-box">
                  <span class="qrcode-logo"></span>
                  <p>
                    <span class="icon-wx"></span>
                    <span>微信扫一扫</span>
                  </p>
                  <div class="qrcode">
                    <Qrcode docId="qrcode"
                    :width="qrcodeWidth"
                    :url="copyurl"
                    ></Qrcode>
                  </div>
                </div>
              </div>
            </el-popover>

            <span class="icon-collect"
            @click="collectFn"
            :class="{active:detailData.isColl}"></span>


            <span @click="onlineSignFn()"
            :class="{gray:detailData.state != 0}"
            class="btn-online">在线报名</span>
            <span v-show="isShowFreeBtn" @click="goFree('/interests')"
            :class="{gray:detailData.state != 0}"
            class="btn-free">免费学</span>
          </div>
        </div>


            <!-- 课程锚点列表 -->
        <div class="tab-box">
            <a v-for="(item,index) in tablist"
            @click="changeTab(index,item)"
            :class="{active:index == tabindex}"
            v-show="detailData[item.key]"
            :key="index">
                {{item.text}}
            </a>
        </div>

        <!-- 课程详情 -->
        <div class="tab-contain">
          <div class="item"
          v-for="(item,index) in tablist"
          :key="index">
            <template v-if="index === 0">
              <div class="teacher-box">
                <div class="img-box">
                  <div class="img">
                    <baseImg
                    :width="130"
                    :height="130"
                    :defaultSrc="defaultUrl"
                    :src="detailData.headPic"
                    :alt="detailData.teacherName">
                    </baseImg>
                  </div>
                  <p class="name">{{detailData.teacherName}}</p>
                </div>

                <p class="intro" v-html="detailData.teacherIntroduction"></p>
              </div>
            </template>
            <div v-if="detailData[item.key]" :id="item.id" class="title">
              <baseTitle :title="item.text"></baseTitle>

            </div>
            <!-- 课程信息 -->
            <template v-if="item.text === '课程信息'">
              <div class="class-mes">
              <p>课程天数：{{getDay}} 天</p>
              <p>课程价格：{{detailData.price}} 元</p>
              <p>培训对象：{{detailData.trainObject}}</p>
              <p>培训时间：{{getTime}}</p>
              <p>培训地点：{{detailData.address + detailData.city + detailData.county}}</p>
              <p>咨询电话：{{detailData.hotline}}</p>
              </div>
            </template>
            <!-- 其他 -->
            <p v-if="item.key && item.key != 'title'" class="intro"
            v-html="transferStringFn(detailData[item.key])"></p>


            <!-- 预约报名 -->
            <template v-if="item.text === '预约报名'">

            <div class="intro form common-open-class-detail-form">
              <div class="form-box">
                  <el-form
                ref="onlineFormSign"
                :rules="rules"
                label-position="left"
                label-width="60px"
                :model="onlineForm">
                  <el-form-item label="称呼" prop="name">
                    <!-- <el-input v-model="onlineForm.name"></el-input> -->
                    <input type="text"
                    v-model.trim="onlineForm.name"
                    @blur="validateFieldFn('name','onlineFormSign')"
                    autocomplete="off"
                    class="el-input__inner">
                  </el-form-item>
                  <el-form-item label="电话" prop="tel">
                    <!-- <el-input v-model="onlineForm.tel"></el-input> -->
                    <input type="text"
                    v-model.trim="onlineForm.tel"
                    @blur="validateFieldFn('tel','onlineFormSign')"
                    autocomplete="off"
                    class="el-input__inner">
                  </el-form-item>
                  <el-form-item label="公司" prop="comp">
                    <!-- <el-input v-model="onlineForm.comp"></el-input> -->
                    <input type="text"
                    v-model.trim="onlineForm.comp"
                    @blur="validateFieldFn('comp','onlineFormSign')"
                    autocomplete="off"
                    class="el-input__inner">
                  </el-form-item>
                   <el-form-item label="职位" prop="work">
                    <!-- <el-input v-model="onlineForm.work"></el-input> -->
                     <input type="text"
                    v-model.trim="onlineForm.work"
                    @blur="validateFieldFn('work','onlineFormSign')"
                    autocomplete="off"
                    class="el-input__inner">
                  </el-form-item>
                  </el-form>
                </div>
               <div class="mes-box">
                <p>您要咨询的内容</p>
                <el-form
                ref="textareaForm"
                :rules="rules"
                :label-position="labelPosition"
                label-width="0px"
                :model="onlineForm">
                <el-form-item prop="message">
                  <!-- <el-input type="textarea"
                  rules="[{
                            min: 2,
                            max: 300,
                            message: '长度在 2 到 300 个字符',
                            trigger: 'blur',
                            required:true,
                        }]"
                  placeholder="请输入您的问题"
                   v-model="onlineForm.message"></el-input> -->
                   <textarea
          v-model.trim="onlineForm.message"
          @blur="validateFieldFn('message','onlineFormSign')"
          autocomplete="off"
          placeholder="请输入您的问题"
          class="el-textarea__inner"
          style="resize: none; min-height: 33px;">
          </textarea>
                </el-form-item>
              </el-form>
              </div>

            </div>

            <span @click="submitForm('onlineFormSign')"
            :class="{gray:detailData.state !== '0'}"
            class="btn-sub">提交信息</span>
            </template>

          </div>

        </div>

      </div>
    <!-- 右侧热门搜索 -->
      <div class="aside">

        <!-- 热门搜索 -->
        <div class="hot-search">
          <p class="title">在线训练营</p>
          <ul class="hot-search-list">
            <li v-for="(item,index) in hotSearchList"
            @click="routerGo(item)"
            :key="index">
              <span class="rank"></span>
              <p>{{item.courseOfflineEntity.title}}</p>
            </li>
          </ul>
        </div>
      </div>


        <!-- 在线报名弹窗 -->
        <div class="dialog-online" v-show="isShowFormDialog">
          <span @click="isShowFormDialog=false" class="el-icon-close"></span>
          <h3>在线报名</h3>

            <div class="intro form">
              <div class="form-box">
                  <el-form
                  ref="formDialog"
                  :rules="rules"
                  :label-position="labelPosition"
                  label-width="60px"
                  :model="onlineForm">
                  <el-form-item label="称呼" prop="name">
                    <!-- <el-input v-model="onlineForm.name"></el-input> -->
                    <input type="text"
                    v-model.trim="onlineForm.name"
                    @blur="validateFieldFn('name','formDialog')"
                    autocomplete="off"
                    class="el-input__inner">
                  </el-form-item>
                  <el-form-item label="电话" prop="tel">
                    <!-- <el-input v-model="onlineForm.tel"></el-input> -->
                    <input type="text"
                    v-model.trim="onlineForm.tel"
                    @blur="validateFieldFn('tel','formDialog')"
                    autocomplete="off"
                    class="el-input__inner">
                  </el-form-item>
                  <el-form-item label="公司" prop="comp">
                    <!-- <el-input v-model="onlineForm.comp"></el-input> -->
                    <input type="text"
                    v-model.trim="onlineForm.comp"
                    @blur="validateFieldFn('comp','formDialog')"
                    autocomplete="off"
                    class="el-input__inner">
                  </el-form-item>
                   <el-form-item label="职位" prop="work">
                    <!-- <el-input v-model="onlineForm.work"></el-input> -->
                    <input type="text"
                    v-model.trim="onlineForm.work"
                    @blur="validateFieldFn('work','formDialog')"
                    autocomplete="off"
                    class="el-input__inner">
                  </el-form-item>
                  </el-form>
                  <div class="mes-box">
                    <p>您要咨询的内容</p>
                    <el-form label-width="0px">
                      <el-form-item prop="message">
                        <!-- <el-input type="textarea"
                        placeholder="请输入您的问题"
                         v-model="onlineForm.message"></el-input> -->
                          <textarea
          v-model.trim="onlineForm.message"
          @blur="validateFieldFn('message','formDialog')"
          autocomplete="off"
          placeholder="请输入您的问题"
          class="el-textarea__inner"
          style="resize: none; min-height: 33px;">
          </textarea>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
                <div class="class-box">
                  <div class="img-box">
                    <div class="img">
                    <baseImg
                    :width="219"
                    :height="130"
                    :lazy="lazy"
                    :src="detailData.pic"
                    :alt="detailData.title">
                    </baseImg>
                    </div>
                    <!-- <img :src="detailData.pic" :alt="detailData.title"> -->
                    <p class="ellipsis2">{{detailData.title}}</p>
                  </div>
                  <p class="address">上课地点：{{detailData.address +
                  detailData.city +
                  detailData.county}}</p>
                  <p class="time">上课时间：{{getTime}}</p>
                </div>

            </div>
             <span @click="submitForm('formDialog')" class="btn-sub">提交信息</span>
      </div>
    </div>
    <!-- 遮罩层 -->
    <div class="mask" v-show="isShowFormDialog"></div>

  </div>
</template>
<script>
import Qrcode from '@/views/web/components/qrcode/qrcode.vue';
import { setScrollTop, transferString } from '@/assets/utils/util';
import { validByPhone } from '@/assets/utils/validator';
import baseTitle from '@/views/web/components/base/base-title.vue';
import {
  findOfflineCourseById,
  showCourseOffline,
  offlineCourseSignUp,
  saveMyCollection,
} from '@/api/apis';
import { formatDate } from '@/assets/utils/timefn';

const defaultPhotoUrl = require('@/views/imgs/default.png');

export default {
  name: 'detail',
  data() {
    return {
      name: '详情页',
      qrcodeWidth: 116,
      lazy: false,
      copyurl: '',
      isShowFormDialog: false,
      showShare: false,
      defaultUrl: defaultPhotoUrl, // 默认头像
      tabindex: 0, // 当前选中tab index
      tablist: [ // tab列表
        { text: '课程信息', id: '1', key: 'title' },
        { text: '课程介绍', id: '2', key: 'introduce' },
        { text: '课程大纲', id: '3', key: 'outline' },
        { text: '课程计划', id: '4', key: 'plan' },
        { text: '预约报名', id: 'online', key: 'title' },
      ],
      labelPosition: 'right',
      onlineForm: { // 在线报名表单
        name: '',
        tel: '',
        comp: '',
        work: '',
        message: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入称呼',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur',
          },
        ],
        tel: [
          {
            required: true,
            message: '请输入电话号码',
            trigger: 'blur',
          },
          {
            min: 11,
            max: 11,
            message: '长度在11个字符',
            trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
              if (!validByPhone(value)) {
                callback(new Error());
              } else {
                callback();
              }
            },
            trigger: 'blur',
            message: '手机号格式不对',
          },
        ],
        comp: [
          {
            required: true,
            message: '请输入公司名称',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'blur',
          },
        ],
        work: [
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur',
          },
        ],
        message: [
          {
            min: 2,
            max: 300,
            message: '长度在 2 到 300 个字符',
            trigger: 'blur',
          },
        ],
      },
      hotSearchList: [], // 在线训练营
      detailData: null,
      courseId: 1,
      saveMyCollectionParam: { // 收藏参数
        courseId: '', // 课程id
        onOffType: '0', // 线上线下0 : 公开课； 1 录播课
      },
      isShowFreeBtn: true,
      type: 2, // 1线上视频课 2公开课 3线上专题课
      copyFlag: true, // 复制是否成功
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    },
    token() {
      this.init();
    },
  },
  computed: {
    getDay() {
      let day = (this.detailData.endTime - this.detailData.startTime) / (24 * 60 * 60 * 1000);

      return parseInt(day, 10) + 1;
    },
    getTime() {
      return `${formatDate(this.detailData.startTime, 'true')} ~ ${formatDate(this.detailData.endTime, 'true')}`;
    },
  },
  methods: {
    init() {
      this.detailData = null;
      this.courseId = parseInt(this.$route.query.cid, 10);
      // 是否登录 初始化显示免费学btn
      if (!this.token) {
        this.isShowFreeBtn = true;
      } else if (this.token
        && this.commonUserData
        && this.commonUserData.leaguerLevelName) {
        this.isShowFreeBtn = this.commonUserData.leaguerLevelName === '用户';
      } else {
        this.isShowFreeBtn = true;
      }
      // 初始化二维码
      // this.copyurl = `${window.location.href.split('#')[0]}#/h5/index?cid=${this.courseId}`;
      // h5详情页替换规则 #号分割 替换/course 位mcourse
      let href = window.location.href.split('#')[0].replace('/course', '/mcourse');
      this.copyurl = `${href}#/detail?cid=${this.courseId}&fromRoute=share`;
      // 获取详情内容
      this.findOfflineCourseByIdFn();
      // 获取在线训练营
      this.showCourseOfflineFn();
    },
    shareFn() {
      // 分享埋点
      if (!this.showShare) {
        this.ysxy_shareClick({
          contentTitle: this.detailData.title,
          contentId: this.detailData.id,
          contentKind: '线下',
          contentType: this.detailData.price === '0' ? '免费' : '收费',
          contentPrice: this.detailData.price,
        });
      }
    },
    validateFieldFn(prop, formname) {
      let curForm = this.$refs[formname].validate
        ? this.$refs[formname]
        : this.$refs[formname][0];
      curForm.validateField([prop]);
    },

    onlineSignFn() {
      if (this.detailData.state !== '0') {
        return;
      }
      if (!this.token) {
        this.confirm();
        // this.$message({
        //   message: '您还没有登录，请先登录',
        //   type: 'warning',
        //   // duration: 0,
        // });
        return;
      }
      this.isShowFormDialog = true;
    },
    transferStringFn(str) {
      return transferString(str) || '';
    },
    goFree(path) {
      // 免费学
      if (this.detailData.state !== '0') {
        // 已结束 或者已截至课程
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
    routerGo(item) {
      this.$router.push({
        path: '/detail',
        query: { cid: item.courseOfflineEntity.id },
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
          // res.data.type 0 取消收藏 1 收藏
          this.detailData.isColl = res.data.type === '1';
          if (this.detailData.isColl) {
            this.ysxy_collect({
              contentTitle: this.detailData.title,
              contentId: this.detailData.id,
              contentKind: '线下',
              contentType: this.detailData.price === '0' ? '免费' : '收费',
              contentPrice: this.detailData.price,
            });
          }
        }
      }).catch((err) => {
        this.isCanRequest = true;
        console.log(err);
        let message = '收藏失败，请稍后再试';
        if (this.detailData.isColl) {
          message = '取消收藏失败，请稍后再试';
        }
        this.$message({
          message,
          type: 'warning',
        });
      });
    },
    offlineCourseSignUpFn() {
      // 录播课在线报名提交表单
      //  this.$message({
      //   message: '公开课详情获取失败，请稍后再试',
      //   type: 'warning',
      //   duration: 2000,
      // });
      // return;
      let params = {
        company: this.onlineForm.comp,
        offlineCourseId: this.courseId,
        name: this.onlineForm.name,
        phone: this.onlineForm.tel,
        job: this.onlineForm.work,
        content: this.onlineForm.message,
      };
      offlineCourseSignUp(params).then((res) => {
        if (res.data.code === '0000') {
          // this.detailData = res.data.data
          this.ysxy_signUp({
            name: this.onlineForm.name,
            phone: this.onlineForm.tel,
            company: this.onlineForm.comp,
            position: this.onlineForm.work,
          });
          if (res.data.id) {
            // 跳转报名成功页
            this.$router.push({
              path: '/success',
              query: {
                sid: res.data.id,
                cid: this.courseId,
                type: this.type,
              },
            });
          }
        } else if (res.data.code !== '0002') {
          this.$message({
            message: res.data.message,
            type: 'warning',
            duration: 2000,
          });
        }
      }).catch((err) => {
        console.log(err);
        this.$message({
          message: '公开课详情获取失败，请稍后再试',
          type: 'warning',
        });
      });
    },
    showCourseOfflineFn() {
      // 获取在线训练营
      showCourseOffline().then((res) => {
        console.log(res);
        if (res.data.code === '0000') {
          // this.detailData = res.data.data
          this.hotSearchList = res.data.list;
        }
      }).catch((err) => {
        console.log(err);
        this.$message({
          message: '公开课详情获取失败，请稍后再试',
          type: 'warning',
        });
      });
    },
    findOfflineCourseByIdFn() {
      // 获取公开课详情
      if (this.courseId) {
        findOfflineCourseById({ id: this.courseId }).then((res) => {
          if (res.data.code === '0000' && res.data.data) {
            res.data.data.isColl = res.data.isFavorite && res.data.isFavorite.code === '8888';
            this.detailData = res.data.data;
            this.ysxy_detailView({
              contentTitle: this.detailData.title,
              contentId: this.detailData.id,
              mainTeacher: this.detailData.teacherName,
              contentKind: '线下',
              contentType: this.detailData.price === '0' ? '免费' : '收费',
              contentPrice: this.detailData.price,
            });
          }
        }).catch((err) => {
          console.log(err);
          this.$message({
            message: '公开课详情获取失败，请稍后再试',
            type: 'warning',
            // duration: 0,
          });
        });
      }
    },
    changeTab(index, item) {
      this.tabindex = index;
      this.scrollToDom(item);
    },

    scrollToDom(item) {
      // 滚动条滚动到指定元素位置
      const obj = document.getElementById(item.id);
      if (obj) {
        const top = obj.offsetTop;
        setScrollTop(top);
      }
    },

    copyFn() {
      // 复制链接
      try {
        const input = document.getElementById('copy');
        input.select(); // 选中文本
        if (window.clipboardData && this.copyFlag) {
          this.copyFlag = window.clipboardData.setData('Text', this.copyurl);
        } else {
          document.execCommand('copy');
        }
        // let flag = document.execCommand('copy'); // 执行浏览器复制命令
        if (!this.copyFlag) {
          this.$message({
            message: '禁用复制功能，请刷新页面或者更换浏览器重试',
            type: 'warning',
          });
        } else {
          this.$message({
            message: '复制成功',
            type: 'success',
          });
        }
      } catch (e) {
        console.log(e);
        this.$message.error(`该浏览器不支持复制，请手动选择复制：${this.copyurl}`);
      }
    },

    submitForm(formName) {
      // 表单提交
      if (this.detailData.state !== '0') {
        // 已结束 或者已截至课程
        return;
      }
      console.log(this.token);
      if (!this.token) {
        this.confirm();
        // this.$message({
        //   message: '您还没有登录，请先登录',
        //   type: 'warning',
        // });
        return;
      }
      let curForm = this.$refs[formName].validate
        ? this.$refs[formName]
        : this.$refs[formName][0];
      curForm.validate((valid) => {
        if (!valid) {
          console.log('提交失败');
        } else {
          this.offlineCourseSignUpFn();
        }
      });
    },


  },
  components: {
    baseTitle,
    Qrcode,
  },
};
</script>
<style scoped>
/*在线学习弹框*/
.teacher-box{
  display: block;
  width: 100%;
  position: relative;
  padding-left: 109px;
  min-height: 130px;
  box-sizing:border-box;
  word-break: break-all;
  line-height: 89px;
}
.teacher-box .img-box{
  position: absolute;
  width: 109px;
  left: 0;
  top: 0;
  text-align: center;
}
.teacher-box .intro{
  font-size: 14px;
  display: inline-block;
  line-height: 16px;
  padding-left: 20px;
}
.teacher-box .img-box .img{
  width: 89px;
  height: 89px;
  border-radius: 100%;
  overflow: hidden;
  margin: 0 auto;
}
.teacher-box .img-box .name{
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  line-height: 16px;
}
.open-class{
  position: relative;
}
.dialog-online{
  background: #FFFFFF;
  border: 1px solid #979797;
  border-radius: 8px;
  width: 738px;
  min-height: 537px;
  max-height: 590px;
  position: absolute;
  left: 50%;
  top: 60px;
  /*-webkit-transform: translate(-50%,0);
  -ms-transform: translate(-50%,0);
  -o-transform: translate(-50%,0);
  transform: translate(-50%,0);*/
  margin-left: -369px;
  z-index: 100;
  padding: 10px;
  box-sizing:border-box;
}
.dialog-online h3{
  text-align: center;
  margin: 20px auto 30px auto;
  font-size: 16px;
  color: #444444;
  letter-spacing: -0.39px;
  text-align: center;
}

.class-box{
  width: 382px;
  font-size: 14px;
  color: #FB683C;
  float: right\0;
}
.class-box .img-box{
  overflow: hidden;

}
.class-box .img-box .img{
  float: left;
  width: 178px;
  height: auto;
  margin-right: 20px;
}
.class-box .ellipsis2{
  height: 40px;
  line-height: 20px;
  font-size: 14px;
  color: #444444;
}
.address{
  margin-bottom: 10px;
}
/*复制链接*/
#copy{
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  z-index: -10;
  opacity: 0;
}
  /*顶部图片 分享按钮 收藏按钮 在线报名 免费学*/
  .img-box{
    position: relative;
    display: block;
    width: 100%;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .img-box img{
    display: block;
    width: 100%;
    max-height: 320px;
    position: relative;
    z-index: 0;
  }
  .img-box .btns{
    position: absolute;
    font-size: 0;
    text-align: right;
    height: 40px;
    bottom:10px;
    right: 0;
    z-index: 1;
  }
  .img-box .btns span{
    font-size: 14px;
    color: #FFFFFF;
    letter-spacing: -0.34px;
    display: inline-block;
    cursor: pointer;
    margin-right: 20px;
    float: left;
  }
  .icon-collect,
  .icon-share{
    width: 30px;
    height: 40px;
    background: url('./imgs/icon-share.png') no-repeat top left;
    background-size: 30px auto;
    position: relative;
    top: 10px;
  }
  .icon-collect{
    top: 12px;
    left: -2px;
    background-size:100% auto;
    background-image: url('./imgs/icon-coll-off.png');
  }
  .icon-collect.active{
    top: 14px;
    left: 2px;
    background-size: 22px auto;
    background-image: url('./imgs/icon-coll-on.png');
  }
  .btn-free,
  .btn-online{
    width: 69px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background: #FB683C;
    position: relative;
    top: 10px;
  }
  .btn-free{
    background: #59A8FF;
  }

  .gray{
    background: #ccc;
  }

  /*微信扫码 复制链接*/
  .share-box{
    text-align: center;
  }
  .wx-box p,
  .copy p{
    height: 32px;
    display: block;
    text-align: center;
    font-size: 0;
  }
  .wx-box p{
    margin-bottom: 10px;
  }
    .copy span,
    .wx-box span{
      font-size: 14px;
    }
  .icon-wx,
  .icon-copy{
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-right: 12px;
    position: relative;
    background: url('./imgs/icon-copy.png') no-repeat top left;
    /*float: left\0;*/
    position: relative;
    top: 4px;
  }
  .icon-wx{
    width: 26px;
    background-image: url('./imgs/icon-wx.png')
  }

  .qrcode{
    width: 116px;
    height: 116px;
    margin: 0 auto;
    overflow: hidden;
  }

  /*专题课程tab*/
  .tab-box{
    display: block;
    height: 54px;
    line-height: 54px;
    background: #F7F7F7;
    font-size: 0;
    margin-bottom: 20px;
    text-align: left;
  }
  .tab-box a{
    display: inline-block;
    font-size: 16px;
    color: #444444;
    letter-spacing: 0;
    margin-left: 40px;
    cursor: pointer;
    text-decoration: none;
  }
  .tab-box a.active{
    color: #FB683C;
  }
  .contain-box{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    overflow: hidden\0;
  }
  .contain-box>.aside{
    float: right\0;
    width: 220px\0;
  }
  .contain-box>.contain{
    float: left\0;
  }
  .contain-box .item{
    padding-bottom: 30px;
  }
  .contain-box .item .title{
    width: 100%;
  }


  .contain-box h4{
    font-size: 14px;
    color: #FB683C;
    margin-bottom: 10px;
  }

  .class-mes{
    font-size: 14px;
  }
  .class-mes p{
    margin-bottom: 10px;
  }
  /*提交表单*/
  .form{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    overflow: hidden\0;
  }
  .form .form-box{
    width: 300px;
    float: left\0;
  }
  .form .mes-box{
    width: 360px;
    height: 192px;
    padding-top: 30px;
    position: relative;
    box-sizing:border-box;
    float: right\0;
  }
  .dialog-online .mes-box{
    width: 280px;
    left: 20px;
    left:0\0;
  }
  .form .mes-box p{
    position: absolute;
    top: 0;
    left: 0;
    text-align: left;
    font-size: 14px;
    line-height: 20px;
  }


  /*右侧标题列表*/
  .aside{
    width: 255px;
    margin-left: 30px;
    font-size: 14px;
    color: #444444;
    letter-spacing: 0;
    flex-shrink:0;
  }
  .title,
  .aside .title{
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: bold;
  }
  .contain{
    max-width: 710px;
    width: 100%;
    flex-shrink:1;
  }
  .hot-word{
    font-size: 0;
    text-align: left;
  }
  .hot-word span{
    display: inline-block;
    font-size: 14px;
    color: #FB683C;
    margin-right: 60px;
    margin-bottom: 20px;
    cursor: pointer;
  }
  .hot-word span:nth-child(2n+1){
    margin-right: 0;
  }
  .hot-search-list li {
    display: block;
    position: relative;
    padding-left: 10px;
    margin-bottom: 10px;
    line-height: 20px;
    cursor: pointer;
  }
  .hot-search-list li .rank{
    display: block;
    position: absolute;
    width: 4px;
    height: 4px;
    text-align: center;
    line-height: 0;
    color: #Fff;
    background: #444;
    left: 0;
    top: 8px;
    font-size: 0;
    border-radius: 100%;
  }


</style>
