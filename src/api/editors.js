import request from './request';

const apiClues = process.env.NODE_ENV === 'development' ? '/api-elyp' : '';
/**
 * 获取节点的有多少种关系
 */
export function getCellRelationList(linkIds) {
  return request.get(`${apiClues}/entities/links/findLinks?linkIds=${linkIds}`);
};
/**
 * 查询关系 (暂时没用)
 * @param startDxId 起始节点对象id
 * @param relationId 关系id
 * @param params 回传参数
 */
export function fetchCellRelationshipNode({ startDxId, params = {} }) {
  let url = `${apiClues}/entities/links/findByStartDxId/${startDxId}`;
  return request.post(url, params);
};

/**
 * 节点所有关系
 * @param tableName 表名
 */
export function getAllRelation({ tableName, params = {} }) {
  return request.post(`${apiClues}/entities/links/findByTabId/${tableName}`, params);
};


/**
 * 点击编显示关系详情
 */
export function fetchRelationDetail({ linkId, params = {} }) {
  return request.post(`${apiClues}/entities/links/findLinkDetail/${linkId}`, params);
}

/**
 * 对象之间是否可以建立关系
 */
export function fetchBetweenEntitiesLink(startDxId, endDxId) {
  return request.get(`${apiClues}/entities/links/findLinksByStartAndEndDxId`, {
    params: {
      startDxId,
      endDxId
    }
  })
};
