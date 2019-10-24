<template>
    <div class="residualEquity">
        <!--header start-->
        <div class="header">
            <div class="header_info">
                <div>
                    <span class="title">{{ vipInfoData.name }}</span>
                    <span class="introduce">{{ vipInfoData.introduce }}</span>
                </div>

                <div class="price_outer">
                    <span>{{ endTime }}  到期</span>
                    <span class="price">
                        ¥
                        <span style="font-size: 32px">{{ vipInfoData.fee }}</span>
                    </span>
                </div>
            </div>
        </div>
        <!--header end-->
        <!--className start-->

        <div class="class_name">
            会员剩余权益
        </div>
        <!--className end-->
        <div v-if="vipInfoData != {}" class="residual_outer">
            <!--<div v-for="(v,index) in courseData" :key="index" class="list_item">-->
                <!--<div class="item_left">-->
                    <!--<img :src="v.pictureUrl" alt="">-->
                    <!--<span>{{ v.name }}</span>-->
                <!--</div>-->
                <!--<span>剩余 {{ v.consumeNum }} 门</span>-->
            <!--</div>-->

            <div v-show="equityDtoList != ''" class="coutent_info">
                <div
                        :key="index"
                        v-for="(v,index) in equityDtoList"
                        class="list_outer">
                    <img :src="v.pictureUrl" alt="">
                    <span>{{ v.name }}</span>
                </div>
            </div>
        </div>

        <div v-show="courseList != ''" class="content_outer">
            <div class="title_outer">
                <div>
                    <span>精品网络课程免费听</span>
                    <i class="icon-class"></i>
                </div>
                <div @click="clickMore" class="more">
                    <span>查看更多></span>
                </div>

            </div>
            <div class="course_info">
                <div
                        v-for="(v,index) in courseList"
                        :key="index"
                        class="course_item">
                    <img @click="clickCourse(v.id)" :src="v.bannerUrl" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable no-param-reassign,no-lonely-if,prefer-destructuring */

import { queryList, queryEquity, queryListDetialById } from '@/api/apis';

export default {
  name: 'residualEquity',
  data() {
    return {
      lodingShow: false,
      vipInfoData: {},
      courseData: [],
      equityDtoList: [],
      endTime: '',
      courseList: [], // 指定具体课程
      vipTypeId: '',
    };
  },
  mounted() {
    if (this.token && this.commonUserData && this.commonUserData.leaguerLevelId) {
      this.queryListFn();
      this.queryListDetialByIdFn(this.commonUserData.leaguerLevelId);
      this.vipTypeId = this.commonUserData.leaguerLevelId;
    } else {
      this.routerReplace('/interests');
    }
  },
  methods: {
    // 查询会员权益列表
    queryListFn() {
      // const that = this;
      this.lodingShow = false;
      queryList().then((res) => {
        this.isShowPage = true;
        if (res.data.code === '0000') {
          console.log(this.commonUserData);
          res.data.list.forEach((item) => {
            if (item.id === this.commonUserData.leaguerLevelId) {
              this.vipInfoData = item;
            }
          });
          this.endTime = this.vipInfoData.maturityTime.split(' ')[0];
          // this.vipInfoData.equityDtoList.forEach((item) => {
          //   if (item.name.indexOf('精品网络课程') >= 0) {
          //     // this.courseData[0] = item;
          //     item.name = '精品网络课程';
          //   }
          //   if (item.name.indexOf('本地财税公开课') >= 0) {
          //     // this.courseData[1] = item;
          //     item.name = '本地财税公开课';
          //   }
          // });
          this.vipInfoData.equityDtoList.forEach((item) => {
            if (item.tickType === '1') {
              this.equityDtoList.push(item);
            }
          });
          this.queryEquityFn(0);
          this.queryEquityFn(1);
          this.lodingShow = true;
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    // 课程剩余次数
    queryEquityFn(flag) {
      queryEquity({ courseType: flag }).then((res) => {
        if (res.data.code === '0000') {
          if (flag === 0) {
            // 线上
            if (res.data.message === 'success') {
              this.equityDtoList.forEach((item) => {
                if (item.name.indexOf('精品网络课程') >= 0) {
                  // this.courseData[1] = item;
                  item.name = `精品网络课程${res.data.consumeNum}门`;
                }
              });
              // this.$set(this.courseData[0], 'consumeNum', res.data.consumeNum);
            } else {
              this.equityDtoList.forEach((item) => {
                if (item.name.indexOf('精品网络课程') >= 0) {
                  // this.courseData[1] = item;
                  item.name = '精品网络课程0门';
                }
              });
              // this.$set(this.courseData[0], 'consumeNum', 0);
            }
          } else {
            // 线下
            if (res.data.message === 'success') {
              this.equityDtoList.forEach((item) => {
                if (item.name.indexOf('本地财税公开课') >= 0) {
                  // this.courseData[1] = item;
                  item.name = `本地财税公开课${res.data.consumeNum}门`;
                }
              });
              // this.$set(this.courseData[1], 'consumeNum', res.data.consumeNum);
            } else {
              this.equityDtoList.forEach((item) => {
                if (item.name.indexOf('本地财税公开课') >= 0) {
                  // this.courseData[1] = item;
                  item.name = '本地财税公开课0门';
                }
              });
              // this.$set(this.courseData[1], 'consumeNum', 0);
            }
          }
          console.log(this.courseData, '线下线上');
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    // 查看更多
    clickMore() {
      this.$router.push({ path: `/vipclass?id=${this.vipTypeId}` });
    },
    // 课程详情
    clickCourse(id) {
      this.$router.push({ path: `/online-detail?cid=${id}` });
    },
    // 指定课程
    queryListDetialByIdFn(id) {
      queryListDetialById({ pageSize: 4, pageNum: 1, id }).then((res) => {
        console.log(res);
        if (res.data.code === '0000') {
          this.courseList = res.data.list;
        }
      }).catch((err) => {
        console.log(err);
      });
    },
  },
};
</script>

<style lang="less" scoped>
    .residualEquity {
        width: 100%;
        overflow: hidden;
        position: relative;
        div {
            box-sizing: border-box;
        }
        .header {
            width: 100%;
            padding: 15px;
            background-color: #fff;
            .header_info {
                width: 100%;
                height: 150px;
                background: url("img/bg-syqy.png") no-repeat;
                -webkit-background-size: 100%;
                background-size: 100%;
                padding: 15px;
                color: #FFFFFF;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .title{
                    font-size: 20px;
                    text-shadow: 0 2px 8px rgba(251,104,60,0.50);
                    font-weight: 600;
                }
                .introduce{
                    display: block;
                    font-size: 14px;
                    margin-top: 7px;
                }
                .price_outer{
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    align-items: center;
                }
            }
        }
        .class_name{
            color: #444444;
            font-size: 16px;
            margin-top: 20px;
            margin-bottom: 10px;
            padding: 0 15px;
            font-weight: 600;
        }
        .list_item{
            margin-bottom: 7px;
            background-color: #fff;
            width: 100%;
            padding: 12px 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span{
                font-size: 14px;
                color: #FB683C;
            }
            .item_left{
                display: flex;
                align-items: center;
                span{
                    font-size: 16px;
                    color: #444444;
                }
                img{
                    border-radius: 50%;
                    border: none;
                    overflow: hidden;
                    width: 40px;
                    height: 40px;
                    margin-right: 10px;
                }
            }
        }
        .coutent_info {
            width: 100%;
            padding: 15px 15px;
            overflow: hidden;
            background-color: #fff;
            .list_outer {
                width: calc(100% / 4);
                overflow: hidden;
                padding: 0 15px;
                text-align: center;
                height: 103px;
                float: left;
                font-size: 12px;
                color: #444;
                display: flex;
                flex-direction: column;
                /*justify-content: space-between;!**!*/
                align-items: center;
                span {
                    /*margin-left: 16px;*/
                    color: #444;
                    margin-top: 10px;
                    line-height: 18px;
                }
                img {
                    border-radius: 50%;
                    border: none;
                    overflow: hidden;
                    width: 40px;
                    height: 40px;

                }
            }
        }
        .content_outer {
            background-color: #fff;
            margin-top: 7px;
            .title_outer {
                width: 100%;
                padding: 15px 30px;
                display: flex;
                justify-content: space-between;
                .more {
                    span {
                        color: #868686;
                        font-size: 12px;
                    }
                }
                .icon-class {
                    display: inline-block;
                    width: 24px;
                    height: 12px;
                    background: url("img/huiyuantequan.png") no-repeat;
                    -webkit-background-size: 100%;
                    background-size: 100%;
                    margin-left: 5px;
                }
                span {
                    display: inline-block;
                    /*padding: 10px 0;*/
                    font-size: 16px;
                    color: #444444;
                    font-weight: 600;
                    font-family: "PingFangSC-Medium";
                }
                .red {
                    color: #f91e1e;
                    padding: 0;
                }
            }
            .coutent_info {
                width: 100%;
                margin-top: 10px;
                padding: 15px 15px;
                overflow: hidden;
                .list_outer {
                    width: calc(100% / 4);
                    overflow: hidden;
                    padding: 0 15px;
                    text-align: center;
                    height: 103px;
                    float: left;
                    font-size: 12px;
                    color: #444;
                    display: flex;
                    flex-direction: column;
                    /*justify-content: space-between;!**!*/
                    align-items: center;
                    opacity: .5;
                    &.opacity {
                        opacity: 1;
                    }
                    span {
                        /*margin-left: 16px;*/
                        color: #444;
                        margin-top: 10px;
                        line-height: 18px;
                    }
                    img {
                        border-radius: 50%;
                        border: none;
                        overflow: hidden;
                        width: 40px;
                        height: 40px;

                    }
                }
            }
            .course_info {
                width: 100%;
                padding: 0 24px;
                padding-bottom: 9px;
                background-color: #fff;
                overflow: hidden;
                margin-bottom: 25.5px;
                .course_item {
                    width: 50%;
                    height: 102px;
                    padding: 6px;
                    float: left;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .btn_outer {
                width: 100%;
                margin-top: 50px;
                text-align: center;
                img {
                    width: 193px;
                    height: 40px;
                    cursor: pointer;
                }
            }
        }
    }
</style>
