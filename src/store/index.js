import Vue from 'vue';
import Vuex from 'vuex';
import * as MutationTypes from './mutation-types';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editors: null, // 编辑器实例,
    selectNodes: [], // 当前选择的节点
    entitys: [], // 实体列表
    hasEdges: [], // 画布里关系类型数量
    hasEntitys: [], // 画布里实体类型数量
    selectModel: 'single', // 选取模式  single(单) | multiple(多)
    layoutType: 'force'
  },
  getters: {
    editors: (state) => state.editors,
    selectNodes: (state) => state.selectNodes,
    entitys: (state) => state.entitys,
    hasEdges: (state) => state.hasEdges,
    hasEntitys: (state) => state.hasEntitys,
    selectModel: (state) => state.selectModel,
    layoutType: (state) => state.layoutType
  },
  mutations: {
    [MutationTypes.SET_LAYOUT_TYPE](state, layoutType) {
      state.layoutType = layoutType;
    },
    [MutationTypes.SET_EDITORS](state, editors) {
      state.editors = editors;
    },
    [MutationTypes.SET_SELECT_NODE](state, payload) {
      if (payload.type === 'single') {
        state.selectNodes = [payload.id];
      } else if (payload.type === 'multiple') {
        
        const ids = [...state.selectNodes];
        const index = ids.findIndex(id => id === payload.id);
        if (index === -1) {
          state.selectNodes = [payload.id, ...ids];
        } else {
          ids.splice(index, 1);
          state.selectNodes = [...ids];
        }
      } else if (payload.type === 'clear') {
        state.selectNodes = [];
      }
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
    [MutationTypes.SET_SELECT_MODEL](state, selectModel) {
      state.selectModel = selectModel;
    }
  }
});