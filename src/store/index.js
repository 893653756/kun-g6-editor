import Vue from 'vue';
import Vuex from 'vuex';
import * as MutationTypes from './mutation-types';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editors: null, // 编辑器实例,
    selectNode: null, // 当前选择的节点
    entitys: [], // 实体列表
    hasEdges: [], // 画布里关系类型数量
    hasEntitys: [] // 画布里实体类型数量
  },
  getters: {
    editors: (state) => state.editors,
    selectNode: (state) => state.selectNode,
    entitys: (state) => state.entitys,
    hasEdges: (state) => state.hasEdges,
    hasEntitys: (state) => state.hasEntitys,
  },
  mutations: {
    [MutationTypes.SET_EDITORS](state, editors) {
      state.editors = editors;
    },
    [MutationTypes.SET_SELECT_NODE](state, selectNode) {
      state.selectNode = selectNode;
    },
    [MutationTypes.SET_ENTITYS](state, entitys) {
      state.entitys = entitys;
    },
    [MutationTypes.SET_EDGE_TYPE](state, hasEdges) {
      state.hasEdges = hasEdges;
    },
    [MutationTypes.SET_NODE_TYPE](state, hasEntitys) {
      state.hasEntitys = hasEntitys;
    }
  }
});