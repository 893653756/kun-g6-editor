import store from '@/store/index';
import * as MutationTypes from '@/store/mutation-types';
import { countLeafNode } from '@/utils/index';

/**
 * 右键菜单
 */

export function getMenuList(item, graph) {
  const type = item.get('model').type;
  // console.warn('item', item);
  // 扩展一层
  const extendMenu = extendChildren(item);
  // 收拢子节点
  let shrinkMenu = shrinkOrUnfoldNodes(item);
  // 展开子节点
  // 删除
  const deleteMenu = `<div data-type="delete" class="icon-shanchu" style="color: #F56C6C">
        <span data-type="delete">删除</span>
      </div>`;
  // 查看详情
  const detailsMenu = lookDetail(item);
  if (item.get('type') === 'edge') {
    return `<div class="right-menu__list">
    ${deleteMenu}
  </div>`;
  };
  const lockMenu = isLock(item);
  const highlightMenu = isHighlight(item);
  const emphasizeMenu = isEmphasize(item);
  // const hiddenMenu = hiddenNode(item);
  if (type === 'group-node') {
    const unfoldMenu = unfoldGroupNodeBySelf(item);
    return `<div class="right-menu__list">
      ${unfoldMenu}
      ${lockMenu}
      ${highlightMenu}
      ${emphasizeMenu}
    </div>`;
  }
  const urlMenu = isHasUrl(item);
  // 展开 | 归类
  const leafNodesMenu = hasLeafNode(item);
  const unfoldMenu = unfoldGroupNodeByParents(item);
  return `<div class="right-menu__list">
    ${detailsMenu}
    ${extendMenu}
    ${shrinkMenu}
    ${leafNodesMenu}
    ${unfoldMenu}
    ${lockMenu}
    ${highlightMenu}
    ${emphasizeMenu}
    ${deleteMenu}
    ${urlMenu}
  </div>`;
};

/**
 * 
 * @param {*} item 
 */
function extendChildren(item) {
  if (store.getters.xsbhs) {
    return '';
  }
  const model = item.getModel();
  const { notExist, dxId, custom } = model.cellInfo;
  // 可疑节点 || 自定义节点
  if ((dxId === '202012280000007')) {
    return '';
  }

  return `<div data-type="extend-relation" class="icon-kuozhan" style="color: #67C23A
  ">
  <span data-type="extend-relation">${custom ? '一键研判' : '扩展节点'}</span>
</div>`;
};

/**
 * 是否锁定
 * @param { Object } item 节点对象
 * @returns { String }
 */
function isLock(item) {
  const lock = item.hasLocked();
  const color = lock ? '' : '#E6A23C';
  const str = `<div data-type="lock-${lock}" class="${lock ? 'icon-jiesuo' : 'icon-suoding'}" style="color: ${color}">
                <span data-type="lock-${lock}">${lock ? '解锁' : '锁定'}(该节点)</span>
              </div>`;
  return str;
};

/**
 * 是否高亮
 */
function isHighlight(item) {
  return '';
  // const selected = item.hasState('highlight');
  // const str = `<div data-type="highlight-${selected}" class="icon-zhiku-gaoliang">
  //               <span data-type="highlight-${selected}">${selected ? '取消高亮' : '高亮'}</span>
  //             </div>`;
  // return str;
};

/**
 * 是否强调
 */
function isEmphasize(item) {
  const model = item.get('model');
  const emphasize = model.emphasize;
  const color = emphasize ? '' : '#E6A23C';
  const str = `<div data-type="emphasize-${emphasize}" class="icon-tanhao" style="color: ${color}">
                <span data-type="emphasize-${emphasize}">${emphasize ? '取消强调' : '强调'}(该节点)</span>
              </div>`;
  return str;
};

/**
 * 是否有连接
 */
function isHasUrl(item) {
  const cellInfo = item.get('model').cellInfo;
  if (cellInfo.xqUrl) {
    return `<div data-type="xqUrl" class="icon-dangan" style="color: #409EFF">
              <span data-type="xqUrl">档案</span>
            </div>`;
  }
  return '';
};

/**
 * 收拢的叶子节点
 */
function hasLeafNode(item) {
  if (store.getters.xsbhs) {
    return '';
  }
  // 如果子节点收缩
  const model = item.getModel();
  if (model.shrink) {
    return '';
  }
  const leafNodeList = countLeafNode(item);
  store.commit(MutationTypes.SET_LEAF_NODE, leafNodeList);
  console.warn('leafNodeList', leafNodeList)
  if (leafNodeList.length === 0) {
    return '';
  }
  return `<div data-type="sub-menu" class="icon-leimu">
            <span data-type="sub-menu">归类子节点</span>
            <i data-type="sub-menu" class="el-icon-arrow-right" style="float:right"></i>
            <div class="second-menu">
              <div data-type="leaf-node_all" data-value="all">全部</div>
              ${leafNodeList.map(v => {
    return `<div data-type="leaf-node_${v.label}" data-value="${v.gxId}">${v.label}(${v.leafNodes.length}个)</div>`
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
  return `<div data-type="sub-menu" class="icon-zhankai1">
  <span data-type="sub-menu">归类子节点展开</span>
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
  return `<div data-type="unfold-node" data-value="${id}" class="icon-zhankai">
            <span data-type="unfold-node" data-value="${id}">展开</span>
          </div>`;
};

/**
 * 隐藏节点
 */
function hiddenNode(item) {
  const str = [
    `<div data-type="hidden-node-self" class="el-icon-s-promotion">
      <span data-type="hidden-node-self">隐藏节点</span>
    </div>`
  ];
  const showStr = `<div data-type="show-node-children" class="el-icon-view">
                    <span data-type="show-node-children">显示子节点</span>
                  </div>`;
  const hideStr = `<div data-type="hidden-node-children" class="el-icon-s-promotion">
                    <span data-type="hidden-node-children">隐藏子节点</span>
                  </div>`;
  const outEdges = item.getOutEdges() || [];
  let hasShowChild = false;
  let hasHideChild = false;
  outEdges.forEach(edge => {
    const visible = edge.get('visible');
    if (visible) {
      hasShowChild = true;
    } else {
      hasHideChild = true;
    }
  });
  hasShowChild ? str.push(hideStr) : null;
  hasHideChild ? str.push(showStr) : null;
  return str.join('');
};

/**
 * 收拢 | 展开子节点
 */
function shrinkOrUnfoldNodes(item) {
  const model = item.getModel();
  const { shrink } = model;
  let str = '';
  if (shrink) {
    str = `<div data-type="unshrink-relation" class="icon-zhankai">
      <span data-type="unshrink-relation">显示子节点</span>
    </div>`;
  } else if (item.getOutEdges().length > 0) {
    str = `<div data-type="shrink-relation" class="icon-shoulong">
      <span data-type="shrink-relation">收拢子节点</span>
    </div>`;
  }
  return str;
};

/**
 * 查看详情
 */
function lookDetail(item) {
  const model = item.getModel();
  const { notExist, dxId, custom } = model.cellInfo;
  if (notExist || (dxId === '202012280000007') || custom) {
    return '';
  }
  return `<div data-type="details" class="icon-icon-chakanxq" style="color: #409EFF">
  <span data-type="details">查看详情</span>
</div>`;
}
