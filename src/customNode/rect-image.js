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
        // stroke: "#ffffff",
        lineWidth: 2,
        fill: '#ffffff',//此处必须有fill 不然不能触发事件
        fillOpacity: 0.1,
        cursor: 'move',
      },
      name: 'node-rect',
      draggable: true,
      item: cfg.item,
    });
    const imgWidth = width - 4;
    const imgHeight = height - 4;
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
    // 锁
    group.addShape('image', {
      attrs: {
        id: 'lock' + cfg.id,
        x: 0,
        y: 0,
        width: parseInt(width / 2),
        height: parseInt(height / 2),
        img: '',
      },
      name: 'lock-image',
    });
    // 添加文本
    if (cfg.label) {
      group.addShape('text', {
        attrs: {
          id: 'text' + cfg.id,
          text: cfg.label,
          fontSize: 12,
          y: width / 2 + 6,
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
  afterDraw(cfg, group) {
    if (!cfg.emphasize) {
      return;
    }
    console.warn('cfg111', cfg);
    const shape = group.get("children")[0];
    let r = shape.attr('width') / 2;
    // 第一个背景圆
    const back1 = group.addShape('circle', {
      zIndex: -3,
      attrs: {
        x: 0,
        y: 0,
        r,
        fill: '#ffffff',
        opacity: 0.6
      },
      // must be assigned in G6 3.3 and later versions. it can be any value you want
      name: 'circle-shape1'
    });
    // 第二个背景圆
    const back2 = group.addShape('circle', {
      zIndex: -2,
      attrs: {
        x: 0,
        y: 0,
        r,
        fill: 'blue', // 为了显示清晰，随意设置了颜色
        opacity: 0.6
      },
      // must be assigned in G6 3.3 and later versions. it can be any value you want
      name: 'circle-shape2'
    });
    // 第三个背景圆
    const back3 = group.addShape('circle', {
      zIndex: -1,
      attrs: {
        x: 0,
        y: 0,
        r,
        fill: 'green',
        opacity: 0.6
      },
      // must be assigned in G6 3.3 and later versions. it can be any value you want
      name: 'circle-shape3'
    });
    group.sort(); // 排序，根据 zIndex 排序

    // 第一个背景圆逐渐放大，并消失
    back1.animate({
      r: r + 10,
      opacity: 0.1
    }, {
      repeat: true, // 循环
      duration: 3000,
      easing: 'easeCubic',
      delay: 0 // 无延迟
    })

    // 第二个背景圆逐渐放大，并消失
    back2.animate({
      r: r + 10,
      opacity: 0.1
    }, {
      repeat: true, // 循环
      duration: 3000,
      easing: 'easeCubic',
      delay: 1000 // 1 秒延迟
    }) // 1 秒延迟

    // 第三个背景圆逐渐放大，并消失
    back3.animate({
      r: r + 10,
      opacity: 0.1
    }, {
      repeat: true, // 循环
      duration: 3000,
      easing: 'easeCubic',
      delay: 2000 // 2 秒延迟
    })
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
    function selectedFill(value) {
      const shape = group.get("children")[0];
      const color = value ? '#ffa500' : '#ffffff';
      const fillOpacity = value ? 0.8 : 0.1;
      shape.attr({
        fill: color,
        fillOpacity
      })
    }
    // 添加边框
    function addStroke(value) {
      const shape = group.get("children")[0];
      // const color = value ? '#ced4d9' : '#ffffff';
      const color = value ? '#00ffff' : '#ffffff';
      shape.attr('stroke', color);
    }
    function isShowLock(value) {
      const shape = group.get("children")[2];
      console.warn('shape', shape)
      const img = value ? '/entityImages/dz_dz.png' : '';
      shape.attr('img', img);
    }
    if (name === 'hover') {
      circlesOpacity(value);
    } else if (name === 'selected') {
      selectedFill(value);
    } else if (name === 'click') {
      addStroke(value)
    } else if (name === 'lock') {
      isShowLock(value);
    }
  }
};
