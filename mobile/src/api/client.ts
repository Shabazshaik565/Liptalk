import axios from 'axios';
import { useAuthStore } from '../store/auth.store';
import { secureStorage } from '../utils/secureStorage';
import { parseApiError } from '../utils/errorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
