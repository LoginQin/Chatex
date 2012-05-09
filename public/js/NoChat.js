function NoChat(){
  var HOSTPATH = "http://127.0.0.1:3000/";
  //by html 2 js tool
  var NewLine = '\n';
  var WebIM = '';
  WebIM+='<div id="WebIM" style="display:none;">'+NewLine;
  WebIM+='<!-- 聊天窗口 -->'+NewLine;
  WebIM+='<div id="IM_MiniBox" title="Chatting With Online People"><div id="IM_NoticeIMG" class="IM_IMG-offline">;-(</div><b>聊天</b><span>Connecting</span></div>'+NewLine;
      WebIM+='<div id="IM_SysMsgBar" ><span>System Message</span></div>'+NewLine;
      WebIM+='<div id="IM_ChatBox">'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='<div class="IM_ChatList" onselectstart="return false">'+NewLine;
      WebIM+='<h3>Chat</h3>'+NewLine;
      WebIM+='<dl class="IM_Chatting-List"> </dl>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='<div class="IM_UserWindow">'+NewLine;
      WebIM+='<div class="IM_PersonWin" sid="{#sid}">'+NewLine;
      WebIM+='<div class="IM_MsgWinHeader" onselectstart="return false">'+NewLine;
      WebIM+='<div class="IM_ChattingTitle">'+NewLine;
      WebIM+='<span title="User State" class="IM_TargetState {#groupstate}">{#name}</span>'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='<div class="IM_UserWinclose" onselectstart="return false"  closeid="{#sid}" title="关闭">×</div>'+NewLine;
      WebIM+='<div class="IM_MinSizeWin" title="最小化">_<!--[if IE 7]><span class="IM_IE7hack">_</span><![endif]--></div>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='<div class="IM_MsgWindow" winid="{#sid}">'+NewLine;
      WebIM+='<!-- 消息体 -->'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='</div> <!-- per win end! -->'+NewLine;
      WebIM+='<div class="IM_WinBottom"></div>'+NewLine;
      WebIM+='<ul class="IM_TB-fontList"><span>Font Size</span>'+NewLine;
      WebIM+='<li value="12">12px</li><li value="13">13px</li><li value="14">14px</li><li value="15">15px</li>'+NewLine;
      WebIM+='<li value="16">16px</li><li value="17">17px</li>'+NewLine;
      WebIM+='</ul>'+NewLine;
      WebIM+='<div class="IM_ToolBar"><a class="IM_TB-fontOption" href="javascript:void(0)">A</a>'+NewLine;
      WebIM+='<div class="IM_SendTypeOption">'+NewLine;
      WebIM+='<h3>SEND TYPE:</h3>'+NewLine;
      WebIM+='<span class="IM_unactive" value="Enter">Enter</span>'+NewLine;
      WebIM+='<span class="IM_active" value="Ctrl_Enter">Ctrl+Enter</span>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='<div class="IM_UserInputBox">'+NewLine;
      WebIM+='<textarea class="IM_UserTextarea"  name="_UserText"></textarea>'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='<a class="IM_btn_Send" title="Send Message" href="javascript:void(0)">Send</a>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='<!--Group聊天窗口end-->'+NewLine;
      WebIM+='<!--Group Chatting Box-->'+NewLine;
      WebIM+=''+NewLine;
      WebIM+=''+NewLine;
      WebIM+='<!-- 主窗口 -->'+NewLine;
      WebIM+='<div id="IM_MainPanel">'+NewLine;
      WebIM+='<div id="IM_TargetInfo"></div>'+NewLine;
      WebIM+='<div id="IM_DialoBox"><div class="IM_DialoClose">×</div><div class="IM_DialoHead"><h2>Master</h2><h4>Login</h4></div><p>'+NewLine;
      WebIM+='<label>用户名<br /><input id="IM_SignInName"  class="IM_DialoInput" size="20px" type="text" /></label><label>密码<br/><input id="IM_SignInPw" class="IM_DialoInput" size="20px" type="password"/></label></p><a id="IM_btn_SignIn" type="button" >登 陆</a></div>'+NewLine;
      WebIM+='<div id="IM_AboutBox" onselectstart="return false" ><div class="IM_AboutHead"><h2>About</h2><h4>NoChat Author</h4></div><div class="IM_DialoContent">'+NewLine;
      WebIM+='<img src="http://www.gravatar.com/avatar/b69725e32e5d2d134d8aca7b8f63244e?s=100"  width="100" height="100"/>'+NewLine;
      WebIM+='<dl><dd><span>作 者:</span> 覃 炜</dd><dd><span>E-Mail:</span> qinwei081@gmail.com</dd><dd><span>微 博:</span><a href="http://weibo.com/chinesetiger" target="_blank">Chinese Tiger</a></dd>'+NewLine;
      WebIM+='<dd><span>GitHub:</span><a href="https://github.com/LoginQin" target="_blank">LoginQin</a></dd></dl>'+NewLine;
      WebIM+='</div><div class="IM_DialoFooter">Chinese Tiger</div></div>'+NewLine;
      WebIM+='<div id="IM_MainBox">'+NewLine;
      WebIM+='<div class="IM_MinBar" title="最小化"><em>Min</em></div>'+NewLine;
      WebIM+='<div class="IM_head">'+NewLine;
      WebIM+='<span id="IM_nickname">Your Name</span>'+NewLine;
      WebIM+='<span id="IM_status" class="IM_online">Online</span>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='<!-- 个人内容 -->'+NewLine;
      WebIM+='<div class="IM_content">'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='<div id="IM_Master">'+NewLine;
      WebIM+='<h3 class="IM_category">Master</h3><a href="javascript:void(0)" class="IM_MasterSignIN">登 录</a><a href="javascript:void(0)" class="IM_MasterSignOut">退 出</a>'+NewLine;
      WebIM+='<ul>'+NewLine;
      WebIM+='<li class="IM_listitem IM_MasterOffline" sid="master:12345"><span>中国老虎</span></li>'+NewLine;
      WebIM+='<li class="IM_listitem IM_MasterOnline" sid="master:123456"><span>HKLLO</span></li>'+NewLine;
      WebIM+='</ul>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='<div id="IM_WithU"><!--在线列表 h3.IM_category ul li.IM_listitem IMnear IM_backlist-->'+NewLine;
      WebIM+='<h3 class="IM_category">9000-WithU</h3>'+NewLine;
      WebIM+='<ul>'+NewLine;
      WebIM+='</ul>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='<div class="IM_footer">'+NewLine;
      WebIM+='<div id="IM_group" ><span></span>GROUP</div>'+NewLine;
      WebIM+='<div class="IM_setting"><span></span>SETTING</div>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='<!-- 组别页面 -->'+NewLine;
      WebIM+='<div id="IM_GroupBox">'+NewLine;
      WebIM+='<div class="IM_MinBar" title="Minimize The Window"><em>Min</em></div>'+NewLine;
      WebIM+='<div class="IM_head">'+NewLine;
      WebIM+='<span>Group</span>'+NewLine;
      WebIM+='<!--     <div id="IM_group_add" title="Add An Group" ></div> -->'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='<div class="IM_content">'+NewLine;
      WebIM+='<div id="IM_group_default">'+NewLine;
      WebIM+='<h3 class="IM_category">Default</h3>'+NewLine;
      WebIM+='<ul>'+NewLine;
      WebIM+='<li class="IM_listitem" sid="group:default"><span>NoChat</span></li>'+NewLine;
      WebIM+='</ul>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='<div class="IM_footer">'+NewLine;
      WebIM+='<div class="IM_home" ><span></span>HOME</div>'+NewLine;
      WebIM+='<div class="IM_setting"><span></span>SETTING</div>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='<!-- 组别页面 end! -->'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='<!-- 设置页面 -->'+NewLine;
      WebIM+='<div id="IM_SettingBox">'+NewLine;
      WebIM+='<div class="IM_MinBar" title="Minimize The Window"><em>Min</em></div>'+NewLine;
      WebIM+='<div class="IM_head IM_setting_head">'+NewLine;
      WebIM+='<span>SETTING</span>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='<div class="IM_content_setting">'+NewLine;
      WebIM+='<ul>'+NewLine;
      WebIM+='<li class="IM_setitem"><span>Name</span>'+NewLine;
      WebIM+='<input id="IM_setname" class="IM_set" type="text" />'+NewLine;
      WebIM+='</li>'+NewLine;
      WebIM+='<li class="IM_setitem">'+NewLine;
      WebIM+='<span>Gender</span>'+NewLine;
      WebIM+='<div id="IM_OP_Gender" class="IM_set_option" >'+NewLine;
      WebIM+='<span class="IM_active">Mr</span>'+NewLine;
      WebIM+='<span class="IM_unactive">Miss</span>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='</li>'+NewLine;
      WebIM+='<li class="IM_setitem"><span>City</span>'+NewLine;
      WebIM+='<input id="IM_setcity" class="IM_set" type="text" />'+NewLine;
      WebIM+='</li>'+NewLine;
      WebIM+='<li  class="IM_setitem">'+NewLine;
      WebIM+='<span>Sound</span>'+NewLine;
      WebIM+='<div id="IM_OP_Sound" class="IM_set_option" >'+NewLine;
      WebIM+='<span class="IM_active">ON</span>'+NewLine;
      WebIM+='<span class="IM_unactive">OFF</span>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='</li>'+NewLine;
      WebIM+='<li class="IM_setitem">'+NewLine;
      WebIM+='<span>Animations</span>'+NewLine;
      WebIM+='<div id="IM_OP_Animation" class="IM_set_option" >'+NewLine;
      WebIM+='<span class="IM_active">ON</span>'+NewLine;
      WebIM+='<span class="IM_unactive">OFF</span>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='</li>'+NewLine;
      WebIM+='<li class="IM_setitem"><span id="IM_Tutorial">Tutorial</span></li>'+NewLine;
      WebIM+='<li class="IM_setitem"><span id="IM_About">About</span></li>'+NewLine;
      WebIM+='</ul>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='<div class="IM_footer">'+NewLine;
      WebIM+='<div class="IM_btn_save"><span></span>&nbsp;</div>'+NewLine;
      WebIM+='<div class="IM_btn_back" ><span></span>&nbsp;</div>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='</div>'+NewLine;
      WebIM+='<!-- 设置页面 end！-->'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='</div><!--MainPanel-->'+NewLine;
      WebIM+=''+NewLine;
      WebIM+='</div>'+NewLine;

      document.write(WebIM);

      var loadJS = function(url){
        var head =  document.getElementsByTagName("head")[0];
        var js = document.createElement('script');
        js.setAttribute('type', 'text/javascript');
        js.setAttribute('src', url);
        head.appendChild(js);
      };
      var loadCSS = function(url){
        var head =  document.getElementsByTagName("head")[0];
        var css = document.createElement('link');
        css.setAttribute('type', 'text/css');
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('href', url);
        head.appendChild(css);
      };
      loadJS('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js');
      loadJS(HOSTPATH + "js/socket.io.min.js");
      loadJS(HOSTPATH + "js/prettify.js");
      // IF OFFLINE, CREATE THE IP INFO BY YOURSELF
      //window.remote_ip_info = {start:'127.0.0.1', country:'Test', city:'Test', isp:'Test', province: 'Test'};
      var loadCoreLib = function(){
        var timeid = setInterval(function(){
          if(typeof remote_ip_info != "undefined" && typeof $ != "undefined" && typeof io != "undefined" ){
            loadJS(HOSTPATH + "js/webim.js?version=20120423");
            clearInterval(timeid);
          }
        }, 1000);
      };
      this.loadJQ = function(version){
        if(version){
          loadJS(HOSTPATH + 'js/' + version);
        }
        loadCoreLib();
      };
      this.loadTheme = function(style){
        loadCSS(HOSTPATH +'theme/' + style + '/css/' + style + ".css?version=20120423");
        loadCSS(HOSTPATH + "theme/blue/css/prettify.css");
      };
      this.setMiniBoxPosition = function(x, y){
        var minibox =  document.getElementById('IM_MiniBox');
        minibox.style.left = x + 'px';
        minibox.style.top = y + 'px';
      };
      this.show = function(){
        var webim = document.getElementById('WebIM');
        webim.style.display = '';
      }
      this.addContentReplaceRule = function(REGE, fn){ //封装聊天模块      
        var time = setInterval(function(){
          if(window.IM_ChatModule){ //Check WebIM Core load 
            window.IM_ChatModule.addContentReplaceRule(REGE,fn);
            clearInterval(time);
          }
        }, 1000);
      }
}
