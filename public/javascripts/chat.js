var socket = io.connect('http://localhost');
socket.on('connect', function(){
  message('System', 'Conect!');
});
socket.on('announcement', function(msg){
  $('#lines').append($('<p>').append($('<em>').text(msg)));
});
socket.on('nicknames', function(nicknames){
  $('#nicknames').empty().append($('<span>Online:<span/>'));
  for(var i in nicknames){
   $('#nicknames').append($('<b />').text(nicknames[i])); 
  }
});
socket.on('public message', message);
socket.on('reconnect', function(){
  message('System', 'Reconnected to the server');
});
/*
socket.on('msg', function(data){
  console.log(data);
  $('#message_txt').val(data.hello);
});
*/
function message(from, msg){
  $('#lines').append($('<p>').append($('<b>').text(from), msg));
  $('#message').scrollTop(10000);
}
$(function(){

  $('#set_name').submit( function(){ 
    var nick = $('#nickname').val();
    socket.emit('nickname', nick, function(set){
      if(set){
        alert('nick name set!');
      }
    });
    return false;
  });
  $('#message_form').submit(function(){
    emitData();
    return false;
  });

})


function emitData(){
  var data = $('#talk').val();
  $('#talk').val('');
 // message('I say:', data);
  if(data) socket.emit('public message', data, function(ok){
    if(ok) message('I say:', data);
  });
}


