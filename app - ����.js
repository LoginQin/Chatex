
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
var sio = require('socket.io');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
 // app.use(express.bodyParser());//默认上传目录在你的appdata/temp文件夹下
  app.use(express.bodyParser({uploadDir: './uploadtmp'}));//指定上传临时目录
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
var io = sio.listen(app);

// Routes
var OnlineSocket = {};
var log = console.log;
var session_id = []
app.get('/', routes.index);
app.get('/user/:id', routes.user);
app.post('/action', routes.action);
io.sockets.on('connection', function(socket){
  log('session:', socket.id);
  session_id.push(socket.id);
  OnlineSocket[socket.id] = socket;
  log('Online Peple:'+ OnlineSocket.length);
  socket.broadcast.emit('connection');
  socket.on('nickname', function(name){
    socket.set('nickname',name,function(){
      socket.emit('ready');
    });
  });
  var broadcast = function(data) {
    var num = 0;
    delete OnlineSocket[socket.id];
    for(var i in OnlineSocket){
      OnlineSocket[i].emit('public message', data);
      num++;
    }
    log('Socket Num:'+num);
    OnlineSocket[socket.id] = socket;
  }
  var i = session_id[0];
  log('target:' + i);
  var target = OnlineSocket[i];
  socket.on('public message', function(data, fn){
    socket.get('nickname', function(err, name){
      console.log('chat message by', name ,'-' ,data);
      //  socket.broadcast.emit('public message',data);
      //  broadcast(data);
      target.emit('public message', data);
    }) 
    fn(true);
  })


});

app.get('/chat', function(req, res){


  res.render('chat', {title: 'Chat-Room', layout: 'mylayout'});

});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
