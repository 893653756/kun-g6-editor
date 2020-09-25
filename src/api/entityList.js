import request from './request';

/**
 * 请求实体列表
 */
export function getEntityList() {
  return request.get('/api-clues/ypdx/findGroupByLx');
  // return {
  //   data: {
  //     "content": [
  //       {
  //         "yjlxmc": "常用类型",
  //         "total": 1,
  //         "yjlx": "ypdx_common_lx",
  //         "list": [
  //           {
  //             "id": "c3eb6ebf3ae8cc412b2dee5e4857a1db",
  //             "ypdxMc": "嫌疑人车辆",
  //             "ypdxTab": "xyr_jcxx_clxx",
  //             "yjlxCode": "ypdx_wp",
  //             "yjlxMc": "物品",
  //             "ejlxCode": "wp_jdc",
  //             "ejlxMc": "机动车",
  //             "dxtbCode": "ypdx_wp_wp_jdc",
  //             "xqUrl": "xxxx",
  //             "createTime": 1600247380000,
  //             "createBy": null,
  //             "updateTime": 1600833203000,
  //             "updateBy": null,
  //             "deleteStatus": null,
  //             "remark": null,
  //             "isCommon": "1",
  //             "cxcsList": [
  //               {
  //                 "id": "1c0e34e2e73aa4a1fddfbd2b8dc9a68f",
  //                 "ypdxId": "c3eb6ebf3ae8cc412b2dee5e4857a1db",
  //                 "cxcsName": "车牌号",
  //                 "cxcsField": "cp_bh",
  //                 "isRequired": 1,
  //                 "orderNum": 1,
  //                 "tabAlias": null,
  //                 "cxcsValue": null
  //               },
  //               {
  //                 "id": "f40dfcb70faadd646fcc30de7c659b6d",
  //                 "ypdxId": "c3eb6ebf3ae8cc412b2dee5e4857a1db",
  //                 "cxcsName": "上牌时间",
  //                 "cxcsField": "",
  //                 "isRequired": 0,
  //                 "orderNum": 2,
  //                 "tabAlias": null,
  //                 "cxcsValue": null
  //               }
  //             ],
  //             "xqcsList": [],
  //             "preList": [],
  //             "showList": []
  //           }
  //         ]
  //       },
  //       {
  //         "yjlxmc": "人员",
  //         "total": 1,
  //         "yjlx": "ypdx_ry",
  //         "list": [
  //           {
  //             "id": "202009220000010",
  //             "ypdxMc": "人员",
  //             "ypdxTab": "ry_jcxx",
  //             "yjlxCode": "ypdx_ry",
  //             "yjlxMc": "人员",
  //             "ejlxCode": "ry_ybry",
  //             "ejlxMc": "一般人员",
  //             "dxtbCode": "ypdx_ry_ry_ybry",
  //             "xqUrl": null,
  //             "createTime": 1600768792000,
  //             "createBy": null,
  //             "updateTime": 1600841461000,
  //             "updateBy": null,
  //             "deleteStatus": null,
  //             "remark": null,
  //             "isCommon": "0",
  //             "cxcsList": [
  //               {
  //                 "id": "484937688808e95f4865e338e6a4f1a2",
  //                 "ypdxId": "202009220000010",
  //                 "cxcsName": "证件号码",
  //                 "cxcsField": "sfzhm",
  //                 "isRequired": 1,
  //                 "orderNum": 1,
  //                 "tabAlias": null,
  //                 "cxcsValue": null
  //               },
  //               {
  //                 "id": "656afd31e9401a7b7357cc6d939027a6",
  //                 "ypdxId": "202009220000010",
  //                 "cxcsName": "人员编码",
  //                 "cxcsField": "id",
  //                 "isRequired": 0,
  //                 "orderNum": 2,
  //                 "tabAlias": null,
  //                 "cxcsValue": null
  //               },
  //               {
  //                 "id": "e6fe9937e6481de89c88d5ceba84e9ac",
  //                 "ypdxId": "202009220000010",
  //                 "cxcsName": "姓名",
  //                 "cxcsField": "xm",
  //                 "isRequired": 0,
  //                 "orderNum": 3,
  //                 "tabAlias": null,
  //                 "cxcsValue": null
  //               }
  //             ],
  //             "xqcsList": [],
  //             "preList": [],
  //             "showList": []
  //           }
  //         ]
  //       },
  //       {
  //         "yjlxmc": "通讯工具",
  //         "total": 1,
  //         "yjlx": "ypdx_txgj",
  //         "list": [
  //           {
  //             "id": "202009180000001",
  //             "ypdxMc": "嫌疑人电话",
  //             "ypdxTab": "xyr_jcxx_sjhm",
  //             "yjlxCode": "ypdx_txgj",
  //             "yjlxMc": "通讯工具",
  //             "ejlxCode": "txgj_sj",
  //             "ejlxMc": "手机",
  //             "dxtbCode": "ypdx_txgj_txgj_sj",
  //             "xqUrl": null,
  //             "createTime": 1600423845000,
  //             "createBy": null,
  //             "updateTime": 1600833221000,
  //             "updateBy": null,
  //             "deleteStatus": null,
  //             "remark": null,
  //             "isCommon": "0",
  //             "cxcsList": [
  //               {
  //                 "id": "52415b9884152c4f48c39e1f21824435",
  //                 "ypdxId": "202009180000001",
  //                 "cxcsName": "手机号码",
  //                 "cxcsField": "sjhm",
  //                 "isRequired": 1,
  //                 "orderNum": 1,
  //                 "tabAlias": null,
  //                 "cxcsValue": null
  //               },
  //               {
  //                 "id": "ee2066f11efcd3463f064d017e91c138",
  //                 "ypdxId": "202009180000001",
  //                 "cxcsName": "姓名",
  //                 "cxcsField": "",
  //                 "isRequired": 0,
  //                 "orderNum": 2,
  //                 "tabAlias": null,
  //                 "cxcsValue": null
  //               },
  //               {
  //                 "id": "862690f2b11316251001b7bc03b8a3f8",
  //                 "ypdxId": "202009180000001",
  //                 "cxcsName": "归属地",
  //                 "cxcsField": "",
  //                 "isRequired": 0,
  //                 "orderNum": 3,
  //                 "tabAlias": null,
  //                 "cxcsValue": null
  //               }
  //             ],
  //             "xqcsList": [],
  //             "preList": [],
  //             "showList": []
  //           }
  //         ]
  //       },
  //       {
  //         "yjlxmc": "物品",
  //         "total": 2,
  //         "yjlx": "ypdx_wp",
  //         "list": [
  //           {
  //             "id": "c3eb6ebf3ae8cc412b2dee5e4857a1db",
  //             "ypdxMc": "嫌疑人车辆",
  //             "ypdxTab": "xyr_jcxx_clxx",
  //             "yjlxCode": "ypdx_wp",
  //             "yjlxMc": "物品",
  //             "ejlxCode": "wp_jdc",
  //             "ejlxMc": "机动车",
  //             "dxtbCode": "ypdx_wp_wp_jdc",
  //             "xqUrl": "xxxx",
  //             "createTime": 1600247380000,
  //             "createBy": null,
  //             "updateTime": 1600833203000,
  //             "updateBy": null,
  //             "deleteStatus": null,
  //             "remark": null,
  //             "isCommon": "1",
  //             "cxcsList": [
  //               {
  //                 "id": "1c0e34e2e73aa4a1fddfbd2b8dc9a68f",
  //                 "ypdxId": "c3eb6ebf3ae8cc412b2dee5e4857a1db",
  //                 "cxcsName": "车牌号",
  //                 "cxcsField": "cp_bh",
  //                 "isRequired": 1,
  //                 "orderNum": 1,
  //                 "tabAlias": null,
  //                 "cxcsValue": null
  //               },
  //               {
  //                 "id": "f40dfcb70faadd646fcc30de7c659b6d",
  //                 "ypdxId": "c3eb6ebf3ae8cc412b2dee5e4857a1db",
  //                 "cxcsName": "上牌时间",
  //                 "cxcsField": "",
  //                 "isRequired": 0,
  //                 "orderNum": 2,
  //                 "tabAlias": null,
  //                 "cxcsValue": null
  //               }
  //             ],
  //             "xqcsList": [],
  //             "preList": [],
  //             "showList": []
  //           },
  //           {
  //             "id": "45722c78cd2d7b1dabd66b29250abb46",
  //             "ypdxMc": "嫌疑人资金",
  //             "ypdxTab": "xyr_jcxx_zjxx",
  //             "yjlxCode": "ypdx_wp",
  //             "yjlxMc": "物品",
  //             "ejlxCode": "wp_yhk",
  //             "ejlxMc": "银行卡",
  //             "dxtbCode": "ypdx_wp_wp_yhk",
  //             "xqUrl": "xxx",
  //             "createTime": 1600227564000,
  //             "createBy": null,
  //             "updateTime": 1600833232000,
  //             "updateBy": null,
  //             "deleteStatus": null,
  //             "remark": null,
  //             "isCommon": "0",
  //             "cxcsList": [
  //               {
  //                 "id": "f2e467aa4596d67873093539b304b3f9",
  //                 "ypdxId": "45722c78cd2d7b1dabd66b29250abb46",
  //                 "cxcsName": "银行卡号",
  //                 "cxcsField": "zjzh",
  //                 "isRequired": 1,
  //                 "orderNum": 1,
  //                 "tabAlias": null,
  //                 "cxcsValue": null
  //               },
  //               {
  //                 "id": "46c9191dd0894685da76c09f7d6650f0",
  //                 "ypdxId": "45722c78cd2d7b1dabd66b29250abb46",
  //                 "cxcsName": "开户银行",
  //                 "cxcsField": "",
  //                 "isRequired": 0,
  //                 "orderNum": 2,
  //                 "tabAlias": null,
  //                 "cxcsValue": null
  //               }
  //             ],
  //             "xqcsList": [],
  //             "preList": [],
  //             "showList": []
  //           }
  //         ]
  //       }
  //     ],
  //     "code": 0,
  //     "msg": "查询成功"
  //   }
  // }
};

/**
 * 查询节点是否存在
 */
export function fetchEntityIsExistence({dxId, params = {}}) {
  return request.post(`/api-clues/entities/links/findEntityByDxId/${dxId}`, params);
}