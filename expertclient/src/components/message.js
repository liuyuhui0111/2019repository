import {
  fileUpload,
  getEquityTime,
  addVipNotice,
  getWorkTime,
  requestAuth,
  getWaitNum,
  endEvaluate,
  getExpertQuestion,
  getToken,
  getInQuestion,
  getIMById,
  clearUnreadMsgCount,
  send,
  groupSend,
} from '@/api/apis';
import {
  initEmoji, getemojiList, emojiToHtml, sendMessage, initGroup, initCreateMessage,
} from './js/init';
import {
  formatDate,
} from '@/assets/utils/timefn';
import {
  validByPhone,
} from '@/assets/utils/validator';
import COMMON_ENV from '@/config/env';
import rate from './rate.vue';

export default {
  name: 'message',
  components: {
    rate,
  },
  data() {
    return {
      name: 'message',
      tel: '40089098887', // 客服电话
      boolFalse: false,
      dialogRightVisible: false, // 无权益用户信息弹窗
      dialogCompentVisible: false, // 评分弹窗
      question: '', // 问题
      dialogQuestion: false, // 显示问题弹窗
      isNeedQuestion: true, // 是否需要填写问题
      mesData: '', // 发送信息
      meslist: [], // 消息列表
      emojiList: [],
      closeCofirmBox: false,
      hidemask: false, // 发送消息遮罩
      isShowMessageBox: false, // 显示聊天窗口
      isShowMessage: false, // 显示聊天窗口
      isShowSystemTips: false, // 显示系统提示
      isShowEmoji: false,
      imgMaxSize: 500, // 图片大小
      fileMaxSize: 10, // 文件大小 小于10m
      targetIdList: [], // 发送对象
      curid: '', // 咨询单id 接口用
      messageData: { // 消息对象
        content: {
          content: '',
          messageName: '',
          extra: {
            mesid: '',
            code: '',
            curid: '',
            icon: '',
            name: '',
          }, // 消息扩展信息，可以放置任意的数据内容。 用户信息  来源等
        },
      },
      getExpertQuestionParam: {
        question_desc: '',
      },

      userParam: { // 用户信息
        name: '',
        tel: '',
      },

      rateParam: { // 评分信息
        rateVal: 5,
        rateTag: [0, 0, 0],
        rateMes: '', // 评价信息
      },


      getEquityCountRes: null, // 权益返回参数
      getWorkTimeRes: null,
      systemMessage: '', // 系统消息
      isCanUpLoad: true,
      timer: null,
      params: { // 初始化容联配置
        appkey: '',
        token: '',
        navi: '',
      },
      targetUser: [],
      userInfo: null,
      isCanUpLoadFile: true,
      groupId: '', // 群组id

      endTimer: null, // 结束咨询倒计时
      curUploadFileId: -1, // 存储当前正在上传的文件id 上传成功后动态修改对应消息记录
      loopNum: 0, // 轮询120次  获取失败就提示关闭
      isShowRateMesBox: false, // 显示评论消息
      endFlag: true,


      isShowMask: false, // 弹窗遮罩层

    };
  },
  created() {
  },
  async mounted() {
    //
    // debugger
    try {
      this.resetData();
      console.log(COMMON_ENV.appkey);
      let params = {
        token: this.curUserData.token,
      // token: ,
      };
      if (!this.imtoken) {
        let res = await getToken(params);
        console.log(res);
        if (res.data.code === '0000') {
          let token = res.data.data.imToken;
          this.setImToken(token);

          let obj = JSON.parse(JSON.stringify(this.curUserData));
          obj.token = 'true';
          obj.id = res.data.data.username;
          obj.accountId = res.data.data.userId;
          obj.account = res.data.data.username;
          obj.name = res.data.data.nickname;
          obj.icon = res.data.data.headImg;
          this.setcurUserData({ ...res.data.data, ...obj });
          // 埋点登录id

          // this.setRongCloudUser({ ...res.data.data, ...obj });
          this.params.token = token;
        } else {
          this.$message(`${res.data.message}`);
          this.hideMessage(2000);
          return;
        }
      } else {
        this.params.token = this.imtoken;
      }
      this.checkCurUser();
    } catch (err) {
      //
      this.hideMessageFn();
    }
  },
  methods: {
    async checkCurUser() {
      // 检测权益
      this.isShowMessageBox = true;
      this.isShowMessage = false;
      let gwtRes = await getWorkTime();

      if (gwtRes.data
          && gwtRes.data.code === '0000'
          && gwtRes.data.data
          && !gwtRes.data.data.isWorkTime) {
        this.getWorkTimeRes = gwtRes.data.data;
        // 不在工作时间 展示弹框
        let gwtCofirmRes = await this.confirmFn('2');
        if (gwtCofirmRes.code !== '0000') {
          // 不咨询了
          this.hideMessage();
          return;
        }
        // 提交问题
        // this.showMessage();
        this.dialogQuestion = true;
        this.isShowMask = true;
        return;
      }


      let curparams = {
        accountId: this.curUserData.accountId,
        account: this.curUserData.account,
      };
        // 获取当前用户权益
      let eqRes = await getEquityTime(curparams);
      if (eqRes.data.code === '0000') {
        this.getEquityCountRes = JSON.parse(JSON.stringify(eqRes.data.data));
        if (this.getEquityCountRes.status === 1) {
          // 有权益 弹出权益消耗弹框
          let eqDialogRes = await this.confirmFn('4');// 弹出权益使用弹窗
          if (eqDialogRes.code !== '0000') {
            // 取消
            this.hideMessage();
            return;
          }
        } else if (this.getEquityCountRes.status === 0) {
          // 权益消耗完 弹窗
          this.dialogRightVisible = true;
          return;
        }
      } else {
        this.$message('获取权益信息失败,请稍后再试');
        this.hideMessage(2000);
        return;
      }
      // this.dialogCompentVisible =true;

      // 获取是否有正在咨询的问题
      let giqRes = await getInQuestion({ accountId: this.curUserData.accountId });
      if (giqRes.data.code === '0000') {
        let { data } = giqRes.data;
        if (data.status === 1) {
          // 有正在咨询的问题

          this.setcurTargetUserData({ name: data.expertName, ...data });
          this.init();
          // if (data.online === 0) {} else {
          //   // 专家不在线
          //   await this.confirmFn('6');
          //   this.hideMessage();
          // }
        } else if (data.status === 0) {
          // 没有
          this.dialogQuestion = true;
          this.isShowMask = true;
        } else if (data.status === 2) {
          // 没有
          await this.confirmFn('6');

          this.hideMessage();


          // this.$message('已经提交过问题');
          // this.hideMessage(2000);
        }
      } else {
        this.dialogQuestion = true;
        this.isShowMask = true;
      }
    },
    async init(type) {
      console.log(this.curUserData, this.curTargetUserData);

      //  获取历史聊天记录
      let imres = await getIMById({ id: this.curTargetUserData.id });
      let list = [];
      if (imres.data.code === '0000') {
        let arr = [];
        // 排除后台自定义消息  加入群组消息
        imres.data.data.msgList.forEach((item) => {
          if (item.objectName !== 'RC:DxhyMsg'
              && item.objectName !== 'RC:GrpNtf'
              && item.targetId
              && item.fromUserId) {
            arr.push(item);
          }
        });
        list = arr;
      }

      // 获取聊天记录 至少应该有一条
      if (list.length < 1) {
        // 没有获取到聊天记录
        setTimeout(() => {
          this.loopNum += 1;
          if (this.loopNum < 120) {
            this.init('init');
          } else {
            this.$message('获取聊天记录失败，请稍后再试');
            this.hideMessage(2000);
          }
        }, 500);
        return;
      }


      let personnNum = -1;
      if (type === 'init') {
        let res = await getWaitNum({ expertId: this.curTargetUserData.expertId }); // 获取等待人数
        console.log(res);
        if (res.data.code === '0000') {
          personnNum = res.data.data.counts;
        }
      }

      let obj = {
        code: window.vue.curTargetUserData.code, // 咨询单code
        id: window.vue.curTargetUserData.id, // 咨询单id
        target: { // 目标对象
          id: window.vue.curTargetUserData.expertId, // 专家id
          name: window.vue.curTargetUserData.name, // 专家名称
          account: window.vue.curTargetUserData.expertAccount, // 专家账号
        },
        user: {
          id: this.curUserData.userId, // 当前用户id
          icon: this.curUserData.headImg, // 当前用户头像
          name: this.curUserData.username, // 当前用户名
        },
        list, // 聊天记录
        personnNum,
      };

      this.setmesListData([obj]);


      this.messageData.content.extra = {
        mesid: window.vue.mesListData[0].id,
        code: window.vue.mesListData[0].code,
        curid: window.vue.mesListData[0].id,
        icon: window.vue.mesListData[0].user.icon,
        name: window.vue.mesListData[0].user.name,
      };
      window.targetIdList = [window.vue.mesListData[0].target.id];
      if (window.vue.curTargetUserData.expertFromId) {
        // 如果有转单id  代表转单
        window.groupId = window.vue.curTargetUserData.code;
        window.targetIdList = [window.vue.mesListData[0].target.id,
          window.vue.curTargetUserData.expertFromId];
      }

      // if (this.getExpertQuestionParam.question_desc) {
      //   // 如果存在问题信息  发送问题
      //   this.startSendMes(this.getExpertQuestionParam.question_desc);
      // }
      this.params.appkey = COMMON_ENV.appkey;
      if (this.params.appkey && this.params.token) {
        this.rongInit(this.params);
      } else {
        throw new Error('appkey 和 token 不能为空');
      }
      // this.showMessage();
      // this.getHistoryMessageListFn();
    },


    async getExpertQuestionFn() {
      // 提交问题
      if (!this.getExpertQuestionParam.question_desc) {
        this.$message('请输入问题');
        return;
      }
      let params = {
        accountId: this.curUserData.accountId,
        account: this.curUserData.account,
        channelFrom: this.curUserData.channelFrom,
        fromName: this.curUserData.fromName,
        fromAddress: this.curUserData.fromAddress,
        fromContent: this.curUserData.fromContent,
        companyLocation: (this.curUserData.currentSelect && this.curUserData.currentSelect.area)
        || '',
        distributorId: this.curUserData.distributorId,
        // distributorId: 0,
        companyTrade: (this.curUserData.currentSelect && this.curUserData.currentSelect.industry)
        || '',
        userCompany: (this.curUserData.currentSelect && this.curUserData.currentSelect.entName) || '',
        userType: this.curUserData.userType, //
        questionDesc: this.getExpertQuestionParam.question_desc,
      };
      console.log(params);
      if (this.isCanRequest) {
        this.isCanRequest = false;
      } else {
        return;
      }
      let res = await getExpertQuestion(params).catch(() => {
        this.isCanRequest = true;
      });
      this.isCanRequest = true;
      if (res.data.code === '0000') {
        // this.hideMessage();
        let { data } = res.data;
        if (data.status === 1) {
          // 获取成功
          this.setcurTargetUserData({ name: data.expertName, ...data });
          this.dialogQuestion = false;
          this.isShowMask = false;

          this.init('init');
        } else if (data.status === -1
          || data.status === 0) {
          // 专家不在线
          this.dialogQuestion = false;
          this.isShowMask = false;
          await this.confirmFn('6');
          this.hideMessage();
        }
      } else {
        this.$message(res.data.message);
      }
      console.log(res);
    },


    async endEvaluateFn(ev) {
      // 结束咨询 已结束咨询直接返回
      if (this.hidemask) return;
      this.endFlag = true;
      let params = {
        id: window.vue.curTargetUserData.id,
        endType: '1', // 结束类型1用户结束2系统结束
      };
      if (this.isCanRequest) {
        this.isCanRequest = false;
      } else {
        return;
      }
      let res = await endEvaluate(params);
      this.isCanRequest = true;
      if (res.data.code === '0000') {
        // 结束咨询
        this.closeCofirmBox = false;
        this.hidemask = true;
        document.querySelector('.hidemask').style.display = 'block';
        /*eslint-disable*/ 
        let evlist = document.querySelectorAll('.closeQuestion-btns');
        evlist.forEach((item)=>{
          item.style.display = 'none';
        })
        // ev.target.parentElement.style.display = 'none';
        /* eslint-enable */
        if (ev) {
          this.isShowRateMesBox = true;
        } else {
          this.dialogCompentVisible = true;
        }
      } else {
        this.$message(res.data.message);
      }
    },
    endEvaluateFnSuc() {
      this.hidemask = true;
      document.querySelector('.hidemask').style.display = 'block';
      if (!this.endFlag) {
        this.isShowRateMesBox = true;
      }

      console.log(`自动结束时间：：：：：${new Date()}`, `结束标志hidemask${this.hidemask}++++dialogCompentVisible::${this.dialogCompentVisible}`);
      this.$forceUpdate();
    },
    resetData() {
      // 初始化data数据
      window.groupId = '';
      this.isShowRateMesBox = false;
      window.targetIdList = [];
      window.vue.mesListData[0] = { list: [] };
      this.setmesListData(window.vue.mesListData);
      this.mesData = '';

      this.getExpertQuestionParam = {
        question_desc: '',
      };
    },
    again() {
      this.resetData();
      this.hidemask = false;
      document.querySelector('.hidemask').style.display = 'none';
      this.isShowMessage = false;
      this.checkCurUser();
    },
    getWaitNumFn() {
      return getWaitNum(); // 获取等待人数
    },

    async dialogCompentVisibleSub() {
      // 评价成功
      this.dialogCompentVisible = false;
      this.isShowRateMesBox = false;
      this.hidemask = true;
      document.querySelector('.hidemask').style.display = 'block';
    },
    async requestAuthFn() {
      // 点击用户授权图标
      let res = await this.confirmFn('3');
      if (res.code === '0000') {
        // 确认授权
        let params = {
          accountId: this.curUserData.accountId,
          expertId: this.curTargetUserData.expertAccount,
          authType: 0,
        };
        let raRes = await requestAuth(params);
        if (raRes.data.code !== '0000') {
          this.$message('授权失败，请重新授权');
        }
      }
    },
    async addVipNoticeFn() {
      // 添加会员
      if (!this.userParam.name) {
        this.$message('请输入用户名');
        return;
      }
      if (!this.userParam.tel) {
        this.$message('请输入手机号');
        return;
      }

      if (!validByPhone(this.userParam.tel)) {
        this.$message('手机号格式有误');
        return;
      }


      let params = {
        accountId: this.curUserData.accountId,
        name: this.userParam.name,
        phone: this.userParam.tel,
        distributorId: this.curUserData.distributorId,
        productId: this.curUserData.productId,

      };
      if (this.isCanRequest) {
        this.isCanRequest = false;
      } else {
        return;
      }
      let res = await addVipNotice(params);
      this.isCanRequest = true;
      if (res.data.code === '0000') {
        this.dialogRightVisible = false;
        this.$message('提交成功');
        this.hideMessage(2000);
      } else {
        this.$message(res.data.message);
      }
    },
    fileUploadFn(params) {
      return fileUpload(params);
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
    async showMessage(time) {
      if (time) await this.sleep(time);
      this.isShowMessageBox = true;
      this.isShowMessage = true;
      this.$emit('show');
      this.sendMessageToParent({ code: '200', data: 'show' });
    },
    async hideMessage(time) {
      // 隐藏聊天框
      // 清除未读消息
      clearUnreadMsgCount({ userId: this.userId, questionId: window.vue.curTargetUserData.id });
      // if(this.dialogRightVisible){
      //   // 校验userParam
      //   if(this.userParam.name || this.userParam.tel){
      //     // 如果填写了信息
      //     let res = await this.$$confirm('您还没有提交信息，确定关闭吗？');
      //     if(res.code === '0000'){
      //       this.dialogRightVisible = false;
      //       this.hideMessageFn();
      //     }
      // return;
      //   }
      // }

      // if(this.dialogCompentVisible){
      //   // 校验userParam
      //     // 如果填写了信息
      //     let res = await this.$$confirm('您还没有提交评价信息，确定关闭吗？');
      //     if(res.code === '0000'){
      //       this.dialogCompentVisible = false;
      //       this.hideMessageFn();
      //     }
      //   return;
      // }


      if (this.dialogQuestion) {
        // 校验userParam
        if (this.getExpertQuestionParam.question_desc) {
          // 如果填写了信息
          let res = await this.$$confirm('您已经填写了要咨询的问题，确定关闭吗？');
          if (res.code === '0000') {
            this.dialogQuestion = false;
            this.isShowMask = false;
            this.hideMessageFn();
          }
          return;
        }
      }

      this.hideMessageFn(time);
    },
    async hideMessageFn(time) {
      if (time) {
        await this.sleep(time);
      }
      this.isShowMessageBox = false;
      this.isShowMessage = false;
      this.setcurUserData({});

      this.$emit('hide');
      this.sendMessageToParent({ code: '200', data: 'hide' });
    },
    async startSendMes(mes) {
      if (!mes) {
        this.mesData = this.mesData.replace(/\n/g, '').replace(/\r\n/g, '').replace(/↵/g, '');
        if (!this.mesData) {
          this.$message({ message: '请输入聊天内容', type: 'warning' });
          return;
        }
        this.messageData.content.content = this.mesData;
      } else {
        this.messageData.content.content = mes;
      }
      this.sendMessageFn('TextMessage');
    },
    async sendQuestion(ev, content) {
      if (this.hidemask) return;
      /*eslint-disable*/
      document.querySelectorAll('.closeQuestion-btns').forEach((item) => {
        item.style.display = 'none';
      });
      /* eslint-enable */
      this.messageData.content.content = content;
      let params = {
        fromUserId: this.userId,
        objectName: 'RC:TxtMsg',
        content: JSON.stringify(this.messageData.content),
      };
      let res = '';
      /*eslint-disable*/ 
      if (this.isCanRequest) {
        this.isCanRequest = false;
      } else {
        return;
      }
      if (window.groupId) {
        params.toGroupId = window.groupId;
        res = await groupSend(params);
      } else {
        params.toUserId = window.targetIdList[0];
        res = await send(params);
      }
      this.isCanRequest = true;
      if(res.data.code === '0000'){
        console.log(ev);
        ev.target.parentElement.style.display = "none";
        
      }
      /* eslint-enable */
      // this.sendMessageFn('TextMessage');
    },

    async initGroupFn(chatRoomId, type) {
      // 初始化群组

      // let c = await this.confirmFn('5');
      // this.dialogCompentVisible = true;

      this.messageData.content = {
        type: '0001',
        data: {
          id: 1,

        },
        extra: this.messageData.content.extra,
      };
      this.sendMessageFn('OptionsMessage', true);
      let res = await initGroup(chatRoomId, type);
      console.log(res);
    },
    checkMesForSystem() {
      if (window.vue.mesListData[0].list.length < 1) {
        // 没有聊天数据
        return true;
      }
      let min = 5 * 60 * 1000; // 发送系统时间  时间间隔 分钟
      let { list } = window.vue.mesListData[0];
      let lastTime = list[list.length - 1].sentTime + min;
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
        console.log(oMessageData);
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
        //   messageName:'InformationNotificationMessage',
        // };
        return sendMessage(window.targetIdList, sysObj, false, window.groupId);
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
          message: this.systemMessage,
          extra: this.messageData.content.extra,
        };
      }
      // if (messageName === 'TextMessage') {
      //   // 文本消息

      //   this.messageData.content.content = this.mesData;
      // }
      this.messageData.content.messageName = messageName;

      let res = await sendMessage(window.targetIdList, this.messageData, isCreate, window.groupId);
      this.sendMesResult(res);
      return new Promise((resolve) => {
        resolve(res);
      });
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
          // 埋点
          if (res.message.content.messageName === 'ImageMessage') {
            this.yszj_sendPicture();
          } else {
            this.yszj_sendFile();
          }
        } else {
          this.pushList(res.message);
          // this.finish(res.message);
        }
      }
    },
    pushList(data, type) {
      if (type === 'edit') {
        this.fileUpLoadSuc(data);
      } else {
        let obj = window.vue.mesListData[0];
        if (!obj.list) {
          this.init();
        }
        obj.list.push({
          id: obj.list.length,
          ...data,
        });
        console.log('extra:::::', data.content.extra, 'contentType:::', data.content.extra && data.content.extra.contentType);
        if (data.content
        && data.content.extra
        && data.content.extra.contentType === 'MSG_END') {
        // 是系统消息  结束咨询
          this.endEvaluateFnSuc();
        }
        this.setmesListData([obj]);
        this.$forceUpdate();
        this.scrollEnd();
      }
    },
    fileUpLoadSuc(data, type) {
      let list = window.vue.mesListData[0].list.slice();
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
        window.vue.mesListData[0].list = list;
        this.setmesListData(window.vue.mesListData);
        this.$forceUpdate();
      }
      this.isCanUpLoadFile = true;
    },
    emojiToHtml(mes) {
      if (typeof (mes) === 'string') {
        return emojiToHtml(mes);
      }
      return '消息格式非法';
    },
    scrollTop() {
      this.$nextTick(() => {
        // 滚动到底部
        let ele = document.getElementById('meslist');
        let aItems = ele.querySelectorAll('.item');
        let oItem = aItems[aItems.length - 20];
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
        let ele = document.getElementById('meslist');
        if (!ele) return;
        ele.scrollTop = ele.scrollHeight;
      });
    },
    hidepersonnNum() {
      window.vue.mesListData[0].personnNum = -1;
      console.log('hidepersonnNum');
      this.$forceUpdate();
    },
    addPromptInfo(res) {
      // let oThis = this;
      if (res.code === '9999') {
        console.log('收到消息', res);
        // 隐藏等待人数消息
        // 判断咨询单id  与当前咨询单id是否一致  不一致不做处理  可能是离线留言
        if (res.data.content.extra
          && (window.vue.curTargetUserData.id !== res.data.content.extra.mesid)) {
          console.log('非当前咨询单消息，不做处理', window.vue.curTargetUserData.id, res.data.content.extra.mesid);
          return;
        }
        // 判断当前消息时间 是否小于最后一条消息的时间  如果小于那个  不做处理
        // 判断当前消息的msgUID  是否存在 存在不做操作 messageUId
        if (window.vue.mesListData[0].list
          && window.vue.mesListData[0].list.length > 0) {
          let flag = false;
          let { list } = window.vue.mesListData[0];
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
        this.hidepersonnNum();

        // 收到消息
        if (res.data.objectName === 'RC:DxhyMsg') {
          // 后台自定义消息
          console.log('收到后台自定义消息', res);
          if (res.data.content.contentType === 'MSG_END_REQUEST') {
            this.endFlag = false;
            this.pushList(res.data);
          }
        } else if (res.data.messageType === 'GroupNotificationMessage') {
          // 加入群组消息  转单
          window.vue.curTargetUserData.name = res.data.content.data.toExpertName; // 转单专家name
          this.setcurTargetUserData(window.vue.curTargetUserData);
          window.groupId = res.data.content.data.targetGroupName; // 群组id

          let tagetid = res.data.content.data.operatorNickname; // 被转专家id
          let changeid = res.data.senderUserId; // 转单专家id
          window.targetIdList = [tagetid, changeid];

          console.log('转单 加入群组消息', res.data, window.groupId, window.targetIdList);
        } else {
          this.pushList(res.data);
        }
      } else if (res.code === '0000') {
        console.log('拿到userid', res);
        // 拿到userid
        this.setUserId(res.data);
        this.sensors_login(res.data);
        this.showMessage();
        // 获取聊天记录
        // this.getHistoryMessageListFn();
      } else if (res.code === '1001') {
        this.$message(res.message);
      } else {
        console.log(res.message);
      }
    },
    sendMessageToParent(data) {
      // 传递信息给父页面
      window.parent.postMessage(data, '*');
    },

    imgClick(url) {
      if (document.getElementById('elemIF')) {
        document.body.removeChild(document.getElementById('elemIF'));
      }

      let elemIF = document.createElement('iframe');
      elemIF.id = 'elemIF';
      elemIF.src = url;
      elemIF.style.display = 'none';
      document.body.appendChild(elemIF);
    },

    async uploadImg(content, fparams) {
      // 上传图片 content base64
      let res = await this.sendSystemMessage();
      if (res.code === '0000') {
        this.sendMesResult(res);
      }
      this.curUploadFileId = window.vue.mesListData[0].list.length;
      let obj = {
        content: {
          messageName: 'ImageMessage',
          content,
          imageUri: '',
        },
        uploading: true,
        messageType: 'ImageMessage',
        objectName: 'RC:ImgMsg',
        senderUserId: this.userId,
      };

      this.pushList(obj);


      let fileRes = await this.fileUploadFn(fparams);
      if (fileRes.data.code === '0000') {
        this.messageData.content.imageUri = fileRes.data.data;
      } else {
        this.$message(fileRes.data.message);
        this.fileUpLoadSuc(null, 'del');
        return;
      }

      // 上传成功 删除预览消息
      // this.mesListData[0].list.splice(curindex, 1);
      // this.isCanUpLoadFile = true;


      // 发送图片消息
      this.messageData.content.content = content;
      this.sendMessageFn('ImageMessage');
    },
    async uploadFile(file) {
      if (!file) return;
      let res = await this.sendSystemMessage();
      if (res.code === '0000') {
        this.sendMesResult(res);
      }
      this.curUploadFileId = window.vue.mesListData[0].list.length;
      let content = {
        name: file.name,
        size: file.size,
        type: file.type,
        extra: this.messageData.content.extra,
        messageType: 'FileMessage',
        objectName: 'RC:FileMsg',
        fileUrl: '',
      };

      let message = {
        content,
        uploading: true,
        messageType: 'FileMessage',
        objectName: 'RC:FileMsg',
        senderUserId: this.userId,
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
        let fileRes = await this.fileUploadFn(fparams);
        if (fileRes.data.code === '0000') {
          content.fileUrl = fileRes.data.data;
        } else {
          this.$message(fileRes.data.message);
          this.fileUpLoadSuc(null, 'del');
          return;
        }


        this.messageData.content = content;
        this.sendMessageFn('FileMessage');
      };
    },
    fileChange(ev, type) {
      if (!this.isCanUpLoadFile) {
        this.$message('有文件正在上传中...');
        /*eslint-disable*/ 
      // 清除value  避免第二次不触发change
      ev.target.value = '';
       /* eslint-enable */
        return;
      }
      let postFiles = Array.prototype.slice.call(ev.target.files);
      let file = postFiles[0];
      if (type === 'img') {
        if (file.size / 1024 > this.imgMaxSize) {
          this.$message(`图片大小必须小于${this.imgMaxSize}kb`);
          /*eslint-disable*/ 
      // 清除value  避免第二次不触发change
      ev.target.value = '';
       /* eslint-enable */
          // 清除value  避免第二次不触发change
          return;
        }
        this.fileToImage(file);
      } else if (type === 'file') {
        if (file.size / (1024 * 1024) > this.fileMaxSize) {
          this.$message(`文件大小必须小于${this.fileMaxSize}M`);
          /*eslint-disable*/ 
      // 清除value  避免第二次不触发change
      ev.target.value = '';
       /* eslint-enable */
          return;
        }
        this.isCanUpLoadFile = false;
        // 上传文件
        this.uploadFile(file);
      }
      /*eslint-disable*/ 
      // 清除value  避免第二次不触发change
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

    /*eslint-disable*/ 
    
    emojiClickItem(item){
      this.mesData = this.mesData + item.symbol;
    },
    emojiClick(){
      // 初始化 emoji
      this.isShowEmoji = !this.isShowEmoji;
      if(this.emojiList.length>0){
        return;
      }
      this.emojiList = getemojiList();
    },


    getSystemTip(item){
      if(item.content.message){
        return item.content.message;
      }else{
        let curtime = formatDate(new Date().getTime());
        let sentTime = item.sentTime || item.msgTimestamp
        let time = formatDate(sentTime);
        if(time.split(' ')[0] === curtime.split(' ')[0]){
          return time.split(' ')[1];
        }else{
          return time;
        }
      }
    },

    confirm(message,subtext,canceltext,title,hideCancelBtn){
      // 
      if(!message) return;
      this.isShowMask = true;
      let showCancelButton = !hideCancelBtn;  //隐藏btn按钮
      return new Promise((resolve)=>{
        this.$confirm(message, title || '', {
          confirmButtonText: subtext || '确定',
          cancelButtonText: canceltext || '取消',
          showCancelButton,
          closeOnClickModal:false,
        }).then(() => {
          resolve({code:'0000'});
          this.isShowMask = false;
        }).catch(() => {
          resolve({code:'404'})    
          this.isShowMask = false;     
        });

      })
    },
    confirmFn(type){
      let message = '';
      const h = this.$createElement;
      if(type === '1'){
        // 弹出问题咨询弹窗
        message = '您已经填写了要咨询的问题，确定关闭吗？';
        return this.confirm(message);
      }else if (type === '2'){
        // 非工作时间提醒
        // let time = '（工作时间：8：00--21:00）'
        let time = this.getWorkTimeRes.desc;
        message = h('div',{
          class:'common-dialog-mes',
          key:'dialog-type'+type,
          ref:'dialog-type'+type,
          },[
            h('p',null,'现在是非工作时间，您可以先提交要咨询的问题'),
            h('p',null,'专家上班会尽快给你回复'),
            h('p',null,time),
          ]);
        return this.confirm(message,'提交问题','不咨询了');
      }else if (type === '3'){
        // 授权提示信息
        message = h('div',{
          class:'common-dialog-mes',
          key:'dialog-type'+type,
          ref:'dialog-type'+type,
          },[
            h('p',{
              style:{
                fontWeight:'blod',
                fontSize:'18px'
              }
            },'数据授权'),
            h('p',null,'为了更好的解答您的问题，专家获取以下权限：'),
            h('p',{
              class:'icon-auth'
            },'授权专家在咨询期间查看您的风险测评数据及报告'),
            h('p',null,'咨询结束后查看权限将被收回'),
          ]);
        return this.confirm(message,'允许','拒绝');
      }else if (type === '4'){
        // 权益咨询次数提示信息
        let allnum = 0;
        let curnum = 0;
        let usenum = 1;   //使用
        if(this.getEquityCountRes){
          allnum = this.getEquityCountRes.equityDay;   //总数
          usenum = this.getEquityCountRes.betweenDays;   //剩余
        }

         message = h('div',{
          class:'common-dialog-mes',
          key:'dialog-type'+type,
          ref:'dialog-type'+type,
          },[
            h('p',null,[
              '您拥有',
              h('span',{
                style:{
                  color:'#33C8DF',
                }
              },allnum),
              '天免费咨询权益',
              ]),
            h('p',['现剩余',
               h('span',{
                style:{
                  color:'#33C8DF',
                  fontSize:'1.4em'
                }
              },usenum),
              '天']),
          ]);
        return this.confirm(message);
      }else if (type === '5'){
        // 权益咨询天数提示信息
        let num = 2;  //剩余天数
        message = h('div',{
          class:'common-dialog-mes',
          key:'dialog-type'+type,
          ref:'dialog-type'+type,
          },[
            h('p',null,'您拥有5天免费咨询权益'),
            h('p',['现剩余 ',
               h('span',{
                style:{
                  color:'#33C8DF',
                  fontSize:'1.4em'
                }
              },num),
              ' 天']),
          ]);
        return this.confirm(message,'立即咨询','','',true);
      }else if (type === '6'){
        // 非工作时间提醒
        // let time = '（工作时间：8：00--21:00）'
        // let time = this.getWorkTimeRes.desc;
        message = h('div',{
          class:'common-dialog-mes',
          key:'dialog-type'+type,
          ref:'dialog-type'+type,
          },[
            h('p',null,'现在无值班专家在线，请稍后再试'),
            h('p',null,'专家上线会尽快给你回复'),
          ]);
        return this.confirm(message,'确定','','',true);
      }
    },

    async imloginOut(mes){
      // im异常情况 提示  退出登录
      console.log(mes);
      await this.$$confirm(mes,'确定','','',true);
      this.hideMessage();
    },
    reconnectFn(mes){
      let oThis = this;
      let { RongIMClient } = window.RongIMLib;
      RongIMClient.reconnect({
        onSuccess() {
          // 重连成功
        },
        onError() {
          // 重连失败
          console.log('重连提示：：：'+mes);
          oThis.imloginOut(mes);
          // oThis.hideMessage(2000);
        },
      },{
        auto: true,
        url: window.location.href,
        rate: [100, 1000, 3000, 6000, 10000]
      });
    },

    rongInit(params) {
      // 容联初始化
      console.log(params)
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
          
          switch (status) {
            case RongIMLib.ConnectionStatus.CONNECTED:
            case 0:
              console.log('连接成功');
              oThis.showMessage();
              oThis.addPromptInfo({ code: status, message: '' });
              break;

            case RongIMLib.ConnectionStatus.CONNECTING:
            case 1:
              console.log('连接中');
              oThis.addPromptInfo({ code: status, message: '' });
              break;

            case RongIMLib.ConnectionStatus.DISCONNECTED:
            case 2:
              console.log('当前用户主动断开链接');
              oThis.addPromptInfo({ code: '-9999', message: '' });
              break;

            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
            case 3:
              // oThis.addPromptInfo({ code: '1001', message: '网络不可用' });
              oThis.reconnectFn('网络不可用,请检查网络');
              break;

            case RongIMLib.ConnectionStatus.CONNECTION_CLOSED:
            case 4:
              // oThis.addPromptInfo({ code: '404', message: '未知原因，连接关闭' });
              // 尝试重连
              oThis.reconnectFn('未知原因，连接关闭');
              break;

            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
            case 6:
              // oThis.addPromptInfo({ code: '1002', message: '用户账户在其他设备登录，本机会被踢掉线' });
              oThis.imloginOut('用户账户已在其他设备登录');
              // oThis.hideMessage(2000);
              break;

            case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
            case 12:
              // oThis.addPromptInfo({ code: '1002', message: '当前运行域名错误，请检查安全域名配置' });
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
          oThis.imloginOut('token无效，请重新登录');
          // oThis.hideMessage(2000);
        },
        onError(errorCode) {
          // 尝试重连
          oThis.reconnectFn('未知原因，连接关闭');
        },
      }, null);
    }
    

  }
}