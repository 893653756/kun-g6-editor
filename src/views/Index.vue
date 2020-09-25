<template>
  <div class="pages">
    <header-tools class="pages-tools"></header-tools>
    <div class="pages-body">
      <aside-tabs class="pages-body__aside"></aside-tabs>
      <graph-canvas class="pages-body__editors" @graph-editors="handleCreateGraph"></graph-canvas>
    </div>
  </div>
</template>
<script>
import HeaderTools from './header-tools/Index.vue';
import AsideTabs from './aside-tabs/Index.vue';
// import EditorsEntity from './editors-entitys/Index.vue';
import GraphCanvas from './graph-canvas/Index.vue';
import * as MutationTypes from '@/store/mutation-types';
import editors from '@/editors';

export default {
  components: {
    HeaderTools,
    AsideTabs,
    // EditorsEntity,
    GraphCanvas,
  },
  created() {
    this.editors = editors;
  },
  methods: {
    handleCreateGraph(graph) {
      this.editors.saveGraph(graph);
      // 保存到 store
      this.$store.commit(MutationTypes.SET_EDITORS, this.editors);
    },
    // // 节点操作
    // handelCellOperating(params) {
    //   if (params.type === 'delete') {
    //     this.handleDeleteCell();
    //   } else if (params.type === 'redo') {
    //     this.handleRedo();
    //   } else if (params.type === 'undo') {
    //     this.handleUndo();
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.pages {
  flex: 1;
  display: flex;
  flex-direction: column;
  &-tools {
    height: 82px;
  }
  &-body {
    flex: 1;
    display: flex;
    border-top: 1px solid #d9d9d9;
    // &__aside {
    //   width: 340px;
    // }
    &__editors {
      flex: 1;
      position: relative;
    }
  }
}
</style>