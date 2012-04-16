
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
}, 60000);

//
//Socket事件监听，必须放在app.js中监听，放在路由处理中会
//广播/发送重复
var onlines = [];
var onlinesocket = {};
var LeaveMsgLimit = 10, KeepOnlineMinute = 120*1000;
var Group = {'group:default': {name:'NoChat', UserList:[], Msgs:[]}}; //已注册的群
var SessionList = {};//socketid 与用户 sessionid 映射表
//io.settings.log = false;
io.enable('browser client gzip');
io.set('log level', 1);
var MasterMsg = {};
var Master = [{masterid: 'master:12345', name:'chinesetiger', pw:'1234', NickName: '中国老虎', alone:0, gender:"Mr", sound:1, animate:1, city:'西雅图', online:false},
      {masterid:'master:123456', name:'cc', pw:'123',NickName: 'KKKK', alone:0, gender:"Mr", sound:1, animate:1, city:'西雅图', online:false}];

io.sockets.on('connection', function(socket){
  var ClientSetting = {//每一个客户端的基本数据
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
  'alone': 0
  };
  var ClientInfo ={
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
  'leaveMessage' : [],
  'dropTimeId' : '',
  'socket': {}
  };

  /*
  if(!onlinesocket[socket.id]){
    ClientInfo.socket = socket;
    onlinesocket[socket.id] = ClientInfo;
  }
  */
  //socket.broadcast.emit('connect');
  var getOnlineList = function(){
    var b = [],len = 0;
    for(var a in onlinesocket){
      //if(a == socket.id)
      if(onlinesocket[a].dropTimeId) continue;
      b.push({'id': a,'nick':onlinesocket[a].name, 'city': onlinesocket[a].city});
      len++;
    }
    return {'total': len, 'list': b};
  };
  socket.on('save data', function(data, fn){
    socket.set('nickname',data.name,function(){
      fn(true);
      for(var i in ClientSetting){
        if(i == 'socket') continue;
        //onlinesocket[socket.id][i] = data[i] ? data[i] : '';
         onlinesocket[data.sessionid][i] = data[i] ? data[i] : '';
      }
      io.sockets.emit('update online list', getOnlineList());
    });
  });
  socket.on('disconnect', function(){
    var sessionid = SessionList[socket.id];
    console.log("User Leave:"+ sessionid)
    if(sessionid.match(/master/i)){
      delete SessionList[socket.id];
      delete onlinesocket[sessionid];
    }else{
      try{
        onlinesocket[sessionid]["dropTimeId"] = '';
        onlinesocket[sessionid]["dropTimeId"] = setTimeout(function(){
          delete onlinesocket[sessionid];
          delete SessionList[socket.id];
          console.log("delete offline:" + sessionid);
          console.log("New SessionList:");
          console.log(SessionList);
        }, KeepOnlineMinute); //2分钟没有连接上,自动销毁

      }catch(err){
        //同个浏览器打开多个页面的时候
        console.log("Disconnect:"+socket.id+"; SessionList:"+SessionList);
      }
    }
        io.sockets.emit('update online list', getOnlineList());
        socket.broadcast.emit('target disconnect', sessionid);
  });

  socket.on('add to online list', function(client, callback){ //暂时利用这条连接返回Master列表吧
    if(!SessionList[socket.id]) {
      SessionList[socket.id] = client.sessionid;//如果是第一次链接
    }

    if(!onlinesocket[client.sessionid]){
      ClientInfo.socket = socket;
      onlinesocket[client.sessionid] = ClientInfo;
    }else { 
      onlinesocket[client.sessionid].socket.disconnect();
      onlinesocket[client.sessionid].socket = socket;
    }
    callback([{masterid:'master:12345', nickname:'中国老虎', online:false },
      { masterid:'master:123456', nickname:'cc', online:false}]);//返回master列表

    for(var olderid in SessionList){
      if(SessionList[olderid] == client.sessionid){ //新的链接会产生新socketid,要重新映射    
        delete SessionList[olderid];
        SessionList[socket.id] = client.sessionid; //用新的socketid映射到用户的session
        /*存在client.sessionid的情况下产生新的socket,说明用户重新链接*/
        try{
          var timeoutid = onlinesocket[client.sessionid].dropTimeId; 
          clearTimeout(timeoutid); //清除自毁定时器
          onlinesocket[client.sessionid].dropTimeId = '';
          console.log("USER: "+client.sessionid+" - Reconnect By:"+ socket.id);
        }catch(err){
          console.log(err);
        }
        /*如果存在离线消息,发送离线消息*/
        var mlen = onlinesocket[client.sessionid].leaveMessage.length, msg,
            owner = onlinesocket[client.sessionid].socket;
        while(mlen > 0){
          msg = onlinesocket[client.sessionid].leaveMessage.shift();
          owner.emit('private message', msg.from , msg.data);//=========这里待解决效率问题
          mlen--;
        }
        socket.broadcast.emit("target reconnect", client.sessionid);
      }
    }
    //-----------------
    for(var i in ClientSetting){
      if(i == 'socket') continue;
      // onlinesocket[socket.id][i] = client[i] ? client[i] : '';
      onlinesocket[client.sessionid][i] = client[i] ? client[i] : '';
    }
    //===
    console.log(getOnlineList());
    console.log(SessionList);
    io.sockets.emit('update online list', getOnlineList());
  });
  socket.on('public message', function(from, data, callback){
    //  socket.get('nickname', function(err, name){
    if(Group[from]){ //如果是已注册的群
      data['groupname'] = Group[from].name;
      data['sid'] = SessionList[socket.id];//消息体还要标识是谁发送的
      if(Group[from].Msgs.length < 50){ //默认保存50条群消息,为后来的访客了解上下文
        Group[from].Msgs.push(data);
      }else {
        Group[from].Msgs.shift();
        Group[from].Msgs.push(data);
      }
      socket.broadcast.emit('public message', from, data); //群就没有消息到达否了
      callback(true);
    }else {
      callback(false);
      socket.emit('message error', 'The Group Is Not Exists, Your Message Has Lose.');
    }
  });
  socket.on('get group history msg', function(get_id, callback){
    if(Group[get_id]){
      callback(get_id, Group[get_id].Msgs);
    }

  });

  socket.on('private message', function(to, data, callback){
    var target = onlinesocket[to];
    var sessionid = SessionList[socket.id];
    if(to.match(/master/i) && !target){ //如果是向主人发送信息,并且不在线
      MasterMsg[to] ? MasterMsg[to].push({from:sessionid,data:data}) : MasterMsg[to] = [{from:sessionid,data:data}];
      socket.emit('message error', '该Master不在线,已为您保存消息,Master登录才能看见,如果需要主人联系您,建议您留下联系方式');
      callback(true);
      return;
    }
    if(target){
      if(target.dropTimeId && !to.match(/master/i)){
        onlinesocket[to]["leaveMessage"].length < LeaveMsgLimit ? onlinesocket[to]["leaveMessage"].push({from:sessionid, data: data}) : 1;
        socket.emit('message error', '用户离线, 服务器暂为您保存'+onlinesocket[to]["leaveMessage"].length+'/10 条离线消息, 10分钟内该用户需重新链接才能获取'); 
        callback(true);
      }
      if(target.alone){
        socket.emit('message error', 'The User Want To Be Alone. Your Message Won\'t Delivered ');
        callback(false);
      }else{
        target.socket.emit('private message', SessionList[socket.id], data, function(ok){
          callback(ok);
        });
      }
      // target.socket.emit('private message', socket.id, data);
    }else{
      callback(false);
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
    // for(var sessionid in onlinesocket){
    //    if(onlinesocket[sessionid].socket["id"] == socket.id){
    var sessionid = SessionList[socket.id];    
    onlinesocket[sessionid]['alone'] = flag;
    //    }
    //  }
    // onlinesocket[socket.id]['alone'] = flag;
    fn(true);
  });

  socket.on('Master Sign In', function(data, fn){
    var master;
    var sessionid = SessionList[socket.id]; //找到当前匹配的对话
    for(var i = 0; i < Master.length; i++){
      master = Master[i];
      if(data.name == master.name && data.pw == master.pw){ 
        if(onlinesocket[master.masterid]){ //如果该用户id在列表中, 说明已经登陆过
          onlinesocket[master.masterid].socket.disconnect();//将原来的链接断开
        }
        SessionList[socket.id] = master.masterid; //才将当前对话提升为MasterId来存储 
        onlinesocket[master.masterid] = onlinesocket[sessionid]; //重新映射在线列表
        onlinesocket[master.masterid].name = master.NickName;
        onlinesocket[master.masterid].city = master.city;
        onlinesocket[master.masterid].sound = master.sound;
        onlinesocket[master.masterid].gender = master.gender;
        onlinesocket[master.masterid].animate = master.animate;
        onlinesocket[master.masterid].alone = master.alone;
        delete onlinesocket[sessionid];//删除原来的映射
        master.online = true; //
        io.sockets.emit('update online list', getOnlineList());//告诉所有人更新其在线列表
        fn(true, {masterid: master.masterid, NickName : master.NickName, alone: master.alone, gender: master.gender, sound: master.sound, animate: master.animate, city: master.city, MasterMsg: MasterMsg[master.masterid]});
        MasterMsg[master.masterid] ? delete MasterMsg[master.masterid] : 1;
        io.sockets.emit("target reconnect", master.masterid);
        return;
      }
    }
    fn(false);
  });
  });

  app.listen(3000);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);