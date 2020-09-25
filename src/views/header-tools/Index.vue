<template>
  <div class="header-tools">
    <div class="header-tools__piece">
      <el-dropdown>
        <icon-label icon="kf-icon-folder" label="文件" color="#ffcd2c"
          ><i class="el-icon-arrow-down el-icon--right"></i
        ></icon-label>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleClearCanvas"
            >清空画布</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <icon-label
        icon="kf-icon-save"
        label="保存"
        @click.native="handleSaveRelation"
      ></icon-label>
      <icon-label
        icon="kf-icon-import"
        label="导入"
        @click.native="openRelationDialog"
      ></icon-label>
      <!-- <icon-label icon="kf-icon-export" label="导出"></icon-label> -->
    </div>
    <!-- <div class="header-tools__small" @click="handelCellOperating">
      <span class="kf-icon-forbid"></span>
      <span class="kf-icon-help"></span>
      <span class="kf-icon-arrow-up"></span>
      <span class="kf-icon-copy"></span>
      <span class="kf-icon-help"></span>
      <span class="kf-icon-forbid"></span>
      <span class="kf-icon-warning"></span>
      <span class="kf-icon-delete" data-type="delete"></span>
      <span class="kf-icon-help"></span>
      <span class="kf-icon-test"></span>
    </div> -->
    <!-- <div class="header-tools__small small-second" @click="handelCellOperating">
      <span class="kf-icon-download-cloud"></span>
      <span class="kf-icon-layout"></span>
      <span class="kf-icon-steel-industry"></span>
      <span class="kf-icon-folder"></span>
      <span class="kf-icon-message"></span>
      <span class="kf-icon-data-sets"></span>
      <span class="kf-icon-redo" data-type="undo"></span>
      <span class="kf-icon-undo" data-type="redo"></span>
    </div> -->
    <!-- <div class="header-tools__piece">
      <icon-label icon="kf-icon-agent" label="布局"></icon-label>
      <icon-label icon="el-icon-s-data" label="分析"></icon-label>
      <icon-label icon="el-icon-share" label="文本"></icon-label>
      <icon-label icon="el-icon-set-up" label="熟悉展示"></icon-label>
      <icon-label icon="kf-icon-full-screen" label="全屏展示"></icon-label>
    </div>
    <div class="header-tools__search">
      <el-input
        size="mini"
        placeholder="请搜索"
        suffix-icon="el-icon-search"
      >
      </el-input>
      <el-select placeholder="请选择" size="mini" v-model="selectValue">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div> -->
    <!-- 保存画布数据 -->
    <el-dialog title="保存关系" :visible.sync="saveCfg.dialog">
      <el-form>
        <el-form-item label="关系图名称" label-width="120px">
          <el-input
            size="small"
            v-model="saveCfg.label"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="关系图描述" label-width="120px">
          <el-input
            type="textarea"
            size="small"
            v-model="saveCfg.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSure"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 导入关系列表 -->
    <el-dialog title="关系图列表" :visible.sync="relationList.dialog">
      <el-table
        :data="relationList.list"
        ref="table"
        row-key="id"
        stripe
        height="280px"
        @row-click="getCurrentRow"
      >
        <el-table-column label="选择" width="50" center>
          <template slot-scope="{ row }">
            <el-radio
              class="radio"
              @change.native="getCurrentRow(row)"
              v-model="relationList.radio"
              :label="row.id"
            ></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          label="关系图名"
          show-overflow-tooltip
          prop="label"
        ></el-table-column>
        <el-table-column
          label="关系图描述"
          show-overflow-tooltip
          prop="description"
        ></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="getRelationDetail"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import IconLabel from '@/components/icon-label/Index.vue';
import { mapGetters } from 'vuex';
import {
  saveAddUpdateRelations,
  getRelationsList,
  getRelationDetailById,
} from '@/api/headerTools';
export default {
  data() {
    return {
      options: [
        { value: 1, label: 'AAAA' },
        { value: 2, label: 'BBBB' },
        { value: 3, label: 'CCCC' },
      ],
      selectValue: '',
      // 保存
      saveCfg: {
        dialog: false,
        label: '',
        description: '',
      },
      // 导入
      relationList: {
        dialog: false,
        list: [],
        radio: '',
      },
      graphId: '', // 当前关系图id
    };
  },
  components: {
    IconLabel,
  },
  computed: {
    ...mapGetters(['editors']),
  },
  methods: {
    // 清空画布
    handleClearCanvas() {
      this.editors.graph.clear();
    },
    handelCellOperating(event) {
      // const target = event.target;
      // const type = target.dataset.type;
      // this.$emit('cell-operating', { type });
    },
    handleSaveRelation() {
      if (this.graphId) {
        const item = this.relationList.list.find((v) => v.id === this.graphId);
        this.saveCfg.description = item.description;
        this.saveCfg.label = item.label;
      }
      this.saveCfg.dialog = true;
    },
    handleSure() {
      const label = this.saveCfg.label.trim();
      if (!label) {
        return this.$message({
          type: 'warning',
          message: '请输入关系图名称',
        });
      }
      // 获取图上关系
      const allCells = this.graph.getModel().cells;
      // const content = {
      //   entities: [],
      //   links: [],
      // };
      // 获取所有节点
      this.editors.graph.findAll('node', (node) => {
        const cellInfo = node.get('model').cellInfo;
        if (cellInfo) {
          content.entities.push(cellInfo);
        }
        return false;
      });
      // 获取所有边
      this.editors.graph.findAll('edge', (edge) => {
        const cellInfo = edge.get('model').cellInfo;
        if (cellInfo) {
          content.links.push(cellInfo);
        }
        return false;
      });
      console.warn('content', content);
      this.saveRelation(content);
    },
    // 后端通讯保存
    async saveRelation(content) {
      const payload = {
        label: this.saveCfg.label,
        description: this.saveCfg.description,
        content: JSON.stringify(content),
      };
      if (this.graphId) {
        payload.id = this.graphId;
      }
      const { data } = await saveAddUpdateRelations(payload);
      console.warn('保存后', data);
      this.$message({
        type: data.code === 0 ? 'success' : 'warning',
        message: data.msg,
      });
      this.handleClose();
    },
    handleClose() {
      // 保存配置
      this.saveCfg.dialog = false;
      this.saveCfg.label = '';
      this.saveCfg.description = '';
      // 关系列表配置
      this.relationList.dialog = false;
      this.relationList.radio = '';
    },
    // 点击单选 (关系图)
    getCurrentRow(row) {
      this.relationList.radio = row.id;
      console.warn('relationList.radio', this.relationList.radio);
    },
    // 打开关系列表弹出框
    async openRelationDialog() {
      // 请求关系列表
      const { data } = await getRelationsList();
      if (data.code === 0) {
        this.relationList.list = data.content.map((v) => ({
          id: v.id,
          label: v.label,
          description: v.description,
          createTime: v.createTime,
          updateTime: v.updateTime,
        }));
      } else {
        this.$message({
          type: 'warning',
          message: data.msg,
        });
      }
      this.relationList.dialog = true;
      console.warn('关系列表', data);
    },
    // 获取关系数据
    async getRelationDetail() {
      if (!this.relationList.radio) {
        return this.$message({
          type: 'warning',
          message: '请选择需要导入的关系',
        });
      }
      const { data } = await getRelationDetailById(this.relationList.radio);
      // 保存当前关系图id
      this.graphId = this.relationList.radio;
      if (data.code === 0) {
        this.editors.importRelationData({
          data: data.content,
        });
      } else {
        this.$message({
          type: 'warning',
          message: data.msg,
        });
      }
      this.handleClose();
    },
  },
};
</script>

<style lang="scss" scoped>
.header-tools {
  display: flex;
  padding: 10px 0px;
  box-sizing: border-box;
  &__piece {
    display: flex;
    align-items: center;
    cursor: pointer;
    border-right: 1px solid #d9d9d9;
    & > div {
      padding: 0 20px;
      // &:hover {
      //   color: #409eff;
      // }
    }
  }
  &__small {
    cursor: pointer;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 200px;
    position: relative;
    border-right: 1px solid #d9d9d9;
    & > span {
      padding: 0px 10px;
      font-size: 18px;
      font-weight: 400;
      color: #555555;
      &:hover {
        color: #409eff;
      }
    }
  }
  .small-second {
    width: 166px;
  }
  &__search {
    flex: 1;
    padding: 0px 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    & > div:last-child {
      width: 100%;
    }
  }
  /deep/ {
    .el-dialog__body {
      padding: 10px;
    }
  }
  .radio {
    /deep/ .el-radio__label {
      display: none;
    }
  }
}
</style>