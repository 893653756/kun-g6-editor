import { bindEventListener } from './eventListener';
import { Algorithm } from '@antv/g6'; // 图算法库
import { Message } from 'element-ui';
import store from '@/store/index';
import * as MutationTypes from '@/store/mutation-types';
// import { layoutCfg } from '@/graph-cfg';
class Editors {
  saveGraph(payload) {
    this.graph = payload.graph;
    // 绑定事件
    bindEventListener(payload.graph);
  }
  // 添加节点
  addNode(model) {
    const cellInfo = model.cellInfo;
    if (cellInfo && (!cellInfo.custom)) {
      const nodeIdList = store.getters.nodeIdList || [];
      const nextEntities = cellInfo.nextEntities || [];
      let childrenCount = 0;
      nextEntities.forEach(id => {
        if (!nodeIdList.includes(id)) {
          childrenCount++;
        }
      });
      model.childrenCount = childrenCount;
    }
    const label = Object.entries(cellInfo.properties)
      .map((v) => `${v[1]}`)
      .join('\n');
    model.img = `${window.baseImagePath}/entityImages/${cellInfo.icon}.png`;
    model.label = label;
    model.id = cellInfo.id;
    this.graph.add('node', model, true);
  }
  // 添加边
  addEdge(model) {
    const { source } = model;
    const cellInfo = model.cellInfo;
    model.label = cellInfo.label;
    model.itemType = 'edge';
    this.graph.add('edge', model, true);
    // 更新节点的下一层节点数量
    const sourceModel = source.getModel();
    this.graph.updateItem(source, sourceModel);
  }
  // 删除节点
  removeItem(item) {
    const id = item.get('id');
    const node = this.graph.findById(id);
    this.graph.removeItem(node, true);
  }
  // 设置状态
  setItemState(item, type, value) {
    this.graph.setItemState(item, type, value);
  }
  // 设置背景颜色
  setItemBackground({ selectType, selectIds, idType }) {
    const selected = [];
    const unselected = [];
    this.graph.findAll(selectType, (node) => {
      const item = node.get('model').cellInfo;
      selectIds.includes(item[idType]) ? selected.push(node) : unselected.push(node);
    });
    unselected.forEach((node) => {
      this.graph.setItemState(node, 'selected', false);
    });
    selected.forEach((node) => {
      this.graph.setItemState(node, 'selected', true);
    });
  }
  // 更新元素
  updateItem(item, model) {
    this.graph.updateItem(item, model);
  }
  // 切换布局
  updateLayout(cfg) {
    this.graph.updateLayout(cfg);
  }
  // 路径分析
  findShortestPath(startId, endId) {
    const { findAllPath } = Algorithm;
    let allPath = findAllPath(this.graph, startId, endId, false);
    if (allPath && allPath.length > 0) {
      allPath = allPath.sort((a, b) => a.length - b.length);
      const path = allPath[0];
      path.forEach((id, index) => {
        const node = this.graph.findById(id);
        this.graph.setItemState(node, 'selected', true);
        if (index + 1 < path.length) {
          const edges = node.get('edges');
          const nextId = path[index + 1];
          edges.forEach(edge => {
            const source = edge.get('source');
            const target = edge.get('target');
            if ((target.get('id') === nextId) || (source.get('id') === nextId)) {
              this.graph.setItemState(edge, 'selected', true);
            }
          })
        }
      })
    } else {
      Message({
        type: 'info',
        message: '未找到路径'
      });
    }
  }
  // 清除样式
  styleReset() {
    const selectNodes = this.graph.findAllByState('node', 'selected');
    selectNodes.forEach(item => {
      this.graph.setItemState(item, 'selected', false);
    });
    const selectEdges = this.graph.findAllByState('edge', 'selected');
    selectEdges.forEach(item => {
      this.graph.setItemState(item, 'selected', false);
    });
  }
  // 清空画布
  clearCanvas() {
    // 清空操作栈
    this.graph.clearStack();
    // 清空元素
    this.graph.clear();
    // 清空选择的元素
    store.commit(
      MutationTypes.SET_SELECT_NODE,
      {
        type: 'clear',
      }
    );
    store.commit(MutationTypes.SET_NODE_TYPE, []);
    store.commit(MutationTypes.SET_EDGE_TYPE, []);
    store.commit(MutationTypes.SET_NODE_IDS, []);
  }
  // 导出graph
  exportGraph(type) {
    if (type === 'image') {
      this.graph.downloadImage(`${Date.now()}`, 'image/png');
    } else if (type === 'json') {
      const data = this.graph.save();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const dataUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a')
      a.download = `${Date.now()}.json`;
      a.href = dataUrl;
      // 触发模拟点击
      a.dispatchEvent(new MouseEvent('click'))
    }
  }
  // 加载关系数据
  importRelationData(content) {
    // const content = payload.data;
    const { entities, links } = content;
    const nodes = entities.map(item => {
      const label = Object.entries(item.properties)
      .map((v) => `${v[1]}`)
      .join('\n');
      const img = `${window.baseImagePath}/entityImages/${item.icon}.png`;
      const nodeIdList = store.getters.nodeIdList || [];
      const nextEntities = item.nextEntities || [];
      let childrenCount = 0;
      nextEntities.forEach(id => {
        if (!nodeIdList.includes(id)) {
          childrenCount++;
        }
      });
      return {
        id: item.id,
        label,
        type: 'circle-image',
        img: img,
        cellInfo: item,
        childrenCount
      }
    });
    // let hasEdges = [];
    const edges = [];
    links.forEach(item => {
      const { sourceEntityId, targetEntityId, label, properties } = item;
      // const id = sourceEntityId + '-' + targetEntityId;
      let edgeId = `${sourceEntityId}-${targetEntityId}`;
      const text = properties ? `${label}\n${properties}` : label;
      const model = {
        id: edgeId,
        label: text,
        cellInfo: item,
        source: sourceEntityId,
        target: targetEntityId,
        type: 'line',
        itemType: 'edge'
      };
      const hasEdge = edges.find(v => v.id === edgeId);
      if (hasEdge) {
        hasEdge.type = 'quadratic';
        edgeId = `${edgeId}-${item.id}`;
        model.id = edgeId;
        model.type = 'quadratic';
        model.curveOffset = 20;
      }
      edges.push(model);
    });
    this.graph.data({
      nodes,
      edges
    });
    this.graph.render();
  }
  // 扩展关系
  extendRelation(leafNodesInfo = [], { entities, links }, sourceId) {
    let flag = false;
    // 节点
    entities.forEach(item => {
      // 查找时候已有该节点
      // let node = this.graph.findById(item.id);
      // if (node) {
      //   return;
      // }
      // node = leafNodesInfo.find(v => item.id === v.nodeModel.id);
      // if (node) {
      //   return;
      // }
      flag = true;
      const model = {
        cellInfo: item,
        type: 'circle-image',
      };
      this.addNode(model);
    });
    // 关系
    links.forEach(item => {
      const { sourceEntityId, targetEntityId, label, properties } = item;
      let edgeId = `${sourceEntityId}-${targetEntityId}`;
      const source = this.graph.findById(sourceEntityId);
      const target = this.graph.findById(targetEntityId);
      if (!source || !target) {
        return;
      }
      const text = properties ? `${label}\n${properties}` : label;
      const newModel = {
        id: edgeId,
        label: text,
        cellInfo: item,
        source: sourceEntityId,
        target: targetEntityId,
        type: 'line',
        itemType: 'edge'
      };
      const edge = this.graph.findById(edgeId);
      if (edge) {
        /**
         * 1. 判断连接关系是否一致
         *    1. 一致则退出
         *    2. 不一致则新增关系，并转换线条样式
         */
        if (edge.get('model').cellInfo.id === item.id) {
          return;
        } else {
          flag = true;
          edgeId = `${edgeId}-${item.id}`;
          newModel.id = edgeId;
          newModel.type = 'quadratic';
          return this.nodeMoreEdges(edge, newModel);
        }
      }
      // 判断是否存在反向关系线
      // const reverseId = `${targetEntityId}-${sourceEntityId}`;
      const reverseId = `${targetEntityId}-${sourceEntityId}`;
      const reverseRelationEdge = this.graph.findById(reverseId);
      if (reverseRelationEdge) {
        let model = reverseRelationEdge.getModel();
        if (model.cellInfo.id === item.id) {
          this.graph.updateItem(reverseId, {
            style: {
              startArrow: true
            }
          });
        } else {
          flag = true;
          edgeId = `${edgeId}-${item.id}`;
          newModel.id = edgeId;
          newModel.type = 'quadratic';
          return this.nodeMoreEdges(reverseRelationEdge, newModel);
        }
        return;
      };
      this.graph.add('edge', newModel, true);
    });
    // 更新子节点数量
    this.updateNodesChildren(sourceId);
    flag && this.graph.layout();
  }
  // 更新节点显示
  updateNodesChildren(sourceId) {
    const item = this.graph.findById(sourceId);
    const model = item.getModel();
    const cellInfo = model.cellInfo;
    const nodeIdList = store.getters.nodeIdList || [];
    const nextEntities = cellInfo.nextEntities || [];
    let childrenCount = 0;
    nextEntities.forEach(id => {
      if (!nodeIdList.includes(id)) {
        childrenCount++;
      }
    });
    this.graph.updateItem(item, {
      childrenCount,
    });
  }
  // 两节点之间多遍情况
  nodeMoreEdges(oldEdge, newModel) {
    this.graph.add('edge', newModel, true);
    if (oldEdge.get('model').type !== 'quadratic') {
      this.graph.updateItem(oldEdge, {
        type: 'quadratic',
        curveOffset: 20,
      });
    }
  }
  // 锁定
  lockItem(item) {
    if (!item.hasLocked()) {
      const model = item.get('model');
      model.lock = true;
      item.lock();
      this.graph.updateItem(item, model);
    }
  }
  // 解锁
  unLockItem(item) {
    if (item.hasLocked()) {
      const model = item.get('model');
      model.lock = false;
      item.unlock();
      this.graph.updateItem(item, model);
    }
  }
  // 强调
  emphasizeItem(item) {
    const model = item.get('model');
    if (!model.emphasize) {
      model.emphasize = true;
      this.graph.updateItem(item, model);
    }
  }
  // 取消强调
  unEmphasizeItem(item) {
    const model = item.get('model');
    if (model.emphasize) {
      model.emphasize = false;
      this.graph.updateItem(item, model);
    }
  }
  // 搜索实体
  searchEntity(value) {
    const nodes = this.graph.getNodes();
    nodes.forEach(item => {
      const model = item.getModel();
      if (model.label.includes(value)) {
        if (!item.hasState('selected')) {
          this.graph.setItemState(item, 'selected', true);
        }
      } else {
        if (item.hasState('selected')) {
          this.graph.setItemState(item, 'selected', false);
        }
      }
    });
  }
};

export default new Editors();
