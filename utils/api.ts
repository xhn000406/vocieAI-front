/**
 * API 配置
 */

import { Platform } from 'react-native';

// 开发环境使用本地 IP，生产环境使用实际域名
const getApiBaseUrl = () => {
  if (__DEV__) {
    // 开发环境：根据平台选择地址
    // iOS 模拟器: localhost
    // Android 模拟器: 10.0.2.2 (Android模拟器的特殊IP，指向宿主机)
    // 真机测试: 需要修改为电脑的局域网 IP (Windows: ipconfig, macOS/Linux: ifconfig)
    const isAndroid = Platform.OS === 'android';
    console.log('isAndroid', isAndroid);
    return isAndroid 
      ? 'http://10.0.2.2:3000/api'  // Android 模拟器
      : 'http://localhost:3000/api'; // iOS 模拟器或真机（真机需要修改为实际IP）
  }
  return 'https://your-production-api.com/api';
};

export const API_BASE_URL = getApiBaseUrl();

// 创建 axios 实例（如果使用 axios）
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加 token
apiClient.interceptors.request.use(
  async (config) => {
    // 从 AsyncStorage 获取 token
    const { storage } = await import('./storage');
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('Network Error:', error.request);
    } else {
      // 其他错误
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

