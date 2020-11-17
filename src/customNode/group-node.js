/**
 * 图片, 文本
 */

export default {
  getSize(cfg) {
    const size = cfg.size;
    if (typeof size === 'number') {
      return size;
    } else if (Array.isArray(size)) {
      return size[0];
    } else {
      return 24;
    }
  },
  draw(cfg, group) {
    const r = this.getSize(cfg);
    cfg.itemType = 'node';
    cfg.__type = cfg.type;
    group.addShape('circle', {
      zIndex: 1,
      attrs: {
        id: 'circle' + cfg.id,
        r: r,
        // stroke: "#ffffff",
        lineDash: [2, 2],
        lineWidth: 2,
        fill: '#ffffff',//此处必须有fill 不然不能触发事件
        fillOpacity: 0.1,
        cursor: 'move',
      },
      name: 'node-circle',
      draggable: true,
      item: cfg.item,
    });
    const imgWidth = 2 * r - 10;
    const imgHeight = 2 * r - 10;
    const keyShape = group.addShape('image', {
      attrs: {
        id: 'image' + cfg.id,
        x: - imgWidth / 2,
        y: - imgHeight / 2,
        width: imgWidth,
        height: imgHeight,
        img: cfg.img,
        cursor: 'move',
      },
      name: 'circle-image',
      draggable: true,
    });
    // 添加组标签
    group.addShape('circle', {
      attrs: {
        id: 'group-bg' + cfg.id,
        r: 8,
        x: -r / 2,
        y: -r / 2,
        fill: '#67C23A',//此处必须有fill 不然不能触发事件
      },
      name: 'group-bg',
      draggable: true,
    });
    const rr = 10;
    group.addShape('image', {
      attrs: {
        id: 'group-icon' + cfg.id,
        x: -(r / 2 + rr / 2),
        y: -(r / 2 + rr / 2),
        width: rr,
        height: rr,
        img: `${window.baseImagePath}/entityImages/group-icon.png`,
      },
      name: 'group-icon',
      draggable: true,
    });
    // 添加文本
    return keyShape;
  },
  afterDraw(cfg, group) {
    const shape = group.get("children")[0];
    // console.warn('afterDraw', cfg)
    let r = shape.attr('r');
    if (cfg.emphasize) {
      // 第一个背景圆
      const back1 = group.addShape('circle', {
        zIndex: -3,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: '#FF764A',
          opacity: 0.6,
          cursor: 'move',
        },
        name: 'circle-shape1',
        draggable: true,
      });
      // 第一个背景圆逐渐放大，并消失
      back1.animate({
        r: r + 10,
        opacity: 0.1
      }, {
        repeat: true, // 循环
        duration: 2000,
        easing: 'easeCubic',
        delay: 0 // 无延迟
      });
    }
    if (cfg.lock) {
      // 锁
      const imgWidth = 2 * r - 4;
      const imgHeight = 2 * r - 4;
      group.addShape('image', {
        attrs: {
          x: - imgWidth / 2,
          y: - imgHeight / 2,
          width: imgWidth,
          height: imgHeight,
          img: `${window.baseImagePath}/entityImages/lock.png`,
        },
        name: 'lock-image',
      });
    }
  },
  // 状态改变
  setState(name, value, item) {
    const group = item.getContainer();
    // 选择变换背景色
    function selectedFill(value) {
      const shape = group.get("children")[0];
      const color = value ? '#ffa500' : '#ffffff';
      const fillOpacity = value ? 0.7 : 0.1;
      shape.attr({
        fill: color,
        fillOpacity
      })
    }
    // 添加边框
    function addStroke(value) {
      const shape = group.get("children")[0];
      // const color = value ? '#ced4d9' : '#ffffff';
      const color = value ? '#FF764A' : '#ffffff';
      shape.attr('stroke', color);
    }
    if (name === 'selected') {
      selectedFill(value);
    } else if (name === 'click') {
      addStroke(value)
    }
  }
};
