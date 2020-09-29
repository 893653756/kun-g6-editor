<template>
  <div class="pages">
    <header-tools class="pages-tools"></header-tools>
    <div class="pages-body">
      <aside-tabs class="pages-body__aside"></aside-tabs>
      <graph-canvas
        class="pages-body__editors"
        @graph-editors="handleCreateGraph"
      ></graph-canvas>
    </div>
    <div class="pages-close" v-if="showClose">
      <span class="kf-icon-close" @click="handleClosePage"></span>
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
import { getRelationByDxType } from '@/api/headerTools';

export default {
  components: {
    HeaderTools,
    AsideTabs,
    // EditorsEntity,
    GraphCanvas,
  },
  data() {
    return {
      showClose: false,
    };
  },
  created() {
    this.editors = editors;
  },
  methods: {
    handleCreateGraph(graph) {
      this.editors.saveGraph(graph);
      // 保存到 store
      this.$store.commit(MutationTypes.SET_EDITORS, this.editors);
      this.$nextTick(() => {
        this.getRelationByDxType();
      });
    },
    // 关闭页面
    handleClosePage() {
      window.parent && window.parent.vm && window.parent.vm.cancelCallBack();
    },
    // 更加url配置获取数据
    async getRelationByDxType() {
      // 解析 url
      const search = window.location.href.split('?')[1];
      if (!search) {
        return;
      }
      const payloadArr = window.parent.frames["topPage"].contentWindow.vm.judgeParam;
      // const payloadArr = [
      //   {
      //     dxType: 'ry_ry',
      //     params: {
      //       gxIds: '',
      //       idMaps: [
      //         { sfzhm: '321284199806296029' },
      //         { sfzhm: '500109200407100220' },
      //       ],
      //     },
      //   },
      // ];
      const arr = [];
      payloadArr.forEach((payload) => {
        arr.push(getRelationByDxType(payload));
      });
      const result = await Promise.all(arr);
      // console.warn('payloadArr', result);
      const nodes = {};
      const edges = {};
      result.forEach(({ data }) => {
        if (data.code === 0) {
          const content = data.content;
          // 节点
          content.entities.forEach((node) => {
            if (!nodes[node.id]) {
              nodes[node.id] = node;
            }
          });
          // 边
          content.links.forEach((edge) => {
            const { sourceEntityId, targetEntityId } = edge;
            const id = `${sourceEntityId}-${targetEntityId}`;
            if (!edges[id]) {
              edges[id] = edge;
            }
          });
        }
      });
      this.editors.importRelationData({
        entities: Object.values(nodes),
        links: Object.values(edges),
      });
      // if (data.code === 0) {
      //   this.editors.importRelationData(data.content);
      // } else {
      //   this.$message({
      //     type: 'warning',
      //     message: data.msg,
      //   });
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.pages {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
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
  &-close {
    position: absolute;
    width: 82px;
    height: 82px;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0px;
    right: 0px;
    span {
      font-size: 30px;
      color: rgba(0, 0, 0, 0.2);
      transition: all linear 0.3;
    }
    span:hover {
      color: rgba(0, 0, 0, 0.7);
      transform: scale(1.1);
    }
  }
}
</style>