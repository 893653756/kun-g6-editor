<template>
  <div class="header-tools">
    <div class="header-tools__piece">
      <el-dropdown>
        <icon-label icon="kf-icon-folder" label="文件" color="#ffcd2c">
          <i class="el-icon-arrow-down"></i>
        </icon-label>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleClearCanvas"
            >清空画布</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 保存 -->
      <el-dropdown>
        <icon-label icon="kf-icon-save" label="保存" color="#409eff"
          ><i class="el-icon-arrow-down"></i
        ></icon-label>
        <el-dropdown-menu slot="dropdown" @click.native="handleSaveRelation">
          <el-dropdown-item data-type="save">保存</el-dropdown-item>
          <el-dropdown-item data-type="saveAs">另存为</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <icon-label
        icon="kf-icon-save"
        label="保存"
        color="#409eff"
        @click.native="handleSaveRelation"
      ></icon-label> -->
      <el-dropdown>
        <icon-label icon="kf-icon-export" label="导出" color="#ffcd2c"
          ><i class="el-icon-arrow-down"></i
        ></icon-label>
        <el-dropdown-menu slot="dropdown" @click.native="handleExportGraph">
          <el-dropdown-item data-type="image">导出图片</el-dropdown-item>
          <!-- <el-dropdown-item data-type="json">导出JSON</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
      <icon-label
        icon="kf-icon-import"
        label="导入"
        @click.native="openRelationDialog"
      ></icon-label>
    </div>
    <div class="header-tools__piece">
      <icon-label
        icon="el-icon-lock"
        label="锁定"
        color="#E6A23C"
        @click.native="handleLock"
      ></icon-label>
      <icon-label
        icon="el-icon-unlock"
        label="解锁"
        @click.native="handleUnLock"
      ></icon-label>
      <icon-label
        icon="kf-icon-info"
        label="强调"
        color="#E6A23C"
        @click.native="handleEmphasize"
      ></icon-label>
      <icon-label
        icon="kf-icon-info"
        label="取消强调"
        @click.native="handleUnEmphasize"
      ></icon-label>
    </div>
    <div class="header-tools__piece">
      <el-dropdown>
        <icon-label icon="kf-icon-agent" :label="layoutName" color="#F56C6C"
          ><i class="el-icon-arrow-down"></i
        ></icon-label>
        <el-dropdown-menu slot="dropdown" @click.native="handelChangeLayout">
          <el-dropdown-item
            v-for="item in layoutCfg"
            :key="item.type"
            :data-type="item.type"
            >{{ item.label }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 单选 | 多选 -->
      <el-dropdown>
        <icon-label icon="kf-icon-blood" :label="selectName" color="#F56C6C"
          ><i class="el-icon-arrow-down"></i
        ></icon-label>
        <el-dropdown-menu
          slot="dropdown"
          @click.native="handelChangeSelectModel"
        >
          <el-dropdown-item data-type="single">单选</el-dropdown-item>
          <el-dropdown-item data-type="multiple">多选</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 分析 -->
      <el-dropdown>
        <icon-label icon="el-icon-s-data" label="分析" color="#67C23A"
          ><i class="el-icon-arrow-down"></i
        ></icon-label>
        <el-dropdown-menu slot="dropdown" @click.native="handelDataAnalysis">
          <el-dropdown-item data-type="shortest-path"
            >最短路径</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <icon-label
        color="#67C23A"
        icon="el-icon-s-data"
        label="路径分析"
        @click.native="shortestPath"
      ></icon-label> -->
      <icon-label
        icon="kf-icon-setting"
        label="重置"
        @click.native="handleStyleReset"
      ></icon-label>
      <icon-label
        icon="kf-icon-full-screen"
        label="全屏"
        @click.native="handleFullScreen"
        v-if="!fullScreen"
      ></icon-label>
      <icon-label
        icon=" kf-icon-small-screen"
        label="还原"
        @click.native="handleSmallScreen"
        v-else
      ></icon-label>
      <!-- <icon-label
        icon="kf-icon-loading"
        label="加载关系"
        @click.native="extendRelationship"
      ></icon-label> -->
    </div>
    <div class="header-tools__search">
      <el-input size="mini" placeholder="请搜索" v-model="searchValue">
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="handleSearchEntity"
        ></i>
      </el-input>
      <el-select placeholder="请选择" size="mini" v-model="selectValue">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span class="kf-icon-table-file"></span>
          <span style="margin-left: 10px">{{ item.label }}</span>
        </el-option>
      </el-select>
    </div>
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
import { layoutCfg } from '@/graph-cfg';
import { mapGetters } from 'vuex';
import * as MutationTypes from '@/store/mutation-types';
import {
  saveAddUpdateRelations,
  getRelationsList,
  getRelationDetailById,
} from '@/api/headerTools';
import { getAllRelation } from '@/api/editors';

export default {
  data() {
    return {
      layoutCfg,
      options: [
        { value: 1, label: 'AAAA' },
        { value: 2, label: 'BBBB' },
        { value: 3, label: 'CCCC' },
      ],
      searchValue: '',
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
      fullScreen: false,
    };
  },
  components: {
    IconLabel,
  },
  computed: {
    ...mapGetters(['editors', 'selectNodes', 'selectModel', 'layoutType']),
    selectName() {
      return this.selectModel === 'single' ? '单选' : '多选';
    },
    layoutName() {
      return this.layoutCfg[this.layoutType].label;
    },
  },
  methods: {
    // 清空画布
    handleClearCanvas() {
      this.editors.clearCanvas();
      this.graphId = '';
    },
    // 导出
    handleExportGraph() {
      const target = event.target;
      const { type } = target.dataset;
      this.editors.exportGraph(type);
    },
    // 锁定
    handleLock() {
      if (this.selectNodes.length > 0) {
        this.selectNodes.forEach((id) => {
          const item = this.editors.graph.findById(id);
          this.editors.lockItem(item);
          // if (!item.hasLocked()) {
          //   const model = item.get('model');
          //   model.lock = true;
          //   item.lock();
          //   this.editors.updateItem(item, model);
          // }
        });
      }
    },
    // 解锁
    handleUnLock() {
      if (this.selectNodes.length > 0) {
        this.selectNodes.forEach((id) => {
          const item = this.editors.graph.findById(id);
          this.editors.unLockItem(item);
          // if (item.hasLocked()) {
          //   const model = item.get('model');
          //   model.lock = false;
          //   item.unlock();
          //   this.editors.updateItem(item, model);
          // }
        });
      }
    },
    // 强调
    handleEmphasize() {
      if (this.selectNodes.length > 0) {
        this.selectNodes.forEach((id) => {
          const item = this.editors.graph.findById(id);
          this.editors.emphasizeItem(item);
          // const model = item.get('model');
          // if (!model.emphasize) {
          //   model.emphasize = true;
          //   this.editors.updateItem(item, model);
          // }
        });
      }
    },
    // 取消强调
    handleUnEmphasize() {
      if (this.selectNodes.length > 0) {
        this.selectNodes.forEach((id) => {
          const item = this.editors.graph.findById(id);
          this.editors.unEmphasizeItem(item);
          // const model = item.get('model');
          // if (model.emphasize) {
          //   model.emphasize = false;
          //   this.editors.updateItem(item, model);
          // }
        });
      }
    },
    // 切换选择模式
    handelChangeSelectModel(event) {
      const target = event.target;
      const { type } = target.dataset;
      this.$store.commit(MutationTypes.SET_SELECT_MODEL, type);
    },
    // 切换布局
    handelChangeLayout(event) {
      const target = event.target;
      const { type } = target.dataset;
      const cfg = this.layoutCfg[type];
      // this.layoutName = cfg.label;
      this.$store.commit(MutationTypes.SET_LAYOUT_TYPE, type);
      this.editors.updateLayout(cfg);
    },
    // 数据分析
    handelDataAnalysis(event) {
      const target = event.target;
      const { type } = target.dataset;
      if (type === 'shortest-path') {
        this.shortestPath();
      }
    },
    // 路径分析
    shortestPath() {
      if (this.selectNodes.length !== 2) {
        // console.warn('this.selectNodes', this.selectNodes);
        return this.$message({
          type: 'warning',
          message: '请选择两个节点',
        });
      }
      this.editors.findShortestPath(this.selectNodes[0], this.selectNodes[1]);
    },
    // 重置, 清除效果
    handleStyleReset() {
      this.editors.styleReset();
    },
    // 全屏
    handleFullScreen() {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
      this.fullScreen = true;
    },
    // 还原
    handleSmallScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      this.fullScreen = false;
    },
    // 搜索实体
    handleSearchEntity() {
      const key = this.searchValue.trim();
      if (!key) {
        return this.$message({
          type: 'warning',
          message: '请输入搜索关键字',
        });
      }
      this.editors.searchEntity(key);
      console.warn('handleSearchEntity');
    },
    // 加载关系 (测试用,)
    // async extendRelationship() {
    //   const payload = {
    //     tableName: 'ry_jcxx',
    //     params: {
    //       idMaps: [{
    //         sfzhm: '321284198003196329',
    //       }],
    //     },
    //   };
    //   const { data } = await getAllRelation(payload);
    //   if (data.code === 0) {
    //     // console.warn('data.content', data.content);
    //     this.editors.importRelationData(data.content);
    //   } else {
    //     this.$message({
    //       type: 'warning',
    //       message: data.msg,
    //     });
    //   }
    // },
    handleSaveRelation(event) {
      const target = event.target;
      const { type } = target.dataset;
      this.saveType = type;
      if (type === 'save') {
        if (this.graphId) {
          const item = this.relationList.list.find(
            (v) => v.id === this.graphId
          );
          this.saveCfg.description = item.description;
          this.saveCfg.label = item.label;
        }
      } else {
        this.saveCfg.description = '';
        this.saveCfg.label = '';
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
      const content = this.editors.graph.save();
      this.saveRelation(content);
    },
    // 后端通讯保存
    async saveRelation(content) {
      const payload = {
        label: this.saveCfg.label,
        description: this.saveCfg.description,
        content: JSON.stringify(content),
      };
      if (this.saveType === 'save' && this.graphId) {
        payload.id = this.graphId;
      }
      const { data } = await saveAddUpdateRelations(payload);
      // console.warn('保存后', data);
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
      // console.warn('关系列表', data);
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
      const content = JSON.parse(data.content);
      // const content = data.content; // 本地调试用
      if (data.code === 0) {
        this.editors.graph.read(content);
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
    /deep/ {
      .el-icon-search {
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
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
