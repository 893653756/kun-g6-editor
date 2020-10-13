<template>
  <div class="aside-right">
    <div class="aside-right__filter">
      <span>筛选</span>
    </div>
    <div class="aside-right__navigator">
      <div
        :class="['aside-right__navigator-minimap', { minimap: showMinimap }]"
        ref="minimap"
      ></div>
      <div class="aside-right__navigator-name" @click="handleChangeMinimap">
        <span>导航器</span>
      </div>
    </div>
  </div>
</template>

<script>
import G6 from '@antv/g6';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      showMinimap: false,
    };
  },
  computed: {
    ...mapGetters(['editors']),
  },
  methods: {
    handleChangeMinimap() {
      this.showMinimap = !this.showMinimap;
      if (!this.imageMinimap) {
        const dataURL = this.editors.graph.toDataURL();
        // 创建导航器
        this.imageMinimap = new G6.ImageMinimap({
          height: 150,
          width: 0,
          graphImg: dataURL,
          container: this.$refs['minimap'],
          delegateStyle: {
            type: 'delegate',
          },
          padding: 10,
        });
        // 添加插件
        this.editors.graph.addPlugin(this.imageMinimap);
        this.bindCB();
      }
    },
    bindCB() {
      this.editors.graph._updateMinimap = () => {
        const dataURL = this.editors.graph.toDataURL();
        this.imageMinimap.updateGraphImg(dataURL)
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.aside-right {
  width: 39px;
  position: relative;
  // background-color: pink;
  border-left: 1px solid #d9d9d9;
  display: flex;
  flex-direction: column;
  &__filter {
    flex: 1;
  }
  &__navigator {
    height: 150px;
    border-top: 1px solid #d9d9d9;
    position: relative;
    cursor: pointer;
    &-name {
      position: relative;
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
      display: flex;
      background-color: #ffffff;
      span {
        font-weight: 400;
        color: #555555;
        writing-mode: vertical-lr;
      }
    }
    &-minimap {
      position: absolute;
      // height: 200px;
      background-color: rgba(255, 192, 203, 0.3);
      left: 0px;
      top: 0px;
      transition: transform 0.3s linear;
    }
    .minimap {
      // left: -50%;
      transform: translate(-100%);
    }
  }
}
</style>
