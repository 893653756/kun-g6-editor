<template>
  <div class="graph-canvas" ref="graph-canvas">
    <div ref="canvas" style="width: 100%; height: 100%"></div>
    <!-- 手动创建连接关系 -->
    <el-dialog
      title="关系类型"
      :visible.sync="dialogLinkType"
      @closed="handleDialogClose"
    >
      <div v-loading="linkLoading">
        <el-form>
          <el-radio-group v-model="radioLink" v-if="linksBetweenEntity.length">
            <el-radio
              v-for="item of linksBetweenEntity"
              :key="item.linkId"
              :label="item.label"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
          <template v-else-if="xsbhs">
            <el-form-item label="关系名称:" class="link-input">
              <div v-if="radioLinkDisabled">{{ radioLink }}</div>
              <el-input placeholder="上线、下线、其它" v-else size="small" v-model="radioLink"></el-input>
            </el-form-item>
            <!-- <el-form-item label="标签:" class="link-input">
              <el-radio-group v-model="caseCluesTagType">
                <el-radio label="red"></el-radio>
                <el-radio label="black">未查获</el-radio>
                <el-radio label="green">延伸</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <!-- <el-form-item label="线索编号:" class="link-input">
              <el-radio-group v-model="xsbh">
                <el-radio v-for="vv of xsbhs" :label="vv.xsbh" :key="vv.xsbh">{{
                  vv.xsmc
                }}</el-radio>
              </el-radio-group>
            </el-form-item> -->
          </template>

          <el-form-item label="关系名称:" v-else class="link-input">
            <el-input size="small" v-model="radioLink"></el-input>
          </el-form-item>
          <el-form-item label="关系描述:">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="可输入关系描述"
              v-model="linkDesc"
            >
            </el-input>
          </el-form-item>
        </el-form>
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
      width="50%"
    >
      <el-table
        :data="cellRelationList"
        stripe
        height="350"
        @selection-change="handleSelectionRela"
        ref="dataTable"
        v-loading="loading"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="关系类型" prop="gxMc"></el-table-column>
        <!-- <el-table-column label="关系节点id" prop="id"></el-table-column>
        <el-table-column
          label="方向"
          prop="xtzx"
          :formatter="formatterText"
        ></el-table-column> -->
        <el-table-column label="关系数量" prop="count"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleDialogClose">取 消</el-button>
        <el-button
          size="small"
          :loading="btnLoading"
          type="primary"
          @click="handleSureSelect"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 连接关系详情 -->
    <el-dialog
      title="关系详情"
      :visible.sync="dialogLinkDetail"
      @closed="handleDialogClose"
      width="85%"
    >
      <div v-if="customLinkDesc">{{ customLinkDesc }}</div>
      <el-table
        :data="linkDetail.values"
        stripe
        v-loading="linkLoading"
        height="300"
        v-else
      >
        <!-- <el-table-column label="xxx"></el-table-column> -->
        <el-table-column
          v-for="(val, k) in linkDetail.columns"
          :key="k"
          :label="val"
          :prop="k"
          show-overflow-tooltip
        >
          <template slot="header" slot-scope="">
            <el-tooltip
              class="dialog-header-tooltip"
              effect="dark"
              :content="val"
              placement="top"
            >
              <span>{{ val }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import { getMenuList } from "./auxiliary";
import { graphCfg } from "@/graph-cfg";
import {
  getCellRelationList,
  fetchBetweenEntitiesLink,
  fetchCellRelationshipNode,
  getAllRelation,
  fetchRelationDetail,
} from "@/api/editors";
import { mapGetters } from "vuex";
import MyMixin from "@/mixin";
import { findBltjrByBlnr, fetchCasecluesDetail, getRelationByDxType } from "@/api/headerTools";

export default {
  data() {
    return {
      dialogLinkList: false, // 关系列表弹框
      dialogLinkType: false, // 节点关系弹窗
      dialogLinkDetail: false, // 关系详情
      linkDetail: {
        values: [],
        columns: {},
      },
      customLinkDesc: "",
      linksBetweenEntity: [], // 可建立的关系列表
      cellRelationList: [], // 节点所有有关系
      radioLink: "",
      radioLinkDisabled: false,
      loading: false,
      btnLoading: false,
      linkLoading: false,
      linkDesc: "",
      // 线索标签 （red查获、black未查获、green延伸）
      // caseCluesTagType: "",
      xsbh: "",
    };
  },
  mixins: [MyMixin],
  created() {
    this.linkDirection = {
      SX: "双向关系",
      ZX: "正向关系",
      FX: "反向关系",
    };
    this.selectRelations = [];
  },
  mounted() {
    this.initGraph();
  },
  computed: {
    ...mapGetters(["editors", "leafNodeList", "xsbhs", "userAndDept"]),
  },
  watch: {
    xsbhs: {
      handler(val) {
        console.log("immediate", val);
        this.xsbh = Array.isArray(val) && val[0].xsbh;
      },
      immediate: true,
    },
  },
  methods: {
    // 初始化编辑器容器
    initGraph() {
      const { clientHeight, clientWidth } = this.$refs["graph-canvas"];
      const self = this;
      this.graph = new G6.Graph({
        width: clientWidth,
        height: clientHeight,
        container: this.$refs.canvas,
        ...graphCfg,
        // animateCfg: {
        //   callback() {
        //     const nodes = self.graph.getNodes();
        //     nodes.forEach((item) => {
        //       const model = item.getModel();
        //       if (model.shrinkParent) {
        //         delete model.shrinkParent;
        //         self.graph.hideItem(item);
        //       }
        //     });
        //   },
        // },
        plugins: this.initPlugins(),
      });
      // 初始化成功
      this.initGraphSuccess();
    },
    // 节点间可以创建的关系
    async getLinksBetweenEntity(edge) {
      const { source, target } = edge;
      // 如果目标节点是集合集合节点则不可创建连线
      // if (target.getModel().type === "group-node") {
      //   return this.$message({
      //     type: "info",
      //     message: "集合不能添加自定义连线",
      //   });
      // }
      // this.handleCreateEdge = edge;
      const startDxId = source.get("model").cellInfo.dxId;
      const endDxId = target.get("model").cellInfo.dxId;
      this.dialogLinkType = true;
      this.linkLoading = true;
      const { data } = await fetchBetweenEntitiesLink(startDxId, endDxId);
      this.linkLoading = false;
      // console.warn('links', data);
      if (data.code === 0) {
        this.linksBetweenEntity = data.content.map((v) => ({
          label: v.gxMc,
          linkId: v.id,
        }));
      } else {
        this.$message({
          type: "warning",
          message: data.msg,
        });
      }
    },
    // 确定创建某种关系
    handleSureLink() {
      if (!this.radioLink) {
        return this.$message({
          type: "warning",
          message:
            this.linksBetweenEntity.length === 0
              ? "请输入连接关系"
              : "请选择连接关系",
        });
      }
      const { source, target } = this.handleCreateEdge;
      const startDxId = source.get("model").cellInfo.dxId;
      const endDxId = target.get("model").cellInfo.dxId;
      const cellInfo = {
        sourceEntityId: startDxId,
        targetEntityId: endDxId,
        linkDesc: this.linkDesc, // 自定义关系描述
        custom: true, // 自定义
      };
      if (this.xsbh) {
        cellInfo.label = this.radioLink;
        cellInfo.xsbh = this.xsbh;
        // cellInfo.tag = this.caseCluesTagType;
        this.handleCreateEdge.id += this.radioLink;
      } else if (this.linksBetweenEntity.length === 0) {
        cellInfo.id = this.radioLink;
        cellInfo.label = this.radioLink;
        this.handleCreateEdge.id += this.radioLink;
      } else {
        const detail = this.linksBetweenEntity.find(
          (v) => v.label === this.radioLink
        );
        cellInfo.id = detail.linkId;
        cellInfo.label = detail.label;
        this.handleCreateEdge.id += detail.linkId;
      }
      this.handleCreateEdge.cellInfo = cellInfo;
      this.editors.addEdge(this.handleCreateEdge);
      this.radioLink = "";
      this.handleDialogClose();
      // this.$nextTick(() => this.graph.layout());
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
        offsetY: 10,
        className: "right-menus",
        itemTypes: ["node"],
        getContent(e) {
          // console.warn('右键菜单', e);
          return getMenuList(e.item, self.graph);
        },
        handleMenuClick(target, item) {
          const { type, value } = target.dataset;
          const menuElement = document.getElementsByClassName(
            "right-menu__list"
          )[0];
          menuElement.classList.add("right-menu__hide");
          self.handleMenuCB(type, item, value);
        },
      });
      // return [grid, menu, toolbar];
      return [menu];
    },
    initGraphSuccess() {
      this.graph._addEdge = (model) => {
        const { target } = model;
        // 如果目标节点是集合集合节点则不可创建连线
        if (target.getModel().type === "group-node") {
          return this.$message({
            type: "info",
            message: "集合不能添加自定义连线",
          });
        }
        this.handleCreateEdge = model;
        if (this.xsbhs) {
          // 创建线索关系
          this.createCasecluesLink(model);
        } else {
          this.getLinksBetweenEntity(model);
        }
      };
      window.graph = this.graph;
      // 调整大小
      this.graph._changeSize = () => {
        const { clientHeight, clientWidth } = this.$refs["graph-canvas"];
        this.graph.changeSize(clientWidth, clientHeight);
      };
      // 点击线条，显示关系详情
      this.graph._showLinkDetail = (item) => {
        // console.warn('edge-click', item);
        const cellInfo = item.getModel().cellInfo;
        if (cellInfo.xsbh) {
          this.showCasecluesLinkDetail(item);
        } else {
          this.showLinkDetail(item);
        }
      };
      // 收缩叶子节点
      this.graph._collapseExpandLeafNode = (item, v) => {
        this.collapseExpandLeafNode(item, v);
      };
      this.graph._deleteNodes = (items) => {
        this.deleteNodes(items);
      };
      // 发射事件
      this.$emit("graph-editors", { graph: this.graph });
    },
    // 创建案件线索关系
    createCasecluesLink(edge) {
      const { target, source } = edge;
      console.log("edge", edge);
      this.dialogLinkType = true;
      const type1 = target.getModel().cellInfo.type;
      const type2 = source.getModel().cellInfo.type;
      if (type1 === "ajxs_xs" || type2 === "ajxs_xs") {
        this.radioLink = "主犯";
        this.radioLinkDisabled = true;
      } else {
        this.radioLinkDisabled = false;
      }
    },
    getRelateNodes({ preNodeIds }) {
      preNodeIds = preNodeIds || [];
      const result = [];
      preNodeIds.forEach((id) => {
        const node = this.graph.findById(id);
        if (node) {
          const cellInfo = node.getModel().cellInfo;
          result.push({
            dxType: cellInfo.type,
            idMap: cellInfo.idMap,
          });
        }
      });
      return result;
    },
    // 团伙关系详情
    async showCasecluesLinkDetail(edge) {
      const source = edge.getSource();
      const sourceCell = source.getModel().cellInfo;
      const target = edge.getTarget();
      const targetCell = target.getModel().cellInfo;
      const cellInfo = edge.getModel().cellInfo;
      const startNode = {
        dxType: sourceCell.type,
        idMap: sourceCell.idMap,
      };
      //产看是否有节点相关信息
      const startRelateNodes = this.getRelateNodes(sourceCell);
      const endNode = {
        dxType: targetCell.type,
        idMap: targetCell.idMap,
      };
      //产看是否有节点相关信息
      const endRelateNodes = this.getRelateNodes(targetCell);
      const params = {
        payload: {
          startNode,
          endNode,
          xsbh: cellInfo.xsbh,
          ...this.userAndDept,
          startRelateNodes,
          endRelateNodes,
        },
        linkId: cellInfo.id,
      };
      this.dialogLinkDetail = true;
      this.linkLoading = true;
      const { data } = await fetchCasecluesDetail(params);
      this.linkLoading = false;
      if (data.code === 0) {
        // const { columns, values } = data.content;
        this.linkDetail = data.content;
      } else {
        this.$message({
          type: "warning",
          message: data.msg,
        });
      }
    },
    // 请求关系详情
    async showLinkDetail(edge) {
      const cellInfo = edge.get("model").cellInfo;
      const linkParams = cellInfo.linkParams || {};
      if (cellInfo.custom) {
        this.dialogLinkDetail = true;
        this.customLinkDesc = cellInfo.linkDesc;
        return;
      }
      const linkId = cellInfo.id;
      const direction = cellInfo.direction;
      const source = edge.get("source");
      let startIdMap = source.get("model").cellInfo.idMap;
      const target = edge.get("target");
      let endIdMap = target.get("model").cellInfo.idMap;
      if (!startIdMap || !endIdMap) {
        return this.$message({
          type: "warning",
          message: "当前有集合节点, 请先展开",
        });
      }
      if (direction === "FX") {
        [startIdMap, endIdMap] = [endIdMap, startIdMap];
      }
      const payload = {
        linkId,
        params: {
          startIdMap,
          endIdMap,
          linkParams,
        },
      };
      this.dialogLinkDetail = true;
      this.linkLoading = true;
      const { data } = await fetchRelationDetail(payload);
      this.linkLoading = false;
      if (data.code === 0) {
        // const { columns, values } = data.content;
        this.linkDetail = data.content;
      } else {
        this.$message({
          type: "warning",
          message: data.msg,
        });
      }
    },
    // 右键菜单回调
    handleMenuCB(type, item, value) {
      if (type === "sub-menu") {
        return;
      }
      let str;
      if (type === "extend-relation") {
        const cellInfo = item.getModel().cellInfo;
        if (cellInfo.custom) {
          this.oneClickJudgment(cellInfo);
        } else {
          this.openRelationBox(item);
        }
      } else if (type === "shrink-relation") {
        this.shrinkChildNodes(item); // 收拢子节点
      } else if (type === "unshrink-relation") {
        this.unShrinkChildNodes(item);
      } else if (type === "delete") {
        this.deleteNodes([item]);
      } else if (type.includes("lock")) {
        str = type.split("-")[1];
        str === "true"
          ? this.editors.unLockItem(item)
          : this.editors.lockItem(item);
      } else if (type.includes("highlight")) {
        str = type.split("-")[1];
        str === "true"
          ? this.graph.setItemState(item, "highlight", false)
          : this.graph.setItemState(item, "highlight", true);
      } else if (type.includes("emphasize")) {
        str = type.split("-")[1];
        str === "true"
          ? this.editors.unEmphasizeItem(item)
          : this.editors.emphasizeItem(item);
      } else if (type === "xqUrl") {
        this.openWindow(item);
      } else if (type.includes("leaf-node")) {
        if (value === "all") {
          this.leafNodeList.forEach((v) => {
            this.collapseExpandLeafNode(item, v);
          });
          this.$nextTick(() => {
            this.graph.layout();
          });
        } else {
          const extendsObj = this.leafNodeList.find(
            (item) => item.gxId === value
          );
          this.collapseExpandLeafNode(item, extendsObj);
        }
        this.$nextTick(() => {
          this.graph.layout();
        });
      } else if (type.includes("unfold")) {
        // 展开组 子节点展开自己 | 父节点展开子节点
        this.unfoldGroupNode(item, value);
      } else if (type.includes("hidden-node") || type.includes("show-node")) {
        // 隐藏节点
        this.handleShowHiddenNode(type, item);
      } else if (type === "details") {
        this.$emit("look-node-detail", item.getModel().cellInfo);
      }
    },
    // 删除节点
    deleteNodes(items) {
      this.$confirm("删除节点后不可撤销, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          items.forEach((v) => this.editors.removeItem(v));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 隐藏显示节点
    handleShowHiddenNode(type, item) {
      const hideItems = [];
      if (type === "hidden-node-self") {
        this.graph.hideItem(item);
      } else if (type === "hidden-node-children") {
        // 隐藏所有后代节点
        this.findAllChildItems(item, hideItems);
        hideItems.forEach((v) => this.graph.hideItem(v));
      } else if (type === "show-node-children") {
        // 显示所有子节点
        this.findAllChildItems(item, hideItems);
        hideItems.forEach((v) => this.graph.showItem(v));
      }
    },
    // 查找所有子节点
    findAllChildItems(item, result = []) {
      const edges = item.getOutEdges();
      edges.forEach((e) => {
        const target = e.getTarget();
        result.push(target);
        this.findAllChildItems(target, result);
      });
    },
    // 展开组
    unfoldGroupNode(item, value) {
      // 如果锁定
      // if (item.hasLocked()) {
      //   return this.$message({
      //     type: 'warning',
      //     message: '节点已锁定'
      //   });
      // }
      const ids = value.split(",");
      const len = ids.length;
      let flag = false;
      ids.forEach((id) => {
        const _item = this.graph.findById(id);
        if (_item.hasLocked()) {
          flag = true;
          return;
        }
        const leafNodesInfo = _item.get("model").leafNodesInfo;
        this.graph.removeItem(_item);
        leafNodesInfo.nodeModels.forEach((v) => {
          this.graph.add("node", v);
        });
        leafNodesInfo.edgeModels.forEach((v) => {
          this.graph.add("edge", v);
        });
      });
      if (flag && len === 1) {
        return this.$message({
          type: "warning",
          message: "节点已锁定",
        });
      }
      this.graph.layout();
    },
    // 收拢子节点
    shrinkChildNodes(item) {
      const descendantNode = {};
      const { x, y, id } = item.getModel();
      this.removeDescendantNode(item, descendantNode);
      const nodes = Object.values(descendantNode);
      nodes.forEach((node) => {
        this.graph.hideItem(node);
        // const model = node.getModel();
        // model.x = x;
        // model.y = y;
        // model.shrinkParent = id;
      });
      // this.graph.refresh();
      if (nodes.length > 0) {
        this.graph.updateItem(item, {
          shrink: true,
        });
      }
      this.$nextTick(() => this.graph.layout());
      // let t = setTimeout(() => {
      //   clearTimeout(t);
      //   t = null;
      //   this.graph.layout();
      // }, 700)
    },
    // 显示子节点
    unShrinkChildNodes(item) {
      const descendantNode = {};
      this.removeDescendantNode(item, descendantNode);
      const nodes = Object.values(descendantNode);
      nodes.forEach((node) => {
        this.graph.showItem(node);
      });
      this.graph.updateItem(item, {
        shrink: false,
      });
      this.$nextTick(() => this.graph.layout());
    },
    // 删除后代节点
    removeDescendantNode(item, descendantNode) {
      const edges = item.getOutEdges("edges");
      const sourceIime = item.getModel().time || 0;
      edges.forEach((e) => {
        const eModel = e.getModel();
        if (!eModel.otherLine) {
          const target = e.getTarget();
          const tModel = target.getModel();
          const id = target.get("id");
          const targetTime = tModel.time || 0;
          if (targetTime < sourceIime) {
            return;
          }
          if (!descendantNode[id]) {
            descendantNode[id] = target;
            if (tModel.shrink) {
              return;
            }
            this.removeDescendantNode(target, descendantNode);
          }
        }
      });
    },
    // 归类叶子节点
    collapseExpandLeafNode(item, extendsObj) {
      // 保存节点数据
      let x;
      let y;
      // const idList = extendsObj.leafNodeIds.split(',');
      const idList = extendsObj.leafNodes;
      const leafNodesInfo = {
        nodeModels: [],
        edgeModels: [],
      };
      const descendantNode = {};
      idList.forEach((v) => {
        const item = this.graph.findById(v);
        const nodeModel = item.get("model");
        x = nodeModel.x;
        y = nodeModel.y;
        // 找到当前关系
        const edges = item
          .getInEdges("edges")
          .find((e) => e.getModel().cellInfo.id === extendsObj.gxId);
        // const edgeModel = edges.get('model');
        // const edgeModel = edges.map((e) => e.get('model'));
        const edgeModel = edges && edges.getModel();
        leafNodesInfo.nodeModels.push(nodeModel);
        if (edgeModel) {
          leafNodesInfo.edgeModels.push(edgeModel);
          // 删除该条关系
          this.graph.removeItem(edges);
        }
        // 如果该节点有子节点, 则删除
        if (item.get("edges").length > 0) {
          this.removeDescendantNode(item, descendantNode);
        }
      });
      // console.warn('descendantNode', descendantNode);
      idList.forEach((v) => {
        const item = this.graph.findById(v);
        if (item.getInEdges("edges").length === 0) {
          this.graph.removeItem(v);
        }
      });
      Object.values(descendantNode).forEach((v) => {
        this.graph.removeItem(v);
      });
      const id = `${item.get("id")}_group_${extendsObj.gxId}`;
      const label = extendsObj.label;
      const model = {
        x,
        y,
        type: "group-node",
        cellInfo: {
          type: extendsObj.img,
          id: id,
          icon: extendsObj.img,
          label: "集合",
          dxId: `${extendsObj.dxId}_group`,
        },
        leafNodesInfo,
        custom: true,
      };
      this.editors.addNode(model);
      // this.graph.add('node', model);
      // 添加线
      const edgeLabel = `${label} (${idList.length}个)`;
      const edgeModel = {
        id: `${item.get("id")}_${extendsObj.gxId}-edge`,
        source: item.get("id"),
        target: id,
        cellInfo: {
          id: extendsObj.gxId,
          label: edgeLabel,
        },
        // type: 'line',
        // itemType: 'edge',
        isGroupEdge: true,
      };
      this.editors.addEdge(edgeModel);
      // this.graph.add('edge', edgeModel);
    },
    // 打开连接窗口
    openWindow(item) {
      const cellInfo = item.get("model").cellInfo;
      window.open(cellInfo.xqUrl, "_blank");
    },
    // 需要加载的关系
    handleSelectionRela(selection) {
      this.selectRelations = selection;
    },
    // 一键研判 (只有当节点为自定义节点时)
    async oneClickJudgment(cellInfo) {
      const payload = {
        params: {
          idMaps: [cellInfo.idMap],
          countNextNodeNum: true,
        },
        dxType: cellInfo.type,
      };
      await findBltjrByBlnr(payload);
      await getRelationByDxType({ wsType: window.access_token, ...payload })
    },
    // 打开节点关系框
    async openRelationBox(node) {
      const { cellInfo } = node.get("model");
      // let leafNodesInfo = [];
      const edges = node.getOutEdges();
      edges.forEach((v) => {
        const tm = v.getTarget().get("model");
        // if (tm.type === 'group-node') {
        //   leafNodesInfo.push(...tm.leafNodesInfo);
        // }
      });
      this.rightClickCell = {
        cellInfo,
        // leafNodesInfo,
      };
      if (!cellInfo.gxId) {
        return this.$message({
          type: "warning",
          message: "该节点没有关系",
        });
      }
      this.cellRelationList = [];
      this.loading = true;
      this.dialogLinkList = true;
      // 请求节点所有关系
      const { data } = await getCellRelationList(cellInfo.gxId);
      this.loading = false;
      if (data.code === 0) {
        const linkCount = cellInfo.linkCount || {};
        this.cellRelationList = this.filterLink(data.content, cellInfo);
        this.$nextTick(() => {
          this.selectSX();
        });
      } else {
        this.$message({
          type: "warning",
          message: data.msg,
        });
      }
      // 一条时直接查询
      // this.extendRelationship(this.rightClickCell, cellInfo.gxId);
    },
    // 过滤查询的关系
    filterLink(content, cellInfo) {
      const item = this.graph.findById(cellInfo.id);
      const edges = item.get("edges");
      const linekTypeCount = {};
      edges.forEach((v) => {
        const eModel = v.getModel();
        if (eModel.isGroupEdge) {
          const gNode = v.getTarget();
          const gModel = gNode.getModel();
          const leafNodesInfo = gModel.leafNodesInfo;
          leafNodesInfo.edgeModels.forEach((model) => {
            const cellInfo = model.cellInfo;
            const key = `${cellInfo.id}_${cellInfo.direction}`;
            linekTypeCount[key]
              ? (linekTypeCount[key] += 1)
              : (linekTypeCount[key] = 1);
          });
        } else {
          const cellInfo = eModel.cellInfo;
          const key = `${cellInfo.id}_${cellInfo.direction}`;
          linekTypeCount[key]
            ? (linekTypeCount[key] += 1)
            : (linekTypeCount[key] = 1);
        }
      });
      // console.warn('linekTypeCount', linekTypeCount);
      const linkCount = cellInfo.linkCount || {};
      return content
        .map((v) => {
          const key = `${v.id}_${v.xtzx}`;
          let count = 0;
          if (linkCount[key]) {
            count = linkCount[key] - (linekTypeCount[key] || 0);
          }
          return {
            gxMc: v.gxMc,
            // zzYpdxId: v.zzYpdxId, // 终止对象id
            xtzx: v.xtzx,
            id: v.id,
            count: count,
            gx: key,
          };
        })
        .sort((a, b) => {
          return b.count - a.count;
        });
    },
    // 默认选中双向关系
    selectSX() {
      const dataTable = this.$refs.dataTable;
      if (!dataTable) {
        return;
      }
      dataTable.clearSelection();
      this.selectRelations = this.cellRelationList.filter((v) => {
        // v.xtzx === 'SX' 表示双向关系
        if (v.count > 0) {
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
      const selectRelations = this.selectRelations.filter((v) => v.count !== 0);
      if (this.selectRelations.length === 0) {
        return this.$message({
          type: "warning",
          message: "请选择需要查询的关系",
        });
      }
      if (selectRelations.length === 0) {
        return this.$message({
          type: "warning",
          message: "你选择的关系暂无数据",
        });
      }
      const gxIds = selectRelations.map((v) => v.gx).join(",");
      this.extendRelationship(this.rightClickCell, gxIds);
    },
    // 扩展关系
    async extendRelationship(rightClickCell, gxIds) {
      const { tab, idMap, type } = rightClickCell.cellInfo;
      this.btnLoading = true;
      try {
        await findBltjrByBlnr({
          dxType: type || "",
          params: { idMaps: [idMap] },
        });
      } catch (error) {}
      const payload = {
        tableName: tab,
        params: {
          idMaps: [idMap],
          gxIds,
        },
        wsType: window.access_token,
      };
      const { data } = await getAllRelation(payload);
      this.btnLoading = false;
      if (data.code === 0) {
        // 处理数据
        // data.content.entities = this.saveItemId(data.content.entities);
        // this.editors.extendRelation(
        //   data.content,
        //   this.rightClickCell.cellInfo.id
        // );
      } else {
        this.$message({
          type: "warning",
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
      this.rightClickCell = null;
      this.dialogLinkType = false;
      // this.caseCluesTagType = "";
      // 节点关系详情
      this.linkDetail = {
        values: [],
        columns: {},
      };
      this.dialogLinkDetail = false;
      this.radioLink = "";
      this.linkDesc = "";
      this.customLinkDesc = "";
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
      .dialog-header-tooltip {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
      }
      .el-radio-group {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .el-radio {
          width: 140px;
          margin: 10px 0px 10px 0px;
        }
      }
    }
  }
}
// .link-input {
//   display: flex;
//   align-items: center;
//   & > span {
//     width: 100px;
//     text-align: right;
//     margin-right: 10px;
//   }
// }
</style>