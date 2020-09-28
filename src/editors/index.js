import { bindEventListener } from './eventListener';
import { Algorithm } from '@antv/g6'; // 图算法库
import { Message } from 'element-ui';
import store from '@/store/index';
import * as MutationTypes from '@/store/mutation-types';
import { layoutCfg } from '@/graph-cfg';
class Editors {
  saveGraph(payload) {
    this.graph = payload.graph;
    // 绑定事件
    bindEventListener(payload.graph);
  }
  // 添加节点
  addNode(model) {
    const cellInfo = model.cellInfo;
    const label = Object.entries(cellInfo.properties)
      .map((v) => `${v[1]}`)
      .join('\n');
    model.img = `${window.baseImagePath}/entityImages/${cellInfo.type}.png`;
    model.label = label;
    model.id = cellInfo.id;
    this.graph.add('node', model, true);
  }
  // 添加边
  addEdge(model) {
    const cellInfo = model.cellInfo;
    model.label = cellInfo.label;
    model.itemType = 'edge';
    this.graph.add('edge', model, true);
  }
  // 删除节点
  removeItem(item) {
    const node = this.graph.findById(item.get('id'));
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
  }
  // 加载关系数据
  importRelationData(content) {
    // const content = payload.data;
    const { entities, links } = content;
    const nodes = entities.map(item => {
      const label = Object.entries(item.properties)
        .map((v) => `${v[1]}`)
        .join('\n');
      const img = `${window.baseImagePath}/entityImages/${item.type}.png`;
      return {
        id: item.id,
        label,
        type: 'circle-image',
        img: img,
        cellInfo: item,
      }
    });
    const edges = links.map(item => {
      const { sourceEntityId, targetEntityId, label } = item;
      const id = sourceEntityId + '-' + targetEntityId;
      return {
        id: id,
        label: label,
        cellInfo: item,
        source: sourceEntityId,
        target: targetEntityId,
        type: 'line',
        itemType: 'edge'
      }
    });
    this.graph.data({
      nodes,
      edges
    });
    this.graph.render();
  }
  // 扩展关系
  extendRelation({ entities, links }) {
    // 节点
    entities.forEach(item => {
      // 查找时候已有该节点
      const node = this.graph.findById(item.id);
      if (node) {
        return;
      }
      const label = Object.entries(item.properties)
        .map((v) => `${v[1]}`)
        .join('\n');
      const img = `${window.baseImagePath}/entityImages/${item.type}.png`;
      const model = {
        id: item.id,
        label,
        type: 'circle-image',
        img: img,
        cellInfo: item,
      };
      this.graph.add('node', model, true);
    });
    // 关系
    links.forEach(item => {
      const { sourceEntityId, targetEntityId, label } = item;
      const id = sourceEntityId + '-' + targetEntityId;
      const edge = this.graph.findById(id);
      if (edge) {
        return;
      }
      // 是否是互换关系
      const model = {
        id: id,
        label: label,
        cellInfo: item,
        source: sourceEntityId,
        target: targetEntityId,
        type: 'quadratic',
        itemType: 'edge'
      }
      this.graph.add('edge', model, true);
    });
    // const layoutType = store.getters.layoutType;
    // const cfg = layoutCfg[layoutType];
    // console.warn('layput', cfg);
    this.graph.updateLayout({});
  }
};

export default new Editors();
