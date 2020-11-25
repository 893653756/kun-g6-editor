<template>
  <div class="aside-tabs">
    <div class="aside-tabs__list">
      <div
        v-for="item of tabsList"
        :key="item.id"
        @click="handleChangeTab(item)"
        :class="{ activeItem: activeId == item.id }"
        :title="item.title"
      >
        <span :class="item.icon"></span>
      </div>
    </div>
    <div :class="['aside-tabs__panel', { 'zoom-in': zoomIn }]" ref="panel">
      <!-- 缩放图标 -->
      <div class="aside-tabs__panel-zoom" @click="handleZoom">
        <span class="el-icon-d-arrow-left"></span>
      </div>
      <!-- 面板 -->
      <div class="aside-tabs__panel-detail" v-loading="listLoading">
        <component v-if="comp" :is="comp"></component>
      </div>
    </div>
  </div>
</template>

<script>
// 统计分析
// import Statistical from './components/Statistical.vue';
// 实体列表
import EntityList from './components/EntityList.vue';
// 社会网络分析
// import SocialNetwork from './components/SocialNetwork.vue';
// 实体属性
import EntityProperty from './components/EntityProperty.vue';
// 历史文件
// import HistoryFile from './components/HistoryFile.vue';
// 技战法任务
// import TacticsTask from './components/TacticsTask.vue';

import * as MutationTypes from '@/store/mutation-types';
import { getEntityList } from '@/api/entityList';
import { mapGetters } from 'vuex';
import { debounce } from '@/utils';

export default {
  components: {},
  data() {
    return {
      tabsList: [
        // 实体创建
        { icon: 'kf-icon-data-sets', id: 'entity', comp: EntityList },
        // 统计分析
        // { icon: 'kf-icon-workspace', id: 'workspace', comp: Statistical },
        // { icon: 'kf-icon-dic-standard', id: 'standard' },
        // 社会网络分析
        // { icon: 'kf-icon-report', id: 'report', comp: SocialNetwork },
        // 实体属性
        {
          icon: 'kf-icon-process',
          id: 'process',
          title: '实体属性',
          comp: EntityProperty,
        },
        // 最近打开记录
        // { icon: 'kf-icon-time', id: 'time', comp: HistoryFile },
        // 技站法任务
        // { icon: 'kf-icon-app', id: 'app', comp: TacticsTask },
      ],
      activeId: '',
      zoomIn: false,
      comp: '',
      listLoading: false
    };
  },
  async created() {
    this.getEntityList();
    this.activeId = this.tabsList[0].id;
    this.comp = this.tabsList[0].comp;
    this.animationCB = debounce(this.animationEnd, 500).bind(this);
  },
  mounted() {
    this.bindListener();
  },
  beforeDestroy() {
    this.$refs['panel'].removeEventListener(
      'webkitTransitionEnd',
      this.animationCB
    );
  },
  computed: {
    ...mapGetters(['editors']),
  },
  methods: {
    // 绑定动画结束事件
    bindListener() {
      this.$refs['panel'].addEventListener(
        'webkitTransitionEnd',
        this.animationCB
      );
    },
    animationEnd() {
      this.editors && this.editors.graph._changeSize();
    },
    handleChangeTab(item) {
      if (this.activeId === item.id) {
        return;
      }
      this.activeId = item.id;
      this.comp = item.comp;
    },
    // 侧边栏收放
    handleZoom() {
      this.zoomIn = !this.zoomIn;
    },
    // 获取实体列表
    async getEntityList() {
      this.listLoading = true;
      const { data } = await getEntityList();
      this.listLoading = false;
      if (data.code === 0) {
        this.$store.commit(MutationTypes.SET_ENTITYS, data.content);
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
.aside-tabs {
  display: flex;
  &__list {
    width: 60px;
    background: #e5e5e5;
    font-size: 30px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-top: 20px;
    & > div {
      cursor: pointer;
      width: 56px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px 0px 0px 8px;
      color: #555555;
      font-size: 25px;
    }
    & div.activeItem {
      background: #1f98cd;
      color: #ffffff;
    }
  }
  &__panel {
    width: 280px;
    position: relative;
    border-right: 1px solid #d9d9d9;
    transition: width 0.3s linear;
    display: flex;
    &-zoom {
      position: absolute;
      width: 26px;
      height: 28px;
      top: 0px;
      right: 0px;
      overflow: hidden;
      cursor: pointer;
      z-index: 10;
      & span {
        position: absolute;
        z-index: 3;
        font-size: 16px;
        font-weight: 400;
        line-height: 20px;
        color: #ffffff;
        bottom: 11px;
        left: 11px;
      }
      &::after {
        content: '';
        width: 44px;
        height: 28px;
        position: absolute;
        background: #67c23a;
        left: 0px;
        top: -12px;
        transform: rotate(45deg);
      }
    }
    &-detail {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      position: relative;
    }
  }
  &__panel.zoom-in {
    width: 0px;
    .aside-tabs__panel-zoom {
      transform: rotateY(180deg);
      transform-origin: center right;
      z-index: 1;
    }
  }
}
</style>
