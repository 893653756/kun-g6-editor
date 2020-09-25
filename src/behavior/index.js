/**
 * 自定义交互模型
 */
import G6 from '@antv/g6';
import addEdge from './add-edge';

const behaviors = {
  'add-edge': addEdge,
};

/**
 * 注册
 */
Object.entries(behaviors).forEach(v => {
  G6.registerBehavior(v[0], v[1]);
});
