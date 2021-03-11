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
        <span :class="['iconfont', 'icon', item.icon]"></span>
      </div>
    </div>
    <div :class="['aside-tabs__panel', { 'zoom-in': zoomIn }]" ref="panel">
      <div class="aside-tabs__panel-box">
        <!-- 缩放图标 -->
        <div class="aside-tabs__panel-zoom" @click="handleZoom">
          <span class="el-icon-d-arrow-left"></span>
        </div>
        <!-- 面板 -->
        <div class="aside-tabs__panel-detail">
          <component v-if="comp" :is="comp" v-on="$listeners"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 统计分析
import Statistical from "./components/Statistical.vue";
// 实体列表
import EntityList from "./components/EntityList.vue";
// 社会网络分析
// import SocialNetwork from "./components/SocialNetwork.vue";
// 实体属性
import EntityProperty from "./components/EntityProperty.vue";
// 历史文件
// import HistoryFile from './components/HistoryFile.vue';
// 技战法任务
// import TacticsTask from './components/TacticsTask.vue';

import * as MutationTypes from "@/store/mutation-types";
import { getEntityList } from "@/api/entityList";
import { mapGetters } from "vuex";
import { debounce } from "@/utils";

const tabOriginLists = [
  // 实体创建
  { icon: "icon-shitifenzu", id: "entity", comp: EntityList },
  // { icon: 'kf-icon-dic-standard', id: 'standard' },
  // 实体属性
  {
    icon: "icon-shuxingguanli",
    id: "process",
    title: "实体属性",
    comp: EntityProperty,
  },
  // 统计分析
  {
    icon: "icon-tongjifenxi",
    id: "statistical-analysis",
    comp: Statistical,
  },
  // 社会网络分析
  // { icon: "icon-tongjifenxi", id: "report", comp: SocialNetwork },
  // 最近打开记录
  // { icon: 'kf-icon-time', id: 'time', comp: HistoryFile },
  // 技站法任务
  // { icon: 'kf-icon-app', id: 'app', comp: TacticsTask },
];

export default {
  components: {},
  data() {
    return {
      activeId: "",
      zoomIn: true,
      comp: "",
    };
  },
  created() {
    this.getEntityList();
    // this.activeId = this.tabsList[0].id;
    // this.comp = this.tabsList[0].comp;
    this.animationCB = debounce(this.animationEnd, 500).bind(this);
  },
  mounted() {
    this.bindListener();
  },
  beforeDestroy() {
    this.$refs["panel"].removeEventListener(
      "webkitTransitionEnd",
      this.animationCB
    );
  },
  computed: {
    ...mapGetters(["editors", "tableId", "otherInfo"]),
    tabsList() {
      if (this.otherInfo.type) {
        return tabOriginLists.filter((v) => v.id !== "entity");
      }
      return tabOriginLists;
    },
  },
  watch: {
    tableId(val) {
      if (val && this.tabsList.length) {
        const item = this.tabsList.find((v) => v.id === val);
        this.handleChangeTab(item);
        this.$store.commit(MutationTypes.SET_TABLE_ID, "");
      }
    },
    tabsList: {
      handler(list) {
        if (list.length) {
          this.activeId = list[0].id;
          this.comp = list[0].comp;
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 绑定动画结束事件
    bindListener() {
      this.$refs["panel"].addEventListener(
        "webkitTransitionEnd",
        this.animationCB
      );
    },
    animationEnd() {
      this.editors && this.editors.graph && this.editors.graph._changeSize();
    },
    handleChangeTab(item) {
      this.zoomIn = false;
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
      const { data } = await getEntityList();
      // console.warn('listdata', data);
      if (data.code === 0) {
        this.$store.commit(MutationTypes.SET_ENTITYS, data.content);
      } else {
        this.$message({
          type: "warning",
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
  .icon {
    font-size: 24px;
  }
  &__list {
    width: 60px;
    background: #e5e5e5;
    font-size: 30px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-top: 20px;
    z-index: 10;
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
    height: 100%;
    // position: relative;
    position: absolute;
    border-right: 1px solid #d9d9d9;
    // transition: width 0.3s linear;
    left: 60px;
    transition: left 0.3s linear;
    display: flex;
    &-box {
      // flex: 1;
      width: 100%;
    }
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
        content: "";
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
      background: #ffffff;
    }
  }
  &__panel.zoom-in {
    // width: 0px;
    left: -220px;
    .aside-tabs__panel-zoom {
      transform: rotateY(180deg);
      transform-origin: center right;
      z-index: 1;
    }
  }
}
</style>
