exports.listener = function(io){
  redis = require('redis'); //redis数据库操作;
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
  //var Master = [{masterid: 'master:12345', name:'chinesetiger', pw:'1234', NickName: '中国老虎', alone:0, gender:"Mr", sound:1, animate:1, city:'西雅图', online:false},
  //{masterid:'master:123456', name:'cc', pw:'123',NickName: 'KKKK', alone:0, gender:"Mr", sound:1, animate:1, city:'西雅图', online:false}];

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

    //保存到Redis数据库
    var saveToDB = function(key, obj, fn){
      var redisclient = redis.createClient();
      redisclient.on('error',function(err){ //监听错误信息
        console.log('Error' + err);
      });
      redisclient.auth(12345, function(err){ //如果有验证,要加入验证
        if(err){
          console.log("Auth Error:"+ err);
        }
      });
      redisclient.HMSET(key, obj, function(err, reply){
        console.log("Redis Save:"); 
        console.log(reply);
        redisclient.end();//注意无阻塞操作关闭数据库连接的地方
      });

    }
    socket.on('save data', function(data, fn){
      socket.set('nickname',data.name,function(){
        fn(true);
        for(var i in ClientSetting){
          if(i == 'socket') continue;
          onlinesocket[data.sessionid][i] = data[i] ? data[i] : '';
        }
        saveToDB(data.sessionid, {NickName: data.name, sound:data.sound, animate:data.animate, city:data.city, gender:data.gender});
        io.sockets.emit('update online list', getOnlineList());
      });
    });
    socket.on('disconnect', function(){
      var sessionid = SessionList[socket.id];
      console.log("User Leave:"+ sessionid)
      if(typeof sessionid == 'string' && sessionid.match(/master/i)){
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
    socket.broadcast.emit('target disconnect', sessionid);
    io.sockets.emit('update online list', getOnlineList());
    });

    var getMasterList = function(callback){
      var rclient = redis.createClient();
      rclient.sort('Masters', 'get', 'nickname:*', function(err, replay){
      });

    };
    var getMasterListFromDB = function(fn){
      var redisclient = redis.createClient();
      redisclient.auth(12345, function(err, reply){
        redisclient.sort('master:list', 'get', 'master:*->masterid','get','master:*->nickname','get', 'master:*->online', function(err, reply){
          var result = [];
          for(var i = 0; i < reply.length; ){
            result.push({masterid : reply[i], nickname:reply[i+1], online: parseInt(reply[i+2])});
            i += 3;
          };
          fn(result);
          redisclient.end();
        });
      });

    };
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

      /*
         callback([{masterid:'master:12345', nickname:'中国老虎', online:false },
         { masterid:'master:123456', nickname:'cc', online:false}]);//返回master列表
         */

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
      for(var i in ClientSetting){ //根据客户端信息,初始化当前socket数据
        if(i == 'socket') continue;
        onlinesocket[client.sessionid][i] = client[i] ? client[i] : '';
      }
      //===
      console.log(getOnlineList());
      console.log(SessionList);
      /*从数据库获得Master列表*/
      getMasterListFromDB(function(data){
        console.log(data);
        callback(data);
        io.sockets.emit('update online list', getOnlineList()); //通知所有人
      });
      //io.sockets.emit('update online list', getOnlineList()); //通知所有人
    });
    socket.on('public message', function(from, data, callback){
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
        try{
          callback(true);
        }catch(err){
          console.log(err); 
        }
      }else {
        try{
          callback(false);
        }catch(err){//not a func
          console.log(err);
        }
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
      var sessionid = SessionList[socket.id];    
      onlinesocket[sessionid]['alone'] = flag;
      fn(true);
    });

    socket.on('Master Sign In', function(data, fn){
      var sessionid = SessionList[socket.id]; //找到当前匹配的对话
      var redisclient = redis.createClient();
      redisclient.on('error',function(err){ //监听错误信息
        console.log('Error' + err);
      });
      redisclient.auth(12345, function(err){ //如果有验证,要加入验证
        if(err){
          console.log("Auth Error:"+ err);
        }
      });
      redisclient.GET(data.name + ':master:id', function(err, masterid){
        console.log(masterid);
        if(!masterid){
          fn(false);
          redisclient.end();
          return;
        }
        redisclient.HGETALL('master:' + masterid, function(err, master){
          console.log(master);
          if(err){
            console.log(err);
            return;
          }
          if(data.name == master.name && data.pw == master.pw){ 
            if(onlinesocket[master.masterid]){ //如果该用户id在列表中, 说明已经登陆过
              onlinesocket[master.masterid].socket.disconnect();//将原来的链接断开
            }
            SessionList[socket.id] = master.masterid; //才将当前对话提升为MasterId来存储 
            onlinesocket[master.masterid] = onlinesocket[sessionid]; //重新映射在线列表
            onlinesocket[master.masterid].name = master.nickname;
            onlinesocket[master.masterid].city = master.city;
            onlinesocket[master.masterid].sound = parseInt(master.sound); //注意Redis没有整型数据,要转
            onlinesocket[master.masterid].gender = master.gender;
            onlinesocket[master.masterid].animate = parseInt(master.animate);
            onlinesocket[master.masterid].alone = parseInt(master.alone);
            delete onlinesocket[sessionid];//删除原来的映射
            master.online = true; //
            io.sockets.emit('update online list', getOnlineList());//告诉所有人更新其在线列表
            fn(true, {masterid: master.masterid, nickname : master.nickname, alone: master.alone, gender: master.gender, sound: master.sound, animate: master.animate, city: master.city, MasterMsg: MasterMsg[master.masterid]});
            MasterMsg[master.masterid] ? delete MasterMsg[master.masterid] : 1;
            io.sockets.emit("target reconnect", master.masterid);
            redisclient.end();
            return;
          }
          fn(false);
          redisclient.end();
        }); 
      });
    });

  });
}
