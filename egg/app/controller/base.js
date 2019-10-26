'use strict';

/**
      * BaseController
      * 基础Controller 后续统一继承它来开发
*/

// code 码
const SUCCESS_CODE = '0000';
const ERROR_CODE = '404';

const Controller = require('egg').Controller;

class BaseController extends Controller {
	success(data) {
    this.ctx.body = {
    	code:SUCCESS_CODE,
      success: true,
      data,
    };
    this.ctx.status = 200;
  }

  error(data) {
    this.ctx.body = {
    	code:ERROR_CODE,
      success: false,
      data,
    };
    this.ctx.status = 400;
  }

  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
}

module.exports = BaseController;