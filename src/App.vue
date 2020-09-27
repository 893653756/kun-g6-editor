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

@import '~element-ui/lib/theme-chalk/index.css';
@import '~@kun/ued-components/lib/theme-blue/kf-icon.css';
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
}
</style>
