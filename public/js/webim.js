(function(){ 
  window.client_ip_info = remote_ip_info;
})()
jQuery.noConflict();
(function($){
$(function(){
  /*Cookie*/
	var addCookie = function(name, value, expireHours){
	  var cookieString = name+"="+escape(value);
	  if(expireHours > 0){
		var date = new Date();
		data.setTime(date.getTime + expireHours * 3600 * 1000);
		cookieString = cookieString + "; expires=" + date.toGMTString();
	  }
	  document.cookie = cookieString;
	};
	
	var addCookies = function(obj, expireHours){
	  if(typeof obj != "object") return;
	  for(var key in obj){
		addCookie(key, obj[key]);
	  }
	  if(expireHours > 0){
		var date = new Date();
		date.setTime(date.getTime + expireHours * 3600 * 1000);
		document.cookie  +=  "; expires=" + date.toGMTString();
	  }
	};

	var ParseCookie = function(){
	  var strCookie = document.cookie;
	  var arrCookie = strCookie.split("; "), arr, cookieObject = {};
	  for(var i = 0; i < arrCookie.length; i++){
		arr = arrCookie[i].split("=");
		cookieObject[arr[0]] = unescape(arr[1]);
	  }
	  return cookieObject;
	}
	
	var getCookie = function(name){
	  var strCookie = document.cookie;
	  var arrCookie = strCookie.split("; "), arr;
	  for(var i = 0 ; i < strCookie.length; i++){
		arr = arrCookie[i].split("=");
		if(arr[0] == name) return unescape(arr[1]);
	  }
	  return "";
	}
	var deleteCookie = function(name){
	  var date = new Date();
	  date.setTime(date.getTime() - 10000000);
	  document.cookie = name + "=v; expires="+date.toGMTString();
	};
	window.deleteCookies = function(obj){
			for(var name in obj){
				deleteCookie(name);
			}
		};
  var Cookie_c = ParseCookie();
  var C = {};//config
  var expiresHoures = 24 * 30; 
   var BrowserInfo = function(){
		var browser = window.navigator.userAgent;
		this.userAgent = browser;
		var ie = browser.match(/MSIE\s\w+.\w+/i),
		firefox = browser.match(/firefox\/\w+.\w+/i),
		chrome = browser.match(/chrome\/\w+.\w+/i),
		opera = browser.match(/opera\/\w+/i),
		windownt = browser.match(/windows nt \w+.\w+/i),
		android = browser.match(/android/i),
		iphone = browser.match(/iphone/i),
		ipad = browser.match(/ipad/i),
		ucweb = browser.match(/ucweb/i),
		linux = browser.match(/linux/i),
		mobile = browser.match(/mobile/i),
		safari = browser.match(/safari\/\w+/i),
		mac = browser.match(/mac os/i);
			this.OS = mac || windownt || linux || ': )';
			this.browser = firefox || chrome || ie || opera || ': )';
			if(safari && !chrome){
			  this.browser = safari || ': )';
			}
			if(mobile){
			  this.mobile = mobile;
			  this.mos = iphone || ipad || android || ': )';
			  this.mbrowser = ucweb || safari || opera || android || ': )';
			}else {
				this.mobile = '-';
				this.mos = '-';
				this.mbrowser = '-';
			}  
	   
	};
  if(!Cookie_c.hostname){
	  C["name"] = '_';
	  C["gender"] = "Miss";
	  C["sound"] = 1;
	  C["animate"] = 1;
	  C["ctrlkey"] = 1;//need CtrlKey to Send
	  if(client_ip_info){
		C["IP_start"] = client_ip_info.start;
		C["country"] = client_ip_info.country;
		C["province"] = client_ip_info.province;
		C["city"] = client_ip_info.city;
		C["isp"] = client_ip_info.isp;
	  }
	  var binfo = new BrowserInfo();
	  C["userAgent"] = binfo.userAgent;
	  C["Browser"] = binfo.browser ? binfo.browser[0]: binfo.browser ;
	  C["OS"] = binfo.OS ? binfo.OS[0] : binfo.OS;
	  C["mobile"] = binfo.mobile ? binfo.mobile[0] : "";
	  C["mos"] = binfo.mos ? binfo.mos[0] : '-';
	  C["mbrowser"] = binfo.mbrowser ? binfo.mbrowser[0] : "";
	  C["hostname"] = window.location.hostname;
	  C["href"] = window.location.href;
	  C["alone"] = 0; //不接收信息
	  C.name = C.Browser;
	  addCookies(C, 24*30);
	  addCookie("name", C.name);
  }else {
  	C = Cookie_c; 
	C.alone = C.alone == "1" ? 1 : 0; //cookie中的数字被转为字符串,要改回来
	C.animate = C.animate == "1" ? 1 : 0;
	C.sound = C.sound == "1" ? 1 : 0;
	C.ctrlkey = C.ctrlkey == "1" ? 1 : 0;
  }
  var WebSiteName = $('title').text();
  $("#IM_setname").val(C.name);
  $("#IM_setcity").val(C.city);
  var Tarea = $("#IM_ChatBox .IM_UserTextarea");
  var currlen = 0; //当前文字长度
  var LIMITLEN = 300;//发送长度上限
  var speed = C.animate ? 200 : 0;
  var HOST = "http://localhost"
  var PORT = 3000;
  var HOSTPATH = HOST+":"+PORT+'/';
  var AccessGroup = {};//允许接收消息的群
  var WebIM = $("#WebIM");
  /*给目标对象添加事件*/
  function addEvent(elm, evType, fn, useCapture) {
	if (elm.addEventListener) {
		elm.addEventListener(evType, fn, useCapture);//DOM2.0
		return true;
	} else if (elm.attachEvent) {
		var r = elm.attachEvent('on' + evType, fn);//IE5+
		return r;
	}else {
		elm['on' + evType] = fn;//DOM 0
	}
  }
  var USER_UNFOCUS = 0;
  addEvent(window, 'blur', function(){USER_UNFOCUS = 1;}, false);

  var target_id = ''; //当前聊天对象id;
  var _MsgWin = $('div[winid="' + target_id + '"]');
  /*显示系统消息*/
  var SysBar = $("#IM_SysMsgBar"), 
  UserID,
  UnCheckedMsg = {} , //未处理信息数
  MiniBox = $("#IM_MiniBox"),
  MainPanel = $("#IM_MainPanel"); //主面板
  NoticeIMG = $("#IM_NoticeIMG"); //MiniBox上的通知图片
  CHATBOXSHOW = false; //聊天窗口是否显示
  var SysMsg = function(){
    var _left, _top, _width;
	this.color  = "#000";
	this.show = function(msg, time, where){
		if(!SHOW_MAINPANEL && !CHATBOXSHOW) return;
		if(!CHATBOXSHOW || where){
			_left = MainBox[0].offsetLeft + 20;
			_top = 300;
			_width = MainBox[0].offsetWidth - 50;
		
		}else{
			_left = ChatBox[0].offsetLeft + 120;
			_top = ChatBox[0].offsetTop + 250;
			_width = ChatBox[0].offsetWidth - 150;
		}
		SysBar.css({left: _left+'px', top: _top+'px', width: _width+'px', color: this.color});
		SysBar.children('span').text(msg);
		SysBar.fadeIn(600, function(){
			if('stay' == time ) return;
			setTimeout(function(){
			  SysBar.fadeOut(600);
			}, time);
		  });
	};
  };
  var _SysMsg = new SysMsg();
  /*初始化设置*/
  var initSetting = function(){
		$("#IM_setname").val(C.name);
		$("#IM_setcity").val(C.city);
		$("#IM_nickname").text(C.name);
		var status = $("#IM_status");
		status.removeClass();
		if(C.alone){
			status.addClass("IM_alone");
			status.text("Alone");
			status.attr("title", "当前不接收任何消息");
		} else {
			status.addClass("IM_online");
			status.text("Online");
			status.attr("title", "当前为接收消息状态");
		}
		var _setOp = function(obj, Config, active_set){
			obj.removeClass();
			if(Config == active_set){
				obj[0].className = "IM_active";
				obj[1].className = "IM_unactive";
			}else {
				obj[1].className = "IM_active";
				obj[0].className = "IM_unactive";
			}
		}
		_setOp($("#IM_OP_Gender span"), C.gender, "Mr");
		_setOp($("#IM_OP_Sound span"), C.sound, 1);
		_setOp($("#IM_OP_Animation span"), C.animate, 1);
		_setOp($(".IM_SendTypeOption span"), C.ctrlkey, 0);
  };
  initSetting();
  /*连接通知*/
  var showOnline = function(){
  	NoticeIMG.removeClass();
	NoticeIMG.addClass("IM_IMG-online");
	NoticeIMG.text(': )');
	MiniBox.children("span").text("chat");
	$("#IM_nickname").css("color", "#43B1FF");
  };
  /*掉线通知*/
  var showOffline = function(){
  	NoticeIMG.removeClass();
	NoticeIMG.addClass("IM_IMG-offline");
	NoticeIMG.text(';-(');
	MiniBox.children("span").text("Connecting");
	$("#IM_nickname").css("color", "#ccc");
	_SysMsg.color = "#f00";
	if(UserID.match(/master/)){
		//如果是Master
		$('.IM_MasterSignOut').remove();
		$('#IM_Master ul').before('<a class="IM_MasterSignIN" href="javascript:void(0)">登 录</a>');
		$('#IM_Master li').removeClass('IM_MasterOnline');
		$('#IM_Master li').addClass('IM_MasterOffline');
	}
	_SysMsg.show('-=当前与服务器断开=-', 'stay');
  };
  /*分类动画*/
  var categoryAnimation = function (m, ml){
    m[0].onmouseover = function(){
      if(ml[0].style.display != "none"){
       m[0].style.backgroundImage="url("+HOSTPATH+"/theme/blue/images/slide_up.png)";
     }else{
       m[0].style.backgroundImage="url("+HOSTPATH+"/theme/blue/images/slide_down.png)";
     }
    };
    m[0].onmouseout = function(){
      m[0].style.backgroundImage="";
    };
    m.click(function(){
      if(ml[0].style.display != "none"){
        ml.slideUp(speed, function(){
          m[0].style.backgroundImage="url("+HOSTPATH+"/theme/blue/images/slide_down.png)";
	
        });
      }else {
        ml.slideDown(speed, function(){
          m[0].style.backgroundImage="url("+HOSTPATH+"/theme/blue/images/slide_up.png)";
          ScrollToView(ml);	
        });
      }
    });
	
  };
  var m = $("#IM_Master .IM_category"),
      ml = $("#IM_Master ul");
  categoryAnimation(m, ml);
 // var rc =  $("#IM_Recently .IM_category"),
 //     rl =  $("#IM_Recently ul");
 // categoryAnimation(rc, rl);
  var wu = $("#IM_WithU .IM_category"), 
      wl = $("#IM_WithU ul");
  categoryAnimation(wu, wl);
//  var gc = $("#IM_group_person .IM_category"),
 //     gl = $("#IM_group_person ul");
 // categoryAnimation(gc, gl);

  /*按钮切换页面*/
  var SettingBox = $("#IM_SettingBox"),
      MainBox = $("#IM_MainBox"),
      GroupBox = $("#IM_GroupBox");
  var m_speed ;
  $(".IM_home").click(function(){
    m_speed = C.animate ? "medium" : 0;
    GroupBox.fadeOut(m_speed, function(){
      MainBox[0].style.zIndex = 10000;
      GroupBox[0].style.zIndex = 100;
      SettingBox[0].style.display = "none";
      GroupBox[0].style.display="";
    });

  });
  $("#IM_group").click(function(){
    m_speed = C.animate ? "medium" : 0;
    MainBox.fadeOut(m_speed, function(){
      GroupBox[0].style.zIndex = 10000;
      MainBox[0].style.zIndex = 100;
      SettingBox[0].style.display = "none";
      MainBox[0].style.display="";
    })
  });

  /*Setting Box Animate*/
  var _left, back_to;
  $("div[class='IM_setting']").click(function(){//IE6 好像不支持.class
	_left = MainBox[0].offsetLeft;
    back_to = _left + MainBox[0].clientWidth ;
    if(C.animate){
      SettingBox[0].style.display = "block";
      SettingBox.animate({left:_left , width:219}, speed);
    }else {
      SettingBox[0].style.display = "block";
      SettingBox[0].style.left = _left +"px";
      SettingBox[0].style.width = 219 +"px";
    }
  });
  $("div[class='IM_btn_back']").click(function(){
    /*=====*/	
    if(C.animate){
      SettingBox.animate({left:back_to, width:0}, speed, function(){
        SettingBox[0].style.display = "none";
      })								 
    }else {
      SettingBox[0].style.display = "none";
      SettingBox[0].style.left = back_to +"px";
      SettingBox[0].style.width = 0 +"px";
    }
  });

  /* Status*/
  var OnlineStatus = $("#IM_status");
  var leaveMeAlone = function(flag){
	 C.alone = flag;
  	 socket.emit('Leave Me Alone', flag, function(ok){
	 	if(ok){
			_SysMsg.color = flag ? "#f90" : "#0c0";
			flag ?  _SysMsg.show("\"Alone\" means to Not Get Any Message", 3000, 'mainbox' ) 
			:  _SysMsg.show(" Get Message Status ", 3000, 'mainbox');
		}
	 });
  };
  var updateStatus = function(){
    OnlineStatus.removeClass();
    OnlineStatus.toggleClass(function(){
      if(OnlineStatus.text() == "Online"){
        return "IM_online";
      }else {
        return "IM_alone";
      }								 
    });
  };
  updateStatus();
  OnlineStatus.click(function(){
  	if($(this).text() == "Online"){
		$(this).text("Alone");
		$(this).attr("title", "当前不接受任何消息")
		C.alone = 1;
	}else {
		$(this).text("Online");
		$(this).attr("title", "当前为接收消息状态")
		C.alone = 0;
	}
	addCookie("alone", C.alone);
	leaveMeAlone(C.alone);
	updateStatus();
  });

  /*SingleSet Option*/
  var singleSelect = function(option){
    option.click(function(){
      option.removeClass();
      option.toggleClass("IM_unactive");
      $(this).removeClass();
      $(this).toggleClass("IM_active");
    });
  };
  singleSelect($("#IM_OP_Gender span"));
  singleSelect($("#IM_OP_Sound span"));
  singleSelect($("#IM_OP_Animation span"));
  singleSelect($("#IM_ChatBox .IM_SendTypeOption span"));
  /*滚动到可视区域*/
  var ScrollToView = function(ob){
    var parent = ob[0].parentNode,
        gp =  parent.parentNode,
        scrolled = gp.scrollTop,
        view = parent.parentNode.clientHeight / 2,
        top = parent.offsetTop - gp.scrollTop - 63,
        tid;
    if(top >= view){
      if(C.animate){
        tid = setInterval(function(){
          var ok = (gp.scrollTop < gp.scrollHeight - parent.parentNode.clientHeight ) && (gp.scrollTop < scrolled - 20 + top);
          if(ok) {
            gp.scrollTop = gp.scrollTop + 40;
          }else {
            clearInterval(tid);
          }
        }, 20);
      }else {
        gp.scrollTop = gp.scrollTop + top;
      }
    }else {
      if(C.animate){
        tid = setInterval(function(){
          var ok = gp.scrollTop > 0 && (gp.scrollTop < scrolled + top);
          if(ok){
            gp.scrollTop = gp.scrollTop - 40;
          } else { 
            clearInterval(tid);
          }
        }, 20);
      }else{
        gp.scrollTop = gp.scrollTop - top;
      }
    }

  };
  /*保存*/
  $(".IM_btn_save").click(function(){
    C.gender = $("#IM_OP_Gender .IM_active").text();
    C.sound = $("#IM_OP_Sound .IM_active").text() == "ON" ? 1 : 0;
    C.animate = $("#IM_OP_Animation .IM_active").text() == "ON" ? 1 : 0;
    C.name = $("#IM_setname").val() ? $("#IM_setname").val() : '_';
	C.city = $("#IM_setcity").val() ? $("#IM_setcity").val() : C.city;
	$("#IM_nickname").text(C.name);
    speed = C.animate ? 200 : 0;
    saveToServer(C);
	C.sessionid.match(/master/i) ? ' ': addCookies(C); //如果是master,不保存cookie
  });
  $("#IM_ChatBox .IM_SendTypeOption").click(function(ev){
    var event = ev || window.event;
    C.ctrlkey = $("#IM_ChatBox .IM_SendTypeOption .IM_active").attr("value") == "Enter" ? 0 : 1;
	addCookie("ctrlkey", C.ctrlkey);
  });

  /*统计字长*/
  var BtnSend = $("#IM_ChatBox .IM_btn_Send");
  var updateSendDataLen = function(){
    var text = Tarea.val();
    currlen = 0;
    for(var i = 0 ; i < text.length; i++){
      if(text.charCodeAt(i) > 256){
        currlen+=2;
      } else {
        currlen+=1;
      }		
    }
    var shownum = Math.ceil(currlen/2);
    if(currlen > 0) {
      BtnSend.html(shownum + "<em style='font-size:12px'>/"+LIMITLEN+"<em>");
    } else {
      BtnSend.text("Send");
    }
    if(shownum > LIMITLEN) {
      BtnSend[0].style.background="#f00";
    //  BtnSend[0].style.border="1px solid #000";
      BtnSend.html(shownum - LIMITLEN + "<em style='font-size:12px'> over</em>");
    }
    else {
      BtnSend[0].style.background="#43B1FF";
    //  BtnSend[0].style.border="1px solid #2194d0";
    }
    currlen = shownum;
    delete shownum;
    $("#IM_ChatBox .IM_TB-fontList").blur();
  };

  /*===Tab及自动缩进*/
  function insertAtCursor(obj, txt) {
    obj.focus();
    //IE support
    if (document.selection) {
      sel = document.selection.createRange();
      sel.text = txt;
    }
    //MOZILLA/NETSCAPE support
    else {
      var startPos = obj.selectionStart, 
        scrollTop = obj.scrollTop,
                  endPos = obj.selectionEnd;
      obj.value = obj.value.substring(0, startPos) + txt + obj.value.substring(endPos, obj.value.length);
      startPos += txt.length;
      obj.setSelectionRange(startPos, startPos);
      obj.scrollTop = scrollTop;
    }
  }
  function getCaretPos(ctrl) {
    var caretPos = 0;
    if (document.selection) {
      // IE Support
      var range = document.selection.createRange();
      var stored_range = range.duplicate();
      // Select all text
      stored_range.moveToElementText( ctrl );
      stored_range.setEndPoint( 'EndToEnd', range );
      // Now we can calculate start and end points
      ctrl.selectionStart = stored_range.text.length - range.text.length;
      ctrl.selectionEnd = ctrl.selectionStart + range.text.length;
      caretPos = ctrl.selectionStart;
    } else if (ctrl.selectionStart || ctrl.selectionStart == '0'){
      // Firefox support
      caretPos = ctrl.selectionStart;
    }
    return (caretPos);
  }

  function getCurrentLineBlanks(obj) {
    var pos = getCaretPos(obj), str = obj.value;
    var i = pos-2, blanks = "";
    if(document.selection){
      if(str.charAt(i+3) != '\n'){ 
        return blanks;	//IE 回车插入\r\n
      }
    }
    else {
      if (str.charAt(i+1) != '\n'){
        return blanks;//判断最后一个是否是回车，在中文输入法中，有时候用回车输入英文，所以不一定会添加\n
      }
    }
    while (i>=0) {
      if (str.charAt(i) == '\n'){ break;}
      i--;
    }
    i++;
    while (i < str.length) {
      var c = str.charAt(i);
      if (c == ' ' || c == '\t'){
        blanks += c;
      }else{
        break;
      }
      i++;
    }
    return blanks;
  }
  /*Send Message Enter*/
  Tarea.keydown(function(event){
    var ev = event || window.event;
    if(ev.keyCode == 9) { //tab
      insertAtCursor(Tarea[0], '    ');
      return false;
    }
    if(ev.keyCode == 13 ){//send message
      if(C.ctrlkey){  	  
        if(ev.ctrlKey){
          updateSendDataLen();
          addMessageToWin();
        }else {
          return true;
        }
      }else if(!C.ctrlkey && ev.ctrlKey){ //不需要Ctrl却按下了
	      document.selection ? insertAtCursor(Tarea[0], '\r\n ') : insertAtCursor(Tarea[0], '\n');

      }else{
	  	updateSendDataLen();
        addMessageToWin();
	  }
      return false;
    }
  }).keyup(function(event){
    var ev = event || window.event;
    if(ev.keyCode == 13){
      last_blanks = getCurrentLineBlanks(Tarea[0]); 
      insertAtCursor(Tarea[0], last_blanks);
    }
    setTimeout(updateSendDataLen, 300);//对于输入法，可以捕捉keydown，文字输入后才产生keyup，所以是在keyup的时候检测
  });

  Tarea[0].onpaste = function(){
    setTimeout(updateSendDataLen, 300);
  };
  Tarea.focus(updateSendDataLen);
  /*按发送按钮发送*/
  BtnSend[0].onclick = function(){
    addMessageToWin();
	this.blur();
  };

  /*Hover to show the Send Type Options*/
  var t, SOption = $("#IM_ChatBox .IM_SendTypeOption");
  BtnSend.hover(function(){
    SOption.animate({opacity: 1}, speed);
    t = BtnSend.html();
    BtnSend.text("Send");
  } ,function(){ 
    SOption.animate({opacity : 0.5},0);
    BtnSend.html(t);
  });  
  SOption.hover(function(){
    SOption.animate({opacity:1},0);
  }, function(){
    SOption.animate({opacity:0.5},0);
  });
  /*Send Prompt*/
  var SendPrompt = $('<span class="IM_SendPrompt">在这里输入信息...</span>');
  $('.IM_btn_Send').before(SendPrompt);
  var showSendPrompt = function(){
	 SendPrompt.show();
  };
  var hideSendPrompt = function(){
	SendPrompt.fadeOut(speed);
  };
  SendPrompt.click(function(ev){ //这里的Click事件JQuery封装了统一的接口，可以不用window.event
	ev ? ev.stopPropagation() : window.event.cancelBubble = true;
	Tarea.focus();
  });
  addEvent(Tarea[0], 'focus', function(){
  	hideSendPrompt();
  }, false);

  addEvent(Tarea[0], 'blur', function(){
     if(currlen != 0) return;
     showSendPrompt();
  }, false);

  /*字体大小选择*/
  var fOption = $("#IM_ChatBox .IM_TB-fontOption"),
      fList = $("#IM_ChatBox .IM_TB-fontList"); 
  var fListShow = false;
  var fOptionOut = function(){
    if(!fListShow){
      fOption[0].style.background = "#fff";
      fOption[0].style.color = "#999";
    }
  },
      fOptionIn = function(){
        fOption[0].style.background = "#E671B8";
        fOption[0].style.color = "#fff";

      };
  fOption.hover(fOptionIn, fOptionOut);
  fList.blur(function(){
    $(this).fadeOut(speed);
    fListShow = false;
    fOptionOut();
  }); 
  fOption.click(function(){
    if(!fListShow){ 
      fList.fadeIn(speed);
      fListShow = true;
      fOptionIn();
    } else {
      fList.blur();
    }
    this.blur();
  });
  var FontSize;
  $("#IM_ChatBox .IM_TB-fontList li").click(function(){
    FontSize = $(this).val();
    Tarea[0].style.fontSize = FontSize + "px";
    $("dd.IM_MsgContent-Get").css("fontSize",FontSize);
    $("dd.IM_MsgContent-Send").css("fontSize",FontSize);
  });

  /*zhuanyi*/
  function html_encode(str){   
    var s = "";   
    if (typeof str != 'string' || str.length == 0){ return "";}   
    s = str.replace(/&/g, "&amp;");   
    s = s.replace(/</g, "&lt;");   
    s = s.replace(/>/g, "&gt;");   
    s = s.replace(/ /g, "&nbsp;");   
    s = s.replace(/\'/g, "&#39;");   
    s = s.replace(/\"/g, "&quot;");   
      s = s.replace(/\n/g, "<br>");
    return s;   
  }   

  function html_decode(str){   
    var s = "";   
    if (typeof str != 'string' || str.length == 0){ return ""; }  
    s = str.replace(/&amp;/g, "&");   
    s = s.replace(/&lt;/g, "<");   
    s = s.replace(/&gt;/g, ">");   
    s = s.replace(/&nbsp;/g, " ");   
    s = s.replace(/&#39;/g, "\'");   
    s = s.replace(/&quot;/g, "\"");   
    s = s.replace(/<br>/g, "\n");   
    return s;   
  }   
    /*聊天处理模块*/
  function _ChatModule() {
	  var ChatContent =  '',
	   result_content = '',
	   Handled_Msg = '',
	   ContentReg = [],
	   notMatchContent = '',
	   match_index = null,
	   handleFun = [];
	   this.html_encode = function(str){
		   	return html_encode(str);
		   };
	   this.html_decode = function(str){
	   		return html_decode(str);
	   }
	  this.addContentReplaceRule = function(Reg, fn){
	  	ContentReg.push(Reg);
		handleFun.push(fn);
	  };
	  this.HandleMsg = function(msg){
	 	ChatContent = msg;
		doReplace();
		return result_content;
	 };
	 var doReplace =  function(){
		var _match;
		for(var i = 0; i < ContentReg.length; i++){
			_match = ChatContent.match(ContentReg[i]);
			if(_match){
				matchReg = ContentReg[i];
				handled_Msg = handleFun[i](_match); //用相应的函数处理匹配到的数据
				var remain = ChatContent.split(_match[0]);//用匹配文本分开得到剩下没有被匹配的文本,有前(index = 0)有后(index = 1)
				result_content = html_encode(remain[0]) + _match[0].replace(matchReg, handled_Msg) 
								+ html_encode(remain[1]);
				break;
			}
		}
		if(!_match){
			result_content = html_encode(ChatContent);
		}
	 }
  };
  var ChatModule = new _ChatModule();
  window.IM_ChatModule = {addContentReplaceRule : function(Regex, func){
	  ChatModule.addContentReplaceRule(Regex, func)}, //向外部注册函数,提供给外部使用,添加不同的匹配函数
	  html_encode: function(str){
		 	return html_encode(str);
		 },
	  html_decode:function(str){
	  	return html_decode(str);
	  }
	  } 
    var REGCODE =/#(code|js|javascript|html|java|perl|py|c|cpp|c\+\+|php|jsp|python|bash|sql|xml|css|makefiles|ruby|php|vb)\s[\s\S]*/i;
  /*为聊天模块添加处理规则,默认处理两个,一个是代码高亮,一个是连接,也可以添加另外的处理规则*/
  ChatModule.addContentReplaceRule(REGCODE, function(data){
	//匹配到的data进行处理,把结果返回给模块,注意有的需要html_encode,否则很危险
  	 return '<pre class="prettyprint">' + prettyPrintOne(html_encode(data[0]), data[1])+'</pre>';
  	
  });
  //增加匹配超链接
  ChatModule.addContentReplaceRule(/https?:\/\/([-\w\.]+)+(:\d+)?(\/([^\s]*(\?\S+)?)?)?/g, function(data){
	return '<a href="'+data[0]+'" target="_blank" style="color:#3399FF; font-style:italic;">'+data[0]+'</a>';												
  });
  //匹配豆瓣
  ChatModule.addContentReplaceRule(/#douban/, function(data){
    return '<iframe id="runtime"  name="runtime" width="330" height="285" scrolling="no" frameborder="0" src="http://douban.fm/partner/uc"></iframe>';
  });
  /**
   * 有道实时翻译
   * 由于谷歌的翻译已经收费,转而使用有道翻译
   * 有道的Api限制1000次/小时请求
   * 而发送一条消息发送端和接收端都需要查询
   * 所以实际上这里被限制为每小时发送500条翻译.
   * */
  ChatModule.addContentReplaceRule(/(#yd|#翻译|#english|#en|#chinese|#cn)\s([\s\S]+)/, function(data){	
    var msg = data[2];
    var query = encodeURI("keyfrom=chinesetiger&key=799841294&type=data&doctype=jsonp&callback=show&version=1.1&q=" + msg);
    //	var query = encodeURI('oncomplete=mycallback&appId=A4D660A48A6A97CCA791C34935E4C02BBB1BEC1C&from=zh-cn&to=en&text='+msg);
    var tid = Math.round(Math.random()*100000000000000);
    $.ajax({
      type: "GET",
      url: "http://fanyi.youdao.com/openapi.do",
      // url: 'http://api.microsofttranslator.com/V2/Ajax.svc/Translate' ,
      data: query,
      dataType: "jsonp",
      success: function(msg){
        $('dd[yd="youdao:'+tid+'"]').text(msg.translation); //获取翻译信息后再替换
      }
    });
    /*for bing api
      window.mycallback = function(data){
      $('dd[yd="youdao:'+tid+'"]').text(data); //获取翻译信息后再替换
      }
      */
    return '<dd yd="youdao:'+tid+'">' + html_encode(data[2])+ '</dd>'; //现将数据返回


  });



  /**
   * 添加虾米音乐
   * ^-^非常感谢虾米提供的API
   * 向虾米搜索音乐,找到数据后加入播放器播放, 默认播放第一条搜索结果,所以为了搜索精确
   * 请使用 #音乐:歌曲 作者 
   * 使搜索精确. 搜索支持虾米的模糊搜索和拼音搜索,比如 光辉岁月 -> ghsy
   * 开启方式#music: | #music= | #音乐: | #音乐= | #虾米= | #虾米: 跟搜索内容#虾米 曲名 作者
   */
  ChatModule.addContentReplaceRule(/#(music|音乐|xiami|虾米)(=|:|\s)([\s\S]+)/ , function(data){
    var value;
    var mid = Math.round(Math.random()*1000000000000000);
    if(data[3]){
      value = encodeURI(data[3]);
    }
    if(!value || value.replace(/\s/g, '') == '') return;
    $.ajax({
      url:'http://www.xiami.com/app/nineteen/search/key/'+value+'/page/1',
      data:'random=' + new Date().getTime() + '.js',
      dataType: 'jsonp',
      success: function(data){
        var mu = $('dd[music="xiami:'+mid+'"]');
        if(data.total == 0 || data.total == '0' ){
          mu.children('em').text('虾米无法找到:');
          mu.children('em').css({fontStyle: 'normal', color: 'red'});
          mu.append('<p style="color:#999; font-size:11px;">请检查搜索词是否正确，更精确搜索请使用：歌名 艺人</p>')

        }else{
          mu.append('<br/><embed src="http://www.xiami.com/widget/0_' + data.results[0].song_id + '/singlePlayer.swf" type="application/x-shockwave-flash" width="257" height="33" style="margin:5px 0 0 0;" wmode="transparent" ></embed>');
          mu.children('em').text('请等待加载音乐:');
          mu.children('em').css({color:'green', fontStyle:'normal'});
          mu.children('span').text(decodeURI(data.results[0].song_name  + ' - ' 
              + data.results[0].artist_name).replace(/\+/g, ' '));
          mu.children('span').css({color: '#FF5A0B'});
          setTimeout(function(){
            mu.children('em').text('点击播放:');
          }, 2500);

        }
        delete mu;
      }
    });
    return '<dd music="xiami:'+mid+'"><em style="color:#F1960A;font-size:11px;">\
      正在搜索虾米音乐:</em><span style="font-size: 12px; margin: 0 0 0 5px;">' + data[3] + '</span></dd>';
  });



  /*发信添加至窗口界面*/
  var addMessageToWin = function(){
    var msg = Tarea.val();
    var fTime = function(time){
      time += "";
      return time.length == 1? "0"+time : time;
    };
    var msgt = msg.replace(/\s/g, '');//判断是否为空消息
    if(msgt.length > 0 && currlen <= LIMITLEN){
      var d = new Date();
      //msg = msg.replace(reg, "\r\n");
      var stime = fTime(d.getHours()) + ':' + fTime(d.getMinutes()) + ':' + fTime(d.getSeconds());
      var dl = $('<dl class="IM_MsgBody-Send" />'), dt = $('<dt class="IM_MsgHeader-Send" />'),
          dd = $('<dd class="IM_MsgContent-Send" style="font-size:'+FontSize+'px" />'),
          span = $("<span />").text(C.name + ' ' + stime),
          sending = $('<em class="IM_MsgSending"> ●正在发送</em>'),
          ddf = $('<dd class="IM_Msg_footer-Send" />').append('<em><em>');
      var msg_html = ChatModule.HandleMsg(msg);
      var span2 = $('<span />');

      span2.append(msg_html);
      Tarea.val('');
      dt.append(span);
      dt.append(sending);
      dl.append(dt);
      dd.append(span2);
      dl.append(dd);
      dl.append(ddf);
      _MsgWin.append(dl);
      _MsgWin.scrollTop(1000000);

      var sendSuccess = function(){
        sending.removeClass();
        sending.addClass('IM_MsgSendSucess');
        sending.text(' ●发送到达')
          sending.fadeOut(2000, function(){
            sending.text('');
            sending.removeClass();
          });

      };
      var sendFail = function(){
        sending.text(' ●发送失败');
        sending.removeClass();
        sending.addClass('IM_MsgSendfail');
      };
      if(target_id.match(/group/)){
        sendPublicMsg(target_id, {'name': C.name, 'time': stime, 'msg': msg, 'footer': ''}, 
            function(ok){
              if(ok) {
                sendSuccess();
              }else{
                sendFail();
              }
            }
            );//send public msg
      }else {
        //var start_time = new Date().getTime();//FOR TEST
        var start_time = '';
        sendPrivateMsg(target_id, {'name': C.name, 'time': stime, 'msg': msg, 'footer': start_time}, 
            function(ok){
              if(ok){
                sendSuccess();
                //	alert(new Date().getTime() - start_time);//FOR TEST
              }else{
                sendFail();
              }
            }
            );
      }

    }
  };
  /*open new window*/
  $(".IM_btn_ChangeWin").live('click',function(){
    var OpenWin = window.open('', 'newwin',
      "modal=yes,height=570,width=720,left=180,top=40px,location=0,toolbar=0,menubar=0,scrollbars=0,resizable=1,status=0,channelmode=0,directories=0");
    var _chatbox = $("#IM_ChatBox");
    /*
       OpenWin.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <title>WebIM</title> <script type="text/javascript" src="js/jquery-1.7.1.min.js" ></script> <link id="IM_css" rel="stylesheet" type="text/css" href="blue_openwin.css" /> <script type="text/javascript" src="js/webim_openwin.js" >																																																																																																													</script> <script type="text/javascript" src="js/prettify.js"></script> <link type="text/css" rel="stylesheet" href="styles/prettify.css"/> </head><body></body></html>');*/


    OpenWin.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>WebIM</title><script type="text/javascript">var a = function(arg){document.write(arg)}</script></head><body></body></html>');
    //OpenWin.document.write('<div id="IM_ChatBox"></div>');//ie这样打开是很吃力的.


    OpenWin.window.a('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>WebIM</title><link id="IM_css" rel="stylesheet" type="text/css" href="blue_openwin.css" /> </head><body><div id="IM_ChatBox">'+_chatbox.html()+'</div></body></html>');
    //OpenWin.window.a(_chatbox);
    OpenWin.document.close(); 
    addMsg = function(){addMessageToWin();} //新窗口访问得到
  });
  // winclose = function(){alert(C.name)} 新窗口访问不到

  //----socket.io----connect
  if(document.selection){ //IE NOT support WebSocket
    var socket = io.connect( HOST + ":" + PORT, {
      'rememberTransport' : true
      , 'match origin protocol' : true 
      , 'sync disconnect on unload' : true
      ,'transports' : [
      'htmlfile'
      , 'xhr-polling'
      , 'jsonp-polling'
      ]
    });
  }else {
    var socket = io.connect(HOST + ':' + PORT);
  }
  /*刷新正在聊天列表,用户可能改名,需要刷新名称*/
  var reflashChattingList = function(target_id){
    if(UserWin[target_id]){//判断改名的是否是正在聊天的人;
      var name = $('li[sid="' + target_id + '"] span').text();
      $('dd[listid="'+target_id+'"] span').text(name);
      $('div[sid="'+ target_id +'"] .IM_TargetState').text(name);
    }
  };
  /*获取在线列表*/
  var getOnlineList = function(data){
    var onlinelist = $("#IM_WithU"), h3 = $('#IM_WithU h3'), ul = $("#IM_WithU ul");
    var online_num = data.total;
    MiniBox.children("span").text(data.total+"人在线");
    ul.empty();
    var list = data.list;
    var master;
    for(var i in list){
      ismaster = list[i].id.match(/master/i);
      if(ismaster){ //如果是获得Master登录消息,标识Master
        var master = $('li[sid="'+list[i].id+'"]');
        master.removeClass('IM_MasterOffline');
        master.children('span').text(list[i].nick);
        master.addClass('IM_MasterOnline');
        reflashChattingList(list[i].id);//刷新名称
        online_num--;
      }
      if(UserWin[list[i].id]){ //如果是正在聊天的对象,那么打上chatwith标记
        ismaster ? master.addClass('IM_chatwith-master') : ul.append($('<li class="IM_listitem IM_Li-chatwith" sid='+ list[i].id+'/>').append($("<span />").text(list[i].nick)).append($('<abbr />').text(list[i].city)));
        reflashChattingList(list[i].id);//刷新名称
      }else{
        ismaster ? '1' : ul.append($('<li class="IM_listitem" sid='+ list[i].id+'/>').append($("<span />").text(list[i].nick)).append($('<abbr />').text(list[i].city)));
      }
      online_num > 1 ? h3.text(online_num +　"-Visitors") : h3.text(online_num +　"-Visitor");
    }
  };
  /*目标下线*/
  var TargetOffline = function(target_id){
    if(target_id.match(/master/i)){
      var master = $('li[sid="' + target_id + '"]');
      master.removeClass('IM_MasterOnline');
      master.addClass('IM_MasterOffline');
    }
    if(!UserWin[target_id]) return;//如果当前没有与该掉线用户聊天,不用处理.
    $('dd[listid="'+target_id+'"] span').css({color : "#ccc", textDecoration: "line-through"});
    $('div[sid="'+target_id+'"] .IM_TargetState').css({borderLeft: "8px solid #ccc", color:'#ccc'})
  };

  var TargetReconnect = function(target_id){//目标用户重新链接到服务器
    if(!UserWin[target_id]) return;//如果当前没有与该掉线用户聊天,不用处理
    $('dd[listid="'+target_id+'"] span').css({color : "#000", textDecoration: "none"});
    $('div[sid="'+target_id+'"] .IM_TargetState').css({borderLeft: "8px solid #84D747", color:'#000'});
    if(target_id.match(/master/i)){
      markChatWithOnlineMaster(target_id);
    }
  };

  socket.on('connect', function(){
    _SysMsg.color = "#000";
    _SysMsg.show('已连接至服务器!', 3000);
    UserID = socket.socket.sessionid;
    if(!Cookie_c.sessionid){
      addCookie("sessionid", UserID);
      C["sessionid"] = UserID;
    }
    UserID = C.sessionid;
    socket.emit('add to online list', C, function(masterdata){
      var ul = $('#IM_Master ul');
      ul.empty();
      var master, _class;
      for(var i in masterdata){
        _class = 'IM_listitem ';
        master = masterdata[i]
      _class += master.online ?　'IM_MasterOnline' : 'IM_MasterOffline';
    ul.append($('<li class="' + _class + '" sid="' + master.masterid + '"></li>').append($('<span />').text(master.nickname)));
      }
    });
    showOnline();
    //$("#IM_ChatList h3").css("background", "#84D747");
  });
  socket.on('target disconnect', TargetOffline);
  socket.on('target reconnect', TargetReconnect);
  socket.on('update online list', getOnlineList);
  socket.on('reconnect', function(){
    _SysMsg.color = "#000";
    _SysMsg.show('Reconnect to Server!', 2000);
  });
  socket.on('disconnect', showOffline);
  /*链接服务器错误*/
  socket.on('error', function(err){
    _SysMsg.color = "#f00";
    _SysMsg.show(' -= Connect Error, Server Have No Response! =-', "stay");
    // $("#IM_ChatList h3").css({background:"#ccc"});
    showOffline();
  });

  var sendPublicMsg = function(to , data, callback){
    socket.emit('public message', to, data, callback);
  };
  var sendPrivateMsg = function(to, data, callback){
    socket.emit('private message', to , data, callback);	
  };

  /*通过向某个对象添加/移除类别来实现闪动*/
  var Flicker = function(obj, _class, times, fn){
    var _flicker = function(obj, _class){
      obj.addClass(_class);
      setTimeout(function(){obj.removeClass(_class)}, 300);
    }
    _flicker(obj, _class);//马上执行一次函数
    times--;
    var timeid = setInterval(function(){
      if(0 == times){
        clearInterval(timeid);
        typeof fn == 'function' ? fn() : 1;
        return;
      }
      _flicker(obj, _class);
      times--;
    }, 600);//隔600秒后再调用
  };

  /*用户焦点不在本窗口时有消息,发出消息提示*/
  var timeid , timeid2;
  var WinUnfocusNotice = function(msg){
    if(document.selection) {return false;} //IE 好像不支持修改title提示
    if(timeid){	clearInterval(timeid);}
    if(timeid2){ clearTimeout(timeid2);}//保证只有一个定时器在工作,如果连续发消息,用户不查看会有很多定时器工作
    var WinTitle = $("title");
    WinTitle.text(msg);
    //$('head').append($('<link id="IM_MessageComeIcon" href="images/favicon.ico" rel="shortcut icon" />'));	
    timeid = setInterval(function(){
      WinTitle.text('Message Come!');
      timeid2 = setTimeout(function(){WinTitle.text(msg)}, 500);
    }, 1000);
    addEvent(window, 'focus', function(){
      USER_UNFOCUS = 0;
      clearInterval(timeid);
      clearTimeout(timeid2);//很有可能用户点击了以后,上文设置的Timeout才执行
      WinTitle.text(WebSiteName);
      //$("#IM_MessageComeIcon").remove();
    }, false);

  };

  /*聊天对象来信在聊天列表提示*/
  var chatListGetMsgAction = function(t_id){
    if(target_id == t_id) return; //如果获得信息是当前聊天窗口,无动作 
    var thisList =  $('dd[listid="' + t_id + '"]');
    if(UnCheckedMsg[t_id]){
      UnCheckedMsg[t_id] +=1;
    }else {
      UnCheckedMsg[t_id] = 1;
    }
    Flicker(thisList, 'IM_ChattingUser-msg', 2, function(){
      thisList.children('em').text('+' + UnCheckedMsg[t_id]);
      thisList.addClass('IM_ChattingUser-uncheck');  
    });
  };


  /*向窗口插入接收消息体*/
  var appendGetMsgToWin = function(_from_id, data){
    var dl = $('<dl class="IM_MsgBody-Get" />'), dt = $('<dt class="IM_MsgHeader-Get" />'),
        dd = $('<dd class="IM_MsgContent-Get" style="font-size:'+FontSize+'px" />');
    if(_from_id.match(/group/)){
      var title = "点击单独跟: "+data.name+" 聊聊~";
      a_name = $('<a class="IM_MsgName-Get" tid="'+data.sid+'" href="javascript:void(0)" title="'+title+'"/>').text(data.name+' ');
    }else{
      a_name = $('<a class="IM_MsgName-Get" tid="'+_from_id+'" href="javascript:void(0)" />').text(data.name+' ');
    }
    //FOR TEST TIME
    //	var _gettime = new Date();
    //	gettime = _gettime.getTime() - parseInt(data.footer);
    var gettime = '';
    span = $('<span />').text(data.time),
         ddf = $('<dd class="IM_Msg_footer-Get" />').append('<em>'+ gettime +'</em>'), span2 = $('<span />');

    var msg = ChatModule.HandleMsg(data.msg);
    var span2 = $('<span />');
    span2.append(msg);
    dt.append(a_name);dt.append(span);dl.append(dt);
    dd.append(span2);dl.append(dd);
    dl.append(ddf);
    /*将消息加入相应窗口中,这里不用_MsgWin是因为_MsgWin始终是用户当前聊天窗口
     *而所获得信息可能不属于当前窗口*/
    var uwin = $('div[winid="' + _from_id + '"]');
    if(uwin[0].clientHeight == uwin[0].scrollHeight - uwin[0].scrollTop){
      uwin.append(dl); //注意应该在消息未添加的时候判断,判断用户回滚后才添加
      uwin.scrollTop(uwin.scrollTop()+10000);//这里判断用户是否上滚查看过往记录,如果正在查看,则新消息添加不往下滚
    }else{
      uwin.append(dl); //注意应该在消息未添加的时候判断,判断用户回滚后才添加
    }
  }

  /*获得消息*/
  var getMessage = function(from , data, callback){
    var group = from.match(/group/i),
        master = from.match(/master/i);
    if(group && !AccessGroup[from]){
      return;
    }
    if(!CHATBOXSHOW){
      showChatBox() //如果没有显示ChatBox,显示ChatBox
    }
    if(!UserWin[from]){ //如果是主动聊天,这时候接收方还没有窗口,要建立窗口
      var w = 0;
      for(var i in UserWin){
        w++;//这里判断UserWin有没有窗口
        if(i) break;//有窗口w = 1,并且退出,实际上一有数据就退出
      }


      if(w > 0){ 
        if(group){
          createUserWin(from, data.groupname , 'notshow'); //如果是群消息或者是讨论消息,要用群名称建立
        }else{
          createUserWin(from, data.name, 'notshow'); //有窗口,建立不显示
        }
      }else {
        if(group){
          createUserWin(from, data.groupname);
        }else {
          createUserWin(from, data.name);//如果建立的是第一个窗口,建立并显示
        }
      }

      if(master){ //是master的主动聊天
        markChatWithOnlineMaster(from);
      }

    }
    chatListGetMsgAction(from);//在Chatlist中提示未读信息,当前窗口不提示.
    if(from != UserID && USER_UNFOCUS){ //用户给自己发消息不提示
      WinUnfocusNotice(data.name+'-Message Come!')
    }
    if(from != UserID && C.sound && C.mobile == '-'){
      playSound("sound/sms.wav");
    }

    appendGetMsgToWin(from, data);//from可以是群id
    if(!group){
      callback(true);//接收到消息,执行回调,告诉服务器
    }

  };

  socket.on('public message', getMessage);
  socket.on('private message', getMessage);
  socket.on('message error', function(err_msg){
    _SysMsg.color = "#000";
    _SysMsg.show(err_msg, 4000);
  });
  var saveToServer = function(obj){
    socket.emit('save data', obj, function(ok){
      if(ok){
        _SysMsg.color = "#393";
        _SysMsg.show('Save Data Success!', 2000, 'Mainbox');
      }							  
    });
  };
  //----------------------------主窗口聊天界面动作-------------------
  var ChatBox = $("#IM_ChatBox"),
      PerWinTemplate = $('div[sid="{#sid}"]').html(),
      ChatList = $("#IM_ChatBox .IM_Chatting-List"),
      UserWin = {};//存储窗口对象
  var showChatBox = function(){
    ChatBox.fadeIn(speed);
    CHATBOXSHOW = true;
  };
  var hideChatBox = function(){
    ChatBox.hide();
    CHATBOXSHOW = false;
  };

  /*点击在线列表*/
  $(".IM_listitem span").live('click', function(){
    if(target_id){ $('dd[listid="'+target_id+'"]').removeClass('IM_Li-chatwith')};//去除上一个列表样式.
    target_id = $(this).parent().attr('sid'), name = $(this).text();
    $(this).parent().addClass('IM_Li-chatwith');
    if(!CHATBOXSHOW){showChatBox();}//如果ChatBox没有显示,显示ChatBox
    createUserWin(target_id, name);
    if(target_id.match(/group/) && !AccessGroup[target_id]){ 
      AccessGroup[target_id] = true; //如果用户打开的是群,说明用户需要接收该群信息.并且是第一次打开才向服务器获取
      socket.emit('get group history msg', target_id, function(get_id , data){
        for(var i in data){
          getMessage(get_id, data[i]);
        }
      });
    }
    if($(this).parent()[0].className.match(/IM_MasterOffline/i)){ //只有master不在线也会显示在master列表,访客下线不显示在列表
      $('dd[listid="'+target_id+'"] span').css({color : "#ccc", textDecoration: "line-through"});
      $('dd[listid="'+target_id+'"]').css("borderLeft",'3px solid #FFCECE'); 
      $('div[sid="'+target_id+'"] .IM_TargetState').css({borderLeft: "8px solid #ccc", color:'#ccc'});
    }
    if($(this).parent()[0].className.match(/IM_MasterOnline/i)){
      markChatWithOnlineMaster(target_id);
    }
  });
  /*标识与Master聊天*/
  var markChatWithOnlineMaster = function(target_id){
    var color = "#FF3535", color2 =  color;
    if($('li[sid="'+target_id+'"]')[0].className.match(/offline/i)){
      color = "#ccc";
      color2 = "#FFCECE";
    };
    $('dd[listid="'+target_id+'"]').css({borderLeft:'3px solid ' + color2});
    $('div[sid="'+target_id+'"] .IM_TargetState').css({borderLeft: "8px solid " + color});
  };

  /*
     socket.on("get group history msg", function(from , data){
     for(var i in data){
     getMessage(from, data[i]);
     }
     });*/

  /*在群聊中点击聊天者名字,创建到私聊*/
  $("a.IM_MsgName-Get").live({
    click:function(){
            $('dd[listid="'+target_id+'"]').removeClass('IM_Li-chatwith');//去除上一个列表样式.
            target_id = $(this).attr('tid');
            createUserWin(target_id, $(this).text());
            $('li[sid="'+target_id+'"]').addClass('IM_Li-chatwith');
            if(target_id.match(/master/i)){
              markChatWithOnlineMaster(target_id);
            }
          },
    mouseover:function(){

              }
  });
  /*显示相应的窗口(点击在线列表,聊天列表时)*/
  var showTargetWin = function(t_id){
    if(!UserWin[t_id]) return;
    target_id = t_id;//当要显示当前窗口的时候,重新设置目标id
    $('#IM_ChatBox .IM_WinBottom').css('opacity', 0);
    $('.IM_PersonWin').css({opacity:0, display:'block', position: 'absolute', top: 0, width: '380px', zIndex: 1});
    UserWin[target_id].css({opacity:1, zIndex:1000});
    $('dd[listid="'+target_id+'"]').addClass('IM_Li-chatwith');
    _MsgWin = $('div[winid="' + target_id + '"]');//将操作窗口改为当前窗口
  };
  /*利用模版创建窗口*/
  var createUserWin = function(target_id, name, show){
    var PerWin = PerWinTemplate.replace(/\{#sid\}/g, target_id),
        group = target_id.match(/group/i);
    name = group ? name+':Group' : name;
    var cssclass = group ? "IM_ChattingUser IM_ChattingGroup" : "IM_ChattingUser";
    var gclass = group ? "IM_State-Group" : '';
    PerWin = PerWin.replace(/\{#groupstate\}/g, gclass);
    PerWin = PerWin.replace(/\{#name\}/g, name);
    if(!UserWin[target_id]){ //如果窗口不存在,则建立,存在则直接跳转
      $('#IM_ChatBox .IM_WinBottom').before('<div class=IM_PersonWin sid="' + target_id +'">'+PerWin+'</div>');
      UserWin[target_id] = $('div[sid="' + target_id + '"]');
      ChatList.append('<dd listid="' + target_id + '" class="'+cssclass+'"><span>' + name + '</span><em></em><a href="javascript:void(0)">x</a></dd>');

    }
    if(!show){showTargetWin(target_id)};//如果show未定义,默认显示目标窗口
  };
  /*点击聊天列表,显示相应聊天窗口*/
  $(".IM_ChattingUser span").live('click',function(){
    var tid = $(this).parent().attr('listid');
    var u = $(this).parent(); //用$(this)在setTimeout中就是另一个了,要保存它
    $('dd[listid="'+target_id+'"]').removeClass('IM_Li-chatwith');//去除上个聊天样式  
    showTargetWin(tid);//点击聊天列表,这里肯定是已经建立好窗口的了,直接显示
    setTimeout(function(){ //可能闪动动画的回调函数还没执行用户就点击了,所以要延迟本次处理清理
      u.children('em').text('');
      if(UnCheckedMsg[tid]){
        u.removeClass('IM_ChattingUser-uncheck');
        UnCheckedMsg[tid] = 0;//清零未处理消息.
      }
    }, 1000);
  });

  /*关闭窗口*/
  var closeTargetWin = function(t_id){
    UserWin[t_id].remove();
    delete UserWin[t_id];
    if(UnCheckedMsg[t_id]){delete UnCheckedMsg[t_id];}
    var queue = [];
    for(var i in UserWin){
      queue.push(i);
    }
    if(queue.length == 0){//关闭了最后一个窗口,一起关闭ChatBox
      hideChatBox();
      SysBar.hide();//如果当前显示了Sysbar,也要关掉.
    }
    if(target_id == t_id){ //关闭的是当前聊天窗口才跳转
      showTargetWin(queue[queue.length-1]);
    }
  }
  /*点击窗口关闭*/
  $('.IM_UserWinclose').live('click', function(){
    var target_id = $(this).attr('closeid');
    if(target_id.match(/group/i)){
      if(!confirm("关闭群后将不会接收该群消息, 服务器只会保存最近50条上下文信息, 真的要关闭群吗? ")) {
        return;
      }
      delete AccessGroup[target_id]; //关闭群,不接收群信息.
    }
    closeTargetWin(target_id);
    $('li[sid="'+target_id+'"]').removeClass('IM_Li-chatwith');
    $('dd[listid="'+target_id+'"]').remove();
  });
  /*点击聊天列表关闭*/
  $('.IM_ChattingUser a').live('click', function(){
    var target_id = $(this).parent().attr('listid');
    $(this).parent().remove();
    $('li[sid="'+target_id+'"]').removeClass('IM_Li-chatwith');
    closeTargetWin(target_id);
  });
  //-------------------聊天列表动作--------
  var Rlist = $("#IM_Recently-List"),
      Recent = $("#IM_Recently"),
      Chat = $("#IM_ChatBox .IM_ChatList h3"); 
  Recent.click(function(){
    Chat.animate({fontSize: "11px"}, 'fast', function(){Chat[0].style.color="#ccc";});
    $(this).addClass("IM_Recent-active");
    $(this).animate({fontSize:"15px", left:"30px"}, 'fast');
    ChatList.animate({width:"0"}, 'fast');
    ChatList.hide();
    Rlist.show();
    Rlist.animate({left: "1px", width:"100px"},'fast');
  });
  Chat.click(function(){
    Recent.animate({fontSize:"10px", left:"50px"}, 'fast',function(){Recent.removeClass("IM_Recent-active");});
    $(this).animate({fontSize:"16px"}, 'fast', function(){Chat[0].style.color="#000";});
    Rlist.animate({left:"100px", width:"0"}, 'fast');
    Rlist.hide();
    ChatList.animate({width: "100px"}, 'fast');
    ChatList.fadeIn('fast');

  });
  /*拖拽*/
  var Dragable = function(trigger, jq_drag){
    var LIMITLEFT = 0 - $('#WebIM')[0].offsetLeft, //jquery offset() will add scrollTop
        LIMITTOP = 0 - $('#WebIM')[0].offsetTop,
        LIMITRIGHT = 220 , LIMITBOTTOM = 45;
    var final_x, final_y, mouse;
    var getMousePasition = function(ev){
      var x, y;
      if(document.selection){ //IE
        x = ev.clientX; 
        y = ev.clientY;
      }else {//Chrome FireFox
        x = ev.pageX;
        y = ev.pageY;
      }
      return {'X' : x, 'Y' : y};
    }
    var DragUp = function(event){
      var ev = event || window.event;
      if(canmove){ 
        jq_drag.css({left: final_x, top: final_y });
        canmove = false;
        //jq_drag.css({boxShadow: "1px 1px 5px 1px #999"});
        document.selection && document.selection.empty && ( document.selection.empty(), 1)
          || window.getSelection && window.getSelection().removeAllRanges();
        // jq_drag.fadeTo(0, 1);
      }
    };

    var DragMove = function(event){
      var ev = event || window.event;
      mouse = getMousePasition(ev);
      if(canmove){ 
        final_x = mouse.X - reLeft;
        final_y = mouse.Y - reTop;
        final_x = final_x > LIMITLEFT ? final_x : LIMITLEFT;
        final_x = final_x > LIMITRIGHT ? LIMITRIGHT : final_x;
        final_y = final_y > LIMITTOP ? final_y : LIMITTOP;
        final_y = final_y > LIMITBOTTOM ? LIMITBOTTOM : final_y;
        jq_drag.css({left: final_x, top: final_y });
      }
    };

    addEvent(document, 'mousemove', DragMove, false);//监听document,确保在任何地方都有效,因为鼠标太快会脱离选定区域
    addEvent(document, 'mouseup', DragUp, false);
    var reTop, reLeft, canmove = false;
    trigger.live({
      mousedown : function(event){ 
                    var ev = event || window.event;
                    mouse = getMousePasition(ev);
                    LIMITLEFT = 0 - $('#WebIM')[0].offsetLeft; //jquery offset() will add scrollTop
                    LIMITTOP = 0 - $('#WebIM')[0].offsetTop;
                    reLeft = mouse.X - jq_drag[0].offsetLeft;
                    reTop = mouse.Y - jq_drag[0].offsetTop ;
                    $(this).css({cursor:"move"});
                    //  jq_drag.css({boxShadow: "1px 1px 3px 1px #43B1FF"});
                    //  jq_drag.fadeTo(0, 0.8);
                    canmove = true;
                  }
                  //mousemove: DragMove,
                  //mouseup: DragUp  

    });
  };
  Dragable($(".IM_ChattingTitle"), ChatBox);

  /*MiniBox*/
  var NoticeMsgNum = MiniBox.children("b");
  var SHOW_MINIBOX = 1,SHOW_MAINPANEL = 0;
  var showMiniBox = function(){
    MiniBox.fadeIn(speed);
    SHOW_MINIBOX = 1;
  };
  var hideMiniBox = function(){
    MiniBox.fadeOut(speed); 
    SHOW_MINIBOX = 0;
  };
  var showMainPanel = function(){
    MainPanel.fadeIn(speed);
    SHOW_MAINPANEL = 1;
  };
  var hideMainPanel = function(){
    MainPanel.hide();
    SHOW_MAINPANEL = 0;
  };
  MiniBox.click(function(){
    hideMiniBox();
    showMainPanel();
    if($(".IM_Li-chatwith").length){
      //如果有正在聊天的对象,显示ChatBox
      showChatBox();
    }
  });

  MiniBox.hover(function(){
    NoticeIMG.addClass("IM_IMG-hover");
  }
  ,
  function(){
    NoticeIMG.removeClass("IM_IMG-hover");
  }
  ); 
  /*最小化窗口*/
  $(".IM_MinBar").click(function(){
    hideMainPanel();
    showMiniBox();
  });
  $(".IM_MinSizeWin").live("click", function(){
    hideMainPanel();
    hideChatBox();
    showMiniBox();
  });

  /*显示目标信息*/
  TargetInfo = $("#IM_TargetInfo");
  var  interid,ids = [];
  var clearIntervals = function(ids){
    for(var i = 0; i<ids.length; i++){
      clearInterval(ids.pop());
    }
  };
  var checkAndShowTargetInfo = function(hover_id){
    if(hover_id.match(/group/) || hover_id.match(/master/)){
      return;
    }
    var newtime, hovertime;
    var d = new Date();
    hovertime = d.getTime();
    interid = setInterval(function(){
      var d = new Date();
      newtime = d.getTime();
      if(newtime - hovertime > 500 ) {
        //	TargetInfo.children("dl").remove();
        TargetInfo.fadeTo(speed, 0.9);
        getTargetUserInfoById(hover_id);
        clearIntervals(ids);
      }; //光标停留150毫秒标示需要显示信息
    }, 100);
    ids.push(interid);
  };

  var getTargetUserInfoById = function(t_id){
    socket.emit("get user info",  t_id);
    TargetInfo.children("dl").remove();
    TargetInfo.append('<dl><dt>User Info</dt><dd><b>Getting Data...</b></dd></dl>');
  };

  /* !!!监听不要写在函数内部,如果写在某函数体内部,麻烦大了,因为每执行一次该函数就会设置一次监听,最终导致设置了多个监听器!!! */
  socket.on("get user info", function(data){ 
    TargetInfo.children("dl").remove();
    data.IP_start = data.IP_start.split(".");
    data.IP_start[2] = data.IP_start[3] = "*";
    TargetInfo.append('<dl><dt>User Info</dt><dd><b>Name </b><span>'+ data.name +'</span></dd><dd><b>Gender </b>'+data.gender+'</dd><dd><b>Browser </b>'+data.Browser+'</dd><dd><b>Mobile </b>'+data.mos+'</dd><dd><b>OS </b>'+data.OS+'</dd><dd><b>ISP</b>'+data.isp+'</dd><dd><b>IP </b>'+data.IP_start.join(". ")+'</dd><dd><b>Position </b><span>'+data.city+' '+data.province+' '+data.country+'</span></dd></dl>');
  });

  (function hoverToShowUserInfo(){  
    if(C.mobile != '-') return;
    /* !!! live如果放在父元素,那么也会触发子元素的相应动作,导致触发多次而发送多次请求,所以精确定位到子元素 !!! */
    $(".IM_listitem span").live( 
      {
        mouseover : function(){
                      TargetInfo.css({top: $(this).parent()[0].offsetTop - $(this).parents(".IM_content").scrollTop() + "px", right:"-"+ (MainBox[0].offsetLeft - 5) + "px", display:"none"});
                      checkAndShowTargetInfo($(this).parent().attr("sid"));
                    },
      mouseout : function(){
                   TargetInfo.hide();
                   clearIntervals(ids);
                 }
      }
      );
  }());

  /*Sound*/
  var  loadSound = function(_src){
    if(document.selection){
      WebIM.append('<bgsound id="IM_bgsound" volume="-5000" src="'+ HOSTPATH + _src + '" />');
    }else {
      WebIM.append('<audio preload="auto" src="'+ HOSTPATH + _src + '" id="IM_audio"></audio>');
    }
  };
  loadSound('sound/sms.wav');
  var audio = $("#IM_audio"), sound = $("#IM_bgsound");
  var playSound = function(_src){
    if(document.selection){ //如果是IE
      sound.removeAttr("volume");
      sound.attr("src", HOSTPATH + _src);
    }else{
      audio[0].play();
    }
  };
  /* Master 登陆*/
  var LoginDialo = $('#IM_DialoBox');
  var showLoginDialo = function(){
    LoginDialo.fadeIn(speed);
  };
  var hideLoginDialo = function(){
    LoginDialo.fadeOut(speed);
  };
  $('.IM_MasterSignIN').click(function(){
    showLoginDialo();
  });
  $('.IM_DialoClose').click(function(){
    hideLoginDialo();
  });
  $('#IM_btn_SignIn').click(function(){
    var name = $('#IM_SignInName').val().replace(' ', ''),
    pw = $('#IM_SignInPw').val().replace(' ', '');
  var shakeDialo = function(){
    LoginDialo.animate({left:'20px'},160, function(){
      LoginDialo.animate({left:'130px'}, 320, function(){
        LoginDialo.animate({left:'100px'}, 160, function(){
          setTimeout(function(){$('#IM_SignInPw').val('');}, 300);
        });
      });
    });
  };
  if(name == ''  && pw == ''){
    shakeDialo();
    return;
  }
  socket.emit('Master Sign In', {name: name, pw: pw}, function(ok, data){
    if(ok){
      _SysMsg.color = "#39f";
      _SysMsg.show('Welcome Back:'+data.nickname,3000,'mainbox');
      deleteCookies(C);
      $('.IM_MasterSignIN').remove();
      $('.IM_MasterSignOut').show();
      C.name = data.nickname;
      C.gender = data.gender;
      C.city = data.city;
      C.sound = parseInt(data.sound);
      C.animate = parseInt(data.animate);
      C.alone = parseInt(data.alone);
      C.sessionid = UserID = data.masterid;
      initSetting();
      hideLoginDialo();
      if(data.MasterMsg){
        var MasterMsg = data.MasterMsg;
        for(var i in MasterMsg){
          getMessage(MasterMsg[i].from, MasterMsg[i].data, function(ok){});
        }
      }

    }else {
      shakeDialo();
    }
  });
  });

  /* 教程 */
  $('#IM_Tutorial').click(function(){
    target_id = 'tutorial';
    if(!UserWin[target_id]){
      createUserWin(target_id,'教程');
      var i = 1;
      getMessage(target_id, TutorialMsg[0], function(){
        i++;
      });
      var ttime = setInterval(function(){
        if(i < TutorialMsg.length){
          if(!UserWin['tutorial']){
            window.clearInterval(ttime);
            return;
          }
          getMessage(target_id, TutorialMsg[i], function(){
            i++;
          });
        }else{
          window.clearInterval(ttime);
        }
      }, 8000);
    }
  });
  var TutorialMsg = [
  {name:'助手', msg:'你好 : ) \r\n欢迎使用 No2Chat ( 意思是Not Only To Chat 哦) \r\n我是教程小助手, 下面让我来介绍No2Chat所含有的功能吧~ \r\n仔细的看一下帮助, 相信会让你更好的使用哦~"' , time:'',  footer:''},
  {name:'助手', msg:'No2Chat被设计为一个极高性能的网页实时聊天工具, 并且可以非常容易安装到需要拥有实时聊天功能的网站中, 比如博客,或者是客服系统,在线咨询等.' , time:'',  footer:''},
  {name:'助手', msg:'现在假如No2Chat安装在一个技术牛人博客上, 在主面板中"Master"一栏看到的是博主是否在线(在线为红色), 如果博主不在线,你还可以跟当前与你一起浏览该网站的人沟通哦.' , time:'',  footer:''},
  {name:'助手', msg:'既然是技术博客, 试试聊聊代码, 你可以用\r\n#code+空白+你的代码\r\n来帮你进行代码高亮~' , time:'',  footer:''},
  {name:'助手', msg:'例如:#code \r\n function(){\r\n alert("OK?");\r\n}' , time:'',  footer:''},
  {name:'助手', msg:'当然啦,我们建议,如果你明确的知道你的代码类型,可以用\r\n#代码类型 来标识. ' , time:'',  footer:''},
  {name:'助手', msg:'例如用\r\n"#html"来取代"#code", 让程序用html的语法来高亮你的代码, 这样不仅保证程序高亮正确,而且也很方便对方看出你写的什么类型的代码.\r\n' , time:'',  footer:''},
  {name:'助手', msg:'如:#html \r\n<script>\r\n  alert("adfs");\r\n</script>' , time:'',  footer:''},
  {name:'助手', msg:'代码高亮基于谷歌的PrettyCode,支持大多数的语言类型.' , time:'',  footer:''},
  {name:'助手', msg:'对了, 输入框是支持Tab及简单的自动缩进哦!' , time:'',  footer:''},
  {name:'助手', msg:'默认情况下程序也匹配了超链接\r\n例如你还可以输入\r\nhttp://weibo.com/chinesetiger/\r\n来发送链接给对方哦, 这是我主人的微博地址.' , time:'',  footer:''},
  {name:'助手', msg:'No2Chat还提供了一个接口来让你创建新的模式来自定义匹配用户消息, 这样可以根据你的网站实际情况来创建新的匹配, 为聊天添加更多丰富的功能~' , time:'',  footer:''},
  {name:'助手', msg:'为了方便,No2Chat还用颜色来标识不同的聊天对象 \r\n比如:\r\n绿色-当前聊天对象,红色-主人,客服,博主等等,还有蓝色-群' , time:'',  footer:''},
  {name:'助手', msg:'*每一个登陆的用户自动加入该网站的默认群 \r\n如果你要查看并接收群消息, 打开群聊对话框即可 \r\n关闭后表示你不想接收群消息哦~系统将不会接受群消息~' , time:'',  footer:''},
  {name:'助手', msg:'*在群聊中如果对某人感兴趣,可以点击对方名字快速创建私聊~' , time:'',  footer:''},
  {name:'助手', msg:'如果你不小心掉线了, 10分钟内再次登陆该网站还可以查看你没有收到的消息~当然需要打开浏览器Cookie功能,否则服务器不认识你啦' , time:'',  footer:''},
  {name:'助手', msg:'如果你是Master, 你永远也不用担心掉线或者接收消息不到,你的消息是存在服务器上的哦.' , time:'',  footer:''},
  {name:'助手', msg:'如果你想试验#号功能，而不打扰其他人，可以通过给自己发消息学习哦，熟悉了再跟他人使用No2Chat吧 ~^_^~' , time:'',  footer:''},
  {name:'助手', msg:'好了, 祝你使用愉快! :)' , time:'',  footer:''}
  ];
  /*About*/
  $('#IM_About').click(function(ev){ 
    ev ? ev.stopPropagation() : window.event.cancelBubble = true;
    $('#IM_AboutBox').fadeIn(300);
  });
  addEvent(document, 'click', function(){
    $('#IM_AboutBox').fadeOut(500);		
  }, false);
  $('#IM_AboutBox').click(function(){
    return false;
  });
  $('#IM_AboutBox a').click(function(){
    window.open($(this).attr('href'), 'Qin Wei');
  });

});




})(jQuery);


