import {
  mapGetters,
  mapMutations,
} from 'vuex';
import Title from '@/views/web/center/title.vue';

export default {
  data() {
    return {
      statusType: {
        1: '等待付款',
        2: '等待付款',
        3: '交易成功',
        // 4: '退款中',
        // 5: '已退款',
        6: '订单已取消',
        7: '交易成功',
      },
    };
  },
  computed: {
    ...mapGetters([
      // 映射 this.count 为 store.state.count
      'commonCenterData', // 用户相关信息
    ]),
  },
  methods: {
    ...mapMutations('center', [
      'setCenterData',
    ]),
  },
  components: {
    Title,
  },
};
