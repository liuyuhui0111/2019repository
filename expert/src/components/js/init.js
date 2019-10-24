// 消息类型页面 https://www.rongcloud.cn/docs/message_architecture.html#message_content

export function initEmoji() {
  let { RongIMLib } = window;
  // 直接初始化
  RongIMLib.RongIMEmoji.init();

  // 通过配置初始化
  // 表情信息可参考 http://unicode.org/emoji/charts/full-emoji-list.html
  let config = {
    size: 24, // 大小, 默认 24, 建议15 - 55
  };
  RongIMLib.RongIMEmoji.init(config);
}
export function initCreateMessage(messageName, prototypes, isCounted, isPersited, objName) {
  // 创建自定义消息
  let { RongIMLib } = window;
  let { RongIMClient } = window.RongIMLib;
  // var messageName = 'PersonMessage'; // 消息名称
  let objectName = objName || `s:${messageName}`; // 消息内置名称，请按照此格式命名
  // var isCounted = true; // 消息计数
  // var isPersited = true; // 消息保存
  let mesasgeTag = new RongIMLib.MessageTag(!!isCounted, !!isPersited);
  // 消息是否保存是否计数，true true 计数且保存，false false 不计数不保存
  // var prototypes = ['name', 'age']; // 消息类中的属性名
  RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes);
}

export function rongClose() {
  // 断开连接
  let { RongIMClient } = window.RongIMLib;
  RongIMClient.getInstance().disconnect();
}

export function getHistoryMessageList(targetId) {
  // 获取历史消息记录
  return new Promise((resolve) => {
    let { RongIMLib } = window;

    let conversationType = RongIMLib.ConversationType.PRIVATE; // 单聊, 其他会话选择相应的会话类型即可
    // let targetId = 'user1'; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id
    let timestrap = null; // 默认传 null，若从头开始获取历史消息，请赋值为 0, timestrap = 0;
    let count = 20; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取
    RongIMLib.RongIMClient.getInstance().getHistoryMessages(
      conversationType, targetId, timestrap, count, {
        onSuccess(list, hasMsg) {
        // list => Message 数组。
        // hasMsg => 是否还有历史消息可以获取。
          resolve({
            code: '0000',
            data: {
              list,
              hasMsg,
            },
          });
        },
        onError(error) {
          console.log(`GetHistoryMessages, errorcode:${error}`);
          resolve({ code: '404', data: error });
        },
      },
    );
  });
}

export function sendMessage(targetIdList, messageData, isCreate, groupId) {
  // 发送消息  参数 目标列表 消息对象 content messageName 必须传
  // isCreate 是否自定义消息 isGroup  是否是群组
  // messageData：{content:{messageName:''}}
  console.log('发送消息::::::::::', targetIdList, messageData, isCreate, groupId);
  return new Promise((resolve, reject) => {
    if (targetIdList.length < 1 || !messageData) {
    // 没有传发送对象  和消息内容
      reject(new Error('params error '));
      return;
    }
    if (!(messageData.content && messageData.content.messageName)) {
      reject(new Error('params error '));
      return;
    }
    let { RongIMLib } = window;
    let { RongIMClient } = window.RongIMLib;

    let conversationType = null;
    if (groupId) {
      conversationType = RongIMLib.ConversationType.GROUP;
    } else {
      conversationType = RongIMLib.ConversationType.PRIVATE;
    }
    /* 会话类型 PRIVATE  单聊
    GROUP 群组
    CHATROOM 聊天室
    CUSTOMER_SERVICE   客服
    等等https://www.rongcloud.cn/docs/web.html#conversation
  */
    /*eslint-disable*/ 
    if (!(RongIMClient && RongIMClient._instance)) {
      reject(new Error(' error 没有初始化'));
      return;
    }
    
    let targetId = targetIdList.length === 1 ? targetIdList[0] : targetIdList;
    /* eslint-enable */
    let mestype = messageData.content.messageName;
    /* 消息类型
  TextMessage         文字消息
  ImageMessage        图片消息
  FileMessage         文件消息
  InformationNotificationMessage      提示条通知消息
  ContactNotificationMessage         好友通知消息
  GroupNotificationMessage         群组通知消息
  CommandMessage         命令消息
  等等https://www.rongcloud.cn/docs/message_architecture.html#message_content
  */
    let msg = null;
    if (isCreate) {
    // 如果为真发送自定义消息
      msg = new RongIMClient.RegisterMessage[mestype](messageData.content);
    } else {
      msg = new RongIMLib[mestype](messageData.content);
    }
    // let msg = new RongIMLib[mestype](messageData.content);
    if (groupId) {
      // 发送群定向消息
      // 返回发送结果
      RongIMClient.getInstance().sendMessage(
        conversationType,
        groupId,
        msg,
        {
          onSuccess(message) {
            // message 为发送的消息对象并且包含服务器返回的消息唯一 id 和发送消息时间戳
            resolve({ code: '0000', message });
          },
          onError(errorCode) {
            resolve({ code: '-9999', message: errorCode });
            console.log('发送文本消息失败', errorCode);
          },
        },
        true, // 是否为定向消息
        '', // Push  显示内容
        '', // Push通知时附加信息
        null,
        { userIds: targetId }, // 发送用户名
      );
    } else {
    // 返回发送结果
      RongIMClient.getInstance().sendMessage(
        conversationType,
        targetId,
        msg,
        {
          onSuccess(message) {
          // message 为发送的消息对象并且包含服务器返回的消息唯一 id 和发送消息时间戳
            resolve({ code: '0000', message });
          },
          onError(errorCode) {
            resolve({ code: '-9999', message: errorCode });
            console.log('发送文本消息失败', errorCode);
          },
        },
      );
    }
  });
}

export function rongInit(params, addPromptInfo) {
  // 容联初始化
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
  RongIMClient.setConnectionStatusListener({
    onChanged(status) {
      addPromptInfo({ code: status, message: '' });
      switch (status) {
        case RongIMLib.ConnectionStatus.CONNECTED:
        case 0:
          console.log('连接成功');

          break;

        case RongIMLib.ConnectionStatus.CONNECTING:
        case 1:
          console.log('连接中');
          addPromptInfo({ code: status, message: '连接中' });
          break;

        case RongIMLib.ConnectionStatus.DISCONNECTED:
        case 2:
          console.log('当前用户主动断开链接');
          addPromptInfo({ code: '-9999', message: '当前用户主动断开链接' });
          break;

        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
        case 3:
          addPromptInfo({ code: '1001', message: '网络不可用' });
          break;

        case RongIMLib.ConnectionStatus.CONNECTION_CLOSED:
        case 4:
          addPromptInfo({ code: '-9999', message: '未知原因，连接关闭' });
          break;

        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
        case 6:
          addPromptInfo({ code: '1002', message: '用户账户在其他设备登录，本机会被踢掉线' });
          break;

        case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
        case 12:
          addPromptInfo({ code: '1002', message: '当前运行域名错误，请检查安全域名配置' });
          break;
        default:
          addPromptInfo({ code: '404', message: '服务器返回错误' });
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
      addPromptInfo({ code: '9999', data: message });
    },
  });
  RongIMClient.connect(token, {
    onSuccess(userId) {
      addPromptInfo({ code: '0000', data: userId });
    },
    onTokenIncorrect() {
      addPromptInfo({ code: '0002', data: 'token无效' });
    },
    onError(errorCode) {
      addPromptInfo(errorCode);
    },
  }, null);
}


export function getemojiList() {
  // 获取emoji list
  let { RongIMEmoji } = window.RongIMLib;
  return RongIMEmoji.list;
}

export function emojiToHtml(message) {
  // emoji 转html
  let { RongIMEmoji } = window.RongIMLib;
  return RongIMEmoji.symbolToHTML(message);
}


// 加入群组
export function initGroup(chatRoomId, type) {
  let { RongIMClient } = window.RongIMLib;
  // let chatRoomId = chatRoomId; // 聊天室 Id
  let count = 50; // 拉取最近聊天最多 50 条
  return new Promise((resolve) => {
    if (type === 'quit') {
      // 退出群组
      RongIMClient.getInstance().quitChatRoom(chatRoomId, {
        onSuccess() {
          // 退出聊天室成功
          console.log('退出聊天室成功');
          resolve({ code: '0000' });
        },
        onError(error) {
          // 退出聊天室失败
          console.log('退出聊天室失败', error);
          resolve({ code: '404' });
        },
      });
    } else {
      RongIMClient.getInstance().joinChatRoom(chatRoomId, count, {
        onSuccess() {
          // 加入聊天室成功
          console.log('加入聊天室成功');
          resolve({ code: '0000' });
        },
        onError(error) {
          // 加入聊天室失败
          console.log('加入聊天室失败', error);
          resolve({ code: '404' });
        },
      });
    }
  });
}
