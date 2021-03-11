<template>
  <!-- 社会网络分析 -->
  <div class="network">
    <div class="network__title">
      <span>社会网络分析</span>
    </div>
    <!-- 搜索 -->
    <div class="network__count">
      <span>
        计算出
        <span class="network__count-num">{{ allEntitys.length }}</span
        >个对象
      </span>
    </div>
    <!-- 实体 -->
    <div class="network__entity">
      <el-table
        :data="allEntitys"
        stripe
        header-cell-class-name="table-title"
        @selection-change="handleSelectionEntity"
        row-key="id"
      >
        <el-table-column
          type="selection"
          width="30"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column label="对象名称" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <div class="img-field">
              <span>{{ row.id }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          prop="label"
          align="center"
          header-align="center"
          width="70"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="重要度"
          prop="weight"
          align="center"
          header-align="center"
          width="60"
        ></el-table-column>
      </el-table>
    </div>
    <!-- 实体标签 -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["editors"]),
    allEntitys() {
      const arr = [];
      if (!this.editors) {
        return arr;
      }
      const nodeList = this.editors.graph
        .getNodes()
        .filter((v) => v.isVisible());
      nodeList.forEach((node) => {
        const id = node.get("id");
        const item = node.get("model").cellInfo;
        arr.push({
          id,
          label: item.label,
          weight: 1,
        });
      });
      return arr;
    },
  },
  methods: {
    handleSelectionEntity(select) {
      // console.warn('1111', select)
      select = select.map((v) => v.id);
      this.editors.setItemBackground({
        selectType: "node",
        selectIds: select,
        idType: "id",
      });
    },
  },
  beforeDestroy() {
    // console.warn('beforeDestroy')
    const graph = this.editors.graph;
    graph.findAll("node", (node) => {
      graph.setItemState(node, "selected", false);
    });
  },
};
</script>

<style lang='scss' scoped>
.network {
  flex: 1;
  height: 0;
  padding: 0px 6px;
  font-size: 14px;
  // 标题
  &__title {
    margin-left: 8px;
    span {
      line-height: 33px;
      font-size: 14px;
      color: #1f98cd;
      &:first-child {
        font-size: 16px;
        color: #000000;
        margin-right: 10px;
        font-weight: 600;
      }
    }
  }
  // 搜索
  &__count {
    display: flex;
    text-align: center;
    margin-left: 8px;
    &-num {
      color: #1f98cd;
      margin: 0 2px;
    }
  }
  // 实体
  &__entity {
    margin-top: 10px;
    /deep/ {
      .el-table {
        .cell {
          padding: 0 5px;
        }
      }
      .table-title {
        background: #e1e1e1;
        padding: 4px 0;
      }
      .img-field {
        display: flex;
        align-items: center;
        img {
          width: 20px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
