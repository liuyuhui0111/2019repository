/*
 *
 *全局mixins
 */
import {
  mapGetters,
  mapMutations,
} from 'vuex';

import {
  getToken,
  getUserInfo,
  goLogin,
  loginout,
  wxShare,
} from '@/api/apis';
import {
  getUrlParam, getSystem,
} from '@/assets/utils/util';
import baseImg from '@/views/components/img.vue';
import BackTop from '@/views/components/backtop.vue';
import classTitle from '@/views/components/classTitle.vue';
import myBtn from '@/views/components/myButton.vue';
import {
  wxConfig,
} from '@/assets/utils/wxFunction';

export default {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          // token: '',
          publicPath: process.env.BASE_URL || '/',
          wxShareTitle: '优税学院',
          wxShareUrl: '', // 分享地址
          wxShareImage: '', // 分享图片地址
          wxShareDesc: '', // 分享描述
          isCanRequest: true, // 防止重复请求
          scrollInitHeight: 700,
          qimoChatTimer: null,

        };
      },
      watch: {
        token() {
          if (!this.token && this.$route.meta.isNeedLogin) {
            // 如果是需要登录的页面；
            this.login();
          }
        },
      },

      created() {
        this.scrollInitHeight = window.innerHeight;
      },
      components: {
        BackTop,
        baseImg,
        classTitle,
        myBtn,
      },
      computed: {
        ...mapGetters([
          // 映射 this.count 为 store.state.count
          'token', // 是否显示全局Loading
          'commonUserData', // 用户相关信息
          'COMMON_COMP_DATA', // 公司主体信息
          'netWorkError',
          'requestLoading',
          'fromRoute',
          'isqimoChatClickFlag',
          'vuexInvoiceData',
          'vuexInvoiceTitle',
          'orderData',
        ]),
      },
      methods: {
        // 警告提示  $全局标记
        $message(mes, type) {
          // toast 提示
          this.$createToast({
            time: 3000,
            txt: mes,
            type: type || 'txt',
          }).show();
        },
        $confirm(mes) {
          // 确认弹窗
          return new Promise((resolve) => {
            this.$createDialog({
              type: 'confirm',
              title: mes,
              confirmBtn: {
                text: '确定',
              },
              cancelBtn: {
                text: '取消',
              },
              onConfirm: () => {
                resolve(true);
              },
              onCancel: () => {
                resolve(false);
              },
            }).show();
          });
        },

        login(type) {
          // 去登录

          goLogin(type);
        },

        async loginoutFn(flag) {
          // 退出登录，清空cookie
          if (flag === true) {
            // flag true 直接登录 不弹窗
            loginout();
            return;
          }
          let res = await this.$confirm('确定退出登录吗？');
          if (!res) {
            return;
          }

          this.setToken('');
          window.localStorage.removeItem('REDIRECT_URI');
          loginout();
        },
        cardClick(item, index, type) {
          if (type === 1) {
            this.ysxy_columnClick({ LocationName: `公开课${index + 1}`, columnTitle: '线下公开课程' });
          } else if (type === 2) {
            this.ysxy_columnClick({ LocationName: `大家都在学${index + 1}`, columnTitle: '大家都在学' });
          } else if (type === 3) {
            this.ysxy_columnClick({ LocationName: `新鲜出炉${index + 1}`, columnTitle: '新鲜出炉' });
          } else if (type === 4) {
            this.ysxy_columnClick({ LocationName: `推荐课程${index + 1}`, columnTitle: '推荐课程' });
          }
          let opt = {
            cid: item.id,
          };
          if (type) {
            opt.fromRoute = `index${type}`;
          }
          // 点击跳转详情
          /*eslint-disable*/
          if(item.type == '2'){
            this.routerGo('/detail',opt);
          }else if(item.type == '1'){
            this.routerGo('/online-detail',opt);
          }
          /* eslint-enable */
        },

        confirmLogin(message) {
          this.login();
          console.log(message);
        },
        getTokenByCode(fn) {
          const code = getUrlParam('code');
          if (code && !this.token) {
            // code 存在  通过code获取token
            getToken({ code }).then((res) => {
              // 设置token
              /* eslint-disable */
                if(res.data.code === 0){
                    let token = res.data.data['access_token']
                    this.setToken(token)
                    this.getUserInfoFn()
                    typeof (fn) === 'function' && fn();
                }

                /* eslint-enable */
            }).catch((err) => {
              console.log(err);
              // 获取token 失败  退出登录 提示重新登录
              // this.$message('登录失败，请重新登录');
            });
          }
        },
        getUserInfoFn() {
          // 如果token 存在获取用户信息
          if (this.token) {
            getUserInfo().then((res) => {
              // 设置用户信息
              // console.log('user===================',res);
              if (res.data.code === '0000') {
                let user = res.data.leaguerList;
                if (!user || !user.userName) {
                  this.setToken('');
                  this.$message('获取个人信息失败，请重新登录');
                  return;
                }
                this.setUsers(user);
              }
            }).catch((err) => {
              console.log(err);
            });
          }
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
        qimoChatClickFn() {
          // 唤起客服
          if (this.isqimoChatClickFlag) {
            window.qimoChatClick();
          } else {
            this.qimoChatTimer = setInterval(() => {
              console.log('check chat');
              if (this.isqimoChatClickFlag) {
                window.qimoChatClick();
                clearInterval(this.qimoChatTimer);
              }
            }, 20);
          }
        },
        emit(eventname, data) {
          // 派发事件
          this.$emit(eventname, data);
        },

        initWxShareFn() {
          /*eslint-disable*/

          // 微信分享
          this.wxShareTitle = this.$route.meta.wxShareTitle
       || '优税学院';
          this.wxShareDesc = this.$route.meta.wxShareDesc || '财税大神进阶之路，职业发展更快一步';

          this.wxShareUrl = window.location.href;
          this.wxShareImage = `${window.location.origin + this.publicPath}sharelogo.png`;
          this.wxShareFn();
        },
        wxShareFn(sucFn) {
          // 设置分享标题 图片 描述 地址
          // alert("分享链接："+this.wxShareUrl)
          let oThis = this;
          let wxShareData = {
            title: this.wxShareTitle, // 分享标题
            link: this.wxShareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl:this.wxShareImage, // 分享图标
            desc: this.wxShareDesc, // 分享描述
            success: function (res) {
              // 用户确认分享后执行的回调函数
              // this.$message('分享成功');
              sucFn && sucFn();
              oThis.$createDialog({
                type: 'alert',
                title: '提示',
                content: '分享成功',
                onConfirm: () => {
                },
              }).show();
            },
            cancel: function (res) {
              // 用户取消分享后执行的回调函数
              oThis.$createDialog({
                type: 'alert',
                title: '提示',
                content: '取消分享',
                onConfirm: () => {
                },
              }).show();
            }
          }
          // shareStart(wxShareData);
          // console.log(wxShareData);
          // alert('当前location:::'+location.href.split('#')[0]+'第一次请求接口url:::'+params.url)
          if(!getSystem().wx){
            // 不是微信环境
            return;
          }
          wxShare().then((res) => {
            if (res.data && res.data.appId) {
              wxConfig(res.data, wxShareData);
            }
          }).catch((err) => {
            console.log(err);
          });
        },

        ...mapMutations([
          'setToken',
          'setCopData',
          'setNetWork',
          'setLoading',
          'setFromRoute',
          'setIsqimoChatClickFlag',
        ]),
        ...mapMutations('user', [
          'setUsers',
        ]),
        ...mapMutations('order', [
          'setVuexInvoiceData',
          'setvuexInvoiceTitle',
          'setOrderData',
        ]),
      },
    });
  },
};
