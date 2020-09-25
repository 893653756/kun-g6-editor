<template>
  <div class="entity-property">
    <div class="entity-property__title">
      <span>实体属性</span>
      <span>—{{ selectNode.label }}</span>
    </div>
    <!-- 基本信息 -->
    <div class="entity-property__base">
      <div class="entity-property__base-title">
        <div>基本信息</div>
        <div>
          <span class="kf-icon-edit"></span>
          <span class="kf-icon-share"></span>
          <span class="kf-icon-steel-industry"></span>
          <span class="kf-icon-lock"></span>
          <span class="el-icon-lock"></span>
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
      </div>
    </div>

    <!-- 该实体所拥有的连接关系 -->
    <el-menu class="entity-property__links">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      // attrList: [
      //   { filed: '姓名', value: '成飞' },
      //   { filed: '证件号码', value: '12123123213' },
      //   { filed: '信息编号', value: '313131321' },
      //   { filed: '录入时间', value: '2018-04-01' },
      //   { filed: '籍贯', value: '四川省成都市' },
      //   { filed: '性别', value: '男' },
      //   { filed: '年龄', value: '56' },
      //   { filed: '年龄段', value: '50~60' },
      // ],
      linkRelationship: [
        { relationship: 'AAA', num: 1 },
        { relationship: 'BBB', num: 2 },
        { relationship: 'CCC', num: 3 },
        { relationship: 'DDD', num: 4 },
      ],
    };
  },
  computed: {
    ...mapGetters(['selectNode', 'editors']),
    baseInfo() {
      if (Object.values(this.selectNode).length === 0) {
        return [];
      }
      const cellInfo = this.selectNode.get('model').cellInfo;
      const info = cellInfo.lbProperties || {};
      return Object.entries(info).map((v) => ({
        field: v[0],
        value: v[1],
      }));
    },
    entitysLinks() {
      if (Object.values(this.selectNode).length === 0) {
        return [];
      }
      const edges = this.selectNode.get('edges');
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
      const selected = [];
      const unselected = [];
      this.editors.graph.findAll('edge', (edge) => {
        const item = edge.get('model').cellInfo;
        select.includes(item.id) ? selected.push(edge) : unselected.push(edge);
      });
      unselected.forEach((edge) => {
        this.editors.graph.setItemState(edge, 'selected', false);
      });
      selected.forEach((edge) => {
        this.editors.graph.setItemState(edge, 'selected', true);
      });
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
    /deep/ {
      .el-table {
        .header-hidden {
          display: none;
        }
        .cell {
          padding: 0 5px;
        }
      }
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