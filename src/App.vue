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
    IndexVue,
  },
};
</script>

<style lang="scss">

#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  /deep/ {
    .el-form-item {
      margin-bottom: 20px;
      .el-form-item__error {
        padding-top: 0px;
      }
    }
    .el-dialog__header {
      padding: 20px 10px 10px 20px;
      .el-dialog__headerbtn {
        top: 6px;
      }
    }
    .el-dialog__body {
      padding: 20px 10px 20px 20px;
    }
    .el-table {
      td,
      th {
        padding: 4px 0px;
      }
      .header-hidden {
        display: none;
      }
      .cell {
        padding: 0 5px;
      }
    }
  }
}
</style>
