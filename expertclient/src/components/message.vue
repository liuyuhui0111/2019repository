<template>
  <div v-if="curUserData.id" class="message common-message">


    <div @click="isShowEmoji=false" class="messagebox">

      <template v-if="isShowMessage">

        <div class="headerbox">
          <span class="title">{{curTargetUserData.name}}</span>
          <span @click="hideMessage()" class="close"></span>
           <!-- 结束 -->
          <el-popover
          placement="left"
          width="168"
          v-model="closeCofirmBox"
          trigger="click">
          <div class="close-confirm-box">
            <p>确定要结束咨询吗？</p>
            <div class="btnbox">
              <span @click="closeCofirmBox=false" class="cancel">取消</span>
              <span @click="endEvaluateFn()" class="sub">确定</span>
            </div>
          </div>
          <span slot="reference"
          class="icon-close">结束咨询</span>
          </el-popover>
        </div>
      <!-- 聊天展示区域 -->
      <div id="meslist"
      class="meslist common-scroll-bar">


        <!-- 系统提示盒子 -->
        <div :personnNum="mesListData[0].personnNum"
        v-show="mesListData[0].personnNum>0" class="systemtips">
          <p>
              排队<span>{{mesListData[0].personnNum}}</span>人，请耐心等候专家回复
          </p>
        </div>
        <!-- 系统提示占位盒子 -->
        <div v-show="mesListData[0].personnNum>0
        && mesListData[0].list.length>0"
        class="h34"></div>
        <template v-if="mesListData[0].list.length>0">
        <div v-for="(item,index) in mesListData[0].list"
        :data="item.fromUserId"
        class="item"
        :class="[
          {on:item.senderUserId==userId || item.fromUserId==userId},
          {system:item.objectName == 'RC:InfoNtf'},
          {create:item.content.type == '0001'},
        ]"
        :key="index">
          <div v-if="item.content.extra &&
          item.objectName != 'RC:InfoNtf'" class="user">
            <img :src="item.content.extra.icon" alt="">
          </div>


          <template v-if="item.objectName == 'RC:InfoNtf'">
          <!-- 系统消息 -->
            <div class="systembox">
              <p v-text="getSystemTip(item)"></p>
              <span class="after"></span>
            </div>

          </template>
          <div class="mesbox">
          <div v-if="item.content.extra &&
          item.objectName != 'RC:InfoNtf'"
          class="name">{{item.content.extra.name}}</div>


          <template v-if="item.objectName == 'RC:DxhyMsg'
          && item.content.contentType =='MSG_END_REQUEST'">
          <!-- 文本消息 -->
            <div class="mes">
            <p>是否可以结束咨询？</p>
            <span class="after"></span>
            </div>
            <div class="closeQuestion-btns">
              <span @click="endEvaluateFn()" class="yes">可以</span>
              <span @click="sendQuestion($event,'我还有问题')" class="no">我还有问题</span>
            </div>
          </template>


          <template v-if="item.objectName == 'RC:TxtMsg'">
          <!-- 文本消息 -->
            <div class="mes">
            <p v-html="emojiToHtml(item.content.content)"></p>
            <span class="after"></span>
            </div>
          </template>


          <template v-if="item.objectName == 'RC:ImgMsg'">
            <!-- 图文消息 -->
            <div class="imgbox mes"
            @click="imgClick(item.content.imageUri)"
            :class="{finish:!item.uploading}">
              <img :id="item.id" :src="item.content.content">
              <span class="after"></span>
            </div>
          </template>

          <template v-if="item.objectName == 'RC:FileMsg'">
            <!-- 文件消息 -->
            <div class="filebox imgbox mes"
            @click="imgClick(item.content.fileUrl)"
            :class="{finish:!item.uploading}">
              <a href="javascript:">{{item.content.name}}</a>
              <span class="after"></span>
            </div>
          </template>
          </div>
        </div >
        </template>
        <!-- 显示评分消息 -->
          <div v-show="isShowRateMesBox" class="ratemesbox">
            <rate @success="dialogCompentVisibleSub"></rate>
          </div>
      </div>

      <!-- 发送区域 -->
      <div class="sendbox">
        <div v-show="hidemask" class="hidemask">
          <!-- 禁用聊天遮罩层 -->
          <span class="btn-sub" @click="again()">再次咨询</span>
        </div>
        <div class="btns">
          <span @click.stop="emojiClick"
          title="表情"
          class="iconfont iconbiaoqing"></span>
          <label for="picture">
          <span title="上传图片"
          class="iconfont iconfasongtupian"></span></label>
          <input style="display:none;"
          @change="fileChange($event,'img')"
          accept="image/jpeg,image/jpg,image/gif,image/png,image/bmp"
          ref="picture"
          type="file" id="picture" name="picture">


          <input
          @change="fileChange($event,'file')"
          ref="file"
          style="display:none;" type="file" id="file" name="file">
          <label for="file">
          <span title="上传文件"
          class="iconfont iconfasongwenjian"></span>
        </label>

          <!-- 数据授权 -->
          <!--  <el-popover
          placement="top"
          width="60"
          trigger="hover">
          <span class="popover">数据授权</span>
          <span @click="requestAuthFn" slot="reference" class="iconfont iconzhuandan1"></span>
          </el-popover> -->


        </div>
        <div class="inp h60">
          <div v-if="isShowEmoji && emojiList.length>0"
          @click.stop
          class="emojibox">
             <div class="item" v-for="(item,index) in emojiList"
             @click="emojiClickItem(item)"
             :key="index" v-html="item.node.outerHTML">
             </div >
          </div>
          <div @keyup.enter="startSendMes()">
            <el-input

            type="textarea"
            placeholder="说点什么吧"
            v-model="mesData"
            rows="3"
            resize="none"
            show-word-limit
            ></el-input>
          </div>
          <!-- <textarea v-model="mesData" placeholder="说点什么吧"></textarea> -->
        </div>
      </div>
      <div class="btn-sub sub" @click="startSendMes()">发送</div>

      </template>
      <!-- 问题弹窗 -->
      <div v-show="dialogQuestion" class="dialog-question">
          <div class="dialog-header">
            <span>优税专家</span>
            <p>财税问题·专业解答</p>
          </div>
          <div class="dialog-content">
            <p>请描述您要向专家咨询的问题，以便专家为您详细解答。</p>
            <div class="inp">
            <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="getExpertQuestionParam.question_desc"
            rows="10"
            resize="none"
            maxlength="150"
            show-word-limit
            ></el-input>
            </div>
            <div class="btns">
              <span @click="hideMessage()" class="btn-sub btn-cancel">取消</span>
              <span @click="getExpertQuestionFn()" class="btn-sub">发送</span>
            </div>
          </div>
      </div>

      <div v-show="dialogRightVisible" class="dialog-mask">
        <!-- 无权益填写个人信息弹窗 -->
        <div class="dialog-box">
        <el-dialog title=""
        :modal-append-to-body="boolFalse"
        :close-on-click-modal="boolFalse"
        @close="hideMessage()"
        :modal="boolFalse"
        :visible.sync="dialogRightVisible">
            <p class="title">您的免费权益已全部消耗，成为VIP会员继续免费咨询</p>
            <p class="tip">留下您的信息，工作人员将在24小时内联系您</p>
            <div class="inpbox">
              <div class="name">
                <el-input
                  placeholder="请输入姓名"
                  v-model="userParam.name">
                </el-input>
              </div>
              <div class="tel">
                <el-input
                  placeholder="请输入电话"
                  v-model="userParam.tel">
                </el-input>
              </div>
            </div>
            <span @click="addVipNoticeFn" class="btn-sub auto">提交</span>

            <p class="custom-tel">您也可以拨打电话{{tel}}</p>
        </el-dialog>
        </div>
      </div>


      <!-- 评价弹窗 -->
      <div v-if="dialogCompentVisible" class="dialog-mask">
        <!-- 评价弹窗弹窗 -->
        <div class="dialog-box-componet-dialog">
        <el-dialog title=""
        :modal-append-to-body="boolFalse"
        :close-on-click-modal="boolFalse"
        :modal="boolFalse"
        :visible.sync="dialogCompentVisible">
          <rate @success="dialogCompentVisibleSub"></rate>
        </el-dialog>
        </div>
      </div>
      <!-- 遮罩层 -->
      <div v-show="isShowMask" class="mask"></div>
      <!-- 上传压缩相关隐藏dom -->

      <canvas id="canvas" style="display:none;"></canvas>

    </div>


  </div>
</template>
<script>

/*eslint-disable*/ 
import message from './message'
export default message;
</script>
<style>
  .el-popover{
    min-width: 50px;
  }
  .common-message .el-dialog__wrapper{
    display: flex;
    align-items: center;
  }
  .common-message .inp .el-textarea__inner{
    border: none;
    
  }
  .common-message .inp.h60 .el-textarea__inner{
    overflow-y: auto;
    height: 80px;
    min-height: 80px;
    font-size:12px;
  }
  .el-message-box__message p{
    text-align: center;
    font-size: 14px;
    margin-bottom: 10px;
    color: #333333;
  }
  .el-message-box__btns{
    text-align: center;
    margin-bottom: 10px;
  }
  .el-input__inner:active,
  .el-input__inner:focus,
  .el-input__inner:hover{
    border-color: #33C8DF;
  }
  .el-message-box__btns .el-button--primary:active,
  .el-message-box__btns .el-button--primary:focus,
  .el-message-box__btns .el-button--primary:hover,
  .el-message-box__btns .el-button--primary{
    color: #FFF;
    background-color: #33C8DF;
    border-color: #33C8DF;
  }
  .el-message-box__btns button:nth-child(2){
    margin-left: 20px;
  }
  .common-dialog-mes .icon-auth{
    padding-left: 18px;
  }
  .common-dialog-mes .icon-auth:before{
    content: "";
    position: relative;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background: #33C8DF;
    display: inline-block;
    margin-right: 8px;
  }
  .common-message .dialog-box .el-dialog{
    width: 400px;
    /*box-sizing:border-box;*/
  }
  .common-message .dialog-box-componet-dialog .el-dialog{
    width: 500px;
    box-sizing:border-box;
  }
  .el-dialog__body{
    padding: 10px 32px;
    color: #333;
    font-size: 14px;
  }
  .el-dialog__wrapper{
    overflow: hidden;
  }


</style>
<style scoped>
/*是否可以结束咨询提示*/
.closeQuestion-btns{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
.closeQuestion-btns span{
  display: block;
  border: 1px solid #33C8DF;
  color: #33C8DF;
  text-align: center;
  height: 30px;
  line-height: 30px;
  padding:0 15px;
  border-radius: 15px;
  margin-right: 20px;
  cursor: pointer;
}
/* 结束咨询 */
.icon-close{
  cursor: pointer;
  display: block;
  position: absolute;
  width: 80px;
  height: 27px;
  background: #FD8606;
  border-radius: 30px 0 0 30px;
  right: 0;
  top: 74px;
  z-index: 8;
  color: #fff;
  text-align: center;
  line-height: 27px;
}
/* .icon-close:hover{
  opacity: 0.1;
} */
/* 重写遮罩层背景 */
.mask{
  background: rgba(0,0,0,0.3);
  z-index: 8;
  
}
/*消息评分*/
.ratemesbox{
  width: 328px;
  height: 345px;
  position: relative;
  border: 1px solid #D8D8D8;
border-radius: 4px;
border-radius: 4px;
float: left;
padding: 16px;
margin: 16px;
}



/*没有权益提交用户信息*/
  .dialog-box .title{
    text-align: left;
    margin-bottom: 16px;
  }
  .dialog-box .tip{
    font-size: 12px;
    margin-bottom: 6px;
  }
  .dialog-box .inpbox{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dialog-box .inpbox .name{
    width: 33%;
  }
  .dialog-box .inpbox .tel{
    width: 65%;
  }
/*弹窗*/
.dialog-mask{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: -10%;
  height: 110%;
  z-index: 100;
}
.dialog-box{
  background: #fff;
}
/*问题弹窗*/
.dialog-question{
  position: absolute;
    width: 90%;
    height: 74%;
    overflow-y: auto;
    overflow-x: hidden;
    background: #F8FEFF;
    left: 5%;
    top: 13%;
    z-index: 9;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 0 40px;
}
.dialog-header{
  padding: 18px 0;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px dashed #d5d5d5;
  color: #33C8DF;
  margin-top: 12px;
}
.dialog-header span{
  font-size: 22px;
}
.dialog-header p{
  font-size: 10px;
}
.dialog-content{
  width: 100%;
  margin: 0 auto;
}
.dialog-content p{
  padding-top: 20px;
  padding-bottom: 16px;
  font-size: 14px;
  color: #333333;
}
.dialog-content .inp{
  border: 1px solid #D8D8D8;
}


.popover{
  font-size: 12px;
  color: #333;
  text-align: center;
  display: block;
  height: 22px;
  line-height: 22px;
}
/*系统提示*/

.systemtips{
  position: fixed;
  width: 100%;
  font-size: 12px;
  color: #333333;
  z-index: 10;
}
.systemtips p{
  display: block;
  width: 280px;
  height: 26px;
  line-height: 26px;
  background: #FFF0D2;
  border-radius: 4px;
  margin: 6px auto;
  text-align: center;
}
.h34{
  height: 34px;
}
.systemtips span{
  color: #e6a23c;
  font-weight: bold;
}

/*禁用聊天*/
.hidemask{
  position: absolute;
  z-index: 99;
  background: rgba(240,240,240,0.6);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.emojibox{
    position: absolute;
    width: 100%;
    z-index: 111;
    background: #fff;
    bottom: 100px;
}
.emojibox div.item{
  display: inline-block;
}
/*确认关闭*/
.close-confirm-box{
  width: 164px;
  height: 98px;
border-radius: 2px;
text-align: center;
font-size: 12px;
color: #333;
}
.close-confirm-box p{
  padding-top: 24px;

}
.close-confirm-box .btnbox{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
}
.close-confirm-box .btnbox span{
  display: block;
  width: 48px;
  height: 25px;
  text-align: center;
  line-height: 25px;
  border: 1px solid #33C8DF;
border-radius: 4px;
border-radius: 4px;
cursor: pointer;
}
.close-confirm-box .btnbox span.cancel{
  color: #33C8DF;
  background: #fff;
  margin-right: 20px;
}
.close-confirm-box .btnbox span.sub{
  background: #33C8DF;
  color: #fff;
}
.messagebox{
  position: absolute;
  bottom: 0;
  right: 0;
  background: #fff;
  width: 100%;
  height: 100%;
  box-shadow: 0 1px 0 0 rgba(0,0,0,0.15);
  z-index: 99;
}
.messagebox .headerbox{
  height: 44px;
  line-height: 44px;
  overflow: hidden;
  background: #33C8DF;
  color: #fff;
  font-size: 14px;
}
.messagebox .headerbox .title{
  text-align: left;
  padding-left: 16px;
}
.messagebox .headerbox .close{
  width: 44px;
  height: 44px;
  float: right;
  cursor: pointer;
  position: relative;
}
.messagebox .headerbox .close:after{
  content: "";
  position: absolute;
  width: 36%;
  height: 2px;
  background: #fff;
  left: 26%;
  top: 21px;
}
.dialog-header .close,
.messagebox .headerbox .btns span{
  width: 16px;
  height: 16px;
  line-height: 14px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  background: #33C8DF;
  color: #fff;
  border-radius: 100%;
}
.messagebox .sendbox{
  height: 130px;
  bottom: 0;
  right: 0;
  position: absolute;
  width: 100%;
  border-top:1px solid #ccc;
}
.messagebox .sendbox .inp{
  position: relative;
}
.messagebox .sendbox .btns{
  height: 30px;
  display: flex;
  padding-left: 8px;
}
.messagebox .sendbox .btns span{
  display: block;
  font-size: 20px;
  width: 30px;
  text-align: center;
  cursor: pointer;
  line-height: 30px;
}
.messagebox .sendbox .btns span.iconzhuandan1{
  font-size: 17px;
}
.messagebox .sendbox .btns span:hover{
  color: #33C8DF;
  font-size: 17px;
}
.messagebox textarea{
  width: 100%;
  border: none;
  min-height: 70px;
  outline: none;
  box-sizing:border-box;
  padding: 0 15px 15px 15px;
  resize: none;
}

.messagebox .btn-sub{
  display: block;
   width: 68px;
  height: 30px;
   line-height: 30px;
  color: #fff;
  text-align: center;
  font-size: 14px;
  background: #33C8DF;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 20px;
  border: 1px solid #33C8DF;
}
.messagebox .sendbox .btn-sub{
  margin: 50px auto;
}
.messagebox .btn-sub.auto{
  margin: 10px auto 0 auto;
}
.messagebox .btn-sub.btn-cancel{
  background: #fff;
  color: #33C8DF;
}
.messagebox .btn-sub:hover{
  box-shadow: 0px 0px 3px 0px #33C8DF;
}
.messagebox .dialog-content .btns{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
}


.common-message .dialog-box .custom-tel{
  font-size: 12px;
color: #666666;
text-align: center;
}
.messagebox .btn-sub.sub{
  position: absolute;
  z-index: 9;
  right: 5px;
  bottom: 5px;
}
.messagebox .meslist{
  position: absolute;
  width: 100%;
  top: 44px;
  bottom:130px;
  overflow-y: auto;
  background: #fff;
}
.messagebox .meslist .item{
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: 10px 50px;
  box-sizing:border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.messagebox .meslist .item .user{
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  left: 10px;
  top: 10px;
}
.messagebox .meslist .item.on .user{
  left: inherit;
  right: 10px;
}
.messagebox .meslist .item .user img{
  width: 100%;
  height: 100%;
}
.messagebox .meslist .item .mesbox{
  max-width: 100%;
  font-size: 13px;
  line-height: 22px;
  position: relative;
}
.messagebox .meslist .item .mesbox .name{
  font-size: 12px;
  color: #666;
  text-align: left;
}
.messagebox .meslist .item.on .mesbox .name{
text-align: right;
display: none;
}
.messagebox .meslist .item.on .imgbox{
  position: relative;
}
.messagebox .meslist .item.on .imgbox:after{
  content: "上传中...";
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: rgba(0,0,0,0.6);
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.messagebox .meslist .item.on .finish:after{
  display: none;
}
.messagebox .meslist .item.on .imgbox img{
  width: 100%;
  opacity: 1;
}
.messagebox .meslist .item .mes{
  display: inline-block;
  padding: 5px 15px;
  max-width: 100%;
  color: #333;
  background: #F5F5F5;
  border-radius: 4px;
  word-break: break-all;
  position: relative;
  min-height: 22px;
}
.messagebox .meslist .item .mes.filebox{
  padding: 40px 20px 20px 20px;
  text-align: center;
  background: url('./img/file.png') no-repeat center 8px;
  background-size: 30px auto;
  cursor: pointer;
}
.messagebox .meslist .item.on{
  justify-content: flex-end;
}

.messagebox .meslist .item.system .mes{
  padding: 0;
  background-color: #E7E7E7;
  font-size: 12px;
color: #777777;
letter-spacing: 0;
text-align: center;
margin: 0 auto;
}
.messagebox .meslist .item.system .mes span.after{
  display: none;
}
.messagebox .meslist .item.system .user{
  display: none;
}
.messagebox .meslist .item.system{
  justify-content: center;
}
.messagebox .meslist .item.system .systembox p{
  background: #f5f5f5;
border-radius: 4px;
border-radius: 4px;
padding: 5px 6px;
word-break: break-all;
font-size: 12px;
}

.messagebox .meslist .item.on .mes{
  background-color: #C5F7FF;
  border-color: #fb683c;
}


.messagebox .meslist .item .mes span.after{
  display: inline-block;
  width: 0;
  height: 0;
  position: absolute;
  top: 2px;
  border-left: 6px solid transparent;
  border-right: 10px solid #F5F5F5;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  right: inherit;
  left: -12px;
  right: inherit;
}

.messagebox .meslist .item.on .mes span.after{
  border-right: 6px solid transparent;
  border-left: 10px solid #C5F7FF;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  right: -12px;
  left: inherit;
  top: 10px;
}

/*再次咨询按钮*/
.hidemask .btn-sub{
  margin-top: 30px;
}

</style>