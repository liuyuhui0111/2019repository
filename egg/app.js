'use strict';

class AppBootHook {
    constructor(app) {
      this.app = app;
    }
  
    configWillLoad() {
      // Ready to call configDidLoad,
      // Config, plugin files are referred,
      // this is the last chance to modify the config.
    }
  
    configDidLoad() {
      // Config, plugin files have been loaded.
    }
  
    async didLoad() {
      // All files have loaded, start plugin here.
    }
  
    async willReady() {
      // All plugins have started, can do some thing before app ready
    }
  
    async didReady() {
      // Worker is ready, can do some things
      // don't need to block the app boot.
      console.log('didReady============');
    }
  
    async serverDidReady() {
      // Server is listening.
      console.log('serverDidReady============');
      // const result = await this.app.curl('http://test.5ifapiao.com:8888/fatsapi/aosp-portal-web/product/getProductStatusByProductId?distributorId=25c05c1966e14404aeeab6b77009750c&type=6&productId=a2cc30f6552542ad8d22155f96adba30',{
      //   dataType: 'json',
      // })
    }
  
    async beforeClose() {
      // Do some thing before app close.
      console.log('beforeClose============');
    }
  }
  
  module.exports = AppBootHook;