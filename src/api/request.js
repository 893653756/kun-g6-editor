import axios from 'axios';
import { MessageBox } from 'element-ui';
const defaultInstance = axios.create({
  timeout: 60000, // 60s超时,
  // baseURL: process.env.VUE_APP_BASE_API, // 接口前缀
  baseURL: window.baseUrlPath
});

// 请求拦截器
const requestInterceptors = [];

// 设置Token
requestInterceptors.push(config => {
  const {
    headers,
    url,
  } = config;
  const token = window.access_token || localStorage.getItem('token');
  if (token) {
    config.headers = headers ? {
      ...headers,
      Authorization: `Bearer ${token}`
    } : {
        Authorization: `Bearer ${token}`
      };
    return config;
  }
  return config;
});

requestInterceptors.forEach(interceptor => {
  defaultInstance.interceptors.request.use(interceptor);
});


// 响应拦截器
defaultInstance.interceptors.response.use(
  response => {
    return response;
  },
  async (error) => {
    if (error.message.includes('timeout')) {
      console.warn('请求超时');
      const config = error.config;
      // 弹框
      try {
        await MessageBox.confirm("请求超时, 是否重新请求?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        return defaultInstance(config);
      } catch (error) {
        return Promise.resolve({
          data: {
            code: -1,
            msg: '请求已取消'
          }
        })
      }
    }
  }
);
export default defaultInstance;
