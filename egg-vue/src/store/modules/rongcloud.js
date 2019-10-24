/* eslint-disable */
/**
      * 聊天相关数据管理
      * 
*/
const state = {
    rongCloudData: {
        userData:{      //当前用户信息

        },
        targetList:{        //聊天对象信息  code:[]  咨询单id：对应聊天对象 单个或多个 
        },
        mesData:{           //聊天列表信息    code:[],        咨询单id:该咨询单下的聊天记录

        }
    },
};


// actions
const actions = {

};

// mutations
const mutations = {
    setRongCloudData(state,data){
        state.rongCloudData = data;
    },
    setRongCloudUser(state,data) {
        // 设置字段 替换
        state.rongCloudData.userData = {...state.rongCloudData.userData,...data};
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
};
