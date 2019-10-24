# ElementUi 分页无法完全重置
###### ElementUi的分页配合选项卡同时使用时，当我们分页选到第二页后切换选项卡，虽然看到的页码显示为1，但数据却是第二页的数据，同时“？条/页”也无法重置

###### 这种问题是ElementUi分页本身无法完全重置导致的
###### 解决方法：我们只需要先将分页销毁，重新创建一个即可；在分页器中加入v-if=“paginationShow”，初始状态为true，当我们切换选项卡，触发handleClick事件，把分页paginationShow属性置为false，后通过$nextTick事件将paginationShow属性置为true重新创建一个分页
```
handleClick(){
    this.paginationShow = false
    this.$nextTick(()=>{
         this.currentPage = 1
         this.page = 10
         this.paginationShow = true
    })
}
```

by-王柳