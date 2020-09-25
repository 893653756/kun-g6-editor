<template>
  <div class="graph-canvas">
    <div ref="canvas" style="width: 100%; height: 100%;"></div>
    <!-- 手动创建连接关系 -->
    <el-dialog
      title="关系类型"
      :visible.sync="dialogLinkType"
      @closed="handleDialogClose"
    >
      <el-radio-group v-model="radioLink" v-if="linksBetweenEntity.length">
        <el-radio
          v-for="item of linksBetweenEntity"
          :key="item.linkId"
          :label="item.label"
          >{{ item.label }}</el-radio
        >
      </el-radio-group>
      <div v-else class="link-input">
        <span>关系名称:</span>
        <el-input size="small" v-model="radioLink"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleDialogClose">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSureLink"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 节点关系列表 -->
    <el-dialog
      title="节点关系"
      :visible.sync="dialogLinkList"
      @closed="handleDialogClose"
    >
      <el-table
        :data="cellRelationList"
        stripe
        @selection-change="handleSelectionRela"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="关系类型" prop="gxMc"></el-table-column>
        <el-table-column label="关系节点id" prop="zzYpdxId"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleDialogClose">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSureSelect"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import G6 from '@antv/g6';
import { graphCfg } from '@/graph-cfg';
import {
  getCellRelationList,
  fetchBetweenEntitiesLink,
  fetchCellRelationshipNode,
} from '@/api/editors';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      dialogLinkList: false, // 关系列表弹框
      dialogLinkType: false, // 节点关系弹窗
      linksBetweenEntity: [], // 可建立的关系列表
      cellRelationList: [], // 节点所有有关系
      radioLink: '',
    };
  },
  mounted() {
    this.initGraph();
  },
  computed: {
    ...mapGetters(['editors']),
  },
  methods: {
    // 初始化编辑器容器
    initGraph() {
      const {clientHeight, clientWidth} = this.$refs.canvas;
      this.graph = new G6.Graph({
        width: clientWidth,
        height: clientHeight,
        container: this.$refs.canvas,
        ...graphCfg,
        plugins: this.initPlugins(),
      });
      this.initGraphSuccess();
      this.graph._addEdge = (model) => {
        this.getLinksBetweenEntity(model);
      };
    },
    // 节点间可以创建的关系
    async getLinksBetweenEntity(edge) {
      this.handleCreateEdge = edge;
      const { source, target } = edge;
      const startDxId = source.get('model').cellInfo.dxId;
      const endDxId = target.get('model').cellInfo.dxId;
      const { data } = await fetchBetweenEntitiesLink(startDxId, endDxId);
      console.warn('links', data);
      if (data.code === 0) {
        this.linksBetweenEntity = data.content.map((v) => ({
          label: v.gxMc,
          linkId: v.id,
        }));
        this.dialogLinkType = true;
      } else {
        this.$message({
          type: 'warning',
          message: data.msg,
        });
      }
    },
    // 确定创建某种关系
    handleSureLink() {
      if (!this.radioLink) {
        return this.$message({
          type: 'warning',
          message:
            this.linksBetweenEntity.length === 0
              ? '请输入连接关系'
              : '请选择连接关系',
        });
      }
      const { source, target } = this.handleCreateEdge;
      const startDxId = source.get('model').cellInfo.dxId;
      const endDxId = target.get('model').cellInfo.dxId;
      const cellInfo = {
        sourceEntityId: startDxId,
        targetEntityId: endDxId,
      };
      if (this.linksBetweenEntity.length === 0) {
        cellInfo.id = this.radioLink;
        cellInfo.label = this.radioLink;
      } else {
        const detail = this.linksBetweenEntity.find(
          (v) => v.label === this.radioLink
        );
        cellInfo.id = detail.linkId;
        cellInfo.label = detail.label;
      }
      this.handleCreateEdge.cellInfo = cellInfo;
      this.editors.addEdge(this.handleCreateEdge);
      this.handleDialogClose();
    },
    initPlugins() {
      const self = this;
      // 工具条
      const toolbar = new G6.ToolBar();
      // 背景网格
      const grid = new G6.Grid();
      // 右键菜单
      const menu = new G6.Menu({
        offsetX: 6,
        offsetX: 10,
        className: 'right-menus',
        itemTypes: ['node', 'edge'],
        getContent(e) {
          console.warn('右键菜单', e);
          return `<div class="right-menu__list">
            <span data-type="extend-relation">扩展一层</span>
            <span data-type="delete">删除</span>
            <span>测试01</span>
            <span>测试01</span>
            <span>测试01</span>
          </div>`;
        },
        handleMenuClick(target, item) {
          const { type } = target.dataset;
          self.handleMenuCB(type, item);
        },
      });
      return [grid, menu, toolbar];
    },
    initGraphSuccess() {
      // 发射事件
      this.$emit('graph-editors', { graph: this.graph });
    },
    // 右键菜单回调
    handleMenuCB(type, item) {
      console.warn(type, item);
      // 扩展一层
      if (type === 'extend-relation') {
        // console.warn(item);
        this.openRelationBox(item);
      } else if (type === 'delete') {
        this.editors.removeItem(item);
      }
    },
    // 需要加载的关系
    handleSelectionRela(selection) {
      this.selectRelations = selection;
    },
    // 打开节点关系框
    async openRelationBox(node) {
      const cellInfo = node.get('model').cellInfo;
      this.rightClickCellInfo = cellInfo;
      if (cellInfo.gxId.includes(',')) {
        // 请求节点所有关系
        const { data } = await getCellRelationList(cellInfo.gxId);
        if (data.code === 0) {
          this.cellRelationList = data.content;
          this.dialogLinkList = true;
        } else {
          this.$message({
            type: 'warning',
            message: data.msg,
          });
        }
      } else {
        this.extendRelationship(cellInfo);
      }
    },
    // 确认加载选择的关系
    handleSureSelect() {
      if (this.selectRelations.length === 0) {
        return this.$message({
          type: 'warning',
          message: '请选择需要查询的关系',
        });
      }
      const gxIds = this.selectRelations.map((v) => v.id).join(',');
      this.extendRelationship(this.rightClickCellInfo, gxIds);
    },
    // 扩展关系
    async extendRelationship(cellInfo, gxIds) {
      const { dxId: startDxId, idMap } = cellInfo;
      const payload = {
        startDxId,
        params: {
          idMap,
          gxIds,
        },
      };
      const { data } = await fetchCellRelationshipNode(payload);
      if (data.code === 0) {
        // const { entities, links } = data.content;
        console.warn('data.content', data.content);
        this.editors.extendRelation(data.content);
      } else {
        this.$message({
          type: 'warning',
          message: data.msg,
        });
      }
      this.handleDialogClose();
    },
    // 关闭弹窗
    handleDialogClose() {
      this.selectRelations = [];
      this.dialogLinkList = false;
      this.linkDetail = [];
      this.linksBetweenEntity = [];
      this.handleCreateEdge = [];
      this.rightClickCellInfo = null;
      this.dialogLinkType = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.graph-canvas {
  overflow: hidden;
}
.link-input {
  display: flex;
  align-items: center;
  & > span {
    width: 100px;
    text-align: right;
    margin-right: 10px;
  }
}
</style>