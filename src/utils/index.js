/**
 * 防抖
 */
export function debounce(fn, wait) {
  let timeout = null;
  return function (params) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => fn(params), wait);
  }
};

// 子节点归类
export function countLeafNode(item) {
  const leafObj = {};
  const sourceId = item.get('id');
  const outEdges = item.getOutEdges() || [];
  outEdges.forEach(line => {
    const target = line.getTarget();
    // const edges = target.get('edges');
    // if (edges.length === 1) {
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
          dxId: targetModel.cellInfo.dxId
        };
    }
    // }
  });
  const leafNodeList = Object.values(leafObj).filter(v => v.leafNodes.length > 1);
  return leafNodeList;
};

/**
 * 获取团伙关系连线信息
 */
export function getCasecluesInfo(edge, userAndDept, otherInfo, deleteFlag) {
  const source = edge.getSource();
  const sourceCell = source.getModel().cellInfo;
  const target = edge.getTarget();
  const targetCell = target.getModel().cellInfo;
  const cellInfo = edge.getModel().cellInfo;

  const xsBase = { xsbh: cellInfo.xsbh };
  const mainer = {
    dxType: sourceCell.type,
    idMap: sourceCell.idMap,
  };
  const follower = {
    dxType: targetCell.type,
    idMap: targetCell.idMap,
  };
  return {
    xsBase,
    mainer,
    follower,
    stage: otherInfo.type || '',
    tag: cellInfo.tag || '',
    label: cellInfo.label || '',
    description: cellInfo.linkDesc,
    queryStatus: otherInfo.type === 'xsTeamFk' ? '1' : (otherInfo.queryStatus || ''),
    deleteStatus: deleteFlag ? '1' : '0',
    ...userAndDept,
  };
}
