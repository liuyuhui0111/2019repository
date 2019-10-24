<template>
    <div class="courseInfo_outer common-components-courseInfo">
        <classTitle title="老师简介"></classTitle>
        <div class="head_outer">
            <div class="head-left">
                <!--<img :src="detailData.headPic || detailData.teacherAvatar">-->
                <base-img :src="detailData.teacherAvatar || detailData.headPic"
                          :defaultSrc="defaultPhotoUrl"
                          :alt="detailData.teacherName"></base-img>
            </div>
            <div class="head-right">
                <span class="tit">{{ detailData.teacherName }}</span>
                <span v-html="detailData.teacherIntroduction || detailData.teacherBrief"></span>

            </div>
        </div>
        <div class="re">
            <span class="hash" id="content0"></span>
            <classTitle v-if="detailData.teacherIntroduction" title="课程信息"></classTitle>
        </div>

        <!--课程信息tit end -->
        <div v-if="detailData.teacherIntroduction" class="information_outer">
            <span>课程天数: {{ getDay }}天</span>
            <span>课程价格: {{ detailData.price }}元</span>
            <span>培训对象: {{ detailData.trainObject }}</span>
            <span>课程时间: {{ getTime }}</span>
            <span>培训地点: {{ detailData.address }}{{ detailData.city }}{{ detailData.county }}</span>
            <span>咨询电话: {{ detailData.hotline }}</span>
        </div>
        <template v-if="detailData.introduce || detailData. courseBrief">
            <!-- 课程介绍 -->
            <div class="re">
            <span class="hash" id="content1"></span>
            <classTitle title="课程介绍"></classTitle>
            </div>
            <div id="shareDesc" class="introduce_outer">
                <span v-html="transferStringFn(detailData.introduce || detailData. courseBrief)">
                </span>
            </div>
        </template>
        <template v-if="detailData.outline || detailData.courseIncome">
            <classTitle v-if="!detailData.teacherIntroduction" title="课程收益"></classTitle>
            <div v-if="!detailData.teacherIntroduction" class="introduce_outer">
                <span
                        v-html="transferStringFn(detailData.outline || detailData.courseIncome)">
                </span>
            </div>
        </template>

        <template v-if="detailData.outline || detailData.courseOutline">
            <!-- 课程大纲 -->
             <div class="re">
            <span class="hash" id="content2"></span>
                 <!--v-if="detailData.teacherIntroduction"-->
            <classTitle
                    title="课程大纲">

            </classTitle>
            </div>
            <div class="introduce_outer">
                <span
                        v-html="transferStringFn(detailData.outline || detailData.courseOutline)">
                </span>
            </div>
        </template>
        <template v-if="detailData.plan">
        <div class="re">
            <span class="hash" id="content3"></span>
            <classTitle
                    v-if="detailData.teacherIntroduction"
                    title="课程计划">
            </classTitle>
        </div>
            <div v-if="detailData.teacherIntroduction" class="introduce_outer">
                <span v-html="transferStringFn(detailData.plan)"></span>
            </div>
        </template>

    </div>
</template>

<script>
import { formatDate } from '@/assets/utils/timefn';
import { transferString } from '@/assets/utils/util';

const defaultPhotoUrl = require('@/views/imgs/default.png');

export default {
  // 接受父组件的值
  props: ['detailData'],
  name: 'courseInfo',
  data() {
    return {
      defaultPhotoUrl,
    };
  },
  computed: {
    getDay() {
      let day = (this.detailData.endTime - this.detailData.startTime) / (24 * 60 * 60 * 1000);
      return parseInt(day, 10) + 1;
    },
    getTime() {
      return `${formatDate(this.detailData.startTime, 'true')} ~ ${formatDate(this.detailData.endTime, 'true')}`;
    },

  },
  methods: {

    transferStringFn(str) {
      return transferString(str);
    },
    // 滚动条滚动到指定元素位置
    scrollToDom(id) {
      console.log(id);
      const obj = document.getElementById(`content${id}`);
      if (obj) {
        obj.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    },
  },
};
</script>
<style>
    .common-components-courseInfo img {
        width: 100%;
    }

    .common-components-courseInfo p {
        line-height: 1.5;
        color: #868686;
    }
    .common-components-courseInfo p span{
        line-height: 1.5;
        color: #868686!important;
        font-family: 'PingFangSC-Medium','Avenir', Helvetica, Arial, sans-serif!important;
    }

    /*.common-components-courseInfo .head-right span p span{*/
    /*font-size: 100%!important;*/
    /*}*/
</style>

<style lang="less" scoped>
    .re{
        position: relative;
    }
    .re .hash{
        position: absolute;
        top:-60px;
    }
    .courseInfo_outer {
        width: 100%;
        height: 100%;
        position: relative;
        padding-bottom: 58px;
        div {
            box-sizing: border-box;
        }
        .head_outer {
            background-color: #fff;
            width: 100%;
            /*display: flex;*/
            padding: 10px 15px;
            .head-left {
                width: 44px;
                height: 44px;
                max-width: 44px;
                float: left;
                border-radius: 50%;
                overflow: hidden;
                img {
                    width: 44px;
                    height: 44px;
                    max-width: 44px;
                }
            }
            .head-right {
                width: calc(100% - 54px);
                margin-left: 54px;
                font-size: 14px;
                span {
                    display: block;
                    color: #868686;
                    line-height: 20px;
                    word-wrap: break-word;
                }
                .tit {
                    /*font-weight: 600;*/
                    margin-bottom: 10px;
                    font-size: 14px;
                    color: #444;
                }
            }
        }
        .tit_outer {
            margin-top: 10px;
            width: 100%;
            padding: 0 15px;
            .tit_content {
                width: 100%;
                padding-bottom: 7px;
                border-bottom: 1px solid #d4d4d4;
                display: flex;
                align-items: center;
                b {
                    width: 3px;
                    height: 14.5px;
                    display: inline-block;
                    background-color: #FB683C;
                    border-radius: 100px;
                }
                span {
                    font-size: 12px;
                    color: #444;
                    margin-left: 5px;
                }
            }

        }
        .information_outer {
            background-color: #fff;
            width: 100%;
            padding: 10px 15px;
            span {
                margin-top: 10px;
                font-size: 14px;
                display: block;
                color: #868686;
                &:nth-child(1) {
                    margin-top: 0;
                }
            }
        }
        .introduce_outer {
            width: 100%;
            padding: 10px 15px;
            background-color: #fff;
            span {
                line-height: 1.5;
                font-size: 14px;
                color: #868686;
                p {
                    line-height: 20px;
                }
            }
        }
    }
</style>
