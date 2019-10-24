<template>
    <div class="preview common-web-index-banner">
      <div class="swiper-container" id="gallery">
        <div class="swiper-wrapper">
          <div v-for="(item,index) in list"
          :key="index"
          class="swiper-slide">
            <img @click="swiperClick(item)"
            :src="item.previewUrl?item.previewUrl:defaultUrl"
            :alt="item.title">
          </div>

        </div>
         <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
      </div>
      <div class="swiper-container" id="thumbs">
        <div class="swiper-wrapper">
          <div v-for="(item,index) in list"
          class="swiper-slide" :key="index">
            <img @click="swiperClick(item)"
            :src="item.previewUrl?item.previewUrl:defaultUrl"
            :alt="item.title">
          </div>
        </div>
      </div>

    </div>
</template>
<script>

require('@/plugins/swiper/swiper.min');

export default {
  name: 'preview',
  data() {
    return {
      name: 'preview',
      defaultUrl: `${window.location.origin}/banner.png`,
    };
  },
  props: {
    list: { // 轮播图数据
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.init();
  },
  computed: {

  },
  methods: {
    init() {
      /*eslint-disable*/
            this.$nextTick(()=>{


            let thumbsSwiper = new Swiper('#thumbs', {
                spaceBetween: 10,
                slidesPerView: 4,
                watchSlidesVisibility: true, // 防止不可点击
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
            let gallerySwiper = new Swiper('#gallery', {
                spaceBetween: 10,
                thumbs: {
                    swiper: thumbsSwiper,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
            })
             /* eslint-enable */
    },
    swiperClick(swiperItem) {
      if (swiperItem.url) {
        // 如果存在href 跳转
        window.location.href = swiperItem.url;
      }
    },
  },

};
</script>
<style scoped>
#gallery{
  margin: 20px auto;
}
.common-web-index-banner{
  width: 100%;
  overflow: hidden;
}
    .swiper-button-prev{
        background: url('./imgs/icon-prev.png') no-repeat center center;
    }
    .swiper-button-next{
        background: url('./imgs/icon-next.png') no-repeat center center;
    }
    #thumbs .swiper-slide{
      opacity: 0.5;
    }
    #thumbs .swiper-slide-thumb-active{
      opacity: 1;
    }
</style>
