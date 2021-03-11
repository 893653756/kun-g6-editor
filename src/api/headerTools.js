import request from './request';
const development = process.env.NODE_ENV === 'development';
const apiClues = development ? '/api-elyp' : '';
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
export function getRelationsList(params) {
  return request.get(`${apiClues}/yp/snapshot/list`, {
    params
  });
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
export function getRelationByDxType({ dxType, params = {}, wsType }) {
  return request.post(`${apiClues}/entities/links/findByDxType/${dxType}/${wsType}`, params);
};

export function findBltjrByBlnr({ dxType, params = {} }) {
  if (development) {
    return 1;
  }
  return request.post(`${apiClues}/rybltj/findBltjrByBlnr/${dxType}`, params);
};


/**
 * 案件线索数据查询
 */
export function getCaseclues(payload) {
  return request.post(`${apiClues}/relate/xy_xyr/team/node_rel_existing`, payload)
}

/**
 * 保存团伙关系
 */
export function saveCaseclues(payload) {
  return request.post(`${apiClues}/relate/xsgroupry/save_custom`, payload);
}

/**
 * 查看团伙关系连线详情
 * { "startNode": { "dxType": dxType, "idMap": idMap }, "endNode": { "dxType": dxType, "idMap": idMap }, "xsbh": "" }
 */
export function fetchCasecluesDetail({ linkId, payload }) {
  return request.post(`${apiClues}/relate/xy_xyr/team/findLinkDetails/${linkId}`, payload)
};
