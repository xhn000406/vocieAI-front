/**
 * API 配置 - 使用 React Native 内置的 fetch API
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

// 使用 fetch API 替代 axios（React Native 内置，无需额外依赖）
class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const { storage } = await import('./storage');
    const token = await storage.getToken();
    const headers = { ...this.defaultHeaders };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP Error: ${response.status} ${response.statusText}`,
        }));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('API Error:', error.message);
        throw error;
      }
      console.error('Network Error:', error);
      throw new Error('Network request failed');
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// 创建 API 客户端实例
export const apiClient = new ApiClient(API_BASE_URL);
