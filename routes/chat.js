var nicknames = {};
var OnlineSocket = {};
var log = console.log;
var session_id = [];
exports.chat = function(req, res) {
  /*
     io.sockets.on('connection', function(socket){
  //  io.sockets.emit('this', {hello: _msgs});
  socket.on('msg', function(data){
  _msgs += data.msg +'\r\n';
  socket.broadcast.emit('msg', {hello: _msgs});
  console.log(data);
  });

  });
  */
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


  res.render('chat', {title: 'Chat-Room', layout: 'mylayout'});
};
