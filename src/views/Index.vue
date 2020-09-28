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
      showClose: false
    }
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
      // http://192.168.0.80:8080/?dimCode=ry_ry&sfzhm=ssss
      // 解析 url
      const search = window.location.href.split('?')[1];
      if (!search) {
        return;
      }
      this.showClose = true;
      let dxType = '';
      let idMap = {};
      search.split('&').forEach(item => {
        const arr = item.split('=');
        if (arr[0] === 'dimCode') {
          dxType = arr[1];
        } else {
          idMap[arr[0]] = arr[1];
        }
      })
      const payload = {
        dxType,
        params: {
          idMap,
        },
      };
      const { data } = await getRelationByDxType(payload);
      if (data.code === 0) {
        this.editors.importRelationData(data.content);
      } else {
        this.$message({
          type: 'warning',
          message: data.msg,
        });
      }
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