import {
  fileUpload,
  getCommonPhrasesList,
  // getQuestionToExpert,
  SearchPage,
  proposeEndConsult,
  getEvaluateByQuestionId,
  getIMById,
  clearUnreadMsgCount,
} from '@/api/apis';
import {
  initEmoji, getemojiList, emojiToHtml, sendMessage, initCreateMessage,
} from './js/init';
import {
  encryption,
} from '@/assets/utils/util';
import {
  formatDate,
  timeStampToDay,
  setWeekByTime,
} from '@/assets/utils/timefn';
import question from '@/components/question.vue';
import expertlist from '@/components/expertlist.vue';
import meslog from '@/components/meslog.vue';
import COMMON_ENV from '@/config/env';

export default {
  name: 'message',
  components: {
    question,
    expertlist,
    meslog,
  },
  data() {
    return {
      isShowQuestion: false, // 问题分类盒子
      isShowMeslog: false, // 展示聊天记录
      searchVal: '', // 搜索值
      curmesid: '', // 咨询单id
      name: 'message',
      tel: '40089098887', // 客服电话
      boolFalse: false,
      isShowquickmesBox: false, // 快捷回复
      dialogRightVisible: false, // 无权益用户信息弹窗
      dialogCompentVisible: false, // 评分弹窗
      question: '', // 问题
      dialogQuestion: false, // 显示问题弹窗
      showDatas: [],
      mesData: '', // 发送信息
      emojiList: [],
      curid: '', // 咨询单id 接口所需
      closeCofirmBox: false,
      hidemask: false, // 发送消息遮罩
      isShowMessageBox: false, // 显示聊天窗口
      isShowSystemTips: false, // 显示系统提示
      personnNum: 2, // 排队人数
      isShowEmoji: false,
      imgMaxSize: 500, // 图片大小500kb
      fileMaxSize: 10, // 文件大小10m
      targetIdList: [], // 发送对象
      messageData: { // 消息对象
        content: {
          content: '',
          messageName: '',
          extra: {
            mesid: '',
            curid: '',
            code: '',
            icon: '',
            name: '',
          }, // 消息扩展信息，可以放置任意的数据内容。
        },
      },
      isShowExpect: false, // 转单弹框

      userParam: { // 用户信息
        name: '',
        tel: '',
      },
      colors: ['#33C8DF', '#33C8DF', '#33C8DF'],
      rateParam: { // 评分信息
        rateVal: 5,
        rateTag: '',
        rateMes: '', // 评价信息
      },
      meslogList: null,

      targetUserName: '', // 当前聊天人姓名
      targetId: '',
      getCommonPhrasesListRes: [], // 常用语列表
      isCanChangeUser: true,
      getHistoryFlag: {}, // 是否还有未加载历史记录
      timer: null,
      isShowToast: false, // toast显示toast
      toaststr: '', // toast提示文字
      questionStr: '', // 当前问题描述
      questionSuccessMap: {}, // 问题分类
      userInfo: {},
      params: {
        appkey: '',
        token: '',
        navi: '',

      },
      isCanUploadFile: true, // 单文件上传拦截
      groupId: '', // 群组id
      searchPageIsEnd: false, // 咨询单是否有下一页
      searchPageParams: {
        page: 1, // 查询咨询单当前页
        rows: 30, // 每页条数  默认100条
      },
      fromExpertId: '', // 转单专家id

      getIMByIdParams: {
        page: 1, // 分页查询咨询单聊天记录
        rows: 10, // 每页条数  默认100条
      },

      isFocusSearch: false, // 搜索框聚焦
    };
  },
  props: {
  },
  mounted() {
    this.params.token = this.curUserData.imToken;
    this.params.appkey = COMMON_ENV.appkey;
    this.init(this.params);
    getCommonPhrasesList({ name: this.curUserData.name }).then((res) => {
      if (res.data.code === '0000') {
        this.getCommonPhrasesListRes = res.data.data;
      }
    });
  },
  filters: {
    userMsgFilters(val) {
      return val > 99 ? '99+' : val;
    },
  },
  methods: {
    async init(params) {
      this.userInfo = {
        icon: this.curUserData.headImg,
        name: this.curUserData.name,
        curid: this.curUserData.id,
        expertAccount: this.curUserData.account,
        ...this.curUserData,
      };

      if (this.userInfo) {
        this.messageData.content.extra = {
          mesid: '',
          curid: '',
          code: '',
          icon: this.curUserData.headImg,
          name: this.curUserData.name,
        };
      }
      let userlist = [];
      let spRes = await SearchPage({
        expertAccount: this.userInfo.expertAccount,
        codeOrAccount: '',
        ...this.searchPageParams,
      }, { isHideLoading: false });
      if (spRes.data.code === '0000') {
        /*eslint-disable*/ 
        // userId: 'l849643081@163.com', // 用户id
        //   icon: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=400062461,2874561526&fm=26&gp=0.jpg', // 头像
        //   name: 'l849643081@163.com', // 用户名
        //   mesid: 'q001', // 咨询单id
        //   online: '1', // 是否在线
        //   time: '09:02', // 最后咨询时间
        //   type: '1', // 是否转单
        //   qtype: '0', // 问题是否分类 1已分类
        // newmes:0,  //0没有新消息 1有新消息
        let list = this.setDataUserList(spRes.data.data.list);
        userlist = this.arrSort(list);
        if(this.searchPageParams.rows>list.length){
          // 如果每页条数大于当前查出来的条数 代表没有更多了
          this.searchPageIsEnd = true;
        }else{
          this.searchPageParams.page += 1;
        }
        /* eslint-enable */
      }
      window.vue.setmeslist(window.vue.meslist);
      window.vue.setuserlist(userlist);
      if (userlist.length > 0) {
        this.checkUser(window.vue.userlist[0], 0, async () => {
          // this.showMessage();

          if (params && params.appkey && params.token) {
            this.rongInit(params);
          } else {
            throw new Error('appkey 和 token 不能为空');
          }

          // this.showMessage();
        });
      } else if (params && params.appkey && params.token) {
        this.rongInit(params);
      } else {
        throw new Error('appkey 和 token 不能为空');
      }
    },
    searchBlur() {
      // 搜索失去焦点事件
      this.lazyFn(() => {
        this.isFocusSearch = false;
      });
    },
    searchFocus() {
      // 搜索获取焦点事件
      this.isFocusSearch = true;
    },
    lazyFn(fn, time) {
      if (!fn) return;
      let t = time || 200;
      setTimeout(() => {
        fn();
      }, t);
    },

    getTimeFn(time, type) {
      if (type === '1') {
        return timeStampToDay(time, type);
      } if (type === '2') {
        // 根据当前时间设置时间
        return setWeekByTime(time.curTime, time.lastMsgTime);
      }
      return '';
    },
    openWindow(item) {
      if (item) {
        window.open(item);
      }
    },

    encryptionFn(str) {
      // 账号脱敏  加****
      if (!str) return '';
      return encryption(str);
    },
    isShowTag(item) {
      // 显示那些tag
      return item.rate.indexOf(this.rateParam.rateVal) === -1;
    },
    showMesLog(content) {
      // 查看聊天记录
      this.meslogList = content;
      this.isShowMeslog = true;
      console.log('查看聊天记录');
    },
    async proposeEndConsultFn() {
      // 询问是否可以结束咨询
      let params = {
        userId: this.targetId,
        expertId: this.userInfo.id,
        questId: this.curid,
      };
      let res = await proposeEndConsult(params);
      if (res.data.code === '0000') {
        this.$message({ message: '询问结束咨询成功', type: 'success' });
      } else {
        this.$message(`询问结束咨询失败${res.data.message}`);
      }
      this.closeCofirmBox = false;
    },

    async changeExpertSuccess(item) {
      // 转单成功  加入群组
      await this.SearchPageFn({ isHideLoading: true });
      this.isShowExpect = false;
      // window.vue.userlist[window.vue.curMessageIndex].type = '1';
      // this.setuserlist(window.vue.userlist);
      this.$toast(`已转单给${item.name}`);
    },
    setDataUserList(arr) {
      /*eslint-disable*/ 
      arr.forEach((item, index) => {
        // 设置字段名称，把后台字段转为对应的展示字段
        item.userId = item.accountId;
        item.icon = item.headImg;
        item.name = item.account;
        item.mesid = item.code;
        item.page = item.page ? item.page : 1;    //当前咨询单聊天记录查询到多少页了
        item.isEnd = item.isEnd ? item.isEnd : false; //是否有更多聊天记录
        let str = formatDate(new Date(item.lastMsgTime).getTime(), 'hh:mm:ss');
        item.time = str.substr(0, 5);
        item.qtype = item.sort;
        item.type = item.exchange;
        item.newmes = 0;
        item.userMsgCount = 0;
        item.historyFlag = item.historyFlag ? item.historyFlag : false;
        if (window.vue.meslist[item.code] === undefined) {
          window.vue.meslist[item.code] = [];
        }
      });
      /* eslint-enable */
      return arr;
    },
    searchPageFnscrollLoad() {
      // 咨询单滚动加载
      let elelist = document.querySelectorAll('.userlistItem');
      let domBox = document.querySelector('#searchPageListDom').getBoundingClientRect();
      let domItem = elelist[elelist.length - 1].getBoundingClientRect();
      let endTop = domItem.top; // 获取最后一个元素距离视窗顶部距离
      let startLoadTop = domBox.height + domBox.top; // 滚动到底部之前开始加载

      if (endTop > startLoadTop) {
        // 没到底部 return 到达底部 开始加载
        return;
      }
      if (this.searchPageIsEnd) {
        // 如果是true  代表没有更多了
        return;
      }
      console.log(endTop, startLoadTop, this.isCanRequest);
      if (this.isCanRequest) {
        this.isCanRequest = false;
        this.SearchPageFn({ isHideLoading: false }, 'scrollLoad');
      }
    },

    async SearchPageFn(opt, type) {
      // 搜索列表
      if (type !== 'scrollLoad') {
        // 如果不是滚动加载 初始化分页信息
        this.searchPageParams.page = 1;
        this.searchPageIsEnd = false;
      }
      return new Promise(async (resolve) => {
        let params = {
          expertAccount: this.userInfo.expertAccount,
          codeOrAccount: this.searchVal,
          ...this.searchPageParams,
        };
        let curindex = 0;

        let spRes = await SearchPage(params, opt);
        this.isCanRequest = true;
        if (spRes.data.code === '0000') {
        /*eslint-disable*/ 

        let list = this.setDataUserList(spRes.data.data.list);
        if(this.searchPageParams.rows>list.length){
          // 如果每页条数大于当前查出来的条数 代表没有更多了
          this.searchPageIsEnd = true;
        }else{
          this.searchPageParams.page += 1;
        }
        
        let arr = this.arrSort(list);
        arr.forEach((item,index)=>{
          if(window.curid === item.id){
            // 如果存在curid
            curindex = index;
          }
        })
        if(type !== 'scrollLoad'){
          // 如果没有更多页了  就直接设置数组
          window.vue.setuserlist(arr);
        }else{
          let ulist = window.vue.userlist;
          window.vue.setuserlist(ulist.concat(arr));
        }
        
        /* eslint-enable */
        } else {
          window.vue.setuserlist([]);
        }

        window.vue.setmeslist(window.vue.meslist);
        if (window.vue.userlist.length > 0) {
          this.checkUser(window.vue.userlist[curindex], curindex);
        }
        this.$forceUpdate();
        resolve({ code: '0000' });
      });
    },
    arrSort(userlist) {
      // 排序 优先在线的置顶
      // console.log(this.curmesid);
      userlist.sort((a, b) => {
        if (a.status < b.status) {
          // status   状态，0：未咨询 1：咨询中，2：咨询结束
          return -1;
        } if (a.status > b.status) {
          return 1;
        } if (a.lastMsgTime < b.lastMsgTime) {
          return 1;
        }
        return -1;
      });
      return userlist;
    },

    async questionSuccess() {
      // await this.SearchPageFn(0);
      this.$message({ type: 'success', message: '问题已分类' });
      window.vue.userlist[window.vue.curMessageIndex].qtype = 1;
      window.vue.setuserlist(window.vue.userlist);
      this.isShowQuestion = false;
    },

    changeExpert() {
      // 转单
      if (this.curUserData.type === 1) {
        this.$toast('合作专家暂不支持转单');
        return;
      }
      this.isShowExpect = true;
      // this.$toast('已转单给xxx');
    },

    showQuestionFn() {
      // 问题分类
      this.isShowQuestion = true;
    },
    $toast(mes, time) {
      // toast提示 time 0 不关闭
      return new Promise((resolve) => {
        this.toaststr = mes;
        this.isShowToast = true;
        if (time !== 0) {
          setTimeout(() => {
            this.isShowToast = false;
            this.toaststr = '';
            resolve({ code: '0000', message: '关闭' });
          }, 2000);
        } else {
          resolve({ code: '404', message: '不关闭提示' });
        }
      });
    },
    // 用户列表相关
    checkUser(item, index, fn) {
      if (!this.isCanChangeUser) return;
      /*eslint-disable*/ 
      // 清除未读消息标志
      clearUnreadMsgCount({userId:this.curUserData.id,questionId:item.id});
      item.newmes = 0; // 点击删除新消息提示
      item.userMsgCount = 0;
      this.setcurTargetUserData(item);
      this.questionStr = item.questionDesc;
      this.targetUserName = item.name;
      this.targetId = item.userId;

      this.targetIdList = [item.userId];
      this.setcurMessageIndex(index);
      this.curmesid = item.code;
      window.curmesid = item.code;
      this.curid = item.id || item.curid;
      window.curid = this.curid;
      this.closeCofirmBox = false;
      this.messageData.content.extra.mesid = item.id;
      this.messageData.content.extra.code = item.mesid;
      this.messageData.content.extra.curid = item.id;
      this.fromExpertId = item.fromExpertId || '';
      console.log(item)
      if (item.fromExpertId) {
        // 设置群组信息  如果群组存在  且 转单专家id存在
        this.targetIdList = [item.userId, item.fromExpertId];
        this.groupId = item.code;
      }else{
        this.groupId = '';
      }
       

      // 切换没聊天信息  获取聊天记录
      if (!item.historyFlag) {
        // 如果获取过聊天记录 就不在获取了
        
        // 防止请求在消息之前返回
        this.getHistoryMessageListFn(item,fn);
      }else{
        this.scrollEnd()
      }
      
      /* eslint-enable */
    },
    async showEvaluateFn() {
      // 查看评价
      let params = {
        id: this.curid,
      };
      let res = await getEvaluateByQuestionId(params);
      if (res.data.code === '0000') {
        this.rateParam.rateVal = res.data.data.evaluateScore;
        this.rateParam.rateTag = res.data.data.evaluateFlag;
        this.rateParam.rateMes = res.data.data.evaluateContent;
        /*eslint-disable*/ 
        this.rateTagMap.forEach((item) => {
          if (this.rateParam.rateTag.indexOf(item.id) !== -1) {
            item.active = true;
          } else {
            item.active = false;
          }
        });
        /* eslint-enable */
        this.rateTagMap = JSON.parse(JSON.stringify(this.rateTagMap));
        this.dialogCompentVisible = true;
      }
    },

    fileUploadFn(params) {
      return fileUpload(params);
    },
    tagClick(item, index) {
      let value = 0;
      /*eslint-disable*/ 
      if (this.rateParam.rateTag[index] === 0) {
        value = item.value;
      }
      /* eslint-enable */
      this.$set(this.rateParam.rateTag, index, value);
    },
    showMessage() {
      this.isShowMessageBox = true;
      this.$emit('show');
    },
    sleep(time) {
      // 延迟几秒执行
      /*eslint-disable*/ 
      return new Promise((resolve)=>{
        setTimeout(()=>{
          resolve();
        },time)
      });
      /* eslint-enable */
    },
    async hideMessage(time) {
      // 隐藏聊天框
      if (time) {
        await this.sleep(time);
      }
      this.isShowMessageBox = false;
      this.$emit('hide');
    },
    quickmes(item) {
      // 快捷消息
      this.startSendMes(2, item.name);
      // 埋点
      this.yszj_quickResponse({ replyContent: item.code });
      this.isShowquickmesBox = false;
    },
    async startSendMes(type, mes) {
      // 1发送文本消息 2发送快捷消息
      this.mesData = this.mesData.replace(/\n/g, '').replace(/\r\n/g, '').replace(/↵/g, '');
      if (!this.mesData && type === 1) {
        this.$message({ message: '请输入聊天内容', type: 'warning' });
        return;
      }
      this.messageData.content.content = this.mesData;
      if (type === 2) {
        this.messageData.content.content = mes;
      }
      this.sendMessageFn('TextMessage');
    },


    checkMesForSystem() {
      if (window.vue.meslist[this.curmesid]
        && window.vue.meslist[this.curmesid].length < 1) {
        // 没有聊天数据
        return true;
      }

      let min = 5 * 60 * 1000; // 发送系统时间  时间间隔 分钟
      let arr = window.vue.meslist[this.curmesid];
      let sentTime = arr[arr.length - 1].sentTime || parseInt(arr[arr.length - 1].msgTimestamp, 10);
      let lastTime = sentTime + min;
      let curTime = new Date().getTime();
      if (lastTime < curTime) {
        // 最后一条消息的时间  大于 5分钟
        return true;
      }

      return false;
    },
    sendSystemMessage() {
      if (this.checkMesForSystem()) {
        // 需要发送
        // 暂存messageData 数据
        let oMessageData = JSON.parse(JSON.stringify(this.messageData));
        // 系统类通知消息
        let sysObj = {
          content: {
            message: '',
            extra: oMessageData.content.extra,
            messageName: 'InformationNotificationMessage',
          },
        };
        // this.messageData.content = {
        //   message:'',
        //   extra:this.messageData.content.extra,
        //   user:this.messageData.content.user,
        //   messageName:'InformationNotificationMessage',
        // };

        return sendMessage(this.targetIdList,
          sysObj, false,
          this.groupId);
      }
      return new Promise((resolve) => {
        resolve({ code: '404' });
      });
    },
    async sendMessageFn(messageName, isCreate) {
      // 发送消息
      if (!messageName) {
        // 如果没有消息类型 返回
        return false;
      }
      // 发送系统消息
      if (messageName !== 'InformationNotificationMessage'
        && messageName === 'TextMessage') {
        // 判断最后一条信息是什么 是否需要发送系统消息
        let sysRes = await this.sendSystemMessage();
        if (sysRes.code === '0000') {
          this.sendMesResult(sysRes);
        }
      }

      if (messageName === 'InformationNotificationMessage') {
        // 系统类通知消息
        this.messageData.content = {
          message: '',
          extra: this.messageData.content.extra,
        };
      }

      this.messageData.content.messageName = messageName;
      let res = await sendMessage(this.targetIdList, this.messageData,
        isCreate, this.groupId);
      this.sendMesResult(res);
      return res;
    },
    sendMesResult(res) {
      console.log('发送消息成功', res);

      if (res.code === '0000') {
        // 发送成功
        if (res.message.content.messageName === 'TextMessage') {
          this.mesData = '';
          this.pushList(res.message);
        } else if (res.message.content.messageName === 'ImageMessage'
          || res.message.content.messageName === 'FileMessage') {
          this.pushList(res.message, 'edit');

          // 发送成功埋点
          if (res.message.content.messageName === 'ImageMessage') {
            // 发送图片成功埋点
            this.yszj_sendPicture();
          } else {
            // 发送文件成功埋点
            this.yszj_sendFile();
          }
        } else {
          this.pushList(res.message);
        }
      }
    },
    async setUserListByCode(data) {
      // 根据code设置用户列表
      /*eslint-disable*/ 
      // let meslist = JSON.parse(JSON.stringify(window.vue.meslist));
      // let userlist = JSON.parse(JSON.stringify(window.vue.userlist));
      return new Promise(async (resolve)=>{
      let code = '';
      if (data.content.extra && data.content.extra.code) {
        code = data.content.extra.code;
      }
      let status = 1;
      if(data.objectName === 'RC:InfoNtf' && data.content.extra.contentType=='MSG_END'){
        // 是系统消息  结束咨询
        status=2;
      }
      if (code && window.vue.meslist[code] === undefined) {
        // 如果不存在用户  刷新列表
        await this.SearchPageFn({isHideLoading:true});
        resolve({code:'0000'});
      } else if (code) {
        // 已有数据  更改状态
        window.vue.userlist.forEach((item, index) => {
          if (item.code === code) {
            if(item.status !== 2){
              item.status = status;
            }
          }
        });
        window.vue.setuserlist(window.vue.userlist);
        this.$nextTick(()=>{
          resolve({code:'0001'})
        })
      }
      
      });
      /* eslint-enable */
    },

    getCodeById(data) {
      let tid = '';
      /*eslint-disable*/ 
      if (data.content.extra && data.content.extra.code) {
        tid = data.content.extra.code;
      } else if (data.content.extra && data.content.extra.mesid) {
        // 如果没有code 根据mesid 来匹配
        window.vue.userlist.forEach((item) => {
          if (data.content.extra.mesid === item.id) {
            // 找到id相等的 设置code
            tid = item.code;
            data.content.extra.code = item.code;
          }
        });
      }
      /* eslint-enable */
      return tid;
    },

    async pushList(data, type) {
      let tid = this.getCodeById(data);


      if (type === 'edit') {
        this.fileUpLoadSuc(data);
      } else {
      // window.vue.meslist[tid].newmes = 1;
        if (window.vue.meslist[tid] === undefined) {
          window.vue.meslist[tid] = [];
        }
        let l = window.vue.meslist[tid].length;
        window.vue.meslist[tid].push({
          id: l,
          ...data,
        });

        window.vue.setmeslist(window.vue.meslist);
        console.log('push');
        this.$nextTick(() => {
          this.scrollEnd();
        });
        this.$forceUpdate();
      }
    },
    emojiToHtml(mes) {
      return emojiToHtml(mes);
    },
    scrollTop() {
      this.$nextTick(() => {
        // 滚动到底部
        let ele = document.getElementById(`meslist${window.vue.curMessageIndex}`);
        let aItems = ele.querySelectorAll('.item');
        let oItem = aItems[20];
        if (!ele || !oItem) {
          return;
        }
        oItem.scrollIntoView();
      });
    },
    scrollEnd() {
      // 滚动到底部

      this.$nextTick(() => {
        // 滚动到底部

        let ele = document.querySelectorAll('.meslist')[window.vue.curMessageIndex];
        if (!ele) {
          setTimeout(() => {
            this.scrollEnd();
          }, 200);
          return;
        }
        let itemlist = ele.querySelectorAll('.item');
        if (itemlist.length > 0) {
          itemlist[itemlist.length - 1].scrollIntoView(false);
        }
      });
    },
    async addPromptInfo(res) {
      if (res.code === '9999') {
        // 收到消息
        console.log('收到消息=========', res);
        let timeItem = res.data;
        let lasttime = timeItem.sentTime || parseInt(timeItem.msgTimestamp, 10) || 0;
        if (lasttime < this.curtime) {
          console.log('收到留言消息，不处理', res);
          return;
        }

        let code = this.getCodeById(res.data);
        if (!code) {
          console.log('消息来源有错，不接收信息');
          return;
        }
        let setuserRes = await this.setUserListByCode(res.data);
        if (setuserRes.code === '0000') {
          return;
        }

        // 根据code  获取当前咨询单是否获取过聊天记录
        window.hisFlag = false;
        if (window.vue.userlist) {
          window.vue.userlist.forEach((item) => {
            if (item.code === code) {
              console.log(item.code, item.historyFlag);
              window.hisFlag = item.historyFlag;
              /*eslint-disable*/ 
            if (window.curmesid !== item.code) {
              item.newmes = 1;
              item.userMsgCount = item.userMsgCount + 1;
            }

            item.online = 0;
            /* eslint-enable */
            }
          });
        }
        // 刷新新消息提醒
        window.vue.setuserlist(window.vue.userlist);
        console.log('hisFlag', !window.hisFlag);
        if (!window.hisFlag && window.vue.userlist[window.vue.curMessageIndex].code !== code) {
          console.log('没有获取过聊天记录，切换会重新拉取最新聊天记录');
          return;
        }
        // 有聊天记录 判断当前时间 与聊天记录时间是否一致
        // 判断当前消息的msgUID  是否存在 存在不做操作 messageUId
        if (window.vue.meslist[code] && window.vue.meslist[code].length > 0) {
          let flag = false;
          let list = window.vue.meslist[code];
          let curMsgUId = res.data.messageUId || res.data.msgUID;
          list.forEach((item) => {
            let listUid = item.messageUId || item.msgUID;
            if (curMsgUId && listUid && curMsgUId === listUid) {
              // 存在id
              flag = true;
            }
          });
          if (flag) {
            console.log('已存在该消息记录，不做处理');
            return;
          }
        }


        console.log('收到正常消息', res);


        if (res.data.messageType === 'GroupNotificationMessage') {
          this.SearchPageFn({ isHideLoading: true });
        } else {
          this.pushList(res.data);
        }
      } else if (res.code === '0000') {
        // 拿到userid
        console.log('拿到用户id', res);
        this.setUserId(res.data);
        this.sensors_login(res.data);
        // 根据用户id targetid 获取历史记录
        // this.getHistoryMessageListFn();
      } else if (res.code === '1001') {
        this.$message(res.message);
      } else {
        console.log(res.message);
      }
    },
    getHistoryMessageListSrollLoad(ev) {
      let oBox = ev.srcElement;
      let aMesitems = oBox.querySelectorAll('.item');
      let item = window.vue.userlist[window.vue.curMessageIndex];// 当前选中的咨询单index


      if (item.isEnd || aMesitems.length < this.getIMByIdParams.rows) {
        console.log('没有更多历史消息了');
        return;
      }
      let oBoxTop = oBox.getBoundingClientRect().top; // 当前盒子距离顶部距离
      let curMesTop = aMesitems[0].getBoundingClientRect().top; // 第一条信息距离顶部距离
      if (curMesTop + 5 <= oBoxTop) {
        // 如果没到50px 就返回 否则调用查询接口
        return;
      }
      if (this.isCanRequest) {
        this.isCanRequest = false;
        this.getHistoryMessageListFn(item, () => {
          console.log(item.page);
        }, 'srollLoad');
      }
    },
    async getHistoryMessageListFn(citem, fn, type) {
      if (type !== 'srollLoad') {
        // 不是分页查询
        this.getIMByIdParams.page = 1;
      } else {
        this.getIMByIdParams.page = citem.page;
      }
      let tid = citem.mesid;
      /* eslint-disable */
      // let meslist = JSON.parse(JSON.stringify(window.vue.meslist));
      let res = await getIMById({ id: this.curid, ...this.getIMByIdParams}).catch(() => {
        // 如果接口报错 轮询请求
        citem.historyFlag = false;
        this.isCanRequest = true;
      });
      this.isCanRequest = true;
      let curmesid = tid || window.curmesid;
      
      if(window.vue.meslist[curmesid] === undefined){
        window.vue.meslist[curmesid]=[];
      }
      if(res.data.code === '0000'){
        let msgList = res.data.data.msgList.reverse();
        let hislist = window.vue.meslist[curmesid] || [];
        
          if(this.getIMByIdParams.rows>msgList.length){
            // 如果请求条数 大于 返回条数  没有更多了
            citem.isEnd = true;
          }else{
            citem.isEnd = false;
            citem.page += 1;
          }
        if(type === 'srollLoad'){
          hislist = msgList.concat(hislist);
          setTimeout(()=>{
            let i = window.vue.curMessageIndex || 0;
            let oBox = document.querySelectorAll('#meslistScrollBox .messagebox')[i];
            oBox.querySelectorAll('.item')[msgList.length].scrollIntoView(true);
          },200)
        }else{
          hislist = res.data.data.msgList;
          this.$nextTick(() => {
            this.scrollEnd();
          });
        }
        window.vue.meslist[curmesid] = hislist;
        window.vue.setmeslist(window.vue.meslist);
        
      }
      if(window.vue.meslist[curmesid].length>0){
        citem.historyFlag = true;
      }else{
        // 如果返回列表为[] 轮询请求
        citem.historyFlag = false;
        
      }
      if(fn){
        console.log("聊天记录拉取成功====且是初始化进入")
        fn();
      }
    },


    imgClick(url) {
      if(document.getElementById('elemIF')){
        document.body.removeChild(document.getElementById('elemIF'))
      }

      let elemIF = document.createElement('iframe');
      elemIF.id = "elemIF";
      elemIF.src = url;
      elemIF.style.display = 'none';
      document.body.appendChild(elemIF);
    },
    dispatch(el) {
      let event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', false, false);
      el.dispatchEvent(event);
    },

    fileUpLoadSuc(data, type) {
      let list = window.vue.meslist[this.curmesid].slice();
      let i = -1;
      list.forEach((item, index) => {
        if (item.id === this.curUploadFileId) {
          i = index;
        }
      });
      if (i !== -1) {
        /*eslint-disable*/ 
        data.uploading = false;
        /* eslint-enable */
        if (type === 'del') {
          // 上传失败删除消息记录
          list.splice(i, 1);
        } else {
          // 上传成功 修改消息状态
          list[i] = data;
        }
        window.vue.meslist[this.curmesid] = list;
        window.vue.setmeslist(window.vue.meslist);
        // this.$forceUpdate();
      }
      this.isCanUploadFile = true;
      this.isCanChangeUser = true;
    },

    async uploadImg(content, fparams) {
      // 上传图片 content base64
      // 锁住切换用户
      this.isCanChangeUser = false;
      this.isCanUploadFile = false;
      let res = await this.sendSystemMessage();
      if (res.code === '0000') {
        this.sendMesResult(res);
      }

      this.curUploadFileId = window.vue.meslist[this.curmesid].length;
      let obj = {
        content: {
          messageName: 'ImageMessage',
          content,
          imageUri: '',
          extra: this.messageData.content.extra,
        },
        uploading: true,
        messageType: 'ImageMessage',
        senderUserId: this.userId,
        targetId: this.targetId,
        objectName: 'RC:ImgMsg',
      };

      this.pushList(obj);

      let fileRes = await this.fileUploadFn(fparams).catch(() => {
        this.$message('上传失败');
        this.fileUpLoadSuc(null, 'del');
      });
      if (fileRes.data.code === '0000') {
        this.messageData.content.imageUri = fileRes.data.data;
      } else {
        // 上传失败
        this.$message(fileRes.data.message);
        this.fileUpLoadSuc(null, 'del');
        return;
      }

      // 上传成功 删除预览消息
      // window.vue.meslist[this.curmesid].splice(curindex, 1);
      // window.vue.setmeslist(window.vue.meslist);


      if (this.messageData.content.imageUri) {
        // 上传成功发送消息

        // 发送图片消息
        this.messageData.content.content = content;
        this.sendMessageFn('ImageMessage');
      }
    },
    async uploadFile(file) {
      this.isCanChangeUser = false;
      this.isCanUploadFile = false;
      this.curUploadFileId = window.vue.meslist[this.curmesid].length;
      let res = await this.sendSystemMessage();
      if (res.code === '0000') {
        this.sendMesResult(res);
      }

      let content = {
        name: file.name,
        size: file.size,
        type: file.type,
        extra: this.messageData.content.extra,
        messageName: 'FileMessage',
        fileUrl: '',
      };

      let message = {
        content,
        uploading: true,
        messageType: 'FileMessage',
        senderUserId: this.userId,
        objectName: 'RC:FileMsg',
      };

      this.pushList(message);

      let reader = new FileReader();
      reader.readAsDataURL(file);// 读取图像文件 result 为 DataURL, DataURL 可直接 赋值给 img.src
      reader.onload = async (event) => {
        let filesrc = event.target.result.substr(event.target.result.indexOf('base64,') + 7);
        let fparams = {
          file: filesrc,
          originalName: file.name,
          contentType: file.type,
        };
        let fileRes = await this.fileUploadFn(fparams).catch(() => {
          // 上传失败
          this.$message('上传失败');
          this.fileUpLoadSuc(null, 'del');
        });
        if (fileRes.data.code === '0000') {
          content.fileUrl = fileRes.data.data;
        } else {
          // 上传失败
          this.$message(fileRes.data.message);
          this.fileUpLoadSuc(null, 'del');
          return;
        }

        this.messageData.content = content;
        this.sendMessageFn('FileMessage');
      };
    },

    fileChange(ev, type) {
      /*eslint-disable*/ 
      if (!this.isCanUploadFile) {
        this.$message('有文件正在上传中...');
        ev.target.value = '';
        return;
      }
      let postFiles = Array.prototype.slice.call(ev.target.files);
      let file = postFiles[0];
      if (type === 'img') {
        if (file.size / 1024 > this.imgMaxSize) {
          this.$message(`图片大小必须小于${this.imgMaxSize}kb`);
          // 清除value  避免第二次不触发change
          ev.target.value = '';
          return;
        }
        this.fileToImage(file);
      } else if (type === 'file') {
        if (file.size / (1024 * 1024) > this.fileMaxSize) {
          this.$message(`文件大小必须小于${this.fileMaxSize}M`);
          ev.target.value = '';
          return;
          // 清除value  避免第二次不触发change
        }
        // 上传文件
        this.uploadFile(file);
      }
     
      ev.target.value = '';
      /* eslint-enable */
    },
    async fileToImage(file) {
      let oThis = this;
      let reader = new FileReader();
      reader.readAsDataURL(file);// 读取图像文件 result 为 DataURL, DataURL 可直接 赋值给 img.src
      reader.onload = (event) => {
        // var img = document.getElementById("img").children[0];
        // img.src = event.target.result;//base64
        let filesrc = event.target.result.substr(event.target.result.indexOf('base64,') + 7);
        let fparams = {
          file: filesrc,
          originalName: file.name,
          contentType: file.type,
        };
        if ((file.size / 1024) < 100) {
          // 小于100k 不用压缩
          oThis.uploadImg(event.target.result, fparams);
        } else {
          let image = new Image();
          let cw = 1;
          let ch = 1;
          image.src = event.target.result;
          image.onload = () => {
            //  300 300
            if (image.width / image.height > 1) {
              // 宽大于高  宽度200压缩
              cw = 170;
              ch = (image.height * cw) / image.width;
            } else {
              ch = 170;
              cw = (image.width * ch) / image.height;
            }
            let canvas = document.getElementById('canvas');
            canvas.width = cw;
            canvas.height = ch;
            let imageCanvas = canvas.getContext('2d');
            imageCanvas.drawImage(image, 0, 0, canvas.width, canvas.height);
            oThis.uploadImg(canvas.toDataURL('image/jpg'), fparams);
          };
        }
      };
    },


    emojiClickItem(item) {
      this.mesData = this.mesData + item.symbol;
    },
    emojiClick() {
      // 初始化 emoji
      this.isShowEmoji = !this.isShowEmoji;
      if (this.emojiList.length > 0) {
        return;
      }
      this.emojiList = getemojiList();
    },


    getSystemTip(item) {
      if (item.content.message) {
        return item.content.message;
      }
      let curtime = formatDate(new Date().getTime());
      let sentTime = item.sentTime || item.msgTimestamp;
      let time = formatDate(sentTime);
      if (time.split(' ')[0] === curtime.split(' ')[0]) {
        return time.split(' ')[1];
      }
      return time;
    },
    async imloginOut(mes, type) {
      // im异常情况 提示  退出登录
      console.log(mes);
      await this.$$confirm(mes, '确定', '', '', true);
      this.hideMessage();
      if (type === 'loginout') {
        // 退出登录 直接去登录页
        this.setToken('');
        this.routerReplace('/login');
      }
    },
    reconnectFn(mes) {
      let oThis = this;
      let { RongIMClient } = window.RongIMLib;
      RongIMClient.reconnect({
        onSuccess() {
          // 重连成功
        },
        onError() {
          // 重连失败
          console.log(`重连提示：：：${mes}`);
          oThis.imloginOut(mes);
          // oThis.hideMessage(2000);
        },
      }, {
        auto: true,
        url: window.location.href,
        rate: [100, 1000, 3000, 6000, 10000],
      });
    },

    rongInit(params) {
      // 容联初始化
      let oThis = this;
      let { RongIMLib } = window;
      let { Protobuf } = window;
      let { RongIMClient } = window.RongIMLib;
      let { appkey } = params;
      let { token } = params;
      let { navi } = params;
      let config = {
        protobuf: Protobuf,
      };
      if (navi) {
        config.navi = navi;
      }
      // 初始化emoji
      initEmoji();


      RongIMClient.init(appkey, null, config);
      oThis.showMessage();
      RongIMClient.setConnectionStatusListener({
        onChanged(status) {
          oThis.addPromptInfo({ code: status, message: '' });
          switch (status) {
            case RongIMLib.ConnectionStatus.CONNECTED:
            case 0:
              console.log('连接成功');
              oThis.showMessage();
              break;

            case RongIMLib.ConnectionStatus.CONNECTING:
            case 1:
              console.log('连接中');
              oThis.addPromptInfo({ code: status, message: '连接中' });
              break;

            case RongIMLib.ConnectionStatus.DISCONNECTED:
            case 2:
              console.log('当前用户主动断开链接');
              oThis.addPromptInfo({ code: '-9999', message: '当前用户主动断开链接' });
              break;

            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
            case 3:
              oThis.reconnectFn('网络不可用,请检查网络');
              break;

            case RongIMLib.ConnectionStatus.CONNECTION_CLOSED:
            case 4:
              // oThis.addPromptInfo({ code: '-9999', message: '未知原因，连接关闭' });
              // 尝试重连
              oThis.reconnectFn('未知原因，连接关闭');
              break;

            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
            case 6:
              // oThis.addPromptInfo({ code: '1002', message: '用户账户在其他设备登录，本机会被踢掉线' });
              console.log('用户账户在其他设备登录');
              oThis.imloginOut('用户账户已在其他设备登录', 'loginout');

              // oThis.hideMessage(2000);
              break;

            case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
            case 12:
              // oThis.addPromptInfo({ code: '1002', message: '当前运行域名错误，请检查安全域名配置' });
              console.log('当前运行域名错误，请检查安全域名配置');
              oThis.imloginOut('当前运行域名错误，请检查安全域名配置');
              // oThis.hideMessage(2000);
              break;
            default:
              // oThis.addPromptInfo({ code: '404', message: '未知原因，连接关闭' });
              // 尝试重连
              oThis.reconnectFn('未知原因，连接关闭');
          }
        },
      });

      // 创建自定义事件
      initCreateMessage('OptionsMessage', ['type', 'data', 'user', 'extra']);
      initCreateMessage('dxhyMessage', ['title', 'user', 'content', 'contentType', 'extra'], true, true, 'RC:DxhyMsg');

      RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived(message) {
          console.log('接收消息');
          oThis.addPromptInfo({ code: '9999', data: message });
        },
      });
      RongIMClient.connect(token, {
        onSuccess(userId) {
          oThis.addPromptInfo({ code: '0000', data: userId });
          oThis.showMessage();
        },
        onTokenIncorrect() {
          console.log('token无效，请重新登录');
          oThis.addPromptInfo({ code: '0002', data: 'token无效' });
          oThis.imloginOut('token无效，请重新登录');
          // oThis.hideMessage(2000);
        },
        onError(errorCode) {
          oThis.addPromptInfo({ code: errorCode, message: errorCode });
          // 尝试重连
          oThis.reconnectFn('未知原因，连接关闭');
        },
      }, null);
    },


  },
};
