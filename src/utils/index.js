/**
 * 防抖
 */
export function debounce(fn, wait) {
  let timeout = null;
  return function () {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(fn, wait);
  }
};

// 子节点归类
export function countLeafNode(item) {
  const leafObj = {};
  const sourceId = item.get('id');
  const outEdges = item.getOutEdges() || [];
  outEdges.forEach(line => {
    const target = line.getTarget();
    const edges = target.get('edges');
    if (edges.length === 1) {
      const targetModel = target.getModel();
      const { id: targetId, type: targetType } = targetModel;
      if (targetId !== sourceId && targetType === 'circle-image') {
        const lineModel = line.get('model');
        const cellInfo = lineModel.cellInfo;
        leafObj[cellInfo.id] ?
          leafObj[cellInfo.id].leafNodes.push(targetId) : leafObj[cellInfo.id] = {
            label: cellInfo.label,
            leafNodes: [targetId],
            gxId: cellInfo.id,
            img: targetModel.cellInfo.icon,
          };
      }
    }
  });
  const leafNodeList = Object.values(leafObj).filter(v => v.leafNodes.length > 1);
  return leafNodeList;
};
