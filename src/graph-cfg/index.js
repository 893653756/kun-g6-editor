/**
 * 布局配置
 */
export const layoutCfg = {
  // 随机布局
  random: {
    type: 'random',
    // workerEnabled: true,
    label: '随机'
  },
  // 力导向布局
  force: {
    type: 'force',
    preventOverlap: true, // 防止节点重叠
    linkDistance: 220, // 节点间距
    nodeStrength: 30,
    nodeSpacing: 40,
    label: '力导向',
    // workerEnabled: true,
  },
  // 环形布局
  circular: {
    type: 'circular',
    radius: 200,
    // workerEnabled: true,
    label: '环形'
  },
  // 辐射布局
  radial: {
    type: 'radial',
    linkDistance: 220,
    nodeSpacing: 180,
    // workerEnabled: true,
    label: '辐射',
    nodeSpacing: 50,
  },
  // 层次布局
  dagre: {
    type: 'dagre',
    rankdir: 'LR',
    nodesep: 50,
    ranksep: 50,
    // workerEnabled: true,
    label: '层次'
  },
  // 网格布局
  grid: {
    type: 'grid',
    begin: [10, 20],
    preventOverlap: true,
    // workerEnabled: true,
    label: '网格'
  }
}
/**
 * 编辑器初始化配置
 */
export const graphCfg = {
  minZoom: 0.5,
  maxZoom: 2,
  animate: true,
  layout: layoutCfg.force,
  // 设置为true，启用 redo & undo 栈功能
  enabledStack: true,
  modes: {
    default: [
      'drag-canvas',
      'zoom-canvas',
      'drag-node',
      {
        type: 'edge-tooltip', // 边提示框
        formatText(model) {
          const source = this.graph.findById(model.source);
          const target = this.graph.findById(model.target);
          const sourceInfo = source.get('model').cellInfo;
          const targetInfo = target.get('model').cellInfo;
          // console.warn('model', model, source, target);
          const sourceLabel = Object.entries(sourceInfo.properties)
          .map((v) => `<span>${v[0]}: ${v[1]}</span>`);
          const targetLabel = Object.entries(targetInfo.properties)
          .map((v) => `<span>${v[0]}: ${v[1]}</span>`);
          // 边提示框文本内容
          return `
            <div class='g6-tooltip__box'>
              <div class='g6-tooltip__box-source'>
                <h3>源实体</h3>
                ${sourceLabel.join('')}
              </div>
              <div class='g6-tooltip__box-target'>
                <h3>目标实体</h3>
                ${targetLabel.join('')}
              </div>
            </div>
          `
        },
      }
    ],
    addEdge: ['add-edge'],
  },
  defaultEdge: {
    anchorPoints: [
      [0.5, 0],
      [1, 0.5],
      [0.5, 1],
      [0, 0.5],
    ],
    labelCfg: {
      autoRotate: true,
      fill: '#000000',
      fontSize: 12,
      refY: 10,
    },
    color: '#b8c3ce',
    style: {
      stroke: '#a3b1bf',
      strokeOpacity: 0.9,
      lineWidth: 2,
      lineAppendWidth: 8,
      endArrow: true,
      // endArrow: {
      //   path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
      //   fill: '#a3b1bf',
      // },
    },
  },
  edgeStateStyles: {
    selected: {
      stroke: '#FF764A',
      lineWidth: 3
    },
    hove: {
      stroke: '#FF764A',
      cursor: 'pointer'
    }
  }
};
