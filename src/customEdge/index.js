/**
 * 自定义连线
 */
import G6 from '@antv/g6';
import dashedLine from './dashed-line';

const edges = {
  'dashed-line': dashedLine,
};

Object.entries(edges).forEach(v => {
  G6.registerEdge(v[0], v[1]);
});
