/* eslint-disable */
import {getUrlParam} from '@/assets/utils/util'
const routeMap = {
    'index0':'首页banner',
    'index1':'首页公开课',
    'index2':'大家都在学',
    'index3':'新鲜出炉',
    'index4':'优质推荐课程',
    'search0':'热门搜索',
    'search1':'在线课程推荐',
    'offline0':'在线训练营',
    'share':'分享',
}
const getters = {
    token: state => state.token,
    fromRoute: (state) => {
    	// 如果路由里拼了来源 就用这个做来源 否则默认的
    	if(getUrlParam('fromRoute')){
            let f = decodeURIComponent(getUrlParam('fromRoute'));
            return routeMap[f] || f;
    	}else{
    		return decodeURIComponent(state.fromRoute);
    	}
    },
    netWorkError: state => state.netWorkError,
    requestLoading: state => state.requestLoading,
    commonUserData: state => state.user.commonUserData,
    vuexInvoiceTitle: state => state.order.vuexInvoiceTitle,
    
    orderData: (state) => {
        if(state.order.orderData.item){
            return state.order.orderData;
        }else if(window.sessionStorage.getItem('orderData')){
            return JSON.parse(window.sessionStorage.getItem('orderData'));
        }else{
            return {};
        }
    },
    vuexInvoiceData: (state) => {
        return state.order.vuexInvoiceData || JSON.parse(window.localStorage.getItem('vuexInvoiceData'));
    },
    
    COMMON_COMP_DATA: state => state.COMMON_COMP_DATA,
    isqimoChatClickFlag: state => state.isqimoChatClickFlag,
};

export default getters;
