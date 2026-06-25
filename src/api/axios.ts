import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { getToken, clearToken } from '../lib/token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleUnauthorized = (error: AxiosError) => {
  if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
    clearToken();
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

const unwrapData = <T>(response: AxiosResponse<T>) => response.data;

api.interceptors.response.use(
  unwrapData,
  handleUnauthorized
);

export default api;