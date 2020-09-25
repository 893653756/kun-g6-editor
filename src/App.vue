<template>
  <div id="app">
    <index-vue></index-vue>
  </div>
</template>

<script>
import IndexVue from '@/views/Index.vue';
export default {
  name: 'App',
  components: {
    IndexVue
  }
}
</script>

<style lang="scss">
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
}
</style>
