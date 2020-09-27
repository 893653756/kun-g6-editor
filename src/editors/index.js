import { bindEventListener } from './eventListener';
import { Algorithm } from '@antv/g6'; // 图算法库
import { Message } from 'element-ui';
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
    console.warn('item', item);
    const node = this.graph.findById(item.get('id'));
    console.warn('node', node);
    this.graph.removeItem(node, true);
  }
  // 设置状态
  setItemState(item, type, value) {
    this.graph.setItemState(item, type, value);
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
  findShortestPath(start, end) {
    const { findShortestPath } = Algorithm;
    const { path } = findShortestPath(this.graph, start, end);
    console.warn('path', path);
    // 给得到的路径上色
    if (path.length === 0) {
      Message({
        type: 'info',
        message: '未找到路径'
      });
    } else {
      path.forEach((id, index) => {
        const node = this.graph.findById(id);
        this.graph.setItemState(node, 'selected', true);
        if (index + 1 < path.length) {
          const edges = node.get('edges');
          const nextId = path[index + 1];
          edges.forEach(edge => {
            const target = edge.get('target');
            if (target.get('id') === nextId) {
              this.graph.setItemState(edge, 'selected', true);
            }
          })
        }
      })
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
        size: [40, 40],
        type: 'rect-image',
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
        size: [40, 40],
        type: 'rect-image',
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
    this.graph.updateLayout({});
  }
};

export default new Editors();

// 13408040341  杨敏 93年