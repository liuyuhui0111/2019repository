<template>
  <div id="commonOnlineClassNav"
  v-if="list.length>0"
  class="online-nav common-scroll-bar">
    <div class="nav-box">
     <div class="title">方向</div>
     <div class="list"
     :class="{open:isOpen[0]}">
       <span @click="changeNav(0,-1)"
       ref="list0"
       :class="{active:curNav[0].id==-1}">全部</span>
       <ul ref="ul0">
         <li v-for="(item,index) in firstList"
          @click="changeNav(0,item.id)"
         :class="{active:item.id == curNav[0].id}"
         :key="index">
           <p>{{item.name}}</p>
         </li>
       </ul>
       <div @click="open(0)"
         v-show="isShowIcon[0]"
         class="icon-box">
           <span class="icon-triangle"></span>
         </div>
     </div>
    </div>
      <div class="nav-box">
       <div class="title">专业</div>
       <div class="list"
       ref="list1"
       :class="{open:isOpen[1]}">
          <span
          @click="changeNav(1,-1)"
          :class="{active:curNav[1].id==-1}">全部</span>
          <ul ref="ul1">
           <li v-for="(item,index) in secondList"
           @click="changeNav(1,item.id)"
           :class="{active:item.id == curNav[1].id}"
           :key="index">
            <p>{{item.name}}</p>
           </li>
         </ul>
         <div @click="open(1)"
         v-show="isShowIcon[1]"
         class="icon-box">
           <span class="icon-triangle"></span>
         </div>
       </div>
     </div>
      <div class="nav-box">
       <div class="title">分类</div>
       <div class="list"
       ref="list2"
       :class="{open:isOpen[2]}">
          <span @click="changeNav(2,-1)"
          :class="{active:curNav[2].id==-1}">全部</span>
          <ul ref="ul2">
           <li v-for="(item,index) in threeList"
           @click="changeNav(2,item.id)"
           :class="{active:item.id == curNav[2].id}"
           :key="index">
             <p>{{item.name}}</p>
           </li>
         </ul>
         <div @click="open(2)"
         v-show="isShowIcon[2]"
         class="icon-box">
           <span class="icon-triangle"></span>
         </div>
       </div>
     </div>
  </div>
</template>
<script>
export default {
  name: 'online-nav',
  data() {
    return {
      name: 'online-nav',
      firstList: [],
      secondList: [],
      threeList: [],
      curNav: [{ id: -1 }, { id: -1 }, { id: -1 }], // 当前选中id
      childList: [], // children分层
      isShowIcon: [false, false, false],
      isOpen: [false, false, false],
    };
  },
  props: {
    list: { // 标题内容
      type: Array,
      default: () => [],
    },
    id: {
      type: [Number, String],
      default: (val) => {
        if (val === '') {
          return -1;
        }
        return parseInt(val, 10);
      },
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initList();
      this.initShowList(this.id);
    },
    open(index) {
      this.$set(this.isOpen, index, !this.isOpen[index]);
    },
    initNavHeight() {
      // 初始化高度 是否显示icon
      this.$nextTick(() => {
        /*eslint-disable*/ 
        for (let i = 0; i < this.isShowIcon.length; i++) {
          let ulH = this.$refs[`ul${i}`].clientHeight;
          this.$set(this.isShowIcon, i, ulH > 60);
          // this.isShowIcon[i] = ulH>60;
        }
      });
    },
    changeNav(index, id) {
      this.curNav[index].id = id;
      // this.$set(this.curNav[index],'id',id);
      // 全部
      if (index === 0) {
        this.initShowList(id);
      } else if (index === 1) {
        if (id === -1) {
          this.initShowList(this.curNav[index - 1].id);
        } else {
          this.initShowList(this.curNav[index].id);
        }
      } else {

      }
      this.$emit('changeNav', this.curNav);
    },
    initList() {
      let navlist = this.list;
      
      function getArrById(id) {
        let arr = [];
        for (let i = 0; i < navlist.length; i++) {
          if (!id && navlist[i].id === navlist[i].pid) {
            arr.push({ children: getArrById(navlist[i].id), ...navlist[i] });
          } else if (navlist[i].pid === id && navlist[i].id !== navlist[i].pid) {
            arr.push({ children: getArrById(navlist[i].id), ...navlist[i] });
          }
        }
        return arr;
      }

      this.childList = getArrById().sort((a,b)=>{
        let asort = a['sort'] || 1;
        let bsort = b['sort'] || 1;
        if(asort>bsort){
          return 1;
        }else{
          return -1;
        }
      });
    },
    initShowList(curid) {
      // 没有id  全部
      let id = curid===''?-1:curid;
      this.curNav = [-1, -1, -1];
      this.firstList = this.childList;
      this.secondList = [];
      this.threeList = [];

      function getListById(data, id) {
        for (let i = 0; i < data.length; i++) {
          if (data[i] && data[i].id == id) {
            return [data[i]];
          }
          if (data[i] && data[i].children) {
            let d = getListById(data[i].children, id);
            if (d) return d.concat(data[i]);
          }
        }
      }
      if (!getListById(this.childList, id)) {
        // 没找到对应id 展示全部
        this.curNav = [{ id: -1 }, { id: -1 }, { id: -1 }];
      } else {
        this.curNav = getListById(this.childList, id).reverse();

        for (let i = this.curNav.length; i < 3; i++) {
          this.curNav[i] = { id: -1 };
        }
        this.curNav = JSON.parse(JSON.stringify(this.curNav));
      }

      for (let i = 0; i < this.firstList.length; i++) {
        if (this.curNav[0].id === -1) {
          this.secondList = this.secondList.concat(this.firstList[i].children);
        } else if (this.curNav[0].id === this.firstList[i].id) {
          this.secondList = this.secondList.concat(this.firstList[i].children);
        }
      }
      for (let i = 0; i < this.secondList.length; i++) {
        if (this.curNav[1].id === -1) {
          this.threeList = this.threeList.concat(this.secondList[i].children);
        } else if (this.curNav[1].id === this.secondList[i].id) {
          this.threeList = this.threeList.concat(this.secondList[i].children);
        }
      }
      /* eslint-enable */
      this.initNavHeight();
    },
  },
};
</script>
<style scoped>
  .online-nav{
    display: block;
    width: 100%;
    max-height: 305px;
    overflow-y: auto;
    font-size: 14px;
  }
  .nav-box{
    position: relative;
    padding-left: 80px;
    min-height: 60px;
    line-height: 60px;
    box-sizing:border-box;

  }
  .nav-box .title{
    position: absolute;
    left: 0;
    top: 0;
    height: 60px;
  }
  .nav-box .list{
    display: block;
    box-sizing:border-box;
    position: relative;
    height:60px;
    overflow-y: hidden;
    padding: 10px 60px;
  }
  .nav-box .list.open{
    height: auto;
  }
  .nav-box .list span{
    cursor: pointer;
    position: absolute;
    min-height: 60px;
    line-height: 60px;
    left: 0;
    top: 0;
  }
  .nav-box .list ul li:hover,
  .nav-box .list ul li.active,
  .nav-box .list span:hover,
  .nav-box .list span.active{
    color: #FB683C;
  }
  .nav-box .list:after{
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px dashed #d4d4d4;
  }
  .nav-box .list ul{
    overflow: hidden;
    position: relative;
  }
  .nav-box .list ul li{
    display: block;
    float: left;
    line-height: 40px;
    min-height: 40px;
    margin-right: 30px;
  }
  .nav-box .list ul li p{
    display: inline-block;
    line-height: 20px;
    cursor: pointer;
  }
  .nav-box .list .icon-box{
    position: absolute;
    right: 0;
    top: 0;
    width: 60px;
    height: 40px;
    cursor: pointer;
  }
  .nav-box .list span.icon-triangle{
    position: absolute;
    left: inherit;
    z-index: 11;
    top: 30px;
    right: 20px;
    width: 0;
    height: 0px;
    min-height: 0;
    line-height: 0;
    padding: 0;
    margin: 0;
    border-width: 8px;
    /*border-color: #d4d4d4;*/
    transition: transform 0.3s;
    transform: rotate(0deg);
  }
  .nav-box .list.open span.icon-triangle{
    transform: rotate(180deg);
    transform: rotate(0deg)\0;
    display: inline-block;
    border-left: 8px solid transparent\0;
    border-right: 8px solid transparent\0;
    border-top: 0px solid #868686\0;
    border-bottom: 8px solid #868686\0;
  }
</style>
