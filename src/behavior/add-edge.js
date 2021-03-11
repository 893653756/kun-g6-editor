/**
 * 自定义连线
 */
export default {
  getEvents() {
    return {
      mousemove: 'onMousemove',
      mouseup: 'onMouseup',
    }
  },
  onMousemove(e) {
    const item = e.item;
    if (!this.edge) {
      // 画线
      this.startItem = item;
      this.edge = this.graph.addItem('edge', {
        source: item,
        target: item,
        type: 'dashed-line',
        id: `dashed-line-${Date.now()}`
      });
    } else {
      // 更新连线
      if (this.edge) {
        this.graph.updateItem(this.edge, {
          target: {
            x: e.x,
            y: e.y
          }
        })
      }
    }
  },
  onMouseup(e) {
    if (!this.startItem) {
      return;
    }
    this.graph.setMode('default');
    const targetItem = e.item;
    if (targetItem === this.startItem) {
      this.graph.removeItem(this.edge);
      this.graph.setItemState(this.startItem, 'hover', false);
      this.graph.setMode('default');
      this.edge = null;
      this.startItem = null;
      return;
    }
    if (targetItem && targetItem.getType() === 'node') {
      if (this.edge) {
        // 如果目标节点是锁定状态
        if (!targetItem.hasLocked()) {
          this.graph._addEdge && this.graph._addEdge({
            id: `${this.startItem._cfg.id}-${targetItem._cfg.id}`,
            source: this.startItem,
            target: targetItem,
            // type: 'quadratic', // 二次贝塞尔曲线
          })
        }
      }
    }
    if (this.edge) {
      this.graph.removeItem(this.edge);
    }
    this.graph.setItemState(this.startItem, 'hover', false);
    this.graph.setMode('default');
    this.edge = null;
    this.startItem = null;
  },
};
