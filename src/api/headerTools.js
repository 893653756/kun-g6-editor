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
  const content = { "nodes": [{ "id": "6b79164379b306ce0b45eef7715b046f", "label": "花良海\n500111197209292409", "type": "circle-image", "img": "/entityImages/ry_jtry.png", "cellInfo": { "id": "6b79164379b306ce0b45eef7715b046f", "gxId": "202009250000037", "idMap": { "sfzhm": "500111197209292409" }, "label": "儿子", "type": "ry_jtry", "dxId": "202009250000018", "properties": { "姓名": "花良海", "身份证号码1": "500111197209292409" }, "lbProperties": { "姓名": "花良海", "身份证号码1": "500111197209292409" }, "mxProperties": { "姓名": "花良海", "身份证号码1": "500111197209292409" }, "tab": "ry_jcxx" }, "style": {}, "itemType": "node", "__type": "circle-image", "x": 265.5156261707941, "y": 129.67705563985547, "index": 0, "vy": 0.0024928746724552416, "vx": 0.003098352156516054 }, { "id": "8a07934d0fe3393db95a39fb60916558", "label": "朱康星\n321284198003196329", "type": "circle-image", "img": "/entityImages/ry_jtry.png", "cellInfo": { "id": "8a07934d0fe3393db95a39fb60916558", "gxId": "202009250000035", "idMap": { "sfzhm": "321284198003196329" }, "label": "母亲", "type": "ry_jtry", "dxId": "202009250000017", "properties": { "姓名": "朱康星", "身份证号码": "321284198003196329" }, "lbProperties": { "姓名": "朱康星", "身份证号码": "321284198003196329" }, "mxProperties": { "姓名": "朱康星", "身份证号码": "321284198003196329" }, "tab": "ry_jcxx" }, "style": {}, "itemType": "node", "__type": "circle-image", "x": 475.86183885745874, "y": 80.30238849971063, "index": 1, "vy": 0.000403572439555214, "vx": 0.003826227384834775 }, { "id": "18ee6456104bd541c86ac7ff6d62adff", "label": "雄琛\n202009250009842\n321284199806296029", "type": "circle-image", "img": "/entityImages/ry_ry.png", "cellInfo": { "id": "18ee6456104bd541c86ac7ff6d62adff", "gxId": "202009250000036", "idMap": { "sfzhm": "321284199806296029" }, "label": "人员", "type": "ry_ry", "dxId": "202009250000016", "properties": { "姓名": "雄琛", "id": "202009250009842", "身份证号码": "321284199806296029" }, "lbProperties": { "姓名": "雄琛", "身份证号码": "321284199806296029" }, "mxProperties": { "姓名": "雄琛", "身份证号码": "321284199806296029" }, "tab": "ry_jcxx" }, "style": {}, "itemType": "node", "__type": "circle-image", "x": 487.97035951195323, "y": 193.96249404220734, "index": 2, "vy": -0.00020059763731698898, "vx": -0.000675774710871017 }, { "id": "1420ff3e88109e388ede701834a53eee", "label": "秦建家\n202009250009830\n50010619760312308X", "type": "circle-image", "img": "/entityImages/ry_ry.png", "cellInfo": { "id": "1420ff3e88109e388ede701834a53eee", "gxId": "202009250000036", "idMap": { "sfzhm": "50010619760312308X" }, "label": "人员", "type": "ry_ry", "dxId": "202009250000016", "properties": { "姓名": "秦建家", "id": "202009250009830", "身份证号码": "50010619760312308X" }, "lbProperties": { "姓名": "秦建家", "身份证号码": "50010619760312308X" }, "mxProperties": { "姓名": "秦建家", "身份证号码": "50010619760312308X" }, "tab": "ry_jcxx" }, "style": {}, "itemType": "node", "__type": "circle-image", "x": 293.27471848457657, "y": 293.66312397792376, "index": 5, "vy": 0.0005248439095656358, "vx": -0.00047962885604097905 }], "edges": [{ "id": "8a07934d0fe3393db95a39fb60916558-6b79164379b306ce0b45eef7715b046f", "label": "母子", "cellInfo": { "id": "202009250000035", "label": "母子", "type": "ypgx_shgx", "direction": "SX", "sourceEntityId": "8a07934d0fe3393db95a39fb60916558", "targetEntityId": "6b79164379b306ce0b45eef7715b046f", "properties": "" }, "source": "8a07934d0fe3393db95a39fb60916558", "target": "6b79164379b306ce0b45eef7715b046f", "type": "quadratic", "itemType": "edge", "anchorPoints": [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]], "labelCfg": { "autoRotate": true, "fill": "#000000", "fontSize": 12 }, "color": "#b8c3ce", "style": { "selected": { "stroke": "#FF764A", "lineWidth": 3 }, "stroke": "#a3b1bf", "strokeOpacity": 0.9, "lineWidth": 2, "lineAppendWidth": 8, "endArrow": true }, "startPoint": { "x": 452.49689402174494, "y": 85.78685317951778 }, "endPoint": { "x": 288.8805710065079, "y": 124.19259096004832 } }, { "id": "6b79164379b306ce0b45eef7715b046f-18ee6456104bd541c86ac7ff6d62adff", "label": "同住", "cellInfo": { "id": "202009250000036", "label": "同住", "type": "ypgx_ntry", "direction": "SX", "sourceEntityId": "6b79164379b306ce0b45eef7715b046f", "targetEntityId": "18ee6456104bd541c86ac7ff6d62adff", "properties": "" }, "source": "6b79164379b306ce0b45eef7715b046f", "target": "18ee6456104bd541c86ac7ff6d62adff", "type": "line", "itemType": "edge", "anchorPoints": [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]], "labelCfg": { "autoRotate": true, "fill": "#000000", "fontSize": 12 }, "color": "#b8c3ce", "style": { "selected": { "stroke": "#FF764A", "lineWidth": 3 }, "stroke": "#a3b1bf", "strokeOpacity": 0.9, "lineWidth": 2, "lineAppendWidth": 8, "endArrow": true }, "startPoint": { "x": 288.5721933715709, "y": 136.33999109774973 }, "endPoint": { "x": 464.91379231117645, "y": 187.29955858431308 } }, { "id": "6b79164379b306ce0b45eef7715b046f-8a07934d0fe3393db95a39fb60916558", "label": "子母", "cellInfo": { "id": "202009250000037", "label": "子母", "type": "ypgx_shgx", "direction": "SX", "sourceEntityId": "6b79164379b306ce0b45eef7715b046f", "targetEntityId": "8a07934d0fe3393db95a39fb60916558", "properties": "" }, "source": "6b79164379b306ce0b45eef7715b046f", "target": "8a07934d0fe3393db95a39fb60916558", "type": "quadratic", "itemType": "edge", "anchorPoints": [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]], "labelCfg": { "autoRotate": true, "fill": "#000000", "fontSize": 12 }, "color": "#b8c3ce", "style": { "selected": { "stroke": "#FF764A", "lineWidth": 3 }, "stroke": "#a3b1bf", "strokeOpacity": 0.9, "lineWidth": 2, "lineAppendWidth": 8, "endArrow": true }, "startPoint": { "x": 288.8805710065079, "y": 124.19259096004832 }, "endPoint": { "x": 452.49689402174494, "y": 85.78685317951778 } }, { "id": "18ee6456104bd541c86ac7ff6d62adff-18ee6456104bd541c86ac7ff6d62adff", "label": "其他关系", "cellInfo": { "id": "202009270000038", "label": "其他关系", "type": "ypgx_shgx", "direction": "ZX", "sourceEntityId": "18ee6456104bd541c86ac7ff6d62adff", "targetEntityId": "18ee6456104bd541c86ac7ff6d62adff", "properties": "" }, "source": "18ee6456104bd541c86ac7ff6d62adff", "target": "18ee6456104bd541c86ac7ff6d62adff", "type": "line", "itemType": "edge", "anchorPoints": [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]], "labelCfg": { "autoRotate": true, "fill": "#000000", "fontSize": 12 }, "color": "#b8c3ce", "style": { "selected": { "stroke": "#FF764A", "lineWidth": 3 }, "stroke": "#a3b1bf", "strokeOpacity": 0.9, "lineWidth": 2, "lineAppendWidth": 8, "endArrow": true }, "startPoint": { "x": 487.97035951195323, "y": 193.96249404220734 }, "endPoint": { "x": 487.97035951195323, "y": 193.96249404220734 } }, { "id": "18ee6456104bd541c86ac7ff6d62adff-1420ff3e88109e388ede701834a53eee", "label": "其他关系", "cellInfo": { "id": "202009270000038", "label": "其他关系", "type": "ypgx_shgx", "direction": "ZX", "sourceEntityId": "18ee6456104bd541c86ac7ff6d62adff", "targetEntityId": "1420ff3e88109e388ede701834a53eee", "properties": "" }, "source": "18ee6456104bd541c86ac7ff6d62adff", "target": "1420ff3e88109e388ede701834a53eee", "type": "line", "itemType": "edge", "anchorPoints": [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]], "labelCfg": { "autoRotate": true, "fill": "#000000", "fontSize": 12 }, "color": "#b8c3ce", "style": { "selected": { "stroke": "#FF764A", "lineWidth": 3 }, "stroke": "#a3b1bf", "strokeOpacity": 0.9, "lineWidth": 2, "lineAppendWidth": 8, "endArrow": true }, "startPoint": { "x": 466.608360451575, "y": 204.90164374153943 }, "endPoint": { "x": 314.6367175449549, "y": 282.72397427859164 } }], "combos": [], "groups": [] }
  return {
    data: {
      content: JSON.stringify(content),
      code: 0,
      msg: '查询成功'
    }
  };
};

/**
 * 框架通过url传参获取每个类型的关系数据
 */
export function getRelationByDxType({ dxType, params = {} }) {
  return request.post(`${apiClues}/entities/links/findByDxType/${dxType}`, params)
};
