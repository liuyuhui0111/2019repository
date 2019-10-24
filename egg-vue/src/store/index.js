/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters'
import {getTokenFn,setTokenFn} from '@/assets/utils/util'
import rongcloud from './modules/rongcloud';

console.log(rongcloud)

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		token:getTokenFn() || '',		//token
		imtoken:'',		//imtoken 聊天token
		userId:'',
		curUserData:{},		//当前用户信息存储  用户id  用户名称 用户账户 imid等
		curTargetUserData:{},		//当前聊天对象信息存储  用户id  用户名称 用户账户 imid等
		curChangeUserData:{},		//当前转单对象信息存储  用户id  用户名称 用户账户 imid等
		mesListData:[],		//{id:xx,code:xx}	聊天记录对象 id:咨询单id code:咨询单code  user:当前用户信息  target:目标对象 list:聊天列表 group:群组信息// 
	},
	actions: {},
	mutations: {
		 setcurTargetUserData(state,data) {
	  	// 设置token  同步到cookie 有效期默认7天
	  	//如果token不存在 默认清空token
	  	console.log('设置咨询单id',data)
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
	    state.curUserData = JSON.parse(JSON.stringify(data));
	  },
	  setmesListData(state,data) {
	  	// 设置token  同步到cookie 有效期默认7天
	  	//如果token不存在 默认清空token
	    state.mesListData = data;
	    
	  },
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
	  setToken(state,token) {
	  	// 设置token  同步到cookie 有效期默认7天
	  	//如果token不存在 默认清空token
	  	setTokenFn(token);
	    state.token = token;
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
  modules:{
  	rongcloud,
  },
  getters
});
