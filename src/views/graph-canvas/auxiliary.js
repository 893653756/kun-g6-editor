/**
 * 一些辅助功能
 */
export function getMenuList(item) {
  const type = item.get('model').type;
  // console.warn('item', item);
  // 扩展一层
  let extendMenu = `<div data-type="extend-relation" class="kf-icon-full-screen">
    <span data-type="extend-relation">扩展一层</span>
  </div>`;
  // 删除
  const deleteMenu = `<div data-type="delete" class="kf-icon-delete">
        <span data-type="delete">删除</span>
      </div>`;
  if (item.get('type') === 'edge') {
    return `<div class="right-menu__list">
    ${deleteMenu}
  </div>`;
  };
  const lockMenu = isLock(item);
  const highlightMenu = isHighlight(item);
  const emphasizeMenu = isEmphasize(item);
  if (type === 'group-node') {
    extendMenu = extendGroupNode(item);
    return `<div class="right-menu__list">
      ${extendMenu}
      ${lockMenu}
      ${highlightMenu}
      ${emphasizeMenu}
    </div>`;
  }
  const urlMenu = isHasUrl(item);
  // 展开 | 收缩
  const leafNode = hasLeafNode(item);
  return `<div class="right-menu__list">
    ${extendMenu}
    ${leafNode}
    ${lockMenu}
    ${highlightMenu}
    ${emphasizeMenu}
    ${deleteMenu}
    ${urlMenu}
  </div>`;
};

/**
 * 是否锁定
 * @param { Object } item 节点对象
 * @returns { String }
 */
function isLock(item) {
  const lock = item.hasLocked();
  const str = `<div data-type="lock-${lock}" class="el-icon-lock">
                <span data-type="lock-${lock}">${lock ? '解锁' : '锁定'}</span>
              </div>`;
  return str;
};

/**
 * 是否高亮
 */
function isHighlight(item) {
  const selected = item.hasState('selected');
  const str = `<div data-type="highlight-${selected}" class="el-icon-sunny">
                <span data-type="highlight-${selected}">${selected ? '取消高亮' : '高亮'}</span>
              </div>`;
  return str;
};

/**
 * 是否强调
 */
function isEmphasize(item) {
  const model = item.get('model');
  const emphasize = model.emphasize;
  const str = `<div data-type="emphasize-${emphasize}" class="kf-icon-info">
                <span data-type="emphasize-${emphasize}">${emphasize ? '取消强调' : '强调'}</span>
              </div>`;
  return str;
};

/**
 * 是否有链接
 */
function isHasUrl(item) {
  const cellInfo = item.get('model').cellInfo;
  if (cellInfo.xqUrl) {
    return `<div data-type="xqUrl" class="el-icon-s-promotion">
              <span data-type="xqUrl">链接详情</span>
            </div>`;
  }
  return '';
};

/**
 * 收拢的叶子节点
 */
function hasLeafNode(item) {
  const leafObj = {};
  const id = item.get('id');
  const edges = item.get('edges') || [];
  edges.forEach(edge => {
    const source = edge.getSource();
    const target = edge.getTarget();
    if (source.get('id') !== id) {
      if (source.get('type') !== 'node') {
        return;
      }
      if (source.get('edges').length === 1) {
        const model = edge.get('model');
        const cellInfo = model.cellInfo;
        leafObj[cellInfo.id] ?
          leafObj[cellInfo.id].leafNode.push(source.get('id')) : leafObj[cellInfo.id] = {
            label: cellInfo.label,
            leafNode: [source.get('id')],
            gxId: cellInfo.id,
            img: source.get('model').cellInfo.type,
          };
      }
    } else {
      if (target.get('type') !== 'node') {
        return;
      }
      if (target.get('edges').length === 1) {
        const model = edge.get('model');
        const cellInfo = model.cellInfo;
        leafObj[cellInfo.id] ?
          leafObj[cellInfo.id].leafNode.push(target.get('id')) : leafObj[cellInfo.id] = {
            label: cellInfo.label,
            leafNode: [target.get('id')],
            gxId: cellInfo.id,
            img: target.get('model').cellInfo.type,
          };
      }
    }
  });
  const nodeList = Object.values(leafObj).filter(v => v.leafNode.length > 1);
  if (nodeList.length === 0) {
    return '';
  }
  return `<div data-type="leaf-node" class="el-icon-plus">
            <span data-type="leaf-node">收缩叶子节点</span>
            <i data-type="leaf-node" class="el-icon-arrow-right" style="float:right"></i>
            <div class="second-menu">
              ${nodeList.map(v => {
                return `<div data-type="leaf-node_${v.label}" data-value="${v.leafNode.join(',')}" data-gxid="${v.gxId}" data-img="${v.img}">${v.label}</div>`
              }).join('')}
            </div>
          </div>`;
};

/**
 * 展开集合节点
 */
function extendGroupNode(item) {
  return `<div data-type="extend-group" class="el-icon-s-promotion">
            <span data-type="extend-group">展开</span>
          </div>`;
};