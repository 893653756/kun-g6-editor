import { bindEventListener } from './eventListener';
// import { loadRelation } from './loadRelation';
class Editors {
  emit(type, payload) {
    this.dealWithEvent(type, payload);
  }
  dealWithEvent(type, payload) {
    if (type === 'graph-editors') {
      this.graph = payload.graph;
      // 绑定事件
      bindEventListener(payload.graph);
    }
  }
  // 添加节点 | 边
  addNode(model) {
    const cellInfo = model.cellInfo;
    const label = Object.entries(cellInfo.properties)
    .map((v) => `${v[0]}:${v[1]}`)
    .join('\n');
    model.img = '/entityImages/01.png';
    model.label = label;
    model.id = cellInfo.id;
    this.graph.add('node', model, true);
  }
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
  // 加载关系数据
  importRelationData(payload) {
    const content = JSON.parse(payload.data);
    const { entities, links } = content;
    const nodes = entities.map(item => {
      const label = Object.entries(item.properties)
        .map((v) => `${v[0]}:${v[1]}`)
        .join('\n');
      const img = '/entityImages/01.png';
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