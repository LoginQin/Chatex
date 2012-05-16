/*
 * 聊天服务器，单服务器版本，不依赖Express做代理
 * 但是客户端核心文件必须想别的办法去加载
 * 可以使用Apache做代理
 *
 */ 
var sio = require('socket.io')
    , redis = require('redis')
    , listener = require('./socketio/listen').listener
    , io = sio.listen(3000);
listener(io);
