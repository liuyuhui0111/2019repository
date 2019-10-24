/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters'
import {getTokenFn,setTokenFn} from '@/assets/utils/util'

const modules = {
}


Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		token: getTokenFn() || '',		//token
		imtoken:'',		//imtoken 聊天token
		userId:'',
		curTargetId:'',
		curUserData:{},		//当前用户信息存储  用户id  用户名称 用户账户 imid等
		curTargetUserData:{},		//当前聊天对象信息存储  用户id  用户名称 用户账户 imid等
		curChangeUserData:{},		//当前转单对象信息存储  用户id  用户名称 用户账户 imid等
		meslist:{},		//聊天信息
		userlist:[],		//用户咨询单列表
		vuexShowMessage:false,		//全局控制是否显示聊天框
		curMessageIndex:0,
	},
	getters: {},
	actions: {},
	mutations: {
		setImToken(state,token) {
	  	// 设置token  同步到cookie 有效期默认7天
	  	//如果token不存在 默认清空token
	  	if(!token){
	  		window.sessionStorage.removeItem('imtoken')
	  	}else{
	  		window.sessionStorage.setItem('imtoken',token);
	  	}
	    state.imtoken = token;
	    
	  },
	  setcurMessageIndex(state,curMessageIndex) {
	    state.curMessageIndex = curMessageIndex;
	  },
	  setvuexShowMessage(state,data) {
	    state.vuexShowMessage = data;
	  },
	  setuserlist(state,data) {
	  	// 设置token  同步到cookie 有效期默认7天
	  	//如果token不存在 默认清空token
	    state.userlist = JSON.parse(JSON.stringify(data));
	  },
	  setmeslist(state,data) {
	  	// 设置token  同步到cookie 有效期默认7天
	  	//如果token不存在 默认清空token
	  	console.log(data);
	    state.meslist = JSON.parse(JSON.stringify(data));
	  },
	  setcurTargetUserData(state,data) {
	  	// 设置token  同步到cookie 有效期默认7天
	  	//如果token不存在 默认清空token
	    state.curTargetUserData = JSON.parse(JSON.stringify(data));
	  },
	  setcurChangeUserData(state,data) {
	  	// 设置token  同步到cookie 有效期默认7天
	  	//如果token不存在 默认清空token
	    state.curChangeUserData = JSON.parse(JSON.stringify(data));
	  },
	  setcurUserData(state,data) {
	  	// 设置token  同步到cookie 有效期默认7天
	  	//如果token不存在 默认清空token
	  	if(!data){
	  		window.sessionStorage.removeItem('curUserData')
	  	}else{
				window.sessionStorage.setItem('curUserData', JSON.stringify(data));
	  	}
	    state.curUserData = JSON.parse(JSON.stringify(data));
	  },
	  setToken(state,token) {
	  	// 设置token  同步到cookie 有效期默认7天
	  	//如果token不存在 默认清空token
	  	setTokenFn(token);
	    state.token = token;
	  },
	  setCurTargetId(state,id) {
	  	// 设置当前聊天的id
	    state.curTargetId = id;
	    if(!id){
	  		window.sessionStorage.removeItem('curTargetId')
	  	}else{
	  		window.sessionStorage.setItem('curTargetId',id);
	  	}
	  },
	  setUserId(state,userId) {
	  	state.userId = userId;
	  	if(!userId){
	  		window.sessionStorage.removeItem('userId')
	  	}else{
	  		window.sessionStorage.setItem('userId',userId);
	  	}
	  	
		},
	},
  modules,
  getters
});
