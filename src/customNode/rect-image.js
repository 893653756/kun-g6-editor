/**
 * 图片, 文本, 锚点
 */
export default {
  getSize(cfg) {
    const size = cfg.size;
    if (typeof size === 'number') {
      return [size, size];
    } else if (Array.isArray(size)) {
      return size;
    } else {
      return [40, 40];
    }
  },
  draw(cfg, group) {
    console.warn('cfg', cfg);
    const size = this.getSize(cfg);
    const width = size[0];
    const height = size[1];
    const offsetX = (- width / 2);
    const offsetY = (- height / 2);
    cfg.itemType = 'node';
    cfg.__type = cfg.type;
    const keyShape = group.addShape('rect', {
      attrs: {
        id: 'rect' + cfg.id,
        x: offsetX,
        y: offsetY,
        width: width,
        height: height,
        stroke: "#ffffff",
        lineWidth: 2,
        fill: '#ffffff',//此处必须有fill 不然不能触发事件
        cursor: 'move',
      },
      name: 'node-rect',
      draggable: true,
      item: cfg.item,
    });
    const imgWidth = width - 8;
    const imgHeight = height - 8;
    group.addShape('image', {
      attrs: {
        id: 'image' + cfg.id,
        x: - imgWidth / 2,
        y: - imgHeight / 2,
        width: imgWidth,
        height: imgHeight,
        img: cfg.img,
        cursor: 'move',
      },
      name: 'reac-image',
      draggable: true,
    });
    // 添加文本
    if (cfg.label) {
      group.addShape('text', {
        attrs: {
          id: 'text' + cfg.id,
          text: cfg.label,
          fontSize: 12,
          y: width / 2 + 10,
          textAlign: 'center',
          fill: '#000000',
          textBaseline: 'top'
        },
        name: 'rect-text'
      })
    }
    // 添加锚点
    const anchorPoints = cfg.anchorPoints || [
      [0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]
    ];
    anchorPoints.forEach((point, index) => {
      const x = width * point[0] + offsetX;
      const y = height * point[1] + offsetY;
      group.addShape('circle', {
        attrs: {
          id: `circle-${index}-${cfg.id}`,
          r: 3,
          x: x,
          y: y,
          isAnchor: true,
          fill: "#eeeeee",
          stroke: '#1890ff',
          opacity: 0,
          cursor: 'crosshair'
        }
      })
    })
    return keyShape;
  },
  // 状态改变
  setState(name, value, item) {
    const group = item.getContainer();
    const circles = group.findAll(c => c.attrs.isAnchor);
    // 锚点显示隐藏
    function circlesOpacity(value) {
      const val = value ? 1 : 0;
      circles.forEach(c => {
        c.attr('opacity', val);
      })
    }
    // 选择变换背景色
    function selectedFill() {
      const shape = group.get("children")[0];
      const color = value ? '#ffa500' : '#ffffff';
      shape.attr('fill', color);
    }
    // 添加边框
    function addStroke(value) {
      const shape = group.get("children")[0];
      // const color = value ? '#ced4d9' : '#ffffff';
      const color = value ? '#00ffff' : '#ffffff';
      shape.attr('stroke', color);
    }
    if (name === 'hover') {
      circlesOpacity(value);
    } else if (name === 'selected') {
      selectedFill(value);
    } else if (name === 'click') {
      addStroke(value)
    }
  }
};
