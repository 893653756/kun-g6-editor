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
    const label = Object.entries(cellInfo.properties)
      .map((v) => `${v[1]}`)
      .join('\n');
    model.img = `${window.baseImagePath}/entityImages/${cellInfo.type}.png`;
    model.label = label;
    model.id = cellInfo.id;
    if (cellInfo.custom) {
      cellInfo.nextEntitiesNumber = 0;
    };
    // 自定义的下一层节点数
    cellInfo.nextCustomNodes = 0;
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
    if (sourceModel.cellInfo.nextCustomNodes) {
      sourceModel.cellInfo.nextCustomNodes += 1;
    } else {
      sourceModel.cellInfo.nextCustomNodes = 1;
    }
    this.graph.updateItem(source, sourceModel);
  }
  // 删除节点
  removeItem(item) {
    const id = item.get('id');
    const node = this.graph.findById(id);
    // 是否是自定义节点
    const nodeIsCustom = node.getModel().cellInfo.custom;
    const edges = node.get('edges');
    const sourceNodes = [];
    edges.forEach(v => {
      const source = v.get('source');
      const target = v.get('target');
      if (target.get('id') === id) {
        sourceNodes.push(source);
      }
    });
    this.graph.removeItem(node, true);
    sourceNodes.forEach(v => {
      const model = v.getModel();
      if (model.cellInfo.custom || nodeIsCustom) {
        model.cellInfo.nextCustomNodes -= 1;
        if (model.cellInfo.nextCustomNodes < 0) {
          model.cellInfo.nextCustomNodes = 0;
        }
        this.graph.updateItem(v, model);
      }
    })
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
  // 导出graph
  exportGraph(type) {
    if (type === 'image') {
      this.graph.downloadImage(`${Date.now()}`, 'image/png');
    } else if (type === 'json') {
      // const data = this.graph.save();
      // console.warn('save', data);
      // // 特殊字符导致json被截取
      // const str = JSON.stringify(data).replace(/\#/g, '');
      // const dataUrl = `data:,${str}`
      // const a = document.createElement('a')
      // a.download = `${Date.now()}.txt`;
      // a.rel = 'noopener';
      // a.href = dataUrl;
      // // 触发模拟点击
      // a.dispatchEvent(new MouseEvent('click'))
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
      const { sourceEntityId, targetEntityId, label, properties } = item;
      const id = sourceEntityId + '-' + targetEntityId;
      const text = properties ? `${label}\n${properties}` : label;
      return {
        id: id,
        label: text,
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
    let flag = false;
    // 节点
    entities.forEach(item => {
      // 查找时候已有该节点
      const node = this.graph.findById(item.id);
      if (node) {
        return;
      }
      flag = true;
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
      const { sourceEntityId, targetEntityId, label, properties } = item;
      const id = sourceEntityId + '-' + targetEntityId;
      const edge = this.graph.findById(id);
      if (edge) {
        return;
      }
      // 判断是否存在反向关系线
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
        }
        return;
      };
      const text = properties ? `${label}\n${properties}` : label;
      flag = true;
      const model = {
        id: id,
        label: text,
        cellInfo: item,
        source: sourceEntityId,
        target: targetEntityId,
        type: 'line',
        itemType: 'edge'
      };
      this.graph.add('edge', model, true);
      // if (reverseRelationEdge) {
      //   model.type = 'quadratic';
      // } else {
      //   model.type = 'line';
      // }
      // this.graph.add('edge', model, true);
      // if (model.type === 'quadratic') {
      //   this.graph.updateItem(reverseId, {
      //     type: 'quadratic',
      //   });
      // }
    });
    flag && this.graph.layout();
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
