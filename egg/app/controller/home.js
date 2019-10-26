'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async render() {
    const ctx = this.ctx;
    await ctx.render('home.html', {
      user: {
        name: '测试',
        age:11,
      },
      title: '测试标题',
      shoplist:[
        {title:'苹果'},
        {title:'香蕉'},
        {title:'鸭梨'},
      ]
    });
  }
}

module.exports = HomeController;
