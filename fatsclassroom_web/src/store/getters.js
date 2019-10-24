/* eslint-disable */
import { getUrlParam } from '@/assets/utils/util'
// 路由来源对照表
const routeMap = {
    'index0':'首页banner',
    'index1':'首页公开课',
    'index2':'大家都在学',
    'index3':'新鲜出炉',
    'index4':'推荐课程',
    'search0':'热门搜索',
    'search1':'在线课程推荐',
    'offline0':'在线训练营',
    'share':'分享',
}
const getters = {
    token: state => state.token,
    commonUserData: state => state.user.commonUserData,
    COMMON_COMP_DATA: state => state.COMMON_COMP_DATA,
    onlineNavListData: state => state.onlineNavListData,
    commonCenterData: state => state.center.commonCenterData,
    
    isShowLoading: state => state.isShowLoading,
    isqimoChatClickFlag: state => state.isqimoChatClickFlag,

    keepAliveComponetScrolls: state => state.keepAliveComponetScrolls,
    fromRoute: (state) => {
        // 如果路由里拼了来源 就用这个做来源 否则默认的
        if(getUrlParam('fromRoute')){
            let f = decodeURIComponent(getUrlParam('fromRoute'));
            return routeMap[f] || f;
        }else{
            return decodeURIComponent(state.fromRoute);
        }
    },
    getCurentComponetScrolls: state => (path) => {
    	//获取当前组件的滚动条位置
    	return state.keepAliveComponetScrolls[path] || 0 
    },		
};

export default getters;
