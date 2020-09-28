/**
 * 事件监听
 */
import store from '@/store/index';
import * as MutationTypes from '@/store/mutation-types';

export const bindEventListener = function (graph) {

  // 鼠标进入现实锚点
  graph.on('node:mouseenter', (e) => {
    const item = e.item;
    if (item.hasLocked()) {
      return;
    }
    // const target = e.target;
    if (!item.hasState('hover')) {
      graph.setItemState(item, 'hover', true);
    }
  });
  graph.on('node:mouseleave', (e) => {
    const item = e.item;
    graph.setItemState(item, 'hover', false);
  });
  // 鼠标按下
  graph.on('node:mousedown', (e) => {
    const item = e.item;
    if (item.hasLocked()) {
      return;
    }
    const target = e.target;
    if (target.attrs.isAnchor) {
      graph.setMode('addEdge');
    }
  });
  // 点击更换填充颜色
  graph.on('node:click', (e) => {
    const selectModel = store.getters.selectModel;
    // 单选
    if (selectModel === 'single') {
      const clickNodes = graph.findAllByState('node', 'click');
      clickNodes.forEach(node => {
        graph.setItemState(node, 'click', false);
      });
      graph.setItemState(e.item, 'click', true);
    } else {
      // 多选
      const item = e.item;
      if (item.hasState('click')) {
        graph.setItemState(item, 'click', false);
      } else {
        graph.setItemState(item, 'click', true);
      }
    }
    store.commit(
      MutationTypes.SET_SELECT_NODE,
      {
        type: selectModel,
        id: e.item.get('id')
      }
    );
  });
  // 完成布局后触发
  graph.on('afterlayout', () => {
  });
  graph.on('beforeadditem', (e) => {
    if (e.model.__type === 'circle-image') {
      e.model.type = 'circle-image';
    } else if (e.model.__type === 'edge') {
      e.model.itemType = 'edge';
    }
  });
  graph.on('afteradditem', (e) => {
    // 重新计算
    // console.warn('afteradditem');
    countCB();
  });
  graph.on('afterremoveitem', () => {
    // 重新计算
    // console.warn('afterremoveitem');
    countCB();
  });
  // 计算节点数量
  function countNodeAddEdge() {
    const nodes = {};
    const edges = {};
    // 计算画布节点类型数量
    graph.findAll('node', (n) => {
      const item = n.get('model').cellInfo;
      if (!item) {
        return;
      }
      if (!nodes[item.dxId]) {
        nodes[item.dxId] = {
          label: item.label,
          dxId: item.dxId,
          count: 1,
          icon: item.type,
        };
      } else {
        nodes[item.dxId].count += 1;
      }
    });
    store.commit(
      MutationTypes.SET_NODE_TYPE,
      Object.values(nodes)
    );
    // 计算画布边类型数量
    graph.findAll('edge', (n) => {
      const item = n.get('model').cellInfo;
      if (!item) {
        return;
      }
      if (!edges[item.id]) {
        edges[item.id] = {
          label: item.label,
          count: 1,
          linkId: item.id,
        };
      } else {
        edges[item.id].count += 1;
      }
    });
    store.commit(
      MutationTypes.SET_EDGE_TYPE,
      Object.values(edges)
    );
  }
  const countCB = debounce(countNodeAddEdge, 200);
  graph.render();
  // 窗口改变重新设置canvas大小
  window.onresize = debounce(graph._changeSize, 250);
}

/**
 * 防抖计算节点数量
 */
// 防抖
function debounce(fn, wait) {
  let timeout = null;
  return function () {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(fn, wait);
  }
}
