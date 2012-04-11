//有参数调用
$(document).ready(function() {
  $("#btn").click(function() {
    var result = remote_ip_info.start + '-' + remote_ip_info.end
    + ' - ' + remote_ip_info.country + '-' + remote_ip_info.province + '-'
    + remote_ip_info.city + '-' + remote_ip_info.isp;
  alert(result);
  $('#dictionary').text(result);
  });
});

