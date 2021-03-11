const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
  // gzip 配置
  // configureWebpack: () => {
  //   if (process.env.NODE_ENV === 'production') {
  //     // 生产环境
  //     return {
  //       plugins: [new CompressionWebpackPlugin({
  //         test: /\.js$|\.html$|\.css/,    // 匹配文件名
  //         threshold: 1024 * 5,               // 文件压缩阈值，对超过10k的进行压缩
  //         deleteOriginalAssets: true// 是否删除源文件
  //       })]
  //     }
  //   }
  // },
  // transpileDependencies: ['@antv/g6'],
  // productionSourceMap: process.env.NODE_ENV === 'development',
  productionSourceMap: true,
  devServer: {
    port: 3000,
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
