import store from '@/store/index';
import * as MutationTypes from '@/store/mutation-types';
/**
 * 右键菜单
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
  const hiddenMenu = hiddenNode(item);
  if (type === 'group-node') {
    extendMenu = extendGroupNode(item);
    return `<div class="right-menu__list">
      ${extendMenu}
      ${hiddenMenu}
      ${lockMenu}
      ${highlightMenu}
      ${emphasizeMenu}
    </div>`;
  }
  const urlMenu = isHasUrl(item);
  // 展开 | 收缩
  const leafNodesMenu = hasLeafNode(item);
  return `<div class="right-menu__list">
    ${extendMenu}
    ${leafNodesMenu}
    ${hiddenMenu}
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
              <span data-type="xqUrl">档案</span>
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
          leafObj[cellInfo.id].leafNodes.push(source.get('id')) : leafObj[cellInfo.id] = {
            label: cellInfo.label,
            leafNodes: [source.get('id')],
            gxId: cellInfo.id,
            img: source.get('model').cellInfo.icon,
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
          leafObj[cellInfo.id].leafNodes.push(target.get('id')) : leafObj[cellInfo.id] = {
            label: cellInfo.label,
            leafNodes: [target.get('id')],
            gxId: cellInfo.id,
            img: target.get('model').cellInfo.icon,
          };
      }
    }
  });
  const nodeList = Object.values(leafObj).filter(v => v.leafNodes.length > 1);
  store.commit(MutationTypes.SET_LEAF_NODE, nodeList);
  if (nodeList.length === 0) {
    return '';
  }
  return `<div data-type="sub-menu" class="el-icon-plus">
            <span data-type="sub-menu">收缩叶子节点</span>
            <i data-type="sub-menu" class="el-icon-arrow-right" style="float:right"></i>
            <div class="second-menu">
              <div data-type="leaf-node_all" data-value="all">全部</div>
              ${nodeList.map(v => {
                return `<div data-type="leaf-node_${v.label}" data-value="${v.gxId}">${v.label}</div>`
              }).join('')}
            </div>
          </div>`;
};

/**
 * 展开集合节点
 */
function extendGroupNode(item) {
  return `<div data-type="extend-group" class="el-icon-rank">
            <span data-type="extend-group">展开</span>
          </div>`;
};

/**
 * 隐藏节点
 */
function hiddenNode() {
  return `<div data-type="hidden-node-self" class="el-icon-s-promotion">
            <span data-type="hidden-node-self">隐藏节点</span>
          </div>
          <div data-type="hidden-node-children" class="el-icon-s-promotion">
            <span data-type="hidden-node-children">隐藏子节点</span>
          </div>
          <div data-type="show-node-children" class="el-icon-view">
            <span data-type="show-node-children">显示子节点</span>
          </div>`;
};