<template>
  <div class="online-nav">
    <div class="nav">
    <div v-for="(item,index) in list"
    class="item ellipsis"
    :class="[
    {active:listIndex == index},
    {checked:checkList[index]}
    ]"
    @click="changeNav(index)"
    :key="index">
      <span>{{
      (item.text && item.text.length>5)
                ? item.text.substr(0,4)+'...'
                : item.text
      }}</span>
    </div>
    </div>
    <div v-show="listIndex==0" class="show-box">
    <!-- 方向专业 -->
      <div class="bg"></div>
      <div class="fl">
        <div class="ellipsis"
        @click="checkNavItemFrist(-1)"
        :class="{active:list[0].value1 === ''}">
          全部
        </div>
        <div v-for="(item,index) in navlist"
        @click="checkNavItemFrist(index)"
        :class="{active:item.id === list[0].value1}"
        class="ellipsis"
        :key="index">
          {{item.name}}
        </div>
      </div>
      <div class="fr">
        <div class="ellipsis"
        @click="checkNavItemSecond(-1)"
        :class="{active:list[0].value2 === ''}">
          全部
        </div>
        <div v-for="(item,index) in secondList"
        @click="checkNavItemSecond(index)"
        :class="{active:item.id === list[0].value2}"
        class="ellipsis"
        :key="index">
          {{item.name}}
        </div>
      </div>
    </div>
    <div v-show="listIndex==1" class="show-box auto">
    <!-- 价格 -->
      <div v-for="(item,index) in pricelist"
      :class="{active:item.value === list[1].value}"
      @click="checkNavItem(item)"
      :key="index"
      class="ellipsis">
        {{item.text}}
      </div>
    </div>
    <div v-show="listIndex==2" class="show-box auto">
    <!-- 类型 -->
      <div v-for="(item,index) in typelist"
      :class="{active:item.value === list[2].value}"
      @click="checkNavItem(item)"
      :key="index"
      class="ellipsis">
        {{item.text}}
      </div>
    </div>
    <div v-show="listIndex==3" class="show-box auto">
    <!-- 热度 -->
    <div v-for="(item,index) in hotlist"
      :class="{active:item.value === list[3].value}"
      @click="checkNavItem(item)"
      :key="index"
      class="ellipsis">
        {{item.text}}
      </div>
    </div>
    <div class="mask" @click="isShowMark = false;listIndex=-1" v-show="isShowMark"></div>

  </div>
</template>
<script>
export default {
  name: 'OnlineNav',
  data() {
    return {
      listIndex: -1,
      isShowMark: false,
      checkList: [false, false, false, false, false],
      list: [
        {
          text: '方向专业',
          value2: '',
          value1: '',
          active: false,
        }, {
          text: '价格',
          value: '',
          active: false,
        }, {
          text: '类型',
          value: '',
          active: false,
        }, {
          text: '最新',
          value: 0,
          active: false,
        },
      ],
      pricelist: [
        {
          text: '全部',
          value: '',
        }, {
          text: '免费',
          value: 0,
        }, {
          text: '付费',
          value: 1,
        },
      ],
      typelist: [
        {
          text: '全部',
          value: '',
        }, {
          text: '思维建立',
          value: 1,
        }, {
          text: '技能精进',
          value: 2,
        }, {
          text: '优秀实践',
          value: 3,
        },
      ],
      hotlist: [
        {
          text: '最新',
          value: 0,
        },
        {
          text: '最热',
          value: 1,
        },
      ],
      navlist: [],
      navlistIndex1: -1, // 一级菜单选中项
      navlistIndex2: -1, // 二级菜单选中项
      secondList: [], // 二级菜单列表
    };
  },
  mounted() {
    this.init();
  },
  activated() {
    this.isShowMark = false;
    this.listIndex = -1;
  },
  props: {
    navlistData: { // 方向专业数据
      type: Array,
      default: () => [],
    },
    listData: { // list 数据
      type: Array,
      default: () => [],
    },
  },
  methods: {
    init() {
      this.initList();
    },
    initList() {
      if (this.listData.length > 0) {
        this.list = this.listData;
      }
      let navlist = this.navlistData;
      /*eslint-disable*/ 
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
     
      this.navlist = getArrById().sort((a,b)=>{
        let asort = a['sort'] || 1;
        let bsort = b['sort'] || 1;
        if(asort>bsort){
          return 1;
        }else{
          return -1;
        }
      });
      /* eslint-enable */
      if (this.list[0].value1) {
        // 如果存在一级id  设置
        this.navlist.forEach((item, index) => {
          if (item.id === this.list[0].value1) {
            this.secondList = item.children;
            this.navlistIndex1 = index;
          }
        });
      } else {
        this.secondList = this.getAllList();
      }
    },
    changeNav(curindex) {
      // 选中导航
      if (this.listIndex === curindex) {
        this.listIndex = -1;
        this.isShowMark = false;
      } else {
        this.listIndex = curindex;
        this.isShowMark = true;
      }
    },
    checkNavItem(item) {
      // 选中选项
      this.list[this.listIndex].text = item.text;
      this.list[this.listIndex].value = item.value;
      this.checkList[this.listIndex] = true;
      console.log(this.checkList);
      this.listIndex = -1;
      this.isShowMark = false;
      this.emit('changeNav', this.list);
    },
    getAllList() {
      // 获取所有二级菜单
      let arr = [];
      this.navlist.forEach((item) => {
        arr.push(...item.children);
      });
      return arr;
    },
    checkNavItemFrist(index) {
      // 选中一级菜单
      this.navlistIndex1 = index;
      this.list[0].value2 = '';
      if (index === -1) {
        this.list[this.listIndex].value1 = '';
        this.secondList = this.getAllList();
      } else {
        this.list[this.listIndex].value1 = this.navlist[index].id;
        this.secondList = this.navlist[index].children;
      }
    },
    checkNavItemSecond(index) {
      // 选中二级菜单
      this.navlistIndex2 = index;
      if (index === -1) {
        // 选全部
        if (this.navlistIndex1 === -1) {
          this.list[this.listIndex].text = '全部';
        } else {
          this.list[this.listIndex].text = this.navlist[this.navlistIndex1].name;
        }
        this.list[this.listIndex].value2 = '';
      } else {
        // 选其他
        this.list[this.listIndex].text = this.secondList[index].name;
        this.list[this.listIndex].value2 = this.secondList[index].id;
      }
      this.checkList[this.listIndex] = true;
      console.log(this.checkList);
      this.listIndex = -1;
      this.isShowMark = false;
      this.emit('changeNav', this.list);
    },
  },
};
</script>
<style scoped>
.online-nav{
  width: 100%;
  position: relative;
}
.online-nav .nav{
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing:border-box;
  /* border-bottom: 1px solid #d8d8d8; */
  background: #fff;
}
.online-nav .item{
  display: flex;
  width: 25%;
  align-items: center;
  justify-content: center;
  height: 40px;
}
.online-nav .item span{
  padding-right: 16px;
  position: relative;
  display: inline-block;
  font-size: 12px;
  line-height: 38px;
}
.online-nav .item span:after{
  content: "";
  position: absolute;
  display: block;
  width: 10px;
  height: 6px;
  background: url('./imgs/icon-tran.png') no-repeat center center;
  background-size: 10px auto;
  right: 0;
  top: 16px;
}
.online-nav .item.checked,
.online-nav .item.active{
  color: #FB683C;
}
.online-nav .item.checked span:after{
  background-image: url('./imgs/icon-tran-checked.png');
}
.online-nav .item.active span:after{
  background-image: url('./imgs/icon-tran-active.png');
}
.show-box{
  position: absolute;
  width: 100%;
  height: 320px;
  top: 36px;
  z-index: 101;
  background: #fff;
  overflow-y: auto;
  left: 0;
  overflow: hidden;
  color: #444444;
}
.online-nav .auto{
  height:auto;
}
.bg{
  position: absolute;
  background: #F1F1F1;
  width: 25%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
}
.show-box .fl{
  width: 25%;
  height: 100%;
  overflow-y: auto;
  float: left;

}
.show-box .fr{
  width: 75%;
  height: 100%;
  float: left;
  overflow-y: auto;
}
.show-box .fl .active{
  background: #fff;
}
.show-box .ellipsis{
  height: 44px;
  line-height: 44px;
  font-size: 13px;
  padding-left: 15px;
  box-sizing:border-box;
  overflow: hidden;
  position: relative;
  border-top: 1px solid #d8d8d8;
}
.show-box .ellipsis.active{
  color: #FB683C;
}
.show-box .fl .ellipsis.active:before{
  content: "";
  position: absolute;
  width: 3px;
  height: 44px;
  left: 0;
  top: 0;
  background: #FB683C;
}
.mask{
  width: 100%;
  position: fixed;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.79);
  z-index: 100;
}
</style>
