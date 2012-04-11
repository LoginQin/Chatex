
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes');
  //parseCookie = require('connect').utils.parseCookie,
  //MemoryStore = require('connect/lib/middleware/session/memory');
var sio = require('socket.io'); 
//    storeMemory = new MemoryStore({
//		reapInterval: 60000 * 10
//	});//session store

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  // app.use(express.bodyParser());//默认上传目录在你的appdata/temp文件夹下
  app.use(express.bodyParser({uploadDir: './uploadtmp'}));//指定上传临时目录
  app.use(express.cookieParser());
//  app.use(express.session({
//		secret: 'wyq',
//		store:storeMemory 
//  }));
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
app.get('/', routes.index);
app.get('/user/:id', routes.user);
app.post('/action', routes.action);
app.get('/chat', function(req, res){
  res.render('chat', {title: 'Chat-Room', layout: 'mylayout'});

});
function html_encode(str){   
  var s = "";   
  if (str.length == 0){ return "";}   
  s = str.replace(/&/g, "&amp;");   
  s = s.replace(/</g, "&lt;");   
  s = s.replace(/>/g, "&gt;");   
  s = s.replace(/ /g, "&nbsp;");   
  s = s.replace(/\'/g, "&#39;");   
  s = s.replace(/\"/g, "&quot;");   
    s = s.replace(/\n/g, "<br>");
  return s;   
} 
var util = require('util');
var mem = process.memoryUsage();
setInterval(function(){
  mem = process.memoryUsage();
  console.log("MEM:" + util.inspect(mem));
  console.log("RSS:" + (mem.rss/(1024*1024)));
}, 10000);

//
//Socket事件监听，必须放在app.js中监听，放在路由处理中会
//广播/发送重复
var onlines = [];
var onlinesocket = {};
var Group = {'group:default': {name:'NoChat'}}; //已注册的群
//io.settings.log = false;
io.enable('browser client gzip');
io.set('log level', 1);
//设置session
/*
io.configure(function(){
  io.set('authorization', function(handshakeData, callback){
   handshakeData.session = {lastAccess: handshakeData.issued};
    
    var connect_sid;
    try {
      // 通过客户端的cookie字符串来获取其session数据
      handshakeData.cookie = parseCookie(handshakeData.headers.cookie);
    connect_sid = handshakeData.cookie['connect.sid'];
    }catch(err){

    }
    if (connect_sid) {
      storeMemory.get(connect_sid, function(error, session){
        if (error) {
          // if we cannot grab a session, turn down the connection
          callback(error.message, false);
        } else {
          // save the session data and accept the connection
          handshakeData.session = session;
          callback(null, true);
        }
      });
    } else {
      //callback('nosession');
      callback(null,true);
    }
   callback(null,true);
  });
});
*/
io.sockets.on('connection', function(socket){
  var ClientInfo = {//每一个客户端的基本数据
    'name': '',
  'country':'',
  'gender': '',
  'IP_start':'',
  'userAgent':'',
  'Browser':'',
  'OS':'',
  'mobile':'',
  'mos':'',
  'mbrowser':'',
  'hostname':'',
  'href':'',
  'city':'',
  'province':'',
  'isp':'',
  'alone': 0,
  'socket':{}
  };
  if(!onlinesocket[socket.id]){
    ClientInfo.socket = socket;
    onlinesocket[socket.id] = ClientInfo;
  }

  //socket.broadcast.emit('connect');
  var getOnlineList = function(){
    var b = [],len = 0;
    for(var a in onlinesocket){
      //if(a == socket.id)
      b.push({'id': a,'info':onlinesocket[a].name +'-'+onlinesocket[a].city});
      len++;
    }
    return {'total': len, 'list': b};
  };
  socket.on('save data', function(data, fn){
    socket.set('nickname',data.name,function(){
      fn(true);
      for(var i in ClientInfo){
        if(i == 'socket') continue;
        onlinesocket[socket.id][i] = data[i] ? data[i] : '';
      }
      io.sockets.emit('update online list', getOnlineList());
    });
  });
  socket.on('disconnect', function(){
    delete onlinesocket[socket.id];
    io.sockets.emit('update online list', getOnlineList());
    socket.broadcast.emit('target disconnect', socket.id);
  });

  socket.on('add to online list', function(client){
    console.log(getOnlineList());
    /*
       onlinesocket[socket.id].name = client.name;
       onlinesocket[socket.id].city = client.city;
       */
    for(var i in ClientInfo){
      if(i == 'socket') continue;
      onlinesocket[socket.id][i] = client[i] ? client[i] : '';
    }
    //===
    io.sockets.emit('update online list', getOnlineList());
  });
  socket.on('public message', function(from, data){
    //  socket.get('nickname', function(err, name){
    //    console.log('chat message by', name ,'-' ,data);
    if(Group[from]){
      data['groupname'] = Group[from].name;
      data['sid'] = socket.id;
      socket.broadcast.emit('public message', from, data);
    }else {
      socket.emit('message error', 'The Group Is Not Exists, Your Message Has Lose.');
    }
    //  });
  });
  socket.on('private message', function(to, data){
    var target = onlinesocket[to];
    if(target){
      target.alone ? socket.emit('message error', 'The User Want To Be Alone. Your Message Won\'t Delivered ') :
    target.socket.emit('private message', socket.id, data);
    }else{
      socket.emit('message error', 'The user has offline, Your message has lose.');
    }
  });
  socket.on('get user info', function(t_id){
    var target;
    try {
      target = onlinesocket[t_id], result = {};
    }catch(err){

    }
    if(target){
      for(var i in target){
        if(i == 'socket') continue;
        result[i] = target[i];
      }
      socket.emit('get user info', result);
    }else{
      socket.emit('message error', 'USER Offline.');
    }
  });
  socket.on('Leave Me Alone', function(flag, fn){
    onlinesocket[socket.id]['alone'] = flag;
    fn(true);
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
