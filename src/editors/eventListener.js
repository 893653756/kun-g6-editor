/**
 * 事件监听
 */
import store from '@/store/index';
import * as MutationTypes from '@/store/mutation-types';
import { debounce } from '@/utils';
import { countLeafNode } from '@/utils/index';
import G6 from '@antv/g6';
import { hoveTitleCfg } from '@/graph-cfg';

export const bindEventListener = function (graph) {
  let ctrlKeydown = false; // 多选
  let shiftKeydown = false; // 框选
  graph.on('node:dragstart', (e) => {
    const item = e.item;
    if (item.hasState('selected')) {

    } else {
      const clickNodes = graph.findAllByState('node', 'selected');
      clickNodes.forEach(node => {
        graph.setItemState(node, 'selected', false);
      });
      graph.setItemState(item, 'selected', true);
    }
  })

  // graph.on('node:dragstart', (e) => {
  //   const item = e.item;
  //   const edges = item.get('edges');
  //   const layout = graph.cfg.layout;
  //   if (edges.length >= 2 && layout.type === 'force') {
  //     graph.layout();
  //   }
  //   refreshDragedNodePosition(e);
  // });
  // graph.on('node:drag', (e) => {
  //   refreshDragedNodePosition(e);
  // });
  // graph.on('node:dragend', (e) => {
  //   e.item.get('model').fx = null;
  //   e.item.get('model').fy = null;
  // });
  // // 移动节点
  // graph.on('node:dragend', (e) => {
  //   graph._updateMinimap && graph._updateMinimap();
  // })
  graph.on('afterrender', () => {
    console.warn('afterrender');
    const nodes = graph.getNodes();
    if (nodes.length === 0) {
      return;
    }
  });
  // 键盘事件 (多选模式)
  graph.on('keydown', evt => {
    const code = evt.key;
    if (!code) {
      return;
    }
    // console.warn('code', code);
    // ctrl + a
    if (ctrlKeydown && code.toLowerCase() === 'a') {
      evt.preventDefault();
      const nodes = graph.getNodes();
      nodes.forEach(node => {
        graph.setItemState(node, 'selected', true);
      });
      return;
    }
    if (ctrlKeydown || shiftKeydown) {
      return;
    }
    // 删除
    if (code.toLowerCase() === 'delete') {
      deleteItemsCB()
    }
    if (code.toLowerCase() === 'control') {
      ctrlKeydown = true;
      return graph.setMode('ctrlSelect');
    }
    if (code.toLowerCase() === 'shift') {
      shiftKeydown = true;
      return graph.setMode('shiftSelect');
    }
  });
  graph.on('keyup', evt => {
    const code = evt.key;
    if (!code) {
      return;
    }
    if (code.toLowerCase() === 'control') {
      ctrlKeydown = false;
      return graph.setMode('default');
    }
    if (code.toLowerCase() === 'shift') {
      shiftKeydown = false;
      return graph.setMode('default');
    }
  });
  // 点击空白清空选择
  graph.on('canvas:click', () => {
    const mode = graph.getCurrentMode();
    if (mode === 'ctrlSelect' || mode === 'shiftSelect') {
      return;
    }
    const clickNodes = graph.findAllByState('node', 'selected');
    clickNodes.forEach(item => {
      graph.setItemState(item, 'selected', false);
    });
    const clickEdges = graph.findAllByState('edge', 'selected');
    clickEdges.forEach(item => {
      graph.setItemState(item, 'selected', false);
    });
  })
  // 点击更换填充颜色
  graph.on('node:click', (e) => {
    const mode = graph.getCurrentMode();
    console.warn('item', e.item, mode);
    if (mode === 'ctrlSelect' || mode === 'shiftSelect') {
      return;
    }
    const clickNodes = graph.findAllByState('node', 'selected');
    // console.warn('clickNodes', clickNodes)
    clickNodes.forEach(node => {
      graph.setItemState(node, 'selected', false);
    });
    const item = e.item;
    graph.setItemState(item, 'selected', true);
    // if (item.get('currentShape') === 'group-node') {
    //   return;
    // }
    store.commit(MutationTypes.SET_SELECT_NODE, item.get('id'));
    store.commit(MutationTypes.SET_TABLE_ID, 'process');
  });
  // 滚轮
  graph.on('wheelzoom', debounce(hiddenLabel, 300));
  // 鼠标进入现实锚点
  graph.on('node:mouseenter', (e) => {
    const item = e.item;
    if (item.hasLocked()) {
      return;
    }
    // const target = e.target;
    // 不显示锚点
    if (notCustomEdge()) {
      return;
    }
    if (!item.hasState('hover')) {
      graph.setItemState(item, 'hover', true);
    }
  });
  graph.on('node:mousemove', (e) => {
    // 是否有提示
    const target = e.target;
    showTitleCB(target);
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
    // 不能连线
    if (notCustomEdge()) {
      return;
    }
    const target = e.target;
    if (target.attrs.isAnchor) {
      graph.setMode('addEdge');
    }
  });
  graph.on('edge:mouseenter', (e) => {
    const item = e.item;
    graph.setItemState(item, 'hover', true);
  });
  graph.on('edge:mouseleave', (e) => {
    const item = e.item;
    graph.setItemState(item, 'hover', false);
  });
  graph.on('edge:click', (e) => {
    const clickEdges = graph.findAllByState('edge', 'selected');
    clickEdges.forEach(edge => {
      graph.setItemState(edge, 'selected', false);
    });
    const item = e.item;
    graph.setItemState(item, 'selected', true);
    graph.setItemState(item, 'selected', true);
  })
  // 连线双击查看详情
  graph.on('edge:dblclick', (e) => {
    const item = e.item;
    graph._showLinkDetail && graph._showLinkDetail(item);
    // console.warn('edge', item);
  })
  // 完成布局后触发
  graph.on('afterlayout', () => {
    console.warn('afterlayout');
    fitCenterCB();
  });
  graph.on('beforeadditem', (e) => {
    if (e.type === 'node') {
      e.model.cluster = e.model.cellInfo.icon;
      if (e.model.__type === 'circle-image') {
        e.model.type = 'circle-image';
      } else if (e.model.__type === 'group-node') {
        e.model.type = 'group-node';
      }
    } else if (e.model.__type === 'edge') {
      e.model.itemType = 'edge';
    }
    // if (e.model.__type === 'circle-image') {
    //   e.model.type = 'circle-image';
    // } else if (e.model.__type === 'edge') {
    //   e.model.itemType = 'edge';
    // } else if (e.model.__type === 'group-node') {
    //   e.model.type = 'group-node';
    // }
  });
  graph.on('afteradditem', ({ model, item }) => {
    // console.warn('afteradditem-----AAAA')
    // 重新计算
    if (model.type === 'dashed-line') {
      return;
    }
    countCB();
    if (item.get('type') !== 'edge') {
      countNodeIdsCB();
    }
    processParallelEdgesCB();
  });
  graph.on('afterremoveitem', ({ item }) => {
    // 重新计算
    if (item.type === 'dashed-line') {
      return;
    }
    countCB();
    if (item.itemType !== 'edge') {
      countNodeIdsCB();
    }
  });
  // 显示隐藏节点调用
  graph.on('afteritemvisibilitychange', () => {
    countCB();
  })
  // 计算节点数量
  function countNodeAddEdge() {
    const nodes = {};
    const edges = {};
    // 计算画布节点类型数量
    const nodeList = graph.getNodes().filter(v => v.isVisible());
    nodeList.forEach(item => {
      const { cellInfo, id } = item.get('model');
      const { dxId, icon, label } = cellInfo;
      const key = `${dxId}-${icon}`;
      if (!nodes[key]) {
        nodes[key] = {
          label,
          // dxId,
          key,
          icon,
          ids: [id]
        };
      } else {
        // nodes[key].count += 1;
        nodes[key].ids.push(id);
      }
    });
    store.commit(
      MutationTypes.SET_NODE_TYPE,
      Object.values(nodes)
    );
    // 计算画布边类型数量
    const edgesList = graph.getEdges().filter(v => v.isVisible());
    edgesList.forEach(item => {
      const { cellInfo, id } = item.get('model');
      // const cellInfo = item.get('model').cellInfo;
      if (!cellInfo) {
        return;
      }
      if (!edges[cellInfo.id]) {
        edges[cellInfo.id] = {
          label: cellInfo.label,
          // count: 1,
          linkId: cellInfo.id,
          ids: [id]
        };
      } else {
        // edges[cellInfo.id].count += 1;
        edges[cellInfo.id].ids.push(id);
      }
    });
    store.commit(
      MutationTypes.SET_EDGE_TYPE,
      Object.values(edges)
    );
  }
  // 重新计算画布现有节点id
  function countNodeIds() {
    const nodes = graph.getNodes();
    const nodeIdList = [];
    nodes.forEach(item => {
      const model = item.getModel();
      if (model.type === 'circle-image') {
        nodeIdList.push(model.id);
      } else {
        const leafNodesInfo = model.leafNodesInfo;
        leafNodesInfo.nodeModels.forEach(v => {
          const id = v.id;
          nodeIdList.push(id);
        });
      }
    });
    // 更新子节点显示数量
    nodes.forEach(item => {
      const model = item.getModel();
      if (model.type === 'circle-image') {
        const nextEntities = model.cellInfo.nextEntities || [];
        const childrenCount = model.childrenCount;
        let count = 0;
        nextEntities.forEach(id => {
          if (!nodeIdList.includes(id)) {
            count++;
          }
        });
        if (count !== childrenCount) {
          graph.updateItem(item, {
            childrenCount: count
          });
        }
      }
    })
    store.commit(MutationTypes.SET_NODE_IDS, nodeIdList);
  }
  // 多线
  function processParallelEdges() {
    const edges = graph.save().edges;
    G6.Util.processParallelEdges(edges, 25);
    graph.getEdges().forEach((edge, i) => {
      const model = edges[i];
      // let curveOffset = 0;
      // if (model.curveOffset < 0) {
      //   curveOffset = model.curveOffset - 10;
      // } else if (model.curveOffset > 0) {
      //   curveOffset = model.curveOffset + 10;
      // }
      graph.updateItem(edge, {
        curveOffset: model.curveOffset,
        curvePosition: model.curvePosition,
        type: model.type
      })
    })
  }
  // 提示
  function showTitle(target) {
    const name = target.cfg.name;
    if (hoveTitleCfg[name]) {
      const tooltips = graph.get('tooltips') || [];

      if (tooltips[tooltips.length - 1]) {
        tooltips[tooltips.length - 1].innerHTML = hoveTitleCfg[name];
      }
    }
  }
  // 删除节点
  function deleteItems() {
    console.warn('delete')
    const nodes = graph.findAllByState('node', 'selected');
    const edges = graph.findAllByState('edge', 'selected');
    const itemList = [...edges, ...nodes,];
    if (itemList.length > 0) {
      graph._deleteNodes && graph._deleteNodes(itemList);
    }
  }
  const countCB = debounce(countNodeAddEdge, 200);
  const countNodeIdsCB = debounce(countNodeIds, 200);
  const processParallelEdgesCB = debounce(processParallelEdges, 300);
  const showTitleCB = debounce(showTitle, 300);
  const deleteItemsCB = debounce(deleteItems, 500);
  // 合并节点后，图居中
  const fitCenterCB = debounce(() => {
    const enterByJudgment = store.getters.enterByJudgment;
    if (enterByJudgment) {
      // debugger
      store.commit(MutationTypes.ENTER_BY_JUDGMENT, false);
      const mergeRelationIds = [...store.getters.mergeRelationIds];
      // 合并子节点
      const obj = {};
      const edges = [];
      // 合并后台新推送的关系类型节点
      mergeRelationIds.forEach(id => {
        const edge = graph.findById(id);
        edge && edges.push(edge);
      })
      // const edges = graph.getEdges();
      edges.forEach(e => {
        const source = e.getSource();
        const id = source.get('id');
        const gxId = e.getModel().cellInfo.id;
        if (obj[id]) {
          obj[id].count++;
        } else {
          obj[id] = {
            item: source,
            count: 1,
            gxId,
          }
        }
      });
      store.commit(MutationTypes.SET_RELATION_ID, []);
      Object.values(obj).filter(v => v.count >= 10).forEach(v => {
        const leafNodeList = countLeafNode(v.item);
        leafNodeList.forEach((leaf) => {
          graph._collapseExpandLeafNode(v.item, leaf);
        });
      });
      requestAnimationFrame(() => {
        graph.layout({
          type: 'dagre'
        });
      })
    }
    graph.fitCenter();
  }, 600);
  // 窗口改变重新设置canvas大小
  window.onresize = debounce(graph._changeSize, 250);

  // 隐藏文本节点
  function hiddenLabel() {
    const zoom = graph.getZoom();
    graph.getNodes().forEach(node => {
      const group = node.getContainer();
      const label = group.find(ele => ele.get('name') === 'circle-text');
      if (label) {
        zoom < 0.85 ? label.hide() : label.show();
      }
    });
    graph.getEdges().forEach(node => {
      const group = node.getContainer();
      const label = group.find(ele => ele.get('name') === 'text-shape');
      // console.warn('label', label);
      if (label) {
        if (zoom < 0.65) {
          label.hide();
          // label.attrs.background.fillOpacity = 0;
        } else {
          label.show();
          // label.attrs.background.fillOpacity = 1;
        }
      }
    })
  }
  // 是否可以自定义连线
  function notCustomEdge() {
    const otherInfo = store.getters.otherInfo;
    const xsbhs = store.getters.xsbhs;
    return otherInfo.readOnly || (Array.isArray(xsbhs) && xsbhs.length > 1)
  }
};

// function refreshDragedNodePosition(e) {
//   const model = e.item.get('model');
//   model.fx = e.x;
//   model.fy = e.y;
// };
