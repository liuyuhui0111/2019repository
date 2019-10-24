<template>
    <div class="default">
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
      name: 'default',
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
