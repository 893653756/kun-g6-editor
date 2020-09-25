import request from './request';

/**
 * 获取节点的有多少种关系
 */
export function getCellRelationList(linkIds) {
  return request.get(`/api-clues/entities/links/findLinks?linkIds=${linkIds}`);
};
/**
 * 查询关系
 * @param startDxId 起始节点对象id
 * @param relationId 关系id
 * @param params 回传参数
 */
export function fetchCellRelationshipNode({ startDxId, params = {} }) {
  let url = `/api-clues/entities/links/findByStartDxId/${startDxId}`;
  return request.post(url, params);
};

/**
 * 点击编显示关系详情
 */
export function fetchRelationDetail({ linkId, params = {} }) {
  return request.post(`/api-clues/entities/links/findLinkDetail/${linkId}`, params);
}

/**
 * 对象之间是否可以建立关系
 */
export function fetchBetweenEntitiesLink(startDxId, endDxId) {
  return request.get(`/api-clues/entities/links/findLinksByStartAndEndDxId`, {
    params: {
      startDxId,
      endDxId
    }
  })
};
