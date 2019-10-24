# 使用 postMessage 实现iframe跨域情况下 父子通信

### 子页面：

```js
// 判断是否存在父页面
if(window.top !== window.self) {
    // 存在父页面 则向父页面发送数据 第二个参数是指向的父地址 *即通配符 生产环境下建议使用具体地址 更安全
    window.parent.postMessage('1','*')
}
```

### 父页面：

```js
window.addEventListener('message',function(e){
  // 子页面发送过来的数据在 事件对象的 data 属性中
  console.log(e.data)
  if (e.data === '1') {
    // 进行相应操作...
  }
})
```

- [MDN 关于PostMessage的详细文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)
- [W3Cschool 关于PostMessage的详细文档](https://www.w3cschool.cn/fetch_api/fetch_api-lx142x8t.html)

—— by **程宽**