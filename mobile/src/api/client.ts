import axios from 'axios';
import { useAuthStore } from '../store/auth.store';
import { secureStorage } from '../utils/secureStorage';
import { parseApiError } from '../utils/errorHandler';

const getApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined' && window.location?.hostname) {
    if (window.location.port === '8080' || window.location.protocol === 'https:') {
      return `${window.location.protocol}//${window.location.host}/api/v1`;
    }
    return `http://${window.location.hostname}:3000/api/v1`;
  }
  return 'http://localhost:3000/api/v1';
};

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  let token = useAuthStore.getState().token;
  if (!token) {
    token = await secureStorage.getToken();
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await useAuthStore.getState().logout();
    }
    const appError = parseApiError(error);
    return Promise.reject(appError);
  }
);
