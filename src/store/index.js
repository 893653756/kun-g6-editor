import Vue from 'vue';
import Vuex from 'vuex';
import * as MutationTypes from './mutation-types';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 画布里所有节点的id
    nodeIdList: [],
    editors: null, // 编辑器实例,
    selectNodeId: '', // 当前选择的节点
    entitys: [], // 实体列表
    hasEdges: [], // 画布里关系类型数量
    hasEntitys: [], // 画布里实体类型数量
    layoutType: 'dagre',
    leafNodeList: [], // 某节点的叶子节点
    enterByJudgment: false, // 是否从一件研判入口进来
    tableId: '',
    xsbhs: '', // 案件线索编号
    otherInfo: {
      // teamType: '', // 团伙类型
      // readOnly: 0, // 不能自定义连线
      // queryStatus: '' // 
    },
    userAndDept: {},
    deleteEdges: [], // 记录线索删除的关系
    // 已自动合并的关系类型列表
    mergeRelationIds: [],
  },
  getters: {
    editors: (state) => state.editors,
    selectNodeId: (state) => state.selectNodeId,
    entitys: (state) => state.entitys,
    hasEdges: (state) => state.hasEdges,
    hasEntitys: (state) => state.hasEntitys,
    layoutType: (state) => state.layoutType,
    leafNodeList: (state) => state.leafNodeList,
    nodeIdList: (state) => state.nodeIdList,
    enterByJudgment: (state) => state.enterByJudgment,
    tableId: (state) => state.tableId,
    xsbhs: (state) => state.xsbhs,
    otherInfo: (state) => state.otherInfo,
    userAndDept: (state) => state.userAndDept,
    deleteEdges: (state) => state.deleteEdges,
    mergeRelationIds: (state) => state.mergeRelationIds,
  },
  mutations: {
    [MutationTypes.SET_TABLE_ID](state, tableId) {
      state.tableId = tableId;
    },
    // 研判入口阀值
    [MutationTypes.ENTER_BY_JUDGMENT](state, enterByJudgment) {
      state.enterByJudgment = enterByJudgment;
    },
    // 更新画布节点id
    [MutationTypes.SET_NODE_IDS](state, nodeIdList) {
      state.nodeIdList = nodeIdList;
    },
    // 叶子节点
    [MutationTypes.SET_LEAF_NODE](state, leafNodeList) {
      state.leafNodeList = leafNodeList;
    },
    [MutationTypes.SET_LAYOUT_TYPE](state, layoutType) {
      state.layoutType = layoutType;
    },
    [MutationTypes.SET_EDITORS](state, editors) {
      state.editors = editors;
    },
    [MutationTypes.SET_SELECT_NODE](state, id) {
      state.selectNodeId = id;
    },
    [MutationTypes.SET_ENTITYS](state, entitys) {
      state.entitys = entitys;
    },
    [MutationTypes.SET_EDGE_TYPE](state, hasEdges) {
      state.hasEdges = hasEdges;
    },
    [MutationTypes.SET_NODE_TYPE](state, hasEntitys) {
      state.hasEntitys = hasEntitys;
    },
    [MutationTypes.SET_XSBH](state, xsbhs) {
      state.xsbhs = xsbhs;
    },
    [MutationTypes.SET_USER_DEPT](state, userAndDept) {
      state.userAndDept = userAndDept;
    },
    [MutationTypes.SET_DELETE_EDGE](state, deleteEdges) {
      state.deleteEdges = deleteEdges;
    },
    [MutationTypes.SET_OTHER_INFO](state, otherInfo) {
      state.otherInfo = otherInfo;
    },
    [MutationTypes.SET_RELATION_ID](state, mergeRelationIds) {
      state.mergeRelationIds = mergeRelationIds;
    },
  }
});