<template>
  <div class="list">
    <baseTitle @moreClick="moreClick" :title="title" :more="more"></baseTitle>
    <slot>
      <div v-if="list.length>0" class="contain-box">
        <div
          v-for="(item,index) in list"
          @click="getIndex(item,index)"
          :key="index"
          :class="{empty:item==null}"
          class="item"
        >
          <Card
            v-if="item != null"
            @classClick="classClick"
            :type="cardType"
            :classData="item">
          </Card>
        </div>
      </div>
    </slot>
  </div>
</template>
<script>
import Card from '@/views/web/components/card/card.vue';
import baseTitle from '@/views/web/components/base/base-title.vue';

export default {
  data() {
    return {
      moreText: '更多',
      name: 'list',
    };
  },
  props: {
    title: {
      type: String,
      derequired: true,
    },
    more: {
      type: String,
      default: () => '',
    },
    cardType: {
      // 卡片类型 online 录播课程 offline 线下公开课
      type: String,
      default: () => '',
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {},
    moreClick() {
      this.$emit('moreClick');
    },
    getIndex(item, index) {
      this.$emit('getIndex', item, this.cardType, index);
    },
    classClick(item, type) {
      this.$emit('classClick', item, type);
    },
  },
  components: {
    Card,
    baseTitle,
  },
};
</script>
<style scoped>
.contain-box {
  display: flex;
  padding: 20px 0 0 0;
  align-items: flex-start;
  justify-content: space-between;
  overflow: hidden;
  width: 100%\0;
}
.contain-box .item {
  width: 219px\0;
  float: left\0;
  margin-right: 34px\0;
}
.contain-box .item:nth-last-child(1) {
  margin-right: 0\0;
}
.contain-box .empty {
  min-width: 219px;
}
</style>
