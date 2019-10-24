<template>
    <div id="commonTeacherBanner" class="teacher-swiper common-web-index-banner">
      <div class="swiper-container swiper-teacher-containner ie9"
      v-if="list.length>0">
        <div class="swiper-wrapper">
            <div class="swiper-slide"
              v-for="(item,index) in list"
              :key="index">
                <div class="teacher-box pointer">
                    <div class="photo">
                        <!-- <img :src="item.headPic" :alt="item.name"> -->
                        <baseImg
                        :width="130"
                        :height="130"
                        :defaultSrc="defaultUrl"
                        :src="item.headPic"
                        :alt="item.name">
                        </baseImg>
                    </div>
                    <p class="name">{{item.name}}</p>
                    <p class="intro" v-html="item.individualResume"></p>
                </div>
            </div>

        </div>

        <!-- <div class="swiper-pagination"  slot="pagination"></div> -->
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
        <!-- <div class="swiper-scrollbar"   slot="scrollbar"></div> -->
      </div>


    </div>
</template>
<script>
require('@/plugins/swiper/swiper.min');
const defaultPhotoUrl = require('@/views/imgs/default.png');

export default {
  data() {
    return {
      name: 'teacher-swiper',
      defaultUrl: defaultPhotoUrl, // 默认头像
      swiperOption: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      mySwiper: null,
      animateTimer: null,
      isCanAnimate: true,
    };
  },
  props: {
    list: { // 教师数据列表
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      /*eslint-disable*/ 
            if (navigator.appName == 'Microsoft Internet Explorer' && parseInt(navigator.appVersion.split(';')[1].replace(/[ ]/g, '').replace('MSIE', '')) == 9) {
                this.$nextTick(() => {
                    this.mySwiper = new Swiper('.swiper-teacher-containner', this.swiperOption);
                    this.initBannerByIe();
                });
            }else{
                this.$nextTick(()=>{
                    this.mySwiper = new Swiper('.swiper-teacher-containner', this.swiperOption);
                })
            }
            /* eslint-enable */
    },
    initBannerByIe() {
      /*eslint-disable*/ 
            let _that = this;
            let oBanner = document.getElementById('commonTeacherBanner');
            let oWraper = oBanner.querySelector('.swiper-wrapper');
            let aSlides = oBanner.querySelectorAll('.swiper-slide');
            let oSlide = aSlides[0];
            let oNext = oBanner.querySelector('.swiper-button-next');
            let oPrev = oBanner.querySelector('.swiper-button-prev');
            let boxWidth = oSlide.offsetWidth; // 每次移动的间隔距离
            let wraperWidth = oWraper.offsetWidth;
            let num = 0;
            let allnum = aSlides.length; // 总个数
            let moveNum = parseInt(allnum / 3); // 移动次数
            oWraper.style.transition = 'left 0.3s';
            oNext.addEventListener('click', () => {
                if(!this.isCanAnimate) return;
                
                let curnum = 0;
                oNext.style.opacity = 1;
                oPrev.style.opacity = 1;
                if (num >= moveNum - 1) {
                    // 到头了
                    num = moveNum;
                    curnum = allnum - 3;
                    oNext.style.opacity = 0.5;
                } else {
                    num += 1;
                    curnum = num * 3;

                }

                // .transform = 'translateX(-' + 200 + 'px)'
                // oWraper.style.left = `${-(curnum * boxWidth)}px`;
                _that.animate(oWraper,-(curnum * boxWidth));
            }, false);
            oPrev.addEventListener('click', () => {
                oNext.style.opacity = 1;
                oPrev.style.opacity = 1;
                let curnum = 0;
                if (num <= 1) {
                    // 到头了
                    num = 0;
                    curnum = 0;
                    oPrev.style.opacity = 0.5;
                } else {
                    num -= 1;
                    curnum = num * 3;
                }
                // oWraper.style.left = `${-(curnum * boxWidth)}px`;
                _that.animate(oWraper,-(curnum * boxWidth));
            }, false);
             /* eslint-enable */
    },
    animate(obj, toLeft) {
      /*eslint-disable*/ 
            // 过渡动画
            let curLeft = obj.style.left ? parseInt(obj.style.left, 10) : 0;
            let step = 0;
            if (curLeft === toLeft || !this.isCanAnimate) {
                return;
            }
            step = -(curLeft - toLeft) / 15;

            clearInterval(this.animateTimer);
            this.isCanAnimate = false;
            this.animateTimer = setInterval(() => {
                if (step > 0) {
                    if (curLeft >= toLeft) {
                        curLeft = toLeft;
                        clearInterval(this.animateTimer);
                        this.isCanAnimate = true;
                    } else {
                        curLeft += step;
                    }
                } else if (curLeft <= toLeft) {
                    curLeft = toLeft;
                    clearInterval(this.animateTimer);
                    this.isCanAnimate = true;
                } else {
                    curLeft += step;
                }

                obj.style.left = `${curLeft}px`;
            }, 20);
            /* eslint-enable */
    },
    swiperClick(swiperItem) {
      if (swiperItem.href) {
        // 如果存在href 跳转
        window.location.href = swiperItem.href;
      }
    },
  },
};
</script>
<style scoped>
    .swiper-button-prev{
        background: url('./imgs/icon-prev1.png') no-repeat center center;
    }
    .swiper-button-next{
        background: url('./imgs/icon-next1.png') no-repeat center center;
    }
    .teacher-box{
        width: 220px;
        max-height: 430px;
        text-align: center;
        font-size: 14px;
            color: #444;
            margin: 0 auto;
            padding-bottom: 40px;
    }
    .teacher-box .name{
        font-size: 16px;
        font-weight: bold;
        margin-top: 10px;
    }
    .teacher-box .photo{
        display: block;
        width: 89px;
        height: 89px;
        margin: 0 auto;
        overflow: hidden;
        border-radius: 100%;
        margin-top: 19px;
    }
    .teacher-box .photo img{
        width: 100%;
        height: auto;
    }
    .teacher-box .intro{
        text-align: left;
        line-height: 20px;
        margin-top: 10px;
        word-break: break-all;
    }
</style>
