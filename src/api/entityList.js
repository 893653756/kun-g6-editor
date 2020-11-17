import request from './request';
const apiClues = process.env.NODE_ENV === 'development' ? '/api-elyp' : '';
/**
 * 请求实体列表
 */
export function getEntityList() {
  return request.get(`${apiClues}/ypdx/findGroupByLx`);
};

/**
 * 查询节点是否存在
 */
export function fetchEntityIsExistence({ dxId, params = {} }) {
  return request.post(`${apiClues}/entities/links/findEntityByDxId/${dxId}`, params);
};
