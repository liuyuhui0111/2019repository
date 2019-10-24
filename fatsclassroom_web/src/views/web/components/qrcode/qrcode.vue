<template>
  <div :id="docId" ref="qrcode" class="qrcode">

  </div>
</template>
<script>
import QRCode from '@/assets/utils/qrcode';

export default {
  name: 'qrcode',
  data() {
    return {
      name: 'qrcode',
      qrcode: null,
    };
  },
  props: {
    docId: { // 绘制documentid
      type: String,
      required: true,
    },
    width: { // 二维码宽度
      type: Number,
      default: () => 116,
    },
    url: { // 二维码地址
      type: String,
      default: () => '',
    },
    logourl: { // 二维码logo地址
      type: String,
      default: () => '',
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$nextTick(() => {
        const { url } = this;
        const width = this.width > 80 ? this.width : 80;
        const { logourl } = this;
        const oDoc = document.getElementById(this.docId);
        this.qrcode = new QRCode(oDoc, {
          text: url,
          width,
          height: width,
          colorDark: '#000000',
          colorLight: '#ffffff',
          logourl,
          correctLevel: QRCode.CorrectLevel.H,
        });
      });
    },
  },
};
</script>
<style scoped>
  .qrcode{
    width: 100%;
    height: 100%;
  }
</style>
