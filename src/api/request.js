import axios from 'axios';
const defaultInstance = axios.create({
  timeout: 60000, // 60s超时,
  // baseURL: process.env.VUE_APP_BASE_API, // 接口前缀
  baseURL: window.baseUrlPath
});
export default defaultInstance;
