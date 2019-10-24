import {
  mapGetters,
  mapMutations,
} from 'vuex';
import { expertLogout } from '@/api/apis';

export default {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          // token: '',
          publicPath: process.env.BASE_URL,
          isCanRequest: true, // 防止连续请求
          rateMap: {
            1: '非常不满意',
            2: '不满意',
            3: '一般',
            4: '满意',
            5: '非常满意',
          },
          rateTagMap: [
            {
              text: '问题完美解决',
              id: '1',
              rate: '5',
              active: false,
            },
            {
              text: '极速回复',
              id: '2',
              rate: '5',
              active: false,
            },
            {
              text: '服务态度好',
              id: '3',
              rate: '5',
              active: false,
            },
            {
              text: '问题没有解决',
              id: '4',
              rate: '1,2,3,4',
              active: false,
            },
            {
              text: '回复慢',
              id: '5',
              rate: '1,2,3,4',
              active: false,
            },
            {
              text: '服务态度差',
              id: '6',
              rate: '1,2,3,4',
              active: false,
            },
          ],
          manageMessageList: [], // 消息管理
          confirmManageMessageList: [], // confirm 消息管理
        };
      },
      computed: {
        ...mapGetters([
          'token', // 登录token
          'imtoken', // 登录token
          'userId', // 登录token
          'curTargetId', // 登录token
          'curUserData', // 当前用户信息
          'curTargetUserData', // 目标用户信息
          'curChangeUserData', // 转单专家用户信息
          'meslist',
          'userlist',
          'vuexShowMessage', // 是否展示聊天窗口
          'curMessageIndex',
        ]),
      },
      methods: {
        login() {
          this.$router.replace('/login');
        },
        logout() {
          expertLogout({ id: this.curUserData.id }).then((res) => {
            if (res.data.code === '0000' || res.data.code === '1058') {
              this.setToken('');
              sessionStorage.clear();
              localStorage.clear();
              this.$router.replace('/login');
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
              });
            }
          });
        },
        $message(mes) {
          if (mes === undefined) return;
          let message = typeof (mes) === 'string' ? mes : mes.message;
          let flag = true;
          this.manageMessageList.forEach((item) => {
            if (item === message) {
              flag = false;
            }
          });
          if (flag) {
            this.manageMessageList.push(message);
            setTimeout(() => {
              this.manageMessageList.splice(0, 1);
            }, 3000);
          } else {
            return;
          }
          if (typeof (mes) === 'string') {
            this.$$message({
              message: mes,
              type: 'warning',
            });
          } else {
            this.$$message(mes);
          }
        },

        delItemFromList(curitem, list) {
          let i = -1;
          list.forEach((item, index) => {
            if (curitem === item) {
              i = index;
            }
          });
          if (i !== -1) {
            list.splice(i, 1);
          }
          console.log(this.confirmManageMessageList);
        },

        $$confirm(message, subtext, canceltext, title, hideCancelBtn) {
          let flag = true;
          this.confirmManageMessageList.forEach((item) => {
            if (item === message) {
              flag = false;
            }
          });


          let showCancelButton = !hideCancelBtn; // 隐藏btn按钮
          return new Promise((resolve) => {
            if (!message || !flag) {
              resolve({ code: '404' });
              return;
            }
            // 将消息push到管理器里
            this.confirmManageMessageList.push(message);

            this.$confirm(message, title || '', {
              confirmButtonText: subtext || '确定',
              cancelButtonText: canceltext || '取消',
              showCancelButton,
              closeOnClickModal: false,
              customClass: 'common-dialog-message-box',
            }).then(() => {
              this.delItemFromList(message, this.confirmManageMessageList);
              resolve({ code: '0000' });
            }).catch(() => {
              this.delItemFromList(message, this.confirmManageMessageList);
              resolve({ code: '404' });
            });
          });
        },


        routerGoBlank(path, q) {
          // 在新标签页打开
          let query = q || {};
          let routeUrl = this.$router.resolve(
            { path, query },
          );
          window.open(routeUrl.href, '_blank');
        },
        routerReplace(path, q) {
          // 路由跳转替换当前路由
          let query = q || {};
          this.$router.replace({ path, query });
        },
        routerGo(path, q) {
          // 路由跳转
          let query = q || {};
          this.$router.push({ path, query });
        },

        ...mapMutations([
          'setToken',
          'setImToken',
          'setUserId',
          'setCurTargetId',
          'setcurUserData', // 当前用户信息
          'setcurTargetUserData', // 目标用户信息
          'setcurChangeUserData', // 转单专家用户信息
          'setmeslist', // 聊天列表
          'setuserlist', // 咨询单列表
          'setvuexShowMessage', // 是否展示聊天窗口
          'setcurMessageIndex', // 是否展示聊天窗口
        ]),
      },

    });
  },
};
