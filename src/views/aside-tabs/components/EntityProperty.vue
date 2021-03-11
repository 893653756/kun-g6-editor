<template>
  <div class="entity-property">
    <div class="entity-property__title">
      <span>实体属性</span>
      <!-- <span>—{{ selectNodeInfo.label }}</span> -->
    </div>
    <!-- 基本信息 -->
    <div class="entity-property__base">
      <div class="entity-property__base-title">
        <div>基本信息</div>
      </div>
      <div>
        <el-table :data="baseInfo" header-row-class-name="header-hidden">
          <el-table-column
            width="80"
            show-overflow-tooltip
            label
            prop="field"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label
            prop="value"
          ></el-table-column>
          <!-- <el-table-column width="30" align="center">
            <span class="kf-icon-table-file"></span>
          </el-table-column> -->
        </el-table>
        <div class="entity-property__base-detail" @click="LookBaseInfoDetail">
          查看全部
        </div>
      </div>
    </div>
    <!-- 节点相关信息 -->
    <div class="entity-property__base" v-if="relatedInfo.length">
      <div class="entity-property__base-title">
        <div>相关信息</div>
      </div>
      <div>
        <el-table :data="relatedInfo" header-row-class-name="header-hidden">
          <el-table-column
            width="80"
            show-overflow-tooltip
            label
            prop="field"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label
            prop="value"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 该实体所拥有的连接关系 -->
    <el-menu
      key="property"
      class="entity-property__links"
      :default-openeds="['1']"
    >
      <el-submenu index="1">
        <template slot="title">
          <div class="entity-property__links-title">
            <span>连接关系</span>
            <span>({{ entitysLinks.length }})</span>
          </div>
        </template>
        <div style="margin-top: 8px">
          <el-table
            :data="entitysLinks"
            stripe
            border
            :resizable="false"
            @selection-change="handleSelectionLink"
            header-cell-class-name="table-title"
            row-key="linkId"
          >
            <el-table-column
              type="selection"
              width="30"
              :reserve-selection="true"
            ></el-table-column>
            <el-table-column
              label="连接关系"
              prop="label"
              show-overflow-tooltip=""
            ></el-table-column>
            <!-- <el-table-column
              label="计数"
              prop="count"
              width="50"
            ></el-table-column> -->
            <el-table-column label="计数" prop="count" width="50">
              <template slot-scope="{ row }">
                <span>{{ row.ids.length }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  watch: {},
  computed: {
    ...mapGetters(["selectNodeId", "editors"]),
    selectNodeInfo() {
      if (this.selectNodeId) {
        // return this.editors.graph.findById(this.selectNodeId);
        const node = this.editors.graph.findById(this.selectNodeId);
        if (node) {
          const model = node.getModel();
          return {
            cellInfo: model.cellInfo,
            id: model.id,
          };
        }
      }
      return {};
    },
    relatedInfo() {
      const arr = [];
      if (Object.values(this.selectNodeInfo).length === 0) {
        return arr;
      }
      const cellInfo = this.selectNodeInfo.cellInfo;
      if (!cellInfo.preNodeIds) {
        return arr;
      }
      cellInfo.preNodeIds.forEach((id) => {
        const node = this.editors.graph.findById(id);
        const info = node.getModel().cellInfo;
        const properties = info.properties || {};
        Object.entries(properties).forEach(v => {
          arr.push({
            field: v[0],
            value: v[1] || '—'
          });
        })
      });
      return arr;
    },
    baseInfo() {
      const arr = [];
      if (Object.values(this.selectNodeInfo).length === 0) {
        return arr;
      }
      const cellInfo = this.selectNodeInfo.cellInfo;
      const lbProperties = cellInfo.lbProperties || {};
      const propOrders = cellInfo.propOrders || [];
      propOrders.forEach((key) => {
        if (lbProperties.hasOwnProperty(key)) {
          arr.push({
            field: key,
            value: lbProperties[key] || "—",
          });
        }
      });
      return arr;
    },
    entitysLinks() {
      if (Object.values(this.selectNodeInfo).length === 0) {
        return [];
      }
      const node = this.editors.graph.findById(this.selectNodeInfo.id);
      const edges = node.get("edges").filter((v) => v.isVisible());
      const obj = {};
      edges.forEach((v) => {
        const model = v.getModel();
        const cellInfo = model.cellInfo;
        if (!cellInfo) {
          return;
        }
        if (!obj[cellInfo.id]) {
          obj[cellInfo.id] = {
            label: cellInfo.label,
            ids: [model.id],
            linkId: cellInfo.id,
          };
        } else {
          obj[cellInfo.id].ids.push(model.id);
        }
      });
      return Object.values(obj);
    },
  },
  methods: {
    handleSelectionLink(select) {
      // console.warn(select);
      const ids = [];
      select.forEach((v) => {
        ids.push(...v.ids);
      });
      this.editors.setItemBackground({
        selectType: "edge",
        selectIds: ids,
        idType: "id",
      });
    },
    // 查看全部信息
    LookBaseInfoDetail() {
      if (Object.keys(this.selectNodeInfo).length === 0) {
        return this.$message({
          type: "warning",
          message: "暂无详情",
        });
      }
      const cellInfo = this.selectNodeInfo.cellInfo;
      this.$emit("look-node-detail", cellInfo);
    },
  },
};
</script>

<style lang="scss" scoped>
.entity-property {
  flex: 1;
  height: 0;
  padding: 0px 6px;
  font-size: 14px;
  &__title {
    margin-left: 8px;
    span {
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
  &__base {
    &-title {
      line-height: 28px;
      background-color: #f7f7f7;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 14px;
      & span {
        margin-right: 10px;
      }
    }
    &-detail {
      line-height: 26px;
      font-size: 12px;
      text-align: right;
      color: #409eff;
      cursor: pointer;
    }
  }
  &__links {
    border-right: none;
    /deep/ {
      .el-submenu__title {
        line-height: 28px;
        height: 28px;
        padding: 0px !important;
      }
    }
    margin-top: 6px;
    &-title {
      line-height: 28px;
      background-color: #f7f7f7;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      padding-left: 14px;
      & span {
        margin-right: 10px;
      }
      margin-bottom: 6px;
    }
  }
}
</style>