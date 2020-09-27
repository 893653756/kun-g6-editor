import request from './request';
const apiClues = process.env.NODE_ENV === 'development' ? '/api-clues' : '';
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
  // return request.get(`${apiClues}/yp/snapshot/list`);
  return {
    data: {
      content: [
        {
          id: '111',
          label: '朱万海',
          description: '我是描述',
        }
      ],
      code: 0
    }
  }
};

/**
 * 获取某个关系图详细数据
 */
export function getRelationDetailById(id) {
  // return request.get(`${apiClues}/yp/snapshot/findById/${id}`);
  return {
    data: {
      content: {
        "entities": [
          {
            "id": "af1e3bfd7c49107b3fa91f748b5e2975",
            "gxId": "202009230000028,202009230000030,202009230000031,202009240000032,202009240000033,202009240000034",
            "idMap": {
              "sfzhm": "321281195010116822"
            },
            "label": "人员",
            "type": "ry_ry",
            "dxId": "202009220000010",
            "properties": {
              "姓名": "喻坚和",
              "身份证号码": "321281195010116822",
              "id": "202009240009614"
            },
            "lbProperties": {
              "姓名": "喻坚和",
              "身份证号码": "321281195010116822"
            },
            "mxProperties": {
              "姓名": "喻坚和",
              "婚姻状况": null,
              "民族": "汉族",
              "经济状况": null,
              "文化程度": null,
              "籍贯详址": "469027",
              "与户主关系": "儿子",
              "身份证号码": "321281195010116822",
              "国籍": "中国",
              "id": "202009240009614",
              "户号": "97113659"
            }
          },
          {
            "id": "4a74cc49ff3d667f8c81a7085b44f88a",
            "gxId": "202009230000028,202009230000030,202009230000031,202009240000032,202009240000033,202009240000034",
            "idMap": {
              "sfzhm": "321102198202055350"
            },
            "label": "人员",
            "type": "ry_ry",
            "dxId": "202009220000010",
            "properties": {
              "姓名": "喻峰",
              "身份证号码": "321102198202055350",
              "id": "202009240009605"
            },
            "lbProperties": {
              "姓名": "喻峰",
              "身份证号码": "321102198202055350"
            },
            "mxProperties": {
              "姓名": "喻峰",
              "婚姻状况": null,
              "民族": "汉族",
              "经济状况": null,
              "文化程度": null,
              "籍贯详址": "321112",
              "与户主关系": "父亲",
              "身份证号码": "321102198202055350",
              "国籍": "中国",
              "id": "202009240009605",
              "户号": "97113659"
            }
          },
          {
            "id": "3d8d2ce01e3a71734c33f15733423045",
            "gxId": "202009230000028,202009230000030,202009230000031,202009240000032,202009240000033,202009240000034",
            "idMap": {
              "sfzhm": "321182197812283921"
            },
            "label": "人员",
            "type": "ry_ry",
            "dxId": "202009220000010",
            "properties": {
              "姓名": "禹永",
              "身份证号码": "321182197812283921",
              "id": "202009240009608"
            },
            "lbProperties": {
              "姓名": "禹永",
              "身份证号码": "321182197812283921"
            },
            "mxProperties": {
              "姓名": "禹永",
              "婚姻状况": null,
              "民族": "汉族",
              "经济状况": null,
              "文化程度": null,
              "籍贯详址": "500109",
              "与户主关系": "母亲",
              "身份证号码": "321182197812283921",
              "国籍": "中国",
              "id": "202009240009608",
              "户号": "97113659"
            }
          },
          {
            "id": "d5d81747b3bb43d7405138ce47cef2c0",
            "gxId": "202009230000028,202009230000030,202009230000031,202009240000032,202009240000033,202009240000034",
            "idMap": {
              "sfzhm": "32120219920617869X"
            },
            "label": "人员",
            "type": "ry_ry",
            "dxId": "202009220000010",
            "properties": {
              "姓名": "喻飞彬",
              "身份证号码": "32120219920617869X",
              "id": "202009240009611"
            },
            "lbProperties": {
              "姓名": "喻飞彬",
              "身份证号码": "32120219920617869X"
            },
            "mxProperties": {
              "姓名": "喻飞彬",
              "婚姻状况": null,
              "民族": "汉族",
              "经济状况": null,
              "文化程度": null,
              "籍贯详址": "321203",
              "与户主关系": "儿子",
              "身份证号码": "32120219920617869X",
              "国籍": "中国",
              "id": "202009240009611",
              "户号": "97113659"
            }
          },
          {
            "id": "75bb003cd0d0eb2f8e402120680f9b69",
            "gxId": "202009230000028,202009230000030,202009230000031,202009240000032,202009240000033,202009240000034",
            "idMap": {
              "sfzhm": "50010520040928163X"
            },
            "label": "人员",
            "type": "ry_ry",
            "dxId": "202009220000010",
            "properties": {
              "姓名": "喻广志",
              "身份证号码": "50010520040928163X",
              "id": "202009240009617"
            },
            "lbProperties": {
              "姓名": "喻广志",
              "身份证号码": "50010520040928163X"
            },
            "mxProperties": {
              "姓名": "喻广志",
              "婚姻状况": null,
              "民族": "汉族",
              "经济状况": null,
              "文化程度": null,
              "籍贯详址": "469031",
              "与户主关系": "女儿",
              "身份证号码": "50010520040928163X",
              "国籍": "中国",
              "id": "202009240009617",
              "户号": "97113659"
            }
          },
          {
            "idMap": {
              "cp_bh": "川A12344"
            },
            "dxId": "c3eb6ebf3ae8cc412b2dee5e4857a1db",
            "id": "1600937793615",
            "label": "嫌疑人车辆",
            "type": "ry_ry",
            "lbProperties": {},
            "properties": {
              "车牌号": "川A12344"
            }
          }
        ],
        "links": [
          {
            "sourceEntityId": "3d8d2ce01e3a71734c33f15733423045",
            "targetEntityId": "75bb003cd0d0eb2f8e402120680f9b69",
            "id": "202009240000034",
            "label": "同火车"
          },
          {
            "id": "202009230000028",
            "label": "父子",
            "type": "ypgx_shgx",
            "direction": "SX",
            "sourceEntityId": "4a74cc49ff3d667f8c81a7085b44f88a",
            "targetEntityId": "d5d81747b3bb43d7405138ce47cef2c0",
            "properties": "喻峰（321102198202055350）是喻飞彬（32120219920617869X）的���亲"
          },
          {
            "id": "202009230000028",
            "label": "父子",
            "type": "ypgx_shgx",
            "direction": "SX",
            "sourceEntityId": "4a74cc49ff3d667f8c81a7085b44f88a",
            "targetEntityId": "af1e3bfd7c49107b3fa91f748b5e2975",
            "properties": "喻峰（321102198202055350）是喻坚和（321281195010116822）的父亲"
          },
          {
            "id": "202009230000031",
            "label": "配偶",
            "type": "ypgx_shgx",
            "direction": "SX",
            "sourceEntityId": "4a74cc49ff3d667f8c81a7085b44f88a",
            "targetEntityId": "3d8d2ce01e3a71734c33f15733423045",
            "properties": ""
          },
          {
            "id": "202009240000032",
            "label": "父女",
            "type": "ypgx_shgx",
            "direction": "SX",
            "sourceEntityId": "4a74cc49ff3d667f8c81a7085b44f88a",
            "targetEntityId": "75bb003cd0d0eb2f8e402120680f9b69",
            "properties": ""
          },
          {
            "sourceEntityId": "d5d81747b3bb43d7405138ce47cef2c0",
            "targetEntityId": "1600937793615",
            "id": "1600937803562",
            "label": "拥有"
          }
        ]
      },
      code: 0
    }
  }
};
