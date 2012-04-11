
/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
/*
 * 路由只能从一个地方获得数据，所以要包含其他路径，要在这里添加进来
 * 从这里exports出去是给外面的routes引用
 */
exports.user =  require('./user').user;
exports.action = require('./action').getPost;
exports.chat = require('./chat').chat;
