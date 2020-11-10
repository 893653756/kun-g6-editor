/**
 * 布局配置
 */
export const layoutCfg = {
  // 随机布局
  random: {
    type: 'random',
    preventOverlap: true,
    // workerEnabled: true,
    label: '随机'
  },
  // 力导向布局
  force: {
    type: 'force',
    preventOverlap: true, // 防止节点重叠
    linkDistance: 250, // 边长
    nodeStrength: 30,
    nodeSpacing: 50,
    edgeStrength: 1,
    label: '力导向',
    // workerEnabled: true,
  },
  // 环形布局

  // circular: {
  //   type: 'circular',
  //   radius: 200,
  //   // workerEnabled: true,
  //   label: '环形'
  // },

  // 同心圆
  concentric: {
    type: 'concentric',
    label: '同心圆',
    preventOverlap: true,
    minNodeSpacing: 50,
    // equidistant: true,
  },
  // 辐射布局
  radial: {
    type: 'radial',
    unitRadius: 200,
    nodeSpacing: 200,
    linkDistance: 200,
    // workerEnabled: true,
    label: '辐射',

  },
  // 层次布局
  dagre: {
    type: 'dagre',
    rankdir: 'TB',
    nodesep: 15,
    ranksep: 30,
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
  animate: true,
  minZoom: 0.2,
  maxZoom: 2,
  layout: layoutCfg.force,
  // 设置为true，启用 redo & undo 栈功能
  enabledStack: true,
  modes: {
    default: [
      'drag-canvas',
      'zoom-canvas',
      'drag-node',
      'drag-combo',
      // 'collapse-expand-combo'
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
      style: {
        fontSize: 10,
        fill: '#a3b1bf',
        background: {
          fill: '#ffffff',
          padding: [2, 2, 2, 2],
          radius: 2,
        },
      },
    },
    style: {
      stroke: '#a3b1bf',
      strokeOpacity: 0.9,
      lineWidth: 1,
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
      lineWidth: 2
    },
    hove: {
      stroke: '#FF764A',
      cursor: 'pointer',
      lineWidth: 2
    }
  }
};
