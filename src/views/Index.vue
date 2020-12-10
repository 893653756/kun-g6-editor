<template>
  <div class="pages">
    <div class="pages-header">
      <header-tools class="pages-header__tools"></header-tools>
      <div class="pages-header__close" v-if="showClose">
        <span class="kf-icon-close" @click="handleClosePage"></span>
      </div>
    </div>
    <div class="pages-body">
      <aside-tabs class="pages-body__aside" @look-node-detail="lookNodeDetail"></aside-tabs>
      <graph-canvas
        class="pages-body__editors"
        @graph-editors="handleCreateGraph"
        v-loading="loading"
        @look-node-detail="lookNodeDetail"
      ></graph-canvas>
      <!-- <aside-right></aside-right> -->
    </div>
    <!-- 节点详情 -->
    <el-dialog title="对象详情" :visible.sync="dialogBaseInfoDetail">
      <el-table :data="baseInfoDetail" header-row-class-name="header-hidden" height="400">
        <el-table-column prop="field" label=""></el-table-column>
        <el-table-column prop="value" label=""></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import HeaderTools from './header-tools/Index.vue';
import AsideTabs from './aside-tabs/Index.vue';
import GraphCanvas from './graph-canvas/Index.vue';
// import AsideRight from './aside-right/Index.vue';
import * as MutationTypes from '@/store/mutation-types';
import editors from '@/editors';
import { getRelationByDxType } from '@/api/headerTools';

export default {
  components: {
    HeaderTools,
    AsideTabs,
    GraphCanvas,
    // AsideRight,
  },
  data() {
    return {
      showClose: false,
      loading: false,
      dialogBaseInfoDetail: false,
      baseInfoDetail: []
    };
  },
  created() {
    this.editors = editors;
  },
  methods: {
    lookNodeDetail(model) {
      const arr = [];
      const cellInfo = model.cellInfo;
      const mxProperties = cellInfo.mxProperties || {};
      const propOrders = cellInfo.propOrders || [];
      propOrders.forEach((key) => {
        if (mxProperties.hasOwnProperty(key)) {
          arr.push({
            field: key,
            value: mxProperties[key] || '空',
          });
        }
      });
      this.baseInfoDetail = arr;
      this.dialogBaseInfoDetail = true;
    },
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
      // // 解析 url
      // const search = window.location.href.split('?')[1];
      // if (!search) {
      //   return;
      // }
      // this.showClose = true;
      // this.loading = true;
      // // 获取参数
      // const frames = window.parent.document.getElementsByClassName('t_page') || [];
      // console.log('frames', frames);
      // let judgeParam = [];
      // for (let i = 0; i < frames.length; i++) {
      //   const frame = frames[i];
      //   const active = frame.dataset.active === 'true';
      //   if (active) {
      //     judgeParam = frame.contentWindow.vm.judgeParam;
      //     console.log('judgeParam', judgeParam);
      //   }
      // }
      this.loading = true;
      const judgeParam = [
        {
          params: { idMaps: [{ sfzhm: '110105197307197114' }] },
          dxType: 'ry_ry',
        },
      ];
      const arr = [];
      judgeParam.forEach((payload) => {
        arr.push(getRelationByDxType(payload));
      });
      // 记录是从一件研判进来
      this.$store.commit(MutationTypes.ENTER_BY_JUDGMENT, true);
      const result = await Promise.all(arr);
      const nodes = {};
      const edges = {};
      const ids = [];
      result.forEach(({ data }) => {
        if (data.code === 0) {
          const content = data.content;
          // 节点
          content.entities.forEach((node) => {
            if (!nodes[node.id]) {
              nodes[node.id] = node;
              ids.push(node.id);
            }
          });
          this.$store.commit(MutationTypes.SET_NODE_IDS, ids);
          // 边
          content.links.forEach((edge) => {
            const { sourceEntityId, targetEntityId } = edge;
            const id = `${sourceEntityId}-${targetEntityId}-${edge.id}`;
            if (!edges[id]) {
              edges[id] = edge;
            }
          });
        }
      });
      this.loading = false;
      this.editors.importRelationData({
        entities: Object.values(nodes),
        links: Object.values(edges),
      });
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
  &-header {
    height: 82px;
    display: flex;
    &__tools {
      flex: 1;
    }
    &__close {
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

  &-body {
    flex: 1;
    display: flex;
    border-top: 1px solid #d9d9d9;
    overflow-y: auto;
    overflow-x: hidden;
    // &__aside {
    //   width: 340px;
    // }
    &__editors {
      flex: 1;
      position: relative;
      width: 0px;
    }
  }
}
</style>