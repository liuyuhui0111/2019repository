'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  app.router.get('/querylist', app.controller.user.querylist);
  app.router.get('/getuser', app.controller.user.getuser);
  app.router.post('/adduser', app.controller.user.adduser);
  app.router.get('/deluser', app.controller.user.deluser);
  app.router.post('/updateuser', app.controller.user.updateuser);
  app.router.post('/upload', app.controller.user.upload);
  router.get('/', controller.home.render);
};
