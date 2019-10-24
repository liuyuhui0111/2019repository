(function(window){
  var COMMONID = 'ExpectInitRongCloudBoxId';
  var iframeSrc = window.rongCloudConfigData.host + '/expertclient/#/index';
  var iframeOrigin = window.rongCloudConfigData.host;
  var cssText = "width:100%;height:100%;max-height:600px;max-width:600px;position:fixed;right:0;bottom:0;z-index:99999;border:1px solid #ccc;box-shadow:0px 0px 3px 0 #ccc;"
  window.initRongCloud = function(userData){
    // userData  参数
      // id: 'l849643088@163.com',
      // name: '测试用户',
      // icon: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1372494972,1692060958&fm=26&gp=0.jpg',
      // account: 'l849643088@163.com',
      // channelFrom:'1624',
      // fromAddress:'http://test.5ifapiao.com:8888/course-430100004#/index',
      // fromName:'优税学院',
      // fromContent:'http://test.5ifapiao.com:8888/course-430100004#/index',
      // companyLocation:'http://test.5ifapiao.com:8888/course-430100004#/index',
       //distributorId: 0,    渠道id
      // accnout:'l849643088@163.com',
      // accnoutId:'l849643088@163.com',
    if(!userData){
      throw new Error("参数不对，token为必填参数");
      return;
    }
    if(!document.getElementById(COMMONID)){
      // 还没有初始化
      if(document.getElementById(COMMONID).style.display === 'block'){
        document.getElementById(COMMONID).style.display = 'none';
        return;
      }
      var timer = setInterval(function(){
        if(document.getElementById(COMMONID)){
          clearInterval(timer);
          sendMessage();
        }
      },500)
    }else{
      sendMessage();
    }

    function sendMessage(){
        document.getElementById(COMMONID).style.cssText='display:block;'+cssText;
        var contentWindow = document.getElementById(COMMONID+'iframe').contentWindow;
        contentWindow.postMessage({code:'0000',data:userData}, iframeOrigin);
    }


    
  }
  window.addEventListener('message', function (e) {
      console.log(e.origin)

      if(e.data.code === '200'){
        // 收到消息
        console.log(e.data);
        if(e.data.data === "hide"){
          document.getElementById(COMMONID).style.display = "none";
        }
      }
  });
  function init() {

    if(document.getElementById(COMMONID)) return;
    

    var oBody = document.querySelector("body");
    var oDiv = document.createElement('div');
    var oIframe = document.createElement('iframe');
    oIframe.frameborder="0";
    oIframe.id = COMMONID+'iframe';
    oIframe.src=iframeSrc+'?t='+new Date().getTime();
    oIframe.style.cssText = 'width:100%;height:100%;max-height:600px;max-width:600px;border:none;';
    oDiv.id=COMMONID;
    oDiv.style.cssText='display:none;'+cssText;
    oDiv.appendChild(oIframe);
    oBody.appendChild(oDiv);
  }
  init();
  window.onload = function(){
    init();
  }


})(window)



// accnoutId string  
// 必须
// 用户ID  
// channelFrom string  
// 必须
// 咨询来源1624：学院 
// fromName  string  
// 必须
// 来源名称  
// fromAddress string  
// 必须
// 企业地址  
// fromContent string  
// 必须
// 来源内容（优税学院为课程名称，宝典为文章标题  
// companyLocation string  
// 必须
// 企业地址  
// questionDesc  string  
// 必须
// 问题描述


// var iframe = document.createElement("iframe");
// iframe.src = "http://www.planabc.net";
// if (iframe.attachEvent){    
//     iframe.attachEvent("onload", function(){        
//         alert("Local iframe is now loaded.");    
//     });
// } else {    
//     iframe.onload = function(){        
//         alert("Local iframe is now loaded.");    
//     };
// }
// document.body.appendChild(iframe);
