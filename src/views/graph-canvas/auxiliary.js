import store from '@/store/index';
import * as MutationTypes from '@/store/mutation-types';
import { countLeafNode } from '@/utils/index';
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
  // 查看详情
  const detailsMenu = `<div data-type="details" class="el-icon-document">
        <span data-type="details">查看详情</span>
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
    const unfoldMenu = unfoldGroupNodeBySelf(item);
    return `<div class="right-menu__list">
      ${unfoldMenu}
      ${hiddenMenu}
      ${lockMenu}
      ${highlightMenu}
      ${emphasizeMenu}
    </div>`;
  }
  const urlMenu = isHasUrl(item);
  // 展开 | 收缩
  const leafNodesMenu = hasLeafNode(item);
  const unfoldMenu = unfoldGroupNodeByParents(item);
  return `<div class="right-menu__list">
    ${detailsMenu}
    ${extendMenu}
    ${leafNodesMenu}
    ${unfoldMenu}
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
  const leafNodeList = countLeafNode(item);
  store.commit(MutationTypes.SET_LEAF_NODE, leafNodeList);
  if (leafNodeList.length === 0) {
    return '';
  }
  return `<div data-type="sub-menu" class="el-icon-plus">
            <span data-type="sub-menu">收缩叶子节点</span>
            <i data-type="sub-menu" class="el-icon-arrow-right" style="float:right"></i>
            <div class="second-menu">
              <div data-type="leaf-node_all" data-value="all">全部</div>
              ${leafNodeList.map(v => {
                return `<div data-type="leaf-node_${v.label}" data-value="${v.gxId}">${v.label}</div>`
              }).join('')}
            </div>
          </div>`;
};

/**
 * 父节点展开子节点
 */
function unfoldGroupNodeByParents(item) {
  const groupEdges = item.getOutEdges().filter(v => v.getModel().isGroupEdge);
  if (groupEdges.length === 0) {
    return ''
  }
  let ids = [];
  const list = groupEdges.map(edge => {
    const label = edge.get('model').label;
    const target = edge.getTarget();
    const id = target.get('id');
    ids.push(id);
    return { label, id };
  });
  ids = ids.join(',');
  return `<div data-type="sub-menu" class="el-icon-rank">
  <span data-type="sub-menu">展开叶子节点</span>
  <i data-type="sub-menu" class="el-icon-arrow-right" style="float:right"></i>
  <div class="second-menu">
    <div data-type="unfold-node" data-value="${ids}">全部</div>
    ${list.map(v => {
      return `<div data-type="unfold-node" data-value="${v.id}">${v.label}</div>`
    }).join('')}
  </div>
</div>`;
}

/**
 * 集合节点展开自己
 */
function unfoldGroupNodeBySelf(item) {
  const id = item.get('id');
  return `<div data-type="unfold-node" data-value="${id}" class="el-icon-rank">
            <span data-type="unfold-node" data-value="${id}">展开</span>
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