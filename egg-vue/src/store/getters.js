/* eslint-disable */
const getters = {
    token: state => state.token,
    curUserData: state => state.curUserData,
    curTargetUserData: state => state.curTargetUserData,
    curChangeUserData: state => state.curChangeUserData,
    
    imtoken: (state) => {
      return state.imtoken ? state.imtoken : window.sessionStorage.getItem('imtoken');
    },
    userId: (state) => {
      return state.userId ? state.userId : window.sessionStorage.getItem('userId');
    },
    mesListData:(state) => {
      return state.mesListData;
    },
    rongCloudData:state => state.rongcloud.rongCloudData,
    // getDemoTitle: state => state.demo.title,
};

export default getters;
