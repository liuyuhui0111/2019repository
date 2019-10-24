// 微信jsApi
import { replaceCode } from '@/assets/utils/util';
/*eslint-disable*/ 
export function wxConfig(data,shareData){
  /*
  *微信config配置
  *window.CONFIG.DEV
  */
  if(wx){
    wx.config({
      debug:false && process.env.NODE_ENV !== 'production',
      appId:data.appId,
      timestamp:data.timestamp,
      nonceStr:data.nonceStr,
      signature:data.signature,
      jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline","hideMenuItems"]
      // jsApiList: ["updateAppMessageShareData", "updateTimelineShareData","hideMenuItems"]
    });
    wx.ready(()=>{
      // alert("微信ready执行分享参数:"+JSON.stringify(shareData));
      shareStart(shareData);
      hideShare();
      
    });
    wx.error((res)=>{
      console.log(res);
      // alert("微信error执行报错信息："+ JSON.stringify(res))
    });
  }else{
    // alert("微信jssdk加载失败")
  }
}

function setShareFrom(h){
  // 设置分享来源
  // 不存在  设置来源字段
  let href = h || '';
  let host = href.split('?')[0]
  let query = '';
  if(href.indexOf('?')!==-1){
    let qs = href.split('?')[1];
    if(qs.indexOf('fromRoute')!==-1){
      // 存在来源字段  把来源字段替换成分享
      let qslist = qs.split('&');
      
      qslist.forEach((item)=>{
        if(item.indexOf('fromRoute')===-1){
          // 设置fromRoute值
          query = query+'&'+item;
        }
      });
      if(query){
        query = '?fromRoute=share'+query;
      }else{
        query = '?fromRoute=share';
      }
      href = host+query;
    }else{
      href = href + '&fromRoute=share';
    }
  }else{
    href = href + '?fromRoute=share';
  }
  return href;
}

export function shareStart(shareData){
  
  // 分享到朋友圈
  let url = setShareFrom(shareData.link)
  shareData.link = replaceCode(url);
  console.log('分享链接++分享链接++分享链接++分享链接++++++++++'+url+'==='+shareData.link);
  wx.onMenuShareTimeline({
    title: shareData.title, // 分享标题
    link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl:shareData.imgUrl, // 分享图标
    success: shareData.success,
    cancel: shareData.cancel
  });
  // wx.updateAppMessageShareData({
  //   title: shareData.title, // 分享标题
  //   link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
  //   imgUrl:shareData.imgUrl, // 分享图标
  //   success: shareData.success,
  //   cancel: shareData.cancel
  // });
  //分享给朋友
  
  wx.onMenuShareAppMessage(shareData);
  // wx.updateAppMessageShareData(shareData);
}
export function hideShare(){
  // 批量隐藏功能按钮接口
  wx.hideMenuItems({
    menuList: [
      // "menuItem:copyUrl", //复制链接
      "menuItem:originPage",  //原网页
      "menuItem:openWithQQBrowser", //qq浏览器打开
      "menuItem:openWithSafari",    //safari浏览器打开
      "menuItem:share:email",       //邮件
      "menuItem:share:QZone",       //分享QQ空间
      "menuItem:share:facebook",      //分享到fb
      "menuItem:share:weiboApp",      //分享到微博
      "menuItem:share:qq",        //分享到QQ

    ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
  });
}


function onBridgeReady(data,sucFn){
  // 微信支付
    // {
    //      "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入     
    //      "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数     
    //      "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串     
    //      "package":"prepay_id=u802345jgfjsdfgsdg888",     
    //      "signType":"MD5",         //微信签名方式：     
    //      "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
    //   }
   WeixinJSBridge.invoke(
      'getBrandWCPayRequest', data,
      function(res){
        if(res.err_msg == "get_brand_wcpay_request:ok" ){
        // 使用以上方式判断前端返回,微信团队郑重提示：
              //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          sucFn && sucFn();
        } 
   }); 
}


export function onBridgeReadyFn(data) {
  // 微信支付
  if (typeof WeixinJSBridge == "undefined"){
   if( document.addEventListener ){
       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
   }else if (document.attachEvent){
       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
   }
  }else{
     onBridgeReady();
  }
}
