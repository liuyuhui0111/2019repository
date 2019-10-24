<template>
  <div v-show="isShowPage" class="question">
    <div class="header">
      <div @click="$emit('back')" class="back">
        <span class="iconfont iconfanhui"></span>
        返回
      </div>
      <template v-if="list.length<1">
        暂无用户聊天记录
      </template>
      <template v-else>
        {{title}}
      </template>
    </div>
    <div class="contain common-scroll-bar">
        <template v-if="list.length>0">
          <div class="item" v-for="(item,index) in list"
          v-show="item.objectName != 'RC:InfoNtf'
          && (item.flag != '1' || item.objectName == 'RC:TxtMsg')"
          :key="index">
            <img :src="item.content.extra.icon" alt="" class="icon">
            <div class="mes">
              <div class="name">
                <span>{{item.content.extra.name}}</span>
                <span class="time">{{getLogTime(item.msgTimestamp)}}</span>
              </div>
              <p v-if="item.objectName == 'RC:TxtMsg'">
                <span class="file-box">
                  {{item.content.content}}
                </span>
              </p>
              <p class="img-box" v-if="item.objectName == 'RC:ImgMsg'">
                <img @click="imgClick(item)"
                :src="item.content.content" alt="">
              </p>
              <p @click="imgClick(item)"  class="file"
              v-if="item.objectName == 'RC:FileMsg'">
                {{item.content.name}}
              </p>
            </div>
          </div >
        </template>
    </div>
    <div v-show="isShowPreviewImg" class="previewImg">
      <!-- 预览大图 -->
      <span @click="isShowPreviewImg =false" class="el-icon-close"></span>
      <img :src="previewImg" alt="">
    </div>
  </div>
</template>
<script>
import {
  getIMById,
} from '@/api/apis';
import {
  formatDate,
} from '@/assets/utils/timefn';

export default {
  name: 'meslog',
  data() {
    return {
      name: 'meslog',
      list: [],
      isShowPage: false,
      title: 'xx与xx的聊天记录',
      previewImg: '',
      isShowPreviewImg: false,
    };
  },
  props: {
    mesid: { // 咨询单id
      type: String,
      default: () => '',
    },
    fromExpertId: { // 转单专家id
      type: String,
      default: () => '',
    },
    meslogList: {
      type: Object,
      default: () => null,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      /* eslint-disable */
      
      
      let params = { id: this.mesid,fromExpertId:this.fromExpertId }
      let res = await getIMById(params);
      
      this.isShowPage = true;
      if(res.data.code === '0000'){
        let arr = [];
        // 过滤聊天记录  不展示系统自定义消息;
        res.data.data.msgList.forEach((item)=>{
          if(item.objectName !== 'RC:DxhyMsg' 
            && item.objectName !=='RC:GrpNtf'
            && item.targetId 
            && item.fromUserId){
            arr.push(item);
          }
        })
        this.list = arr;
        this.title = res.data.data.title;
      }
      /* eslint-enable */
    },
    getLogTime(time) {
      if (!time) {
        return '';
      }
      let str = formatDate(time);
      console.log(str);
      return str;
    },
    imgClick(item) {
      console.log(item, '点击图片消息');
      if (item.objectName === 'RC:ImgMsg') {
        this.previewImg = item.content.imageUri;
        this.isShowPreviewImg = true;
        // window.open(item.content.imageUri, '_blank');
      } else {
        window.open(item.content.fileUrl, '_blank');
      }
    },
    backToView() {
      this.$router.push({ path: '/askMange' });
    },
  },
};
</script>
<style scoped>
/*图片链接*/
.img-box img{
  cursor: pointer;
  max-width: 500px;
  max-height: 500px;
}
/*大图预览*/
.previewImg{
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0.8);
}
.previewImg .el-icon-close{
  color: #fff;
  position: absolute;
  right: 0;
  top: 0;
  width: 40px;
  height: 40px;
  font-size: 34px;
  cursor: pointer;
}
.previewImg img{
  max-width: 100%;
  max-height: 100%;
}
.question{
  position: absolute;
  top:0;
  left:68px;
  bottom: 0;
  right: 0;
  background: #fff;
  z-index: 100;
}
.contain{
  position: absolute;
  top: 50px;
  bottom: 0px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}
.contain .item{
  display: block;
  position: relative;
  box-sizing:border-box;
  width: 100%;
  padding-left: 84px;
}
.contain .item img.icon{
  display: block;
  width: 44px;
  height: 44px;
  position: absolute;
  left: 30px;
  top: 16px;
  border-radius: 100%;
}
.contain .item .mes{
  padding: 16px 30px 16px 0;
  border-bottom: 1px solid #e7e7e7;
  box-sizing:border-box;
  min-height: 76px;
  text-align: left;
}
.contain .item .mes .name{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
color: #333333;
  width: 100%;
  margin-bottom: 4px;
}
.contain .item .mes p{
  font-size: 12px;
color: #666666;
text-align: left;
}
.contain .item .mes .name .time{
  font-size: 12px;
color: #999999;
}
.question .footer,
.question .header{
  background: #F5F5F5;
  position: absolute;
  height: 50px;
  line-height: 50px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 16px;
color: #333333;
}
.question .header{
  top: 0;
}
.question .footer{
  bottom: 0;
}
.question .header .back{
  position: absolute;
  left: 30px;
  cursor: pointer;
}
</style>
