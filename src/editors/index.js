import { bindEventListener } from './eventListener';
import { Algorithm } from '@antv/g6'; // 图算法库
import { Message } from 'element-ui';
import store from '@/store/index';
import * as MutationTypes from '@/store/mutation-types';
import G6 from '@antv/g6';
import { defaultEdgeStyle } from '@/graph-cfg';
import { getCasecluesInfo } from '@/utils'

class Editors {
  constructor() {
    this.dataList = {
      entities: [],
      relations: []
    };
    this.drawing = false;
    this.time = Date.now()
  }
  saveGraph(payload) {
    this.graph = payload.graph;
    // 绑定事件
    bindEventListener(payload.graph);
    this.requestAnimationFrameDraw();
  }
  getLabel(cellInfo) {
    let text = [];
    let label = ''
    if (cellInfo.properties) {
      text = Object.entries(cellInfo.properties).filter(v => v[1]).map(v => `${v[1]}`);
      label = text.length > 1 ? text.join('\n') : (text.length === 1 ? text[0] : '');
    }
    return label;
  }
  // 添加节点
  addNode(model) {
    if (!model.time) {
      model.time = Date.now();
    }
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
    let label = this.getLabel(cellInfo)
    model.img = `${window.baseImagePath}/entityImages/${cellInfo.icon}.png`;
    model.label = label;
    model.id = cellInfo.id;
    this.graph.add('node', model);
  }
  // 添加边
  addEdge(model) {
    const cellInfo = model.cellInfo;
    const { label, properties, number, tag, shape } = cellInfo;
    model.style = {
      ...defaultEdgeStyle,
      lineDash: shape === 'dotted' ? [8, 4] : [],
    };
    // if (tag) {
    //   model.style = {
    //     ...defaultEdgeStyle,
    //     stroke: tag,
    //     lineDash: shape === 'dotted' ? [8, 4] : [],
    //   };
    // }
    let text = '';
    if (model.isGroupEdge) {
      text = cellInfo.label;
    } else {
      text = properties ? `${label}: ${properties}` : label;
      text = number ? `${text}(${cellInfo.number})` : `${text}`;
    }
    // 团伙关系区别
    if (cellInfo.stage === 'xsTeam') {
      text = `研判阶段\n${text}`;
    } else if (cellInfo.stage === ' xsTeamFk') {
      text = `反馈阶段\n${text}`;
    }
    // model.label = cellInfo.label;
    model.label = text;
    model.itemType = 'edge';
    this.graph.add('edge', model);
  }
  // 删除节点
  removeItem(item) {
    console.warn('delete', item);
    const type = item.getType();
    const cellInfo = item.getModel().cellInfo;
    // if (type === 'node' && !cellInfo.custom) {
    //   return Message({
    //     type: 'warning',
    //     message: '原始节点不能删除'
    //   });
    // }
    if (type === 'edge' && cellInfo.xsbh) {
      const otherInfo = store.getters.otherInfo;
      const deleteEdges = store.getters.deleteEdges || [];
      const userAndDept = store.getters.userAndDept || {};
      const info = getCasecluesInfo(item, userAndDept, otherInfo, true);
      store.commit(MutationTypes.SET_DELETE_EDGE, [...deleteEdges, info]);
    }
    const id = item.get('id');
    const node = this.graph.findById(id);
    this.graph.removeItem(node);
  }
  // 设置状态
  setItemState(item, type, value) {
    this.graph.setItemState(item, type, value);
  }
  // 元素高亮
  setItemBackground({ selectType, selectIds, idType }) {
    const selected = [];
    const unselected = [];
    this.graph.findAll(selectType, (node) => {
      const model = node.get('model');
      // const item = node.get('model').cellInfo;
      selectIds.includes(model[idType]) ? selected.push(node) : unselected.push(node);
    });
    unselected.forEach((node) => {
      this.graph.setItemState(node, 'highlight', false);
    });
    selected.forEach((node) => {
      this.graph.setItemState(node, 'highlight', true);
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
        this.graph.setItemState(node, 'highlight', true);
        if (index + 1 < path.length) {
          const edges = node.get('edges');
          const nextId = path[index + 1];
          edges.forEach(edge => {
            const source = edge.get('source');
            const target = edge.get('target');
            if ((target.get('id') === nextId) || (source.get('id') === nextId)) {
              this.graph.setItemState(edge, 'highlight', true);
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
  stateReset() {
    // const highlightNodes = this.graph.findAllByState('node', 'highlight');
    const nodes = this.graph.getNodes();
    nodes.forEach(item => {
      this.graph.clearItemStates(item);
      const model = item.getModel();
      if (model.emphasize) {
        this.graph.updateItem(item, {
          emphasize: false
        });
      }
    });
    const edges = this.graph.getEdges();
    edges.forEach(item => {
      this.graph.clearItemStates(item);
    });
    // 清除强调动画

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
    // 判断当前画布有无数据
    const nodes = this.graph.getNodes();
    if (nodes.length === 0) {
      return Message({
        type: 'warning',
        message: '当前画布无数据'
      });
    }
    if (type === 'image') {
      this.graph.downloadFullImage(`${Date.now()}`, 'image/png', {
        backgroundColor: '#ffffff',
        padding: 25
      });
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
  // importRelationData(content) {
  //   const time = Date.now();
  //   const { entities, relations } = content;
  //   const nodes = entities.map(item => {
  //     // const label = Object.entries(item.properties)
  //     //   .map((v) => `${v[1]}`)
  //     //   .join('\n');
  //     let text = [];
  //     let label = ''
  //     if (item.properties) {
  //       text = Object.entries(item.properties).filter(v => v[1]).map(v => `${v[1]}`);
  //       label = text.length > 1 ? text.join('\n') : (text.length === 1 ? text[0] : '');
  //     }
  //     const img = `${window.baseImagePath}/entityImages/${item.icon}.png`;
  //     const nodeIdList = store.getters.nodeIdList || [];
  //     const nextEntities = item.nextEntities || [];
  //     let childrenCount = 0;
  //     nextEntities.forEach(id => {
  //       if (!nodeIdList.includes(id)) {
  //         childrenCount++;
  //       }
  //     });
  //     return {
  //       id: item.id,
  //       label,
  //       type: 'circle-image',
  //       img: img,
  //       cellInfo: item,
  //       childrenCount,
  //       time: time,
  //     }
  //   });
  //   // let hasEdges = [];
  //   const edges = [];
  //   relations.forEach(item => {
  //     const { sourceEntityId, targetEntityId, label, properties, instanceIdForMerge } = item;
  //     // const id = sourceEntityId + '-' + targetEntityId;
  //     // let edgeId = `${sourceEntityId}-${targetEntityId}`;
  //     const edgeId = instanceIdForMerge;
  //     let text = properties ? `${label}: ${properties}` : label;
  //     text = `${text}(${item.number})`;
  //     const model = {
  //       id: edgeId,
  //       label: text,
  //       cellInfo: item,
  //       source: sourceEntityId,
  //       target: targetEntityId,
  //       // type: 'line',
  //       itemType: 'edge'
  //     };
  //     edges.push(model);
  //   });
  //   this.graph.data({
  //     nodes,
  //     edges
  //   });
  //   this.graph.render();
  // }
  // 批量处理, 去重
  batchProcessing({ entities, relations }) {
    // console.warn('batchProcessing')
    entities.forEach(v => {
      const item = this.dataList.entities.find(node => node.id === v.id);
      if (!item) {
        this.dataList.entities.push(v);
      }
    });
    relations.forEach(v => {
      const item = this.dataList.relations.find(node => node.instanceIdForMerge === v.instanceIdForMerge);
      if (!item) {
        this.dataList.relations.push(v);
      }
    });
    // console.warn(this.dataList);
  }
  requestAnimationFrameDraw() {
    requestAnimationFrame(() => {
      if (this.drawing) {
        return this.requestAnimationFrameDraw();
      }
      const { entities, relations } = this.dataList;
      // console.warn(entities, relations)
      if (entities.length !== 0 || relations.length !== 0) {
        const nowTime = Date.now();
        if (nowTime - this.time > 1500) {
          this.dataList = {
            entities: [],
            relations: []
          }
          this.time = nowTime;
          store.commit(MutationTypes.ENTER_BY_JUDGMENT, true);
          this.extendRelation({ entities, relations });
        }
      }
      this.requestAnimationFrameDraw();
    });
  }
  // 扩展关系
  extendRelation({ entities, relations }, sourceId) {
    this.drawing = true;
    let flag = false;
    const hiddenIds = []
    // 节点
    const time = Date.now();
    const nodeIdList = store.getters.nodeIdList || [];
    entities.forEach(item => {

      const oldNode = this.graph.findById(item.id);
      if (oldNode) {
        const model = oldNode.getModel();
        if (model.replace) {
          let label = this.getLabel(item);
          this.graph.updateItem(oldNode, {
            label,
            cellInfo: item
          });
        }
        return;
      }
      if (item.hidden) {
        hiddenIds.push(item.id)
      }
      flag = true;
      const model = {
        cellInfo: item,
        type: 'circle-image',
        time: time
      };
      this.addNode(model);
    });
    const mergeRelationIds = [...store.getters.mergeRelationIds];
    // 关系
    relations.forEach(item => {
      const { sourceEntityId, targetEntityId, label, properties, instanceIdForMerge, id: gxId } = item;
      // let edgeId = `${sourceEntityId}-${targetEntityId}`;
      const edgeId = instanceIdForMerge;
      const source = this.graph.findById(sourceEntityId);
      let target = this.graph.findById(targetEntityId);
      if (!target) {
        /**
         * 此处默认没有 target 节点
         * 查看节点是否在集合节点里
         */
        if (nodeIdList.includes(targetEntityId)) {
          /**
           * 1. 获取集合节点，遍历找出目标节点
           * 2. 保存数据
           */
          const groupNodes = this.graph.getNodes().filter(node => node.getModel().type === "group-node") || [];
          // console.warn('groupNodes', groupNodes);
          for (const iterator of groupNodes) {
            const model = iterator.getModel();
            const { nodeModels, edgeModels } = model.leafNodesInfo;
            const item = nodeModels.find(m => m.id === targetEntityId);
            if (item) {
              this.graph.removeItem(iterator);
              nodeModels.forEach((v) => {
                this.graph.add("node", v);
              });
              edgeModels.forEach((v) => {
                this.graph.add("edge", v);
              });
            }
          }
          target = this.graph.findById(targetEntityId);
        } else {
          return;
        }
      }
      // let text = properties ? `${label}: ${properties}` : label;
      // text = `${text}(${item.number})`;
      const newModel = {
        id: edgeId,
        // label: text,
        cellInfo: item,
        source: sourceEntityId,
        target: targetEntityId,
        // type: 'line',
        // itemType: 'edge'
      };
      const edge = this.graph.findById(edgeId);
      if (edge) {
        /**
         * 1. 判断连接关系是否一致
         *    1. 一致则退出
         *    2. 不一致则新增关系，并转换线条样式
         */
        if (edge.get('model').cellInfo.direction === item.direction) {
          return;
        } else {
          this.graph.updateItem(edge, {
            style: {
              // startArrow: true,
              startArrow: {
                path: G6.Arrow.triangle(5, 10, 25),
                d: 25
              }
            }
          });
          return;
        }
      }
      // 查询两个节点之间是否已存在关系联系
      let existEdge = false;
      const sourceEdges = source.get('edges').map(v => v.get('id'));
      const targetEdges = target.get('edges').map(v => v.get('id'));
      targetEdges.forEach(id => {
        if (sourceEdges.includes(id)) {
          existEdge = true;
        }
      });
      if (existEdge) {
        newModel.otherLine = true;
      }
      // const sourceLinkId = `${sourceEntityId}_${gxId}`

      mergeRelationIds.includes(edgeId) ? null : mergeRelationIds.push(edgeId);
      store.commit(MutationTypes.SET_RELATION_ID, mergeRelationIds);
      this.addEdge(newModel);
    });
    // 更新子节点数量
    sourceId && this.updateNodesChildren(sourceId);
    hiddenIds.forEach(id => this.graph.hideItem(id))
    flag && this.graph.layout();
    this.drawing = false;
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
    const list = [];
    nodes.forEach(item => {
      const model = item.getModel();
      if (!item.isVisible()) {
        return;
      }
      if (model.leafNodesInfo) {
        const nodeModels = model.leafNodesInfo.nodeModels;
        nodeModels.forEach(v => {
          if (v.label.includes(value)) {
            list.push({
              id: model.id,
              label: v.label
            });
          }
        });
      } else {
        if (model.label.includes(value)) {
          list.push({
            id: model.id,
            label: model.label
          });
        }
      }
    });
    return list;
  }
  focusItem(id) {
    const nodes = this.graph.getNodes();
    nodes.forEach(item => {
      this.graph.setItemState(item, 'selected', false);
    });
    if (id) {
      this.graph.setItemState(id, 'selected', true);
      this.graph.focusItem(id);
    }
  }
};

export default new Editors();
