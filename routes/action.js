var fs = require('fs');
var tmp_path;
var target_path;
var qs = require('querystring');
var path = require('path');
var data;
exports.getPost = function (req, res) {
  console.log(req.body.user);
  console.log(req.files);
  if(req.files.img.size > 1024) { //这个方式不是很好，因为会把数据上传到服务器才会获得files数据
    res.end('Too Bit Size!');
    return;
  }
  tmp_path =  req.files.img.path;
  target_path = './public/uploadData/' + req.files.img.name;

  console.log(tmp_path);
  req.on('data', function(raw){
    console.log('get - data'+ raw.length);
    data += raw; 
    }
   
  );
 
  //req.on('end', function(){
  console.log(path.resolve(__dirname,  '../' + tmp_path));
  //tmp_path = path.resolve(__dirname,  '../' + tmp_path);
  tmp_path='./' + tmp_path; //这个非常重要，必须要有./，这样fs才能找到
  console.log(tmp_path);
   path.exists(tmp_path, function(is){ console.log(is + '');});
  path.exists(tmp_path, function(exist){
    if(exist){
      fs.rename( tmp_path, target_path, function(err) {
        if(err) throw err;
      //  fs.unlink(tmp_path, function(err){
      //    if(err) throw err;
          res.send('File upload to:' + target_path); 
          console.log('File upload to' + target_path);
     //   });
      });
    }
  });
  //  });

  // res.render('action', {user: req.body.user, layout: false});
}

