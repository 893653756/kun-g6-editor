import request from './request';
const apiClues = process.env.NODE_ENV === 'development' ? '/api-elyp' : '';
/**
 * 保存关系 (新增)
 * id: 该关系图id
 * label: 关系图名称
 * description: 关系图描述
 * content: 关系图json数据
 */
export function saveAddUpdateRelations(payload) {
  if (payload.id) {
    return request.post(`${apiClues}/yp/snapshot/updateById`, payload);
  } else {
    return request.post(`${apiClues}/yp/snapshot/save`, payload);
  }
};

/**
 * 获取关系列表
 */
export function getRelationsList() {
  return request.get(`${apiClues}/yp/snapshot/list`);
};

/**
 * 获取某个关系图详细数据
 */
export function getRelationDetailById(id) {
  return request.get(`${apiClues}/yp/snapshot/findById/${id}`);
};

/**
 * 框架通过url传参获取每个类型的关系数据
 */
export function getRelationByDxType({ dxType, params = {} }) {
  return request.post(`${apiClues}/entities/links/findByDxType/${dxType}`, params)
};
