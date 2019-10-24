/* eslint-disable */
const getters = {
  token: state => state.token,
  curUserData: state => {
    if(state.curUserData.id){
      return state.curUserData
    }else if(window.sessionStorage.getItem('curUserData')){
      return JSON.parse(window.sessionStorage.getItem('curUserData'))
    }else{
      return {};
    }
  },
  
  curTargetUserData: state => state.curTargetUserData,
  curMessageIndex: state => state.curMessageIndex,
  curChangeUserData: state => state.curChangeUserData,
  meslist: state => state.meslist,
  userlist: state => state.userlist,
  imtoken: (state) => {
    return state.imtoken ? state.imtoken : window.sessionStorage.getItem('imtoken');
  },
  userId: (state) => {
    return state.userId ? state.userId : window.sessionStorage.getItem('userId');
  },
  curTargetId: (state) => {
    return state.curTargetId ? state.curTargetId : window.sessionStorage.getItem('curTargetId');
  },
  vuexShowMessage: state => state.vuexShowMessage,
};

export default getters;
