<template>
  <div class="entity-property">
    <div class="entity-property__title">
      <span>实体属性</span>
      <span>—{{ selectNodeInfo.label }}</span>
    </div>
    <!-- 基本信息 -->
    <div class="entity-property__base">
      <div class="entity-property__base-title">
        <div>基本信息</div>
        <div>
          <!-- <span class="kf-icon-edit"></span>
          <span class="kf-icon-share"></span>
          <span class="kf-icon-steel-industry"></span>
          <span class="kf-icon-lock"></span>
          <span class="el-icon-lock"></span> -->
        </div>
      </div>
      <div>
        <el-table :data="baseInfo" header-row-class-name="header-hidden">
          <el-table-column width="30" align="center">
            <span class="kf-icon-check-detail"></span>
          </el-table-column>
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
          <el-table-column width="30" align="center">
            <span class="kf-icon-table-file"></span>
          </el-table-column>
        </el-table>
        <div class="entity-property__base-detail" @click="LookBaseInfoDetail">
          查看全部
        </div>
      </div>
    </div>

    <!-- 该实体所拥有的连接关系 -->
    <el-menu class="entity-property__links" :default-openeds="['1']">
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
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column label="链接关系" prop="label"></el-table-column>
            <el-table-column
              label="计数"
              prop="count"
              width="60"
            ></el-table-column>
          </el-table>
        </div>
      </el-submenu>
    </el-menu>

    <!-- 发生次数关系 -->
    <!-- <el-menu class="entity-property__count">
      <el-submenu index="1">
        <template slot="title">
          <span class="entity-property__count-title">关系发生次数(5)</span>
        </template>
        <div style="margin-top: 8px">
          <div class="entity-property__count-filter">
            <el-input size="mini"></el-input>
            <div>≤次数≤</div>
            <el-input size="mini"></el-input>
            <el-button size="mini" type="primary" icon="el-icon-search">查询</el-button>
          </div>
          <el-table :data="linkRelationship" stripe border header-cell-class-name="table-title">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column label="关系发生次数"></el-table-column>
            <el-table-column label="计数"></el-table-column>
          </el-table>
        </div>
      </el-submenu>
    </el-menu> -->
    <!-- 详情弹框 -->
    <el-dialog :visible.sync="dialogBaseInfoVisible" width="30%">
      <el-table :data="baseInfoDetail" header-row-class-name="header-hidden">
        <el-table-column prop="field" label=""></el-table-column>
        <el-table-column prop="value" label=""></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      linkRelationship: [
        { relationship: 'AAA', num: 1 },
        { relationship: 'BBB', num: 2 },
        { relationship: 'CCC', num: 3 },
        { relationship: 'DDD', num: 4 },
      ],
      dialogBaseInfoVisible: false,
      baseInfoDetail: [],
    };
  },
  computed: {
    ...mapGetters(['selectNodes', 'editors']),
    selectNodeInfo() {
      if (this.selectNodes.length > 0) {
        return this.editors.graph.findById(this.selectNodes[0]);
      }
      return {};
    },
    baseInfo() {
      if (Object.values(this.selectNodeInfo).length === 0) {
        return [];
      }
      const cellInfo = this.selectNodeInfo.get('model').cellInfo;
      const info = cellInfo.lbProperties || {};
      return Object.entries(info).map((v) => ({
        field: v[0],
        value: v[1],
      }));
    },
    entitysLinks() {
      if (Object.values(this.selectNodeInfo).length === 0) {
        return [];
      }
      const edges = this.selectNodeInfo.get('edges');
      const obj = {};
      edges.forEach((v) => {
        const cellInfo = v.get('model').cellInfo;
        if (!obj[cellInfo.id]) {
          obj[cellInfo.id] = {
            label: cellInfo.label,
            count: 1,
            linkId: cellInfo.id,
          };
        } else {
          obj[cellInfo.id].count += 1;
        }
      });
      return Object.values(obj);
    },
  },
  methods: {
    handleSelectionLink(select) {
      select = select.map((v) => v.linkId);
      this.editors.setItemBackground({
        selectType: 'edge',
        selectIds: select,
        idType: 'id'
      });
    },
    // 查看全部信息
    LookBaseInfoDetail() {
      if (Object.keys(this.selectNodeInfo).length === 0) {
        return this.$message({
          type: 'warning',
          message: '暂无详情',
        });
      }
      const cellInfo = this.selectNodeInfo.get('model').cellInfo;
      const arr = [];
      if (cellInfo.mxProperties) {
        Object.entries(cellInfo.mxProperties).forEach((v) => {
          arr.push({
            field: v[0],
            value: v[1],
          });
        });
      }
      this.baseInfoDetail = arr;
      this.dialogBaseInfoVisible = true;
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
  /deep/ {
    .el-dialog__header {
      padding: 10px 10px 10px 0px;
      .el-dialog__headerbtn {
        top: 6px;
      }
    }
    .el-dialog__body {
      padding: 10px 10px 20px 10px;
    }
    .el-table {
      td, th {
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
    /deep/ {
      .table-title {
        background: #e1e1e1;
        padding: 4px 0;
      }
    }
  }
  // &__count {
  //   border-right: none;
  //   /deep/ {
  //     .el-submenu__title {
  //       line-height: 28px;
  //       height: 28px;
  //       padding: 0px !important;
  //     }
  //   }
  //   margin-top: 6px;
  //   &-title {
  //     line-height: 28px;
  //     background-color: #f7f7f7;
  //     display: flex;
  //     align-items: center;
  //     justify-content: space-between;
  //     padding-left: 14px;
  //     & span {
  //       margin-right: 10px;
  //     }
  //     margin-bottom: 6px;
  //   }
  //   &-filter {
  //     display: flex;
  //     justify-content: center;
  //     align-items: center;
  //     & div {
  //       flex: 1;
  //       &:nth-child(2n -1) {
  //         margin: 0 3px;
  //       }
  //     }
  //     margin-bottom: 10px;
  //   }
  //   /deep/ {
  //     .table-title {
  //       background: #e1e1e1;
  //     }
  //   }
  // }
}
</style>