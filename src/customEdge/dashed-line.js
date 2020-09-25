/**
 * 节点连线时的虚线样例
 */
export default {
  draw(cfg, group) {
    const start = cfg.startPoint;
    const end = cfg.endPoint;
    const path = [
      ['M', start.x, start.y],
      ['L', end.x, end.y],
    ];
    const keyShape = group.addShape('path', {
      attrs: {
        id: cfg.id,
        path: path,
        stroke: '#1890ff',
        lineDash: [5, 5],
        strokeOpacity: 0.7
      }
    })
    return keyShape;
  }
};
