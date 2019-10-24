<template>
  <div id="commonBanner" class="banner common-web-index-banner">
    <div v-if="list.length>1" class="swiper-container swiper-banner ie9">
      <div class="swiper-wrapper">
        <div class="swiper-slide" :index="list.length-1" v-if="isIe9&&list.length>1">
          <baseImg
            :width="960"
            :height="304"
            :lazy="lazy"
            @click="swiperClick(list[list.length-1])"
            :src="list[0].pic?list[list.length-1].pic:defaultUrl"
            :alt="list[list.length-1].title"
          ></baseImg>
        </div>

        <div class="swiper-slide" v-for="(item,index) in list" :index="index" :key="index">
          <baseImg
            :width="960"
            :height="304"
            :lazy="lazy"
            @click="swiperClick(item,index)"
            :src="item.pic?item.pic:defaultUrl"
            :alt="item.title"
          ></baseImg>
        </div>

        <div class="swiper-slide" index="0" v-if="isIe9&&list.length>1">
          <baseImg
            :width="960"
            :height="304"
            :lazy="lazy"
            @click="swiperClick(list[0])"
            :src="list[0].pic?list[0].pic:defaultUrl"
            :alt="list[0].title"
          ></baseImg>
        </div>
      </div>
      <div class="swiper-pagination" slot="pagination">
        <span
          v-for="(item,index) in list"
          :class="{active:paginationIndex == index}"
          :key="index">
        </span>
      </div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
      <!-- <div class="swiper-scrollbar"   slot="scrollbar"></div> -->
    </div>
    <div v-if="list.length==1">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item,index) in list" :index="index" :key="index">
          <baseImg
            :width="960"
            :height="304"
            :lazy="lazy"
            @click="swiperClick(item,index)"
            :src="item.pic?item.pic:defaultUrl"
            :alt="item.title"
          ></baseImg>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
require('@/plugins/swiper/swiper.min');

export default {
  name: 'banner',
  data() {
    return {
      name: 'banner',
      lazy: false,
      defaultUrl: '',
      swiperOption: {
        autoplay: {
          delay: 3000,
          // disableOnInteraction: false,
        }, // 自动播放
        loop: true, // 循环播放
        pagination: {
          // 分页
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      mySwiper: null,
      paginationIndex: 0,
      isCanAnimate: true,
      isIe9: false,
      autoplayTimer: null,
      animateTimer: null,
    };
  },
  props: {
    list: {
      // 轮播图数据
      type: Array,
      default: () => [],
    },
  },
  beforeDestroy() {
    console.log('清除定时器');
    clearInterval(this.autoplayTimer);
    clearInterval(this.animateTimer);
  },
  mounted() {
    this.init();
  },
  computed: {},

  methods: {
    init() {
      // console.log(this.list);
      /*eslint-disable*/

      this.defaultUrl = this.publicPath + "banner.png";
      if (
        navigator.appName == "Microsoft Internet Explorer" &&
        parseInt(
          navigator.appVersion
            .split(";")[1]
            .replace(/[ ]/g, "")
            .replace("MSIE", "")
        ) == 9
      ) {
        this.isIe9 = true;
        this.$nextTick(() => {
          this.initBannerByIe();
        });
      } else {
        this.$nextTick(() => {
          this.mySwiper = new Swiper(".swiper-banner", this.swiperOption);
        });
      }

      /* eslint-enable */
    },
    swiperClick(swiperItem, index) {
      console.log(index);
      let href = swiperItem.url;
      if (swiperItem.url) {
        this.ysxy_columnClick({ LocationName: `运营位${index + 1}`, columnTitle: '首页bannan' });
        // 如果存在href 跳转
        // window.location.href = swiperItem.url;
        if (swiperItem.url.indexOf(window.location.origin) === 0) {
          // 如果是用本地域名开头的  拼接来源为banner
          if (swiperItem.url.indexOf('?') !== -1) {
            href = `${swiperItem.url}&fromRoute=index0`;
          } else {
            href = `${swiperItem.url}?fromRoute=index0`;
          }
        }
        /* eslint-enable */
        window.open(href);
      }
    },
    initBannerByIe() {
      /*eslint-disable*/

      if (this.list.length <= 1) return;
      let _that = this;
      let oBanner = document.getElementById("commonBanner");
      let oWraper = oBanner.querySelector(".swiper-wrapper");
      let oSlide = oBanner.querySelectorAll(".swiper-slide");
      let oNext = oBanner.querySelector(".swiper-button-next");
      let oPrev = oBanner.querySelector(".swiper-button-prev");
      let boxWidth = oBanner.offsetWidth;
      let wraperWidth = oSlide.length * boxWidth;
      let num = 1;
      let move = function(type) {
        if (!_that.isCanAnimate) return;
        if (type === "prev") {
          if (num <= 0) {
            num = oSlide.length - 1;
          } else {
            num -= 1;
          }
          if (num <= 0) {
            _that.paginationIndex = oSlide.length - 3;
          } else {
            _that.paginationIndex = num - 1;
          }
          _that.animate(oWraper, -(num * boxWidth), () => {
            if (num <= 0) {
              num = oSlide.length - 2;
              oWraper.style.left = -(num * boxWidth) + "px";
            }
          });
        } else if (type === "next") {
          if (num >= oSlide.length - 1) {
            num = 1;
          } else {
            num += 1;
          }
          if (num >= oSlide.length - 1) {
            _that.paginationIndex = 0;
          } else {
            _that.paginationIndex = num - 1;
          }
          _that.animate(oWraper, -(num * boxWidth), () => {
            if (num == oSlide.length - 1) {
              num = 1;
              oWraper.style.left = -(num * boxWidth) + "px";
            }
          });
        }
      };

      if (oSlide.length < 2) {
        return;
      }

      for (let i = 0; i < oSlide.length; i++) {
        oSlide[i].style.width = boxWidth + "px";
      }
      oWraper.style.width = wraperWidth + "px";
      oWraper.style.left = -(num * boxWidth) + "px";

      oNext.addEventListener(
        "click",
        () => {
          clearInterval(this.autoplayTimer);
          move("next");
        },
        false
      );

      oPrev.addEventListener(
        "click",
        () => {
          clearInterval(this.autoplayTimer);
          move("prev");
        },
        false
      );

      clearInterval(this.autoplayTimer);
      this.autoplayTimer = setInterval(() => {
        move("next");
      }, 3000);
      /* eslint-enable */
    },
    animate(obj, toLeft, fn) {
      /*eslint-disable*/
      // 过渡动画
      let curLeft = obj.style.left ? parseInt(obj.style.left, 10) : 0;
      let step = 0;
      if (curLeft === toLeft || !this.isCanAnimate) {
        return;
      }
      step = -parseInt((curLeft - toLeft) / 15, 10);
      clearInterval(this.animateTimer);
      this.isCanAnimate = false;
      this.animateTimer = setInterval(() => {
        if (step > 0) {
          if (curLeft + step >= toLeft) {
            curLeft = toLeft;
            clearInterval(this.animateTimer);
            this.isCanAnimate = true;
            obj.style.left = `${curLeft}px`;
            fn && fn();
          } else {
            curLeft += step;
            obj.style.left = `${curLeft}px`;
          }
        } else {
          if (curLeft + step <= toLeft) {
            curLeft = toLeft;
            clearInterval(this.animateTimer);
            this.isCanAnimate = true;
            obj.style.left = `${curLeft}px`;
            fn && fn();
          } else {
            this.isCanAnimate = true;
            curLeft += step;
            obj.style.left = `${curLeft}px`;
          }
        }
      }, 20);
      /* eslint-enable */
    },
  },
};
</script>
<style scoped>
.swiper-button-prev {
  background: url("./imgs/icon-prev.png") no-repeat center center;
}
.swiper-button-next {
  background: url("./imgs/icon-next.png") no-repeat center center;
}
.banner-img {
  width: 100%;
}
.swiper-pagination {
  overflow: hidden\0;
  position: absolute\0;
  height: 30px\0;
  bottom: 0\0;
  right: 0\0;
}
.swiper-pagination span {
  display: block\0;
  width: 13px\0;
  height: 13px\0;
  background: #fff\0;
  border: 1px solid #fff\0;
  margin-right: 10px\0;
  float: left\0;
  border-radius: 100%\0;
}
.swiper-pagination span.active {
  background: #fb683c;
}
</style>
