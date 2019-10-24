<template>
  <div class="learnlist">

    <div class="empty" v-show="list.length<1 && isShowPage">
      <span class="icon-empty"></span>
      <p @click="routerReplace('/online-class')">还没收藏记录哦~ <br>
      <span class="active">现在去收藏</span></p>
    </div>
    <div v-if="list.length>0" class="view-wrapper">
      <cube-scroll
          ref="colScroll"
          :data="list"
          :options="options"
          :scrollEvents="['scroll-end']"
          @scroll-end="scroll"
          @pulling-up="onPullingUp">
        <!-- 上拉加载 -->
        <!-- 展示区域 -->
        <div class="list">
          <div v-for="(item,index) in list" class="item"
          :key="index">
            <ClassCard @cardClick="cardClick"
            :item="item" page="list">
            <template slot-scope="props"
            slot="title">
              <span :class="'classtype'+ props.item.type"
              >{{props.item.type==2?'公开课':'录播课'}}</span>
              {{props.item.title}}
            </template>
            <template slot-scope="props"
            slot="onlineIntro">
              <div class="col-box mtop">
                <span class="money"
                :class="{free:props.item.price==0}">
                {{props.item.price==0?'免费':'￥'+props.item.price}}</span>
                <span @click.stop="saveMyCollectionFn(props.item)" class="col">取消收藏</span>
              </div>
            </template>
            </ClassCard>
          </div >

        </div>
        <div v-if="list.length>14" class="h80"></div>
        <template slot="pullup" slot-scope="props">
          <div v-if="props.isPullUpLoad" class="tips">
            加载中...
          </div>
          <div v-else class="tips">
            <span v-show="list.length>14">
              没有更多了~
            </span>
          </div>
          </template>
      </cube-scroll>
        <!-- 返回顶部 -->
      <BackTop @backTop="scrollToTop"
      :isShowBackTop="isShowBackTop"></BackTop>
    </div>


  </div>
</template>
<script>
import {
  queryCollectionClass,
  saveMyCollection,
} from '@/api/apis';
import ClassCard from '@/views/components/card.vue';

export default {
  name: 'learnlist',
  data() {
    return {
      list: [],
      isShowPage: false,
      pageNum: 1, // 页面
      pageSize: 15, // 每页条数
      total: 0, // 总条数
      pullUpLoad: true,
      pullUpLoadThreshold: 100,
      pullUpLoadMoreTxt: '上拉加载',
      pullUpLoadNoMoreTxt: '没有更多了~',
      isShowBackTop: false, // 返回顶部

      saveMyCollectionParam: { // 取消收藏参数
        courseId: '', // 课程id
        onOffType: '', // 线上线下0 : 公开课； 1 线上课
      },
    };
  },
  components: {
    ClassCard,
  },
  watch: {
    $route() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  computed: {
    options() {
      return {
        pullUpLoad: this.pullUpLoadObj,
        scrollbar: false,
      };
    },
    pullUpLoadObj() {
      return this.pullUpLoad ? {
        threshold: parseInt(this.pullUpLoadThreshold, 10),
        txt: {
          more: this.pullUpLoadMoreTxt,
          noMore: this.pullUpLoadNoMoreTxt,
        },
      } : false;
    },
  },
  methods: {
    async init() {
      this.pageNum = 1;
      this.total = 0;
      this.isShowPage = false;
      this.list = [];
      // 获取在线课程导航
      this.onPullingUp('init');
    },
    scroll(pos) {
      if (pos.y < -this.scrollInitHeight) {
        this.isShowBackTop = true;
      } else {
        this.isShowBackTop = false;
      }
    },
    scrollToTop() {
      this.$refs.colScroll.scrollTo(0, 0, 300);
      this.isShowBackTop = false;
    },
    onPullingUp(t) {
      // 我的收藏
      let opt = { isHideLoading: true };
      if (t === 'init') {
        this.pageNum = 1;
        opt = {};
      }
      if (this.list.length >= this.total && t !== 'init') {
        this.$refs.colScroll.forceUpdate();
        return;
      }
      let { pageNum } = this;
      let { pageSize } = this;
      // this.total = 0;
      queryCollectionClass({
        pageNum,
        pageSize,
      }, opt).then((res) => {
        if (res.data.code === '0000') {
          this.isShowPage = true;
          this.pageNum += 1;
          if (res.data.list.length > 0) {
            /*eslint-disable*/
              res.data.list.forEach((item) => {
                item.pic = item.picture;
                item.id = item.courseId;
                item.title = item.className;
                item.price = item.classPrice;
                if(item.onOffType === "1"){
                  // 线上课
                  item.type = "1"
                }else{
                  // 公开课
                  item.type = "2"
                }
              });
             if(t==='init'){
              this.list = res.data.list
            }else{
              this.list = this.list.concat(res.data.list);
            }


            if (this.list.length >= res.data.total && t !== 'init') {
              this.$refs.colScroll.forceUpdate();
            }
          } else {
            this.$refs.colScroll && this.$refs.colScroll.forceUpdate();
          }
           /* eslint-enable */
          this.total = res.data.total;
        }
      }).catch((err) => {
        console.log(err);
        this.$message('我的收藏列表获取失败，请稍后再试');
      });
    },

    async saveMyCollectionFn(item) {
      // 收藏 如果未登录  提示去登陆
      let confirm = await this.$confirm('确定要取消收藏该课程吗？');
      if (!confirm) {
        return;
      }
      if (this.isCanRequest) {
        this.isCanRequest = false;
      } else {
        return;
      }

      this.saveMyCollectionParam.courseId = item.id;
      this.saveMyCollectionParam.onOffType = item.type === '2' ? 0 : 1;

      saveMyCollection(this.saveMyCollectionParam).then((res) => {
        this.isCanRequest = true;
        if (res.data.code === '0000') {
          // res.data.type === '1' 收藏   0 取消收藏
          if (res.data.type === '0') {
            this.cancelSucFn(this.saveMyCollectionParam.courseId);
            this.$message('已取消收藏');
          } else {
            // 如果是收藏  再次取消
            this.saveMyCollectionFn(item);
          }
        } else if (res.data.code !== '0002') {
          this.$message('取消失败，请重新操作');
        }
      }).catch((err) => {
        this.isCanRequest = true;
        console.log(err);
        // this.$message('取消失败，请重新操作');
      });
    },
    cancelSucFn(cid) {
      let i = -1;
      this.list.forEach((item, index) => {
        if (item.id === cid) {
          i = index;
        }
      });
      if (i !== -1) {
        this.list.splice(i, 1);
      }
      this.onPullingUp('init');
    },


  },
};
</script>
<style scoped>
.h80{
  height: 57px;
  display: block;
  position: relative;
  overflow: hidden;
}
.tips{
  display: block;
  width: 100%;
  color: #868686;
  text-align: center;
  font-size: 12px;
  padding: 7px 0 30px 0;
  height: 20px;
  line-height: 20px;
  position: absolute;
  bottom: 0;
}

.classtype2,
.classtype1{
  color: #FB683C;
  margin-right: 3px;
  font-weight: bold;
  font-size: 12px;
  background: rgba(251,104,60,0.15);
  border-radius: 3px;
  text-align: center;
  display: inline;
  padding: 4px 8px;
}
.classtype2{
  color: #3C68FB;
  background: rgba(60,104,251,0.15);
}
.col-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.col-box.mtop{
  overflow: hidden;
  padding-top: 20px;
}
.col-box .col{
  float: right;
  display: block;
  width: 68px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border: 1px solid #868686;
  border-radius: 15px;
  font-size: 12px;
}
.money{
  color: #FB683C;
  font-size: 17px;
  font-weight: bold;
  float: left;
}
.money.free{
  color: #2DAF53;
  font-weight: normal;
}
.view-wrapper{
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.empty{
    padding-top: 103px;
    font-size: 17px;
    color: #868686;
    text-align: center;
  }
  .icon-empty{
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 4px;
    margin: 0 auto;
    background: url('./imgs/icon-empty.png') no-repeat center center;
    background-size: 50px 50px;
  }
  .empty p{
    line-height: 24px;
    margin-top: 15px;
  }
  .empty p .active{
    color: #FB683C;
  }
   .list{
    border-bottom: 1px solid #d4d4d4;
    padding-left: 15px;
    display: block;
    width: 100%;
    box-sizing:border-box;
    background: #fff;
  }
  .list .item{
    width: 100%;
    padding: 15px 15px 15px 0;
    border-bottom: 1px solid #d4d4d4;
    box-sizing:border-box;
  }
  .list .item:nth-last-child(1){
    border-bottom: none;
  }
</style>
