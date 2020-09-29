/**
 * 自定义节点
 */
import G6 from '@antv/g6';
import circleImage from './circle-image';

const nodes = {
  'circle-image': circleImage,
};

Object.entries(nodes).forEach(v => {
  G6.registerNode(v[0], v[1]);
});
