/**
 * 编辑器初始化配置
 */
export default {
  width: 1200,
  height: 1000,
  layout: {
    type: 'force', // 指定为力导向布局
    preventOverlap: true, // 防止节点重叠
    linkDistance: 220, // 节点间距
  },
  // 设置为true，启用 redo & undo 栈功能
  enabledStack: true,
  modes: {
    default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
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
    },
    color: '#b8c3ce',
    style: {
      stroke: '#a3b1bf',
      strokeOpacity: 0.9,
      lineWidth: 1,
      lineAppendWidth: 8,
      endArrow: {
        path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
        fill: '#a3b1bf',
      },
    },
  },
  edgeStateStyles: {
    selected: {
      stroke: '#ffa500'
    }
  }
}
