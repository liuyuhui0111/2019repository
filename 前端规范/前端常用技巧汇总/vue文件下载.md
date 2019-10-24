/*
*封装函数 downLoadFile.js
*params:  
*data:二进制文件
*/
```
exports.install = function (Vue, options){
  Vue.prototype.downloadFile =function(data){
    if (!data) {
      return
    }
    let url = window.URL.createObjectURL(new Blob([data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', 'excel1111.xlsx')
    document.body.appendChild(link)
    link.click()
   };
}


/---发送请求 获取二进制流
this.$http.post(this.baseUrl+"/api/v1/statistic/export/event/817BA83027DA43F491486829E668DBEC",
          {
            startTime:time[0],
            endTime:time[1]
          },
            //--headers和responseType一定要在一起设置，否则会导致 获取到的二进制文件流 格式不正确
          {
            headers: {                                       
              'content-type': 'application/json; charset=utf-8',
              'token':sessionStorage.getItem("tokens"),
            },
            responseType: 'blob'      //--设置请求数据格式
          })
          .then((res)=>{
//            console.log(res);
            this.downloadFile(res.data);  //---调用函数
          }).catch((erro)=>{
            console.log("erro-----",erro);
        })
```
--------------------- 
作者：web_who 
来源：CSDN 
原文：https://blog.csdn.net/qq_42842709/article/details/82498585 
版权声明：本文为博主原创文章，转载请附上博文链接！