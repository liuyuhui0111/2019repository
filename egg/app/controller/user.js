'use strict';

const Controller = require('./base');
const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');


const validateRule = {
  name:{type:'string',min:1,max:10},
  age:{type:'number',min:1,max:99},
}

class UserController extends Controller {
  async querylist() {
    // 多表查询
    const { ctx } = this;
    const data = await ctx.service.user.querylist();
    this.success(data);
  }

  async getuser() {
    const { ctx } = this;
    const data = await ctx.service.user.getuser(ctx.query.id);
    this.success(data);
  }


  async adduser() {
    const { ctx } = this;
    try{
      ctx.validate(validateRule)
    }catch(err){
      ctx.logger.warn(err.errors);
      this.error(err);
      return;
    }
    const data = await ctx.service.user.adduser(ctx.request.body);
    this.success(data);
  }


  async deluser() {
    const { ctx } = this;
    
    const data = await ctx.service.user.deluser(ctx.query.id);
    this.success(data);
  }


  async updateuser() {
    const { ctx } = this;
    try{
      ctx.validate(validateRule)
    }catch(err){
      ctx.logger.warn(err.errors);
      this.error(err);
      return;
    }
    const data = await ctx.service.user.updateuser(ctx.request.body);
    this.success(data);
  }

  async upload(){
    const { ctx } = this;
    // const file = ctx.request.files[0];
    // 文件流上传
    const stream = await this.ctx.getFileStream();
    const filename = path.basename(stream.filename);
    const target = path.join(this.config.baseDir, 'app/public', filename);
    const writeStream = fs.createWriteStream(target);
    
    await pump(stream, writeStream);
    
    this.success({ src: '/public/' + filename });
  }


}
module.exports = UserController;
