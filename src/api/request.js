import axios from 'axios';
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
  const token = localStorage.getItem('token');
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

export default defaultInstance;
