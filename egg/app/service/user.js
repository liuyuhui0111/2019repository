'use strict';

const Service = require('egg').Service;
class UserService extends Service {
  // 默认不需要提供构造函数。
  // constructor(ctx) {
  //   super(ctx); 如果需要在构造函数做一些处理，一定要有这句话，才能保证后面 `this.ctx`的使用。
  //   // 就可以直接通过 this.ctx 获取 ctx 了
  //   // 还可以直接通过 this.app 获取 app 了
  // }
  async querylist() {
    // 查询用户列表
    /**  可以配置数据库查询条件
      where: {
        status: 'draft',
        author: ['author1', 'author2']
    },
    columns: ['author', 'title'],
    orders: [
        ['created_at', 'desc'],
        ['id', 'desc']
    ],
    limit: 10,
    offset: 0
    select * from emp inner join dep on emp.dep_id=dep.id;
    */
    // const result = await this.app.mysql.select('user', {
    //   orders: [
    //     [ 'id', 'desc' ],
    //   ],
    // });
    let SQL = 'select a.id,a.age,a.name,b.src from user a left join userimg b on a.id = b.uid ORDER BY a.id DESC;';
    const result = await this.app.mysql.query(SQL);
    return result;
  }

  async getuser(id) {
    // 获取一条数据
    const result = await this.app.mysql.get('user', { id });

    return result;
  }

  async adduser(user) {
    // 新增用户  name age  事务使用
    const conn = await this.app.mysql.beginTransaction(); // 初始化事务
    try {
      const userData = await conn.insert('user', {
        'name':user.name,
        'age':user.age,
      });  // 第一步操作
      const img = await conn.insert('userimg', {
        'uid':userData.insertId,
        'src':user.src
      });  // 第二步操作
      await conn.commit(); // 提交事务
      return img.affectedRows === 1 && userData.affectedRows === 1;
    } catch (err) {
      // error, rollback
      console.log(err)
      await conn.rollback(); // 一定记得捕获异常后回滚事务！！
      throw err;
    }
    
  }

  async deluser(id) {
    // 删除用户
    const conn = await this.app.mysql.beginTransaction(); // 初始化事务
    try {
      const userData = await conn.delete('user', { id });  // 第一步操作
      console.log(userData)
      const img = await conn.delete('userimg', {
        'uid':id
      });  // 第二步操作
      await conn.commit(); // 提交事务
      return img.affectedRows === 1 && userData.affectedRows === 1;
    } catch (err) {
      // error, rollback
      console.log(err)
      await conn.rollback(); // 一定记得捕获异常后回滚事务！！
      throw err;
    }
  }

  async updateuser(user) {
    // 修改用户
    const conn = await this.app.mysql.beginTransaction(); // 初始化事务
    try {
      const userData = await conn.update('user', {
        'name':user.name,
        'age':user.age,
      },{
        where:{
          id:user.id
        }
      });  // 第一步操作
      const img = await conn.update('userimg', {
        'src':user.src
      },{
        where:{
          uid:user.uid
        }
      });  // 第二步操作
      await conn.commit(); // 提交事务
      return img.affectedRows === 1 && userData.affectedRows === 1;
    } catch (err) {
      // error, rollback
      console.log(err)
      await conn.rollback(); // 一定记得捕获异常后回滚事务！！
      throw err;
    }
  }


}
module.exports = UserService;
