
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes'),
  url = require('url'),
  fs = require('fs'); 
  
var sio = require('socket.io'); 
var app = module.exports = express.createServer();

//Express Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  // app.use(express.bodyParser());//默认上传目录在你的appdata/temp文件夹下
  app.use(express.bodyParser({uploadDir: './uploadtmp'}));//指定上传临时目录
  app.use(express.cookieParser());
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
app.get('/chat', function(req, res){
  //res.render('chat', {title: 'Chat-Room', layout: 'mylayout'});
  var realpath = __dirname + '/views/' + url.parse('no2chat.html').pathname;
  var txt = fs.readFileSync(realpath);
  res.end(txt);
});
app.get('/remote-chat', routes.chat);

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
/*
var mem = process.memoryUsage();
setInterval(function(){
  mem = process.memoryUsage();
  console.log("MEM:" + util.inspect(mem));
  console.log("RSS:" + (mem.rss/(1024*1024)));
}, 60000);
*/
var socket_listener = require('./socketio/listen').listener;
socket_listener(io);//用注入方式把io注给外部处理,达到分离
app.listen(80);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
