<template>
    <div @click="showSearchBox=false"
    class="layout common-web-layout">
     <el-container>
     <!-- 页面头部 -->
     <!-- <compHeader v-if="false"></compHeader> -->
     <el-header height="60px">

          <div class="header">
            <div class="common-container-width">
              <div class="logo-box">
                <div :style="'background-image:url('+COMMON_COMP_DATA.logoUrl+')'" class="logo">
                <!-- <router-link to="/index" tag="a">
                  <img :src="COMMON_COMP_DATA.logo">
                </router-link> -->
                </div>
                <div class="logoname">
                  {{COMMON_COMP_DATA.productName}}
                </div>
                <!-- <h1>法规资讯</h1> -->
              </div>
              <!-- 导航 -->
              <div class="nav">

                <div v-for="(item,index) in navlist"
                class="item"
                v-show="item.name != '在线学习'"
                @click="changeNav(item,index)"
                :class="{active:index==navIndex}"
                :key="index">
                {{item.name}}</div>

                <!-- 在线学习类目 -->
                <el-popover
                  popper-class="common-layout-nav"
                  placement="bottom"
                  trigger="hover"
                  width="970"
                  offset="offset"
                  v-model="showOnlineBox">
                  <div slot="reference" class="slot-online">
                    <div v-for="(item,index) in navlist"
                    class="item"

                    @click="changeNav(item,index)"
                    v-show="item.name == '在线学习'"
                    :class="[
                    {active:index==navIndex},
                    {online:item.name == '在线学习'},
                    ]"
                    :key="index">
                    {{item.name}}</div>
                  </div>

                  <!-- 类目展开框 -->
                  <div class="online-box common-scroll-bar">
                    <div class="online-nav-left" v-if="onlineNavList.length>0">
                      <div class="item"
                      :class="{active:index == onlineNavIndex}"
                      @mouseenter="onlineNavIndex = index"
                      v-for="(item,index) in onlineNavList"
                      :key="index">
                        {{item.name}}
                      </div >
                    </div>

                    <div class="online-nav-right">
                      <ul v-if="onlineNavList[onlineNavIndex]
                      && onlineNavList[onlineNavIndex].children"
                      class="online-nav-right-list">
                        <li
                        v-for="(item,index) in
                        onlineNavList[onlineNavIndex].children"
                        :key="index">
                          <span @click="onlineNavClick(item,index)"
                          class="title">
                            {{item.name}}
                          </span>
                          <span v-for="(list,listindex) in item.children"
                          @click="onlineNavClick(list,listindex)"
                          :key="listindex">
                            {{list.name}}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </el-popover>

              </div>


              <!-- 用户信息 未登录 -->
              <div class="user-box"
              v-if="!token || !commonUserData
              || !commonUserData.userName">
                <span class="register" @click="login('reg')">注册</span>
                <span class="nologin" @click="login">登录</span>
              </div>
              <!-- 用户信息 登录成功 -->
              <div v-if="token
              && commonUserData
              && commonUserData.userName" class="user-box">
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  width="190"
                  v-model="showUserBox">
                  <div class="name-btn" slot="reference">
                    <span @click="routerGo('/center/preson')"
                    :title="commonUserData.userName"
                    class="name pointer ellipsis">Hi,{{commonUserData.userName}}</span>
                    <span class="icon-triangle"></span>
                  </div>
                  <!-- 用户详情 start -->
                  <div class="user-container">
                    <span class="name ellipsis"
                    :title="commonUserData.userName">Hi,{{commonUserData.userName}}</span>
                    <span class="level pointer"
                    @click="routerGo('/interests')">
                    {{subString(commonUserData.leaguerLevelName) || "用户"}}</span>
                    <ul class="user-nav">
                      <li
                      v-for="(item,index) in userNav"
                      @click="routerGo(item.href)"
                      :key="index">
                        {{item.text}}
                      </li >
                    </ul>
                    <span @click="loginoutFn" class="loginout">退出</span>
                  </div>
                 <!-- 用户详情 end -->
                </el-popover>
                <!-- 用户等级 -->
                <span
                @click="routerGo('/interests')"
                class="level pointer">{{subString(commonUserData.leaguerLevelName) || "用户"}}</span>
              </div>


              <!-- 搜索框 -->
              <div class="search-box-contain">
              <el-popover
                  placement="bottom"
                  trigger="manual"
                  width="386"
                  v-model="showSearchBox">

                <div slot="reference" class="search-box-slot">
                  <div class="search-box"
                  @click.stop
                  :class="{active:showSearchInput}">
                    <input ref="searchInput" type="text"
                    @keyup.enter="goSearchPage"
                    @focus="showSearchBox=true"
                    v-model.trim="search.value">
                    <span

                    @click="focusSearchInput"
                     class="icon-search"></span>
                  </div>
                </div>

                <!-- 联动结果框 -->
                <div class="search-result-box">

                  <div class="result-list-box">
                    <div class="tab">
                      <span @click="changeSearchTab(0,'online')"
                      :class="{active:searchTabIndex==0}">
                      录播课({{getSearchListData.online.total}})</span>
                      <span @click="changeSearchTab(1,'offline')"
                      :class="{active:searchTabIndex==1}">
                      公开课({{getSearchListData.offline.total}})</span>
                    </div>
                    <div v-if="getSearchListData[searchResultType].total<1" class="empty">
                      <span v-show="!isShowSearchLoading && search.value">
                        暂无数据，换个关键词试试吧
                      </span>
                      <span v-show="search.value ===''">
                        请输入搜索内容
                      </span>
                      <span class="el-icon-loading"
                      v-show="isShowSearchLoading"></span>
                    </div>
                    <ul v-if="getSearchListData[searchResultType].total>0" class="result-list">
                      <li class="pointer"
                      @click="goDetail(item,'ysxy_searchResultClick')"
                      v-for="(item,index) in getSearchListData[searchResultType].list.slice(0,3)"
                      :key="index">
                        <img :src="item.bannerUrl?item.bannerUrl:item.pic" :alt="item.title">
                        <div class="title-box">
                          <p class="title ellipsis2"
                          v-html="searchValToHtml(item.title,search.value)">
                          </p>
                          <p class="time-box">
                            <span>{{getSearchTime(item)}}</span>
                            <span>{{getSearchLearn(item)}}</span>
                          </p>
                        </div>
                      </li >
                    </ul>

                    <p v-if="getSearchListData[searchResultType].total>=3"
                    @click="goSearchPage"
                    class="more">查看更多</p>
                  </div>

                </div>

              </el-popover>
              </div>
              <span
                v-if="isBackBtnShow"
                class="backworkbench"
                @click="backWorkbench">
                <i class="icon-back"></i>返回工作台
              </span>

            </div>

          </div>

     </el-header>


       <!-- 公共侧栏 -->
     <div class="aside">
        <!-- 能力测评 -->
        <div v-show="isShowEvaluation" class="aside-evaluation">
          <div v-if="!isEvad" class="isevad">
            <p class="title">测一测你的能力模型</p>
            <p class="step">step1：能力评测</p>
            <span class="icon-triangle"></span>
            <p class="step">step2：评估报告</p>
            <span @click="showEva()" class="btn-ev">测评</span>
          </div>
          <div v-else class="isevad">
            <span @click="isShowEvaluation=false" class="el-icon-close"></span>
            <p class="title">您的成绩</p>
            <div class="loading">
                <div class="left">
                  <span :style="isEvadStyleLeft" class="after"></span>
                </div>
                <div class="right">
                  <span :style="isEvadStyleRight" class="after"></span>
                </div>
                <div class="progress">
                  <span class="store">{{evadStore.num}}</span> / {{evadStore.total}}
                  <p>我的成绩</p>
                </div>
            </div>

            <span @click="showEva()" class="btn-ev">查看报告</span>
          </div>
        </div>

        <!-- 返回顶部 QQ -->
       <div class="aside-qq-backtop">
        <span v-show="sourceData.isOpen"
        :class="{on:sourceData.mesnum}"
        @click="expectFn()" class="icon-expect">
          咨询专家
        </span>
        <span @click="isShowEvaluation = !isShowEvaluation" class="icon-ev">
          能力测评
        </span>
        <!-- <a v-if="COMMON_COMP_DATA.qq" :href="COMMON_COMP_DATA.qq" target="_blank">
         <span class="icon-qq"></span>
        </a> -->
        <a v-if="isqimoChatClickFlag" href="javascript:"
        @click="qimoChatClickFn">
         <span class="icon-qq">
           在线客服
         </span>
        </a>
         <span v-if="aside.scrollTop>=aside.scrollY"
          @click="backTop"
          class="icon-backtop">
          返回顶部</span>
       </div>
     </div>
      <!-- 首次进入页面提示测评弹框 -->
      <div class="mask" v-if="isShowTips">
        <div @click.stop class="cptip-dialog">
          <span @click="closeTips" class="el-icon-close"></span>

          <img src="./imgs/layouttips.png" alt="">
          <span  @click="showEva(true)" class="btn-sub">测评</span>
        </div>
      </div>

      <!-- 页面主体 -->
      <div class="main">
      <el-main><slot>main</slot></el-main>
      </div>

      <!-- 页面底部 -->
      <el-footer height="176px">
        <compFooter></compFooter>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import { getScrollTop, setScrollTop } from '@/assets/utils/util';
import {
  getSearchList,
  getCategoryList,
  getReviewUrl,
  noPassLogin,
  getProductStatusByProductId,
  getUnreadMsgCount,
} from '@/api/apis';

import compFooter from '@/views/web/layout/footer.vue';
// import compHeader from '@/views/web/layout/header.vue';

export default {
  data() {
    return {
      name: 'layout',
      backUrl: '',
      isBackBtnShow: false, // 是否显示回到工作台按钮
      navlist: [
        { name: '首页', href: '/index' },
        { name: '公开课', href: '/open-class' },
        { name: '录播课', href: '/online-class' },
      ],
      // isShowTips: false,
      isShowTips: window.localStorage.getItem('isShowTips') !== 'hide',
      navIndex: 0, // 默认顶部导航选中index
      offset: 100,
      isShowEvaluation: false, // 是否显示测评
      isEvad: false, // 是否已经评测过
      evadStore: { // 评测得分
        total: 60, // 总分
        num: 0, // 当前得分
      },
      isEvadStyleLeft: {
        transform: 'rotateZ(0deg)',
      },
      isEvadStyleRight: {
        transform: 'rotateZ(0deg)',
      },


      showOnlineBox: false, // 在线学习类目显示
      onlineNavIndex: 0, // 当前选中的在线课程分类
      onlineNavList: [],

      showUserBox: false, // 用户信息弹框
      user: {
        name: '',
        level: '',
      },

      userNav: [
        {
          text: '个人中心',
          value: '0',
          icon: 'preson',
          href: '/center/preson',
        },
        {
          text: '我的课程',
          value: '1',
          icon: 'myclass',
          href: '/center/myclass',
        },
        {
          text: '我的收藏',
          value: '2',
          icon: 'mycol',
          href: '/center/mycol',
        },
        {
          text: '我的报名',
          value: '3',
          icon: 'signin',
          href: '/center/signin',
        },
        {
          text: '我的订单',
          value: '4',
          icon: 'myorder',
          href: '/center/myorder',
        },
        {
          text: '个人设置',
          value: '5',
          icon: 'myset',
          href: '/center/myset',
        },
      ],
      search: {
        value: '',
      },
      searchTabIndex: 0,
      showSearchInput: false,
      showSearchBox: false, // 搜索联动框
      getSearchListList: [], // 搜索结果
      isShowSearchLoading: false, // 搜索等待

      aside: {
        qq: '', // 侧栏QQ
        scrollTop: 0, // 滚动条高度
        scrollY: 200, // 展示返回顶部按钮的阈值
      },

      timer: null,
      searchTimer: null,
      backToptimer: null,
      evurl: '',
      getSearchListData: {
        online: {
          total: 0,
          list: [],
        },
        offline: {
          total: 0,
          list: [],
        },
      },
      searchResultType: 'online',
      sourceData: { // 是否开通专家权限
        isOpen: false,
        mesnum: false,
      },
      getProductTimer: null,

    };
  },
  created() {
    // 初始化用户信息
  },
  mounted() {
    this.init();
  },
  watch: {
    /*eslint-disable*/
        'search.value': function () {
          if(this.search.value){
            this.getSearchListFn();
          }
        },
        '$route':function(){
          this.initNavListIndex();
          // 清空搜索值
          this.initSearchVal();
          if (!this.$route.meta.isNeedLogin) {
            this.getTokenByCode();
          }
          this.getUserInfoFn();
          this.getProductStatusByProductIdFn();
        },
        'token':function(newval,oldval){
          if(oldval && !newval){
            console.log("0002退出登录")
            this.loginout();
            return;
          }
          if(this.token){
            this.initReview();
            this.getProductStatusByProductIdFn();
          }
        },
        'COMMON_COMP_DATA':function(){
          this.getProductStatusByProductIdFn();

        },
        /* eslint-enable */
  },
  methods: {

    init() {
      this.aside.qq = this.COMMON_COMP_DATA.qq;
      if (this.$route.query.backUrl) {
        this.backUrl = this.$route.query.backUrl;
        this.isBackBtnShow = true;
      }

      // 初始化导航位置
      this.initNavListIndex();
      // 设置评测环状
      this.initProcess();
      // 初始化滚动条
      this.initScroll();
      // 获取公开课程列表
      this.getCategoryListFn();
      // 初始化测评相关
      this.initReview();
      // 获取token
      if (!this.$route.meta.isNeedLogin) {
        this.getTokenByCode();
      }
      // 获取用户信息
      this.getUserInfoFn();
      // 定时器一分钟获取一次  获取是否有新消息
      clearInterval(this.getProductTimer);
      this.getProductTimer = setInterval(() => {
        this.getUnreadMsgCountFn();
      }, 10 * 1000);
    },
    // 返回工作台
    backWorkbench() {
      let backUrl = decodeURI(this.backUrl);

      window.open(backUrl, '_self');
    },
    async getUnreadMsgCountFn() {
      // 判断一下当前窗口的状态 如果是唤起的状态 不请求接口
      // 如果已经提示有新消息，不继续请求 点击的时候
      let expertDom = document.getElementById('ExpectInitRongCloudBoxId') ? document.getElementById('ExpectInitRongCloudBoxId').style.display : '';
      if (this.token && this.commonUserData.userId
        && !this.sourceData.mesnum
        && expertDom !== 'block') {
        let res = await getUnreadMsgCount({ type: 'user', userId: this.commonUserData.userId });
        if (res.data.code === '0000') {
          this.sourceData.mesnum = res.data.data;
        }
      }
    },
    async getProductStatusByProductIdFn() {
      // 获取是否开通专家
      console.log(this.token && this.commonUserData.userId);
      if (this.sourceData.isOpen) {
        // 如果已经有开通权限 但是没有token  或者 有开通权限且有新消息提示  直接返回
        return;
      }
      this.getUnreadMsgCountFn();

      if (this.COMMON_COMP_DATA
        && this.COMMON_COMP_DATA.source) {
        let res = await getProductStatusByProductId({
          distributorId: this.COMMON_COMP_DATA.source,
          type: 6,
          productId: 'a2cc30f6552542ad8d22155f96adba30',
        });
        if (res.data.code === '0000' && res.data.data.status === '2') {
          this.sourceData.isOpen = res.data.data.openExpert === '1';
        }
      }
    },

    expectFn() {
      // 唤起专家

      // status string
      // 非必须
      // 0 默认 1 下架 2 已上架 3 删除
      if (!this.token) {
        this.confirm();

        return;
      }
      console.log(this.commonUserData, this.COMMON_COMP_DATA);
      /*eslint-disable*/
      const reg = /code\=\w*(&|$)/;
      const reg1 = /token\=[\w|\.|\-|\_]*(&|$)/;
      let href = window.location.href.replace(reg, '').replace(reg1, '');
      /* eslint-enable */
      let otitle = document.getElementById('detailTitle');

      let params = {
        id: this.commonUserData.userName,
        name: this.commonUserData.userName,
        icon: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1372494972,1692060958&fm=26&gp=0.jpg',
        account: this.commonUserData.userName,
        channelFrom: 1624,
        fromAddress: href,
        fromName: '优税学院',
        fromContent: otitle ? otitle.innerHTML : document.title,
        companyLocation: href,
        accnout: this.commonUserData.userName,
        accnoutId: this.commonUserData.userName,
        distributorId: this.COMMON_COMP_DATA.source, // 渠道id
        token: this.token,
        ...window.COMMON_ENV.rongCloudConfig,
      };
      this.sourceData.mesnum = false; // 唤起后隐藏红点
      window.initRongCloud(params);
    },
    initSearchVal() {
      this.search.value = '';
      this.showSearchBox = false;
      this.showSearchInput = false;
      this.isShowSearchLoading = false;
      this.getSearchListData = JSON.parse(JSON.stringify({
        online: {
          total: 0,
          list: [],
        },
        offline: {
          total: 0,
          list: [],
        },
      }));
    },
    qimoChatClickFn() {
      // 唤起客服
      window.qimoChatClick();
    },
    noPassLoginFn() {
      // 免密登录
      let params = {
        username: '19931303211',
        isOnce: 1,
        taxNo: '12345678901234567890',
        entName: '哈哈哈公司',
      };
      noPassLogin(params).then((res) => {
        console.log(res);
        // this.setToken(res.data.accessToken);
      }).catch((err) => {
        console.log(err);
      });
    },
    closeTips() {
      this.isShowTips = false;
      localStorage.setItem('isShowTips', 'hide');
    },
    goDetail(item, evtype) {
      // 搜索结果点击埋点
      if (evtype === 'ysxy_searchResultClick') {
        this.ysxy_searchResultClick({
          keyWord: this.search.value,
          contentId: item.id,
          contentTitle: item.title,
        });
      }
      this.showSearchBox = false;
      if (this.searchResultType === 'online') {
        this.$router.push({ path: '/online-detail', query: { cid: item.id } });
      } else {
        this.$router.push({ path: '/detail', query: { cid: item.id } });
      }
    },
    getSearchTime(item) {
      if (this.searchResultType === 'online') {
        let num = 0;
        if (item.courseVideoEntity.length > 0) {
          item.courseVideoEntity.forEach((min) => {
            num += min.videoMinute;
          });
        }
        return `${num}分钟`;
      }

      return `讲师:${item.teacherName}`;
    },
    getSearchLearn(item) {
      if (this.searchResultType === 'online') {
        return `${item.learnNum}人在学`;
      }
      // let price = item.price ? `${item.price}元` : '免费';
      let city = item.address + item.city;
      return city;
    },
    changeSearchTab(index, type) {
      this.searchTabIndex = index;
      this.searchResultType = type;
    },

    initReview() {
      console.log('init', this.token);
      if (!this.token) {
        // 用户未登录  展示测评
        this.isEvad = false;
      } else {
        // this.getReviewFn();
        this.getReviewUrlFn();
      }
    },
    showEva(type) {
      if (!this.token && type) {
        // 直接去登录不提示
        this.confirm();
        return;
      }
      this.ysxy_EvaluationClick();
      if (this.token && this.evurl) {
        // 如果token存在且跳转地址存在 去测评
        this.closeTips();
        window.open(this.evurl);
      } else if (!this.token) {
        // 否则 登录失效 去登录
        // this.loginout();
        this.confirm();
        // this.$message({ message: '您还没有登录，请先登录', type: 'warning' });
      } else {
        // this.getReviewUrlFn();
        this.$message({ message: '获取评测地址失败，请稍后再试', type: 'warning' });
      }
    },
    getReviewUrlFn() {
      // 获取测评地址

      getReviewUrl().then((res) => {
        if (res.data.code === '0000' || res.data.code === '0009') {
          console.log(res);
          if (res.data.code === '0009') {
            this.evadStore.num = res.data.review.memberCorrectCount; // 用户答对题数
            this.evadStore.total = res.data.review.examTotal; // 总题数
            // 已经评测过
            this.isEvad = true;
          } else {
            this.isEvad = false;
          }
          this.evurl = res.data.url;
        } else if (res.data.code !== '0002') {
          this.isEvad = false;
          // 获取测评地址失败
          this.$message({
            message: '获取测评地址失败,请稍后再试',
            type: 'warning',
          });
        }
      }).catch((err) => {
        this.isEvad = false;
        this.$message({
          message: '获取测评信息失败,请稍后再试',
          type: 'warning',
        });
        console.log(err);
      });
    },
    onlineNavClick(item) {
      this.$router.push({ path: '/online-class', query: { nid: item.id } });
    },

    arrFindById(arr, id) {
      let i = -1;
      arr.forEach((item, index) => {
        if (item.id === id) {
          i = index;
        }
      });
      return i;
    },
    initNavList(list) {
      function getChildById(id) {
        let childs = [];
        list.forEach((item) => {
          if (item.pid === id && item.id !== item.pid) {
            childs.push({ children: getChildById(item.id), ...item });
          }
        });
        return childs;
      }

      let arr = [];
      list.forEach((item) => {
        if (item.id === item.pid) {
          arr.push({ children: getChildById(item.id), ...item });
        }
      });

      arr.sort((a, b) => {
        let asort = a.sort || 1;
        let bsort = b.sort || 1;
        if (asort > bsort) {
          return 1;
        }
        return -1;
      });

      return arr;
    },

    getCategoryListFn() {
      // 获取公开课程列表
      // if (this.onlineNavListData.length > 0) {
      //   this.onlineNavList = this.initNavList(this.onlineNavListData);
      //   return;
      // }
      getCategoryList().then((res) => {
        if (res.status === 200) {
          let arr = [];
          let { list } = res.data;
          // 设置vuex在线导航列表
          this.setOnlineNavListData(res.data.list);
          // id === pid 是一级菜单
          arr = this.initNavList(list);
          console.log(arr);
          this.onlineNavList = arr;
        }
      }).catch((err) => {
        this.$message({
          message: '获取公开课程列表失败,请稍后再试',
          type: 'warning',
        });
        console.log(err);
      });
    },
    getSearchListFn() {
      // 搜索埋点
      this.ysxy_searchButtonClick();
      // 搜索联动
      this.isShowSearchLoading = true;
      const title = this.search.value;
      if (title) {
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => {
          getSearchList({ title }).then((res) => {
            let hasResult = false;
            this.isShowSearchLoading = false;
            if (res.data.code === '0000') {
              // this.getSearchListData = res.data
              this.$set(this.getSearchListData, 'online', res.data.online);
              this.$set(this.getSearchListData, 'offline', res.data.offLine);
              if (res.data.online.list.length > 0 || res.data.offLine.list.length > 0) {
                hasResult = true;
              }
            }

            // 搜索结果埋点
            this.ysxy_sendSearchRequest({
              keyWord: this.search.value,
              hasResult,
            });
          }).catch((err) => {
            this.ysxy_sendSearchRequest({
              keyWord: this.search.value,
              hasResult: false,
            });
            this.isShowSearchLoading = false;
            console.log(err);
          });
        }, 2000);
      }
    },
    initScroll() {
      // 监听滚动条事件 判断当前滚动条位置
      const oThis = this;
      this.aside.scrollTop = getScrollTop();
      window.addEventListener('scroll', () => {
        const scorllTop = getScrollTop();
        clearTimeout(this.timer);
        oThis.timer = setTimeout(() => {
          oThis.aside.scrollTop = scorllTop;
        }, 300);
      }, false);
    },

    initNavListIndex() {
      // 初始化 当前选中状态
      if (this.$route.meta && this.$route.meta.navIndex) {
        this.navIndex = this.$route.meta.navIndex;
      } else {
        let nav = -1;
        this.navlist.forEach((item, index) => {
          if (item.href === this.$route.path) {
            nav = index;
          }
        });
        this.navIndex = nav;
      }
    },

    initProcess() {
      const store = (this.evadStore.num / this.evadStore.total).toFixed(2) * 100;
      let deg;
      if (store > 50) {
        deg = parseInt(180 * (1 - (store - 50) / 50), 0);
        this.isEvadStyleLeft.transform = 'rotateZ(0deg)';
        this.isEvadStyleRight.transform = `rotateZ(${deg}deg)`;
      } else {
        deg = parseInt((50 - store) / 50 * 180, 0);
        if (deg === 0) {
          deg = 180;
        }
        this.isEvadStyleRight.transform = 'rotateZ(180deg)';
        this.isEvadStyleLeft.transform = `rotateZ(${deg}deg)`;
      }
    },

    routerGo(path) {
      if (path) {
        this.$router.push({ path });
      }
    },

    backTop() {
      /**
                * 返回顶部过度动画
                * @desc 过渡时间 scrollTime=300 ms
                * @author liuyuhui
                * @date 2019年4月13日13:20:32
                * @param scrollTime 过渡时间
                * @example this.backTop
          */
      this.aside.scrollTop = 0;
      const scrollTime = 300;
      const stepTime = 10; // 每次触发间隔
      const scrollTop = getScrollTop();
      // step 计算每次滚动距离
      const step = Math.ceil((scrollTop - this.aside.scrollTop) / (scrollTime / stepTime));

      clearInterval(this.backToptimer);
      this.backToptimer = setInterval(() => {
        const curScroll = getScrollTop();
        let top = 0;
        if (curScroll - step > 0) {
          top = curScroll - step;
        } else {
          clearInterval(this.backToptimer);
        }
        setScrollTop(top);
      }, stepTime);
    },
    register() {
      window.location.href = 'http://www.baidu.com';
    },

    changeNav(item, index) {
      console.log(item);
      this.navIndex = index;
      if (item.href) {
        this.$router.push({ path: item.href });
      }
    },

    focusSearchInput() {
      // 展示搜索框并聚焦
      if (this.showSearchInput) {
        // 如果已经聚焦 再次点击去搜索
        this.goSearchPage();
      } else {
        this.showSearchInput = true;
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      }
    },

    goSearchPage() {
      // 去搜索结果页面  或者关闭搜索框
      if (this.search.value === '') {
        this.showSearchInput = false;
        this.showSearchBox = false;
      } else {
        this.$nextTick(() => {
          this.showSearchBox = false;
          this.$refs.searchInput.blur();
          this.$router.push({
            path: '/search',
            query: {
              val: this.search.value,
              tab: this.searchTabIndex,
            },
          });
        });
      }
    },

    loginoutFn() {
      // 退出登录
      this.showUserBox = false;
      this.loginout();
    },
  },
  components: {
    compFooter,
    // compHeader,
  },
};
</script>
<style lang="less" scoped>
  .icon-back{
    width: 13.8px;
    height: 14px;
    display: inline-block;
    background: url("./imgs/back1.svg") no-repeat;
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    margin-right: 5px;
  }
  .backworkbench{
    cursor: pointer;
    position: absolute;
    left: 100%;
    margin-top: 10px;
    margin-left: 20px;
    white-space: nowrap;
    display: inline-block;
    width: 122px;
    height: 40px;
    background: #F0F0F0;
    border: 1px solid #E5E5E5;
    border-radius: 6px;
    border-radius: 6px;
    font-size: 14px;
    color: #333333;
    text-align: center;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover{
      .icon-back{
        background: url("./imgs/back2.svg") no-repeat;
        -webkit-background-size: 100% 100%;
        background-size: 100% 100%;
      }
    }
  }
  .backworkbench:hover{
    color: #0898AD;
    background: #F0F0F0;
    border: 1px solid #E5E5E5;
  }
/*首次进入页面评测弹窗*/
.mask{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
}
.cptip-dialog{
  display: block;
  position: absolute;
  width: 421px;
  height: 354px;
  left: 50%;
  top: 50%;
  margin: -177px 0 0 -211px;
  background: #fff;
  border: 1px solid #979797;
border-radius: 8px;
}
.cptip-dialog .el-icon-close{
  color: #000;
  position: absolute;
  right: 20px;
    top: 10px;
    font-size: 20px;
}
.cptip-dialog img{
  width: 270px;
  height: 260px;
  display: block;
  margin: 30px auto 0 auto;
}
.main{
  min-height: 600px;
}
  .register,
  .nologin{
    font-size: 16px;
    cursor: pointer;
    margin-left: 30px;
  }
  .register{
    margin-left: 0;
  }


  /*开始迁移*/
  .logo-box{
    float: left;
    /* display: flex; */
    margin-top: 7px;
    /* width: 140px; */
    height: 46px;
    line-height: 46px;
    font-size: 0;
    overflow: hidden;
  }
  .logo-box h1{
    display: inline;
    font-size: 19px;
    color: #444444;
  }
  .logo-box .logo{
    background-size: 100% 100%;
    display: block;
    height: 46px;
    width: 46px;
    margin-right: 10px;
    cursor: pointer;
    font-size: 0;
    overflow: hidden;
    float: left;
    position: relative;
  }
  .logo-box .logoname{
    white-space: nowrap;
        float: left;
    /* width: 80px; */
    color: #000;
    font-weight: bold;
    font-size: 16px;
  }
  .logo-box .logo img{
    height: 46px;
    width: inherit;
    position: absolute;
    left: 0;
    top: 0;
  }
  .nav{
    float: left;
    font-size: 0;
    margin-left: 46px;
  }
  .nav .item{
    display: inline-block;
    height: 60px;
    position: relative;
    font-size: 16px;
    color: #444;
    letter-spacing: -0.39px;
    text-align: center;
    padding: 17px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .nav .item.online:hover{
    color: #FFA489;
  }
  .nav .item.active{
    color: #FB683C;
  }
  .nav .slot-online{
    display: inline-block;
  }
  .nav .item.active:after{
    content: "";
    position: absolute;
    width: 100%;
    height: 3px;
    background: #FB683C;
    border-radius: 100px;
    bottom: 0;
    left: 0;
    color: #FB683C;
  }
  .search-box-contain{
    max-width: 302px;
    float: right;
    margin-left: 10px;
  }
  .online-box{
    /*height: 360px;*/
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 20px 10px;
    text-align: left;
    overflow: hidden\0;
    max-height: 400px;
    overflow-y: auto;
  }
  .online-box>div{
    float: left\0;
  }
  .online-box .online-nav-right,
  .online-box .online-nav-left{
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: block;
    position: relative;
  }
  .online-box .online-nav-left{
    width: 98px;
  }
  .user-container .name{
    max-width: 105px;
    overflow: hidden;
    display: inline-block;
    top: 7px;
    position: relative;
  }

  .online-box:after{
    content: "";
    position: absolute;
    width: 0;
    bottom: 30px;
    left: 110px;
    top: 30px;
    border-right: 1px solid #D4D4D4;
  }
  .online-box .online-nav-left .item{
    display: flex;
    min-height: 22px;
    line-height: 22px;
    margin-bottom: 20px;
    cursor: pointer;
    align-items: center;
    border: none;
  }
  .online-box .online-nav-left .item.active{
    color: #FB683C;
  }
  .online-nav-right-list{
    padding-left: 20px\0;
  }
  .online-nav-right-list li:nth-last-child(1),
  .online-box .online-nav-left .item:nth-last-child(1){
    margin-bottom: 0;
  }

  .online-nav-right-list li{
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 820px;
    /*margin-bottom: 20px;*/
    font-size: 14px;
    color: #868686;
   min-height: 42px;
    line-height: 22px;
    /*margin-top: 10px;*/
    overflow: hidden\0;
    box-sizing:border-box;
    padding-left: 20%;
    position: relative;
  }
  .online-nav-right-list li span{
    display: block;
    width: 25%;
    text-align: left;
    cursor: pointer;
    float: left\0;
    margin-bottom: 20px;
  }
  .user-nav li:hover,
  .online-nav-right-list li span:hover{
    color: #FB683C;
  }
  .online-nav-right-list li .title{
    color: #444;
    font-weight: bold;
    position: absolute;
    width: 20%;
    left: 0;
  }
.el-icon-close{
  color: #fff;
}

  /*搜索框*/
  .search-box-slot{
    height: 60px;

    float: left;
  }
  .search-box{
    float: left;
    width: 280px;
    height: 36px;
    border: 1px solid #fff;
    border-radius: 100px;
    padding-left: 20px;
    padding-right: 30px;
    box-sizing:border-box;
    margin-top: 12px;
    position: relative;
  }
  .search-box input{
    border: none;
    display: none;
    width: 100%;
    height: 36px;
    line-height: 36px;
    font-size: 16px;
    color: #444;
    letter-spacing: -0.39px;
    text-align: left;
    background: none;
    outline: none;
  }
  /*搜索框激活样式*/
  .search-box.active{
    border: 1px solid #FB683C;
  }
  .search-box.active input{
    display: block;
  }
  .icon-search{
    position: absolute;
    width: 20px;
    height: 20px;
    right: 10px;
    top: 8px;
    background: url("./imgs/icon-search.png") no-repeat center center;
    z-index: 10;
    cursor: pointer;
  }
  .search-result-box{
    max-height: 412px;
    padding: 5px;
    overflow-y: auto;
  }
  .search-result-box .tab{
    font-size: 16px;
    letter-spacing: -0.39px;
  }
  .search-result-box .tab span{
    margin-right: 20px;
    cursor: pointer;
  }
  .search-result-box .tab span.active{
    color: #FB683C;
  }
  .search-result-box .more{
    text-align: center;
    font-size: 14px;
    color: #444444;
    letter-spacing: -0.34px;
    text-align: center;
    cursor: pointer;
  }

  .result-list li{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0 10px 0;
  }
  .result-list li{
    overflow: hidden\0;
  }
  .result-list li>div,
  .result-list li>img{
    float: left\0;
  }
  .result-list li .title-box{
    width: 228px;
  }
  .result-list li img{
    display: block;
    width: 131px;
    height: 78px;
    margin-right: 10px;
  }
  .result-list li .title{
    height: 40px;
    line-height: 20px;
  }
  .time-box{
    display: flex;
    justify-content: space-between;
    padding-top: 18px;
    font-size: 14px;
    color: #868686;
    letter-spacing: 0;
  }

  .empty{
    height: 20px;
    line-height: 20px;
    padding: 60px;
    font-size: 16px;
    color: #868686;
    letter-spacing: -0.39px;
    text-align: center;
  }


  /*用户信息*/
  .user-box{
    font-size: 0;
    color: #444444;
    letter-spacing: -0.39px;
    margin-left: 20px;
    margin-top: 20px;
    float: right;
    max-width: 184px;
  }
  .user-nav{
    font-size: 14px;
    padding: 20px 10px 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    overflow: hidden;
  }
  .user-nav li{
    float: left\0;
    display: block;
    width: 50%;
    padding-bottom: 20px;
    cursor: pointer;
  }
  .user-nav li:nth-child(2n){
    text-align: right;
  }
  .name-btn{
    float: left;
    height: 45px;
  }
  .user-box .name{
    font-size: 16px;
    margin-right: 6px;
   max-width: 86px;
    display: inline-block;
    overflow: hidden;
  }

  .level{
    display: inline-block;
    width: 64px;
    height: 21px;
    margin-left: 10px;
    line-height: 21px;
    text-align: center;
    background: #FB683C;
    border-radius: 100px;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: -0.29px;
    position: relative;
  }
  .loginout{
    font-size: 14px;
    color: #868686;
    display: block;
    text-align: center;
    width: 60px;
    height: 20px;
    margin: 0 auto;
    letter-spacing: -0.34px;
    cursor: pointer;
  }

  /*侧边栏*/
  /*侧边栏测评模块*/
  .aside-evaluation{
    width: 184px;
    height: 279px;
    background: #363636;
    box-shadow: 3px 5px 14px 0 rgba(0,0,0,0.70);
    border-radius: 8px;
    position: fixed;
    bottom: 78px;
    right: 100px;
    z-index: 99;
    text-align: center;
  }
  .aside-evaluation .title{
    font-size: 16px;
    color: #FB683C;
    letter-spacing: 0;
    text-align: center;
    margin: 20px 0 30px 0;
  }
  .aside-evaluation .step{
    display: block;
    width: 144px;
    height: 36px;
    line-height: 36px;
    background: #555555;
    border: 1px solid #383838;
    border-radius: 26px;
    font-size: 14px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    margin: 0 auto 20px auto;
  }
  .aside-evaluation .icon-triangle{
    background: none;
    border-top: 6px solid #FB683C;
    margin-bottom: 20px;
    top: 2px;
  }
  .aside-evaluation .btn-ev{
    display: block;
    width: 108px;
    height: 29px;
    line-height: 29px;
    background: #FB683C;
    border-radius: 100px;
    text-align: center;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: -0.29px;
    margin: 30px auto;
    cursor: pointer;
  }
  .aside-qq-backtop{
    display: block;
    width: 88px;
    position: fixed;
    right: 0px;
    bottom:60px;
    z-index: 99;
  }
  .icon-expect,
  .icon-ev,
  .icon-backtop,
  .icon-qq{
    width: 68px;
    height: 76px;
    display: block;
    text-align: center;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    border-radius: 4px;
    border-radius: 4px;
    padding-top: 50px;
    box-sizing:border-box;
    margin-bottom: 2px;
    background: url('./imgs/icon-qq.png') no-repeat center 16px;
    background-size: 26px 26px;
    background-color: rgba(75,75,75,0.85);
  }
  .aside-qq-backtop span:hover{
    color: #FF7318;
  }
  .icon-backtop{
    background-image: url('./imgs/icon-back.png');
  }
  .icon-backtop:hover{
    background-image: url('./imgs/icon-back-on.png');
  }
  .icon-ev{
    background-image: url('./imgs/icon-ev.png');
  }
  .icon-ev:hover{
    background-image: url('./imgs/icon-ev-on.png');
  }
  .icon-expect{
    background-image: url('./imgs/icon-expect.png');
    position: relative;
  }
  .icon-expect:hover{
    background-image: url('./imgs/icon-expect-on.png');
  }
  .icon-qq:hover{
    background-image: url('./imgs/icon-qq-on.png');
  }
  .icon-expect.on:after{
    content: "";
    display: block;
    position: absolute;
    width: 10px;
    height: 10px;
    background: #f00;
    border-radius: 100%;
    right: 10px;
    top: 10px;
  }

  /*评测分环状*/
  .isevad .loading {
      margin: 20px auto;
      width: 116px;
      height: 116px;
      position: relative;
  }

  .isevad .loading .progress {
      position: absolute;
      width: 86px;
      height: 86px;
      background-color: #363636;
      font-size: 16px;
      color: #FFFFFF;
      letter-spacing: 0;
      line-height: 22px;
      border-radius: 50%;
      left: 15px;
      top: 15px;
      /*line-height: 86px;*/
      text-align: center;
      box-sizing:border-box;
      padding-top: 15px;
  }
  .isevad .loading .progress .store{
    font-size: 20px;
    color: #FE6732;
    letter-spacing: 0;
    line-height: 28px;
  }
  .isevad .loading .progress p{
    font-size: 12px;
  }

  .isevad .left,
  .isevad .right {
      width: 58px;
      height: 116px;
      overflow: hidden;
      position: relative;
      float: left;
      background-color: #fff;
  }

  .isevad .left {
      border-radius: 116px 0 0 116px;
  }

  .isevad .right {
      border-radius: 0 116px 116px 0;
  }

  .isevad .left .after,
  .isevad .right .after {
      position: absolute;
      display: block;
      width: 58px;
      height: 116px;
      border-radius: 116px 0 0 116px;
      background-color: #FB683C;
  }

  .isevad .right .after {
      content: "";
      position: absolute;
      display: block;
      border-radius: 0 116px 116px 0;
  }
  .isevad .left .after {
      transform-origin: right center;
      transform: rotateZ(0deg);
  }

  .isevad .right .after {
      transform-origin: left center;
      transform: rotateZ(45deg);
  }

  html body .logo-box img {
    width: 135px;
    height: 46px;
  }

</style>
