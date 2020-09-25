module.exports = {
  productionSourceMap: process.env.NODE_ENV === 'development',
  devServer: {
    host: '0.0.0.0',
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // 后端服务
        target: process.env.VUE_PROXY_TARGET || '/',
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_API}`]: '',
        },
      },
    },
  },
};
