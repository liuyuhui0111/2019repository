<template>
    <div class="index">
      <layout>
          <router-view></router-view>
      </layout>
    </div>
</template>

<script>
import layout from '@/views/layout.vue';

export default {
  data() {
    return {
      name: 'index',
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {

    },
  },
  components: {
    layout,
  },
};
</script>
<style scoped>

</style>
