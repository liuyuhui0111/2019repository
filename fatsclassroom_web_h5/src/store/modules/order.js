/* eslint-disable */
// initial state
// shape: [{ id, quantity }]
const state = {
    vuexInvoiceData: null,
    vuexInvoiceTitle:'',
    orderData:{},
};


// actions
const actions = {

};

// mutations
const mutations = {
    setVuexInvoiceData(state, data) {
        window.localStorage.setItem('vuexInvoiceData',JSON.stringify(data));
        state.vuexInvoiceData = data;
    },
    setvuexInvoiceTitle(state, title) {
        state.vuexInvoiceTitle = title
    },
    setOrderData(state, data) {
        window.sessionStorage.setItem('orderData',JSON.stringify(data))
        state.orderData = JSON.parse(JSON.stringify(data));
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
};
