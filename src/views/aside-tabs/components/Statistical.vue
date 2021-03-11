<template>
  <!-- 统计分析 -->
  <div class="statistics">
    <div class="statistics__title">
      <span>统计分析</span>
    </div>
    <!-- 实体 -->
    <el-menu class="statistics__entity" :default-openeds="['1']">
      <el-submenu index="1">
        <template slot="title">
          <span class="statistics__entity-title">实体</span>
        </template>
        <div style="margin-top: 8px">
          <el-table
            :data="hasEntitys"
            stripe
            border
            header-cell-class-name="table-title"
            @selection-change="handleSelectionEntity"
            row-key="key"
          >
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column label="实体类型">
              <template slot-scope="{ row }">
                <div class="img-field" @click="handleLookDetail">
                  <img
                    :src="`${$baseImagePath}/entityImages/${row.icon}.png`"
                    alt
                  />
                  <span>{{ row.label }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="计数"
              align="center"
              header-align="center"
              width="50"
            >
              <template slot-scope="{ row }">
                <span>{{ row.ids.length }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-submenu>
    </el-menu>
    <!-- 连接关系 -->
    <el-menu class="statistics__entity" :default-openeds="['1']">
      <el-submenu index="1">
        <template slot="title">
          <div class="statistics__entity-title">
            <span>连接关系</span>
            <span>({{ hasEdges.length }})</span>
          </div>
        </template>
        <div style="margin-top: 8px">
          <el-table
            :data="hasEdges"
            stripe
            border
            :resizable="false"
            @selection-change="handleSelectionLink"
            header-cell-class-name="table-title"
            row-key="linkId"
          >
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column label="连接关系" prop="label"></el-table-column>
            <el-table-column label="计数" width="50">
              <template slot-scope="{ row }">
                <span>{{ row.ids.length }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-submenu>
    </el-menu>
    <!-- 发生次数关系 -->
    <el-menu class="statistics__count" :default-openeds="['1']">
      <el-submenu index="1">
        <template slot="title">
          <span class="statistics__count-title">关系发生次数</span>
        </template>
        <div style="margin-top: 8px">
          <div class="statistics__count-filter">
            <el-input size="mini" v-model="linksRange.start"></el-input>
            <div>≤次数≤</div>
            <el-input size="mini" v-model="linksRange.end"></el-input>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="handleSearchRange"
              >查询</el-button
            >
          </div>
          <el-table
            :data="entityLinks"
            stripe
            border
            header-cell-class-name="table-title"
            @selection-change="handleLinkNum"
          >
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column
              label="关系发生次数"
              prop="links"
            ></el-table-column>
            <el-table-column label="实体计数" prop="count"></el-table-column>
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
    return {
      entityLinks: [],
      linksRange: {
        start: "",
        end: "",
      },
    };
  },
  watch: {
    hasEdges: {
      handler() {
        this.countEntityLinks();
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["hasEntitys", "hasEdges", "editors"]),
  },
  methods: {
    // 下转到类型实体详情
    handleLookDetail() {
      //
    },
    handleSearchRange() {
      this.countEntityLinks();
    },
    isInRnage(k) {
      let { start, end } = this.linksRange;
      start = start === "" ? -1 : start;
      end = end === "" ? 1000 : end;
      if (k >= start && k <= end) {
        return true;
      }
      return false;
    },
    // 计算每个实体的关系数量
    countEntityLinks() {
      if (!this.editors) {
        return;
      }
      const obj = {};
      const nodeList = this.editors.graph
        .getNodes()
        .filter((v) => v.isVisible());
      nodeList.forEach((node) => {
        const k = `${node.get("edges").filter((v) => v.isVisible()).length}`;
        const id = node.get("id");
        if (!this.isInRnage(k - 0)) {
          return;
        }
        if (!obj[k]) {
          obj[k] = {
            count: 1,
            ids: [id],
            links: k,
          };
        } else {
          obj[k].count += 1;
          obj[k].ids.push(id);
        }
      });
      this.entityLinks = Object.values(obj);
    },
    // 选择的实体节点
    handleSelectionEntity(select) {
      // select = select.map((v) => v.dxId);
      const ids = [];
      select.forEach((v) => {
        ids.push(...v.ids);
      });
      this.editors.setItemBackground({
        selectType: "node",
        selectIds: ids,
        idType: "id",
      });
    },
    // 选择的连接关系
    handleSelectionLink(select) {
      // select = select.map((v) => v.linkId);
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
    handleLinkNum(select) {
      select = select.reduce((a, b) => {
        return [...a, ...b.ids];
      }, []);
      this.editors.setItemBackground({
        selectType: "node",
        selectIds: select,
        idType: "id",
      });
    },
  },
  beforeDestroy() {
    const graph = this.editors.graph;
    graph.findAll("node", (node) => {
      graph.setItemState(node, "selected", false);
    });
    graph.findAll("edge", (node) => {
      graph.setItemState(node, "selected", false);
    });
  },
};
</script>

<style lang='scss' scoped>
.statistics {
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
  // 实体
  &__entity {
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
      .img-field {
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          width: 20px;
          margin-right: 5px;
        }
      }
    }
  }
  &__count {
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
      justify-content: space-between;
      padding-left: 14px;
      & span {
        margin-right: 10px;
      }
      margin-bottom: 6px;
    }
    &-filter {
      display: flex;
      justify-content: center;
      align-items: center;
      & div {
        flex: 1;
        &:nth-child(2n -1) {
          margin: 0 4px;
        }
        &:nth-child(2) {
          text-align: center;
        }
      }
      margin-bottom: 10px;
    }
    /deep/ {
      .table-title {
        background: #e1e1e1;
        padding: 4px 0;
      }
    }
  }
  /deep/ {
    .el-submenu [class^="el-icon-"] {
      vertical-align: baseline;
      margin-right: 0px;
      width: 18px;
      text-align: center;
      font-size: 12px;
    }
  }
}
</style>
