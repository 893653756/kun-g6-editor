import { bindEventListener } from './eventListener';
import { Algorithm } from '@antv/g6'; // 图算法库
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
    .map((v) => `${v[0]}:${v[1]}`)
    .join('\n');
    model.img = '/entityImages/wp_sp.png';
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
    const { length, path } = findShortestPath(this.graph, start, end);
    console.warn('findShortestPath', length, path );
  }
  // 加载关系数据
  importRelationData(payload) {
    // const content = JSON.parse(payload.data);
    const content = payload.data;
    const { entities, links } = content;
    const nodes = entities.map(item => {
      const label = Object.entries(item.properties)
        .map((v) => `${v[0]}:${v[1]}`)
        .join('\n');
      const img = '/entityImages/wp_sp.png';
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
      const style = {
        stroke: '#a3b1bf',
        strokeOpacity: 0.9,
        lineWidth: 1,
        lineAppendWidth: 8,
        endArrow: {
          path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
          fill: '#a3b1bf',
        },
      };
      if (item.direction === 'SX') {
        style.startArrow = {
          path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
          fill: '#a3b1bf',
        }
      }
      return {
        id: id,
        label: label,
        cellInfo: item,
        source: sourceEntityId,
        target: targetEntityId,
        type: 'line',
        style,
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
    // entities.forEach(element => {
      
    // });
  }
};

export default new Editors();

// 13408040341  杨敏 93年