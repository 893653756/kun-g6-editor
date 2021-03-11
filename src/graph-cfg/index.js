import G6 from '@antv/g6';
/**
 * 布局配置
 */
export const layoutCfg = {
  // 力导向布局
  force: {
    type: 'force',
    preventOverlap: true, // 防止节点重叠
    linkDistance: 250, // 边长
    nodeStrength: 30,
    nodeSpacing: 50,
    edgeStrength: 1,
    label: '网络',
    // clustering: true,
    workerEnabled: true,

    // type: 'force',
    // label: '力导向',
    // clustering: true,
    // linkDistance: 250, // 边长
    // clusterNodeStrength: 0,
    // clusterEdgeDistance: 250,
    // clusterNodeSize: 48,
    // clusterFociStrength: 1.2,
    // nodeSpacing: 20,
    // preventOverlap: true,
    // workerEnabled: true,
  },

  // 环形布局
  circular: {
    type: 'circular',
    radius: 200,
    // workerEnabled: true,
    label: '环形'
  },

  // 同心圆
  concentric: {
    type: 'concentric',
    label: '同心圆',
    preventOverlap: true,
    minNodeSpacing: 50,
    equidistant: true,
  },
  // 辐射布局
  radial: {
    type: 'radial',
    unitRadius: 220,
    nodeSpacing: 70,
    linkDistance: 220,
    strictRadial: true,
    preventOverlap: true,
    // workerEnabled: true,
    label: '辐射',
  },
  // 层次布局
  dagre: {
    type: 'dagre',
    rankdir: 'TB',
    nodesep: 15,
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
};

export const hoveTitleCfg = {
  'group-icon': '集合节点, 右键展开',
  'question-mark': '可疑',
  'number-rect': '可查询子节点数量',
  'number-text': '可查询子节点数量',
  'add-icon': '可右键显示收拢的子节点',
}

/**
 * 编辑器初始化配置
 */

export const defaultEdgeStyle = {
  stroke: '#a3b1bf',
  // strokeOpacity: 0.9,
  lineWidth: 1,
  lineAppendWidth: 8,
  // endArrow: true,
  endArrow: {
    path: G6.Arrow.triangle(5, 10, 25),
    d: 25,
    lineDash: []
  },
  startArrow: {
    path: G6.Arrow.triangle(0, 0, 25),
    d: 25,
    lineDash: []
  },
  // lineDash: [8, 4]
}

export const graphCfg = {
  animate: true,
  minZoom: 0.2,
  maxZoom: 2,
  layout: layoutCfg.dagre,
  linkCenter: true,
  // 设置为true，启用 redo & undo 栈功能
  // enabledStack: true,
  modes: {
    default: [
      {
        type: 'drag-canvas',
        // enableOptimize: true,
      },
      'zoom-canvas',
      {
        type: 'drag-node',
        enableDelegate: true,
      },
      {
        type: 'tooltip',
        formatText(model) {
          return '提示...';
        },
        shouldBegin(e) {
          const target = e.target;
          const name = target.cfg.name;
          if (hoveTitleCfg[name]) {
            return true;
          }
          return false;
        },
        offset: 10,
      },
    ],
    addEdge: ['add-edge'],
    // 多选节点
    ctrlSelect: [{
      type: 'click-select',
      trigger: 'ctrl'
    }],
    // 框选
    shiftSelect: [{
      type: 'brush-select',
      trigger: 'drag'
    }, 'drag-node']
  },
  defaultEdge: {
    type: 'quadratic',
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
        fill: '#000000',
        // background: {
        //   fill: '#ffffff',
        //   padding: [2, 2, 2, 2],
        //   radius: 2,
        // },
      },
    },
    style: {
      ...defaultEdgeStyle
    },
  },
  edgeStateStyles: {
    highlight: {
      lineWidth: 2,
      stroke: '#ffa500',
    },
    hover: {
      cursor: 'pointer',
      stroke: 'rgba(255, 118, 74, 0.7)',
      lineWidth: 2,
    },
    selected: {
      stroke: '#FF764A',
      lineWidth: 3,

    }
  }
};
