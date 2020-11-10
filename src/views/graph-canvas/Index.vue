<template>
  <div class="graph-canvas" ref="graph-canvas">
    <div ref="canvas" style="width: 100%; height: 100%"></div>
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
        height="370"
        @selection-change="handleSelectionRela"
        ref="dataTable"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="关系类型" prop="gxMc"></el-table-column>
        <el-table-column label="关系节点id" prop="id"></el-table-column>
        <el-table-column
          label="方向"
          prop="xtzx"
          :formatter="formatterText"
        ></el-table-column>
        <el-table-column label="数量" prop="count"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleDialogClose">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSureSelect"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 连接关系详情 -->
    <el-dialog
      title="关系详情"
      :visible.sync="dialogLinkDetail"
      @closed="handleDialogClose"
      width="80%"
    >
      <el-table :data="linkDetail.values" stripe>
        <el-table-column
          v-for="(val, k) in linkDetail.columns"
          :key="k"
          :label="val"
          :prop="k"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import G6 from '@antv/g6';
import { getMenuList } from './auxiliary';
import { graphCfg } from '@/graph-cfg';
import {
  getCellRelationList,
  fetchBetweenEntitiesLink,
  fetchCellRelationshipNode,
  getAllRelation,
  fetchRelationDetail,
} from '@/api/editors';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      dialogLinkList: false, // 关系列表弹框
      dialogLinkType: false, // 节点关系弹窗
      dialogLinkDetail: false, // 关系详情
      linkDetail: [],
      linksBetweenEntity: [], // 可建立的关系列表
      cellRelationList: [], // 节点所有有关系
      radioLink: '',
    };
  },
  created() {
    this.linkDirection = {
      SX: '双向关系',
      ZX: '正向关系',
      FX: '反向关系',
    };
    this.selectRelations = [];
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
      const { clientHeight, clientWidth } = this.$refs['graph-canvas'];
      this.graph = new G6.Graph({
        width: clientWidth,
        height: clientHeight,
        container: this.$refs.canvas,
        ...graphCfg,
        plugins: this.initPlugins(),
      });
      // 初始化成功
      this.initGraphSuccess();
    },
    // 节点间可以创建的关系
    async getLinksBetweenEntity(edge) {
      this.handleCreateEdge = edge;
      const { source, target } = edge;
      const startDxId = source.get('model').cellInfo.dxId;
      const endDxId = target.get('model').cellInfo.dxId;
      const { data } = await fetchBetweenEntitiesLink(startDxId, endDxId);
      // console.warn('links', data);
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
      this.radioLink = '';
      this.handleDialogClose();
    },
    // 初始化插件
    initPlugins() {
      const self = this;
      // 工具条
      // const toolbar = new G6.ToolBar();
      // 背景网格
      // const grid = new G6.Grid();
      // 右键菜单
      const menu = new G6.Menu({
        offsetX: 6,
        offsetX: 10,
        className: 'right-menus',
        itemTypes: ['node'],
        getContent(e) {
          // console.warn('右键菜单', e);
          return getMenuList(e.item);
        },
        handleMenuClick(target, item) {
          const { type, value, gxid, img } = target.dataset;
          const extendsObj = {
            leafNodeIds: value,
            gxid: gxid,
            img,
          };
          // console.warn('type:', type);
          self.handleMenuCB(type, item, extendsObj);
        },
      });
      // return [grid, menu, toolbar];
      return [menu];
    },
    initGraphSuccess() {
      this.graph._addEdge = (model) => {
        this.getLinksBetweenEntity(model);
      };
      window.graph = this.graph;
      // 调整大小
      this.graph._changeSize = () => {
        const { clientHeight, clientWidth } = this.$refs['graph-canvas'];
        this.graph.changeSize(clientWidth, clientHeight);
      };
      // 点击线条，显示关系详情
      this.graph._showLinkDetail = (item) => {
        // console.warn('edge-click', item);
        this.showLinkDetail(item);
      };
      // 发射事件
      this.$emit('graph-editors', { graph: this.graph });
    },
    // 请求关系详情
    async showLinkDetail(edge) {
      const linkId = edge.get('model').cellInfo.id;
      const source = edge.get('source');
      const startIdMap = source.get('model').cellInfo.idMap;
      const target = edge.get('target');
      const endIdMap = target.get('model').cellInfo.idMap;
      const payload = {
        linkId,
        params: {
          startIdMap,
          endIdMap,
        },
      };
      const { data } = await fetchRelationDetail(payload);
      if (data.code === 0) {
        // const { columns, values } = data.content;
        this.linkDetail = data.content;
        this.dialogLinkDetail = true;
      } else {
        this.$message({
          type: 'warning',
          message: data.msg,
        });
      }
    },
    // 右键菜单回调
    handleMenuCB(type, item, extendsObj) {
      if (type === 'leaf-node') {
        return;
      }
      // 扩展一层
      let str;
      if (type === 'extend-relation') {
        this.openRelationBox(item);
      } else if (type === 'delete') {
        this.editors.removeItem(item);
      } else if (type.includes('lock')) {
        str = type.split('-')[1];
        str === 'true'
          ? this.editors.unLockItem(item)
          : this.editors.lockItem(item);
      } else if (type.includes('highlight')) {
        str = type.split('-')[1];
        str === 'true'
          ? this.graph.setItemState(item, 'selected', false)
          : this.graph.setItemState(item, 'selected', true);
      } else if (type.includes('emphasize')) {
        str = type.split('-')[1];
        str === 'true'
          ? this.editors.unEmphasizeItem(item)
          : this.editors.emphasizeItem(item);
      } else if (type === 'xqUrl') {
        this.openWindow(item);
      } else if (type.includes('leaf-node')) {
        this.collapseExpandLeafNode(type, item, extendsObj);
      } else if (type === 'extend-group') {
        // 展开组
        this.extendGroupNode(item);
      }
    },
    // 展开组
    extendGroupNode(item) {
      const leafNodesInfo = item.get('model').leafNodesInfo;
      this.graph.removeItem(item);
      leafNodesInfo.forEach((v) => {
        this.graph.add('node', v.nodeModel);
        this.graph.add('edge', v.edgeModel);
      });
    },
    // 收缩叶子节点
    collapseExpandLeafNode(type, item, extendsObj) {
      // 保存节点数据
      let x;
      let y;
      const idList = extendsObj.leafNodeIds.split(',');
      const leafNodesInfo = idList.map((v) => {
        const item = this.graph.findById(v);
        const nodeModel = item.get('model');
        x = nodeModel.x;
        y = nodeModel.y;
        const edges = item.get('edges')[0];
        const edgeModel = edges.get('model');
        return {
          nodeModel,
          edgeModel
        };
      });
      idList.forEach((v) => {
        this.graph.removeItem(v);
      });
      const id = `${item.get('id')}_${extendsObj.gxid}`;
      const label = type.split('_')[1];
      const model = {
        x,
        y,
        id: id,
        type: 'group-node',
        cellInfo: {
          label: '',
          type: extendsObj.img,
          id: id,
        },
        leafNodesInfo,
        img: `${window.baseImagePath}/entityImages/${extendsObj.img}.png`,
        label: '',
      };
      this.graph.add('node', model, true);
      // 添加线
      const edgeModel = {
        id: `${item.get('id')}_${extendsObj.gxid}-edge`,
        label: `${label} (${idList.length})`,
        source: item.get('id'),
        target: `${item.get('id')}_${extendsObj.gxid}`,
        cellInfo: {
          id: extendsObj.gxid,
        },
        type: 'line',
        itemType: 'edge',
      };
      this.graph.add('edge', edgeModel);
    },
    // 打开连接窗口
    openWindow(item) {
      const cellInfo = item.get('model').cellInfo;
      window.open(cellInfo.xqUrl, '_blank');
    },
    // 需要加载的关系
    handleSelectionRela(selection) {
      this.selectRelations = selection;
    },
    // 打开节点关系框
    async openRelationBox(node) {
      const cellInfo = node.get('model').cellInfo;
      this.rightClickCellInfo = cellInfo;
      if (!cellInfo.gxId) {
        return this.$message({
          type: 'warning',
          message: '该节点没有关系',
        });
      }
      if (cellInfo.gxId.includes(',')) {
        // 请求节点所有关系
        const { data } = await getCellRelationList(cellInfo.gxId);
        if (data.code === 0) {
          const linkCount = cellInfo.linkCount || {};
          this.cellRelationList = data.content
            .map((v) => ({
              gxMc: v.gxMc,
              // zzYpdxId: v.zzYpdxId, // 终止对象id
              xtzx: v.xtzx,
              id: v.id,
              count: linkCount[`${v.id}_${v.xtzx}`] || 0,
              gx: `${v.id}_${v.xtzx}`,
            }))
            .sort((a, b) => {
              return b.count - a.count;
            });
          this.dialogLinkList = true;
          this.$nextTick(() => {
            this.selectSX();
          });
        } else {
          this.$message({
            type: 'warning',
            message: data.msg,
          });
        }
      } else {
        this.extendRelationship(cellInfo, cellInfo.gxId);
      }
    },
    // 默认选中双向关系
    selectSX() {
      const dataTable = this.$refs.dataTable;
      if (!dataTable) {
        return;
      }
      dataTable.clearSelection();
      this.selectRelations = this.cellRelationList.filter((v) => {
        if (v.xtzx === 'SX' && v.count > 0) {
          return true;
        }
        return false;
      });
      this.$nextTick(() => {
        this.selectRelations.forEach((row) => {
          dataTable.toggleRowSelection(row);
        });
      });
    },
    // 确认加载选择的关系
    handleSureSelect() {
      this.selectRelations = this.selectRelations.filter((v) => v.count !== 0);
      if (this.selectRelations.length === 0) {
        return this.$message({
          type: 'warning',
          message: '请选择需要查询的关系',
        });
      }
      const gxIds = this.selectRelations.map((v) => v.gx).join(',');
      this.extendRelationship(this.rightClickCellInfo, gxIds);
    },
    // 扩展关系
    async extendRelationship(cellInfo, gxIds) {
      const { tab, idMap } = cellInfo;
      const payload = {
        tableName: tab,
        params: {
          idMaps: [idMap],
          gxIds,
        },
      };
      const { data } = await getAllRelation(payload);
      if (data.code === 0) {
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
      this.linksBetweenEntity = [];
      this.handleCreateEdge = [];
      this.rightClickCellInfo = null;
      this.dialogLinkType = false;
      // 节点关系详情
      this.linkDetail = [];
      this.dialogLinkDetail = false;
    },
    // 格式化关系方向
    formatterText(obj) {
      return this.linkDirection[obj.xtzx];
    },
  },
};
</script>

<style lang="scss" scoped>
.graph-canvas {
  overflow: auto;
  /deep/ {
    .el-dialog {
      margin: 0px auto 0px;
    }
  }
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