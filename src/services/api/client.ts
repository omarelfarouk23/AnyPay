// src/services/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../../config/endpoints';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// إضافة interceptor للتوكن تلقائياً (سيتم تعيينه من auth service)
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = (): string | null => authToken;

// معالجة أخطاء موحدة
export const handleApiError = (error: unknown): { message: string; code?: string } => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data;
    if (data && typeof data === 'object' && 'message' in data) {
      return { message: (data as { message: string }).message };
    }
    if (axiosError.response) {
      return { message: `خطأ الخادم (${axiosError.response.status})` };
    }
    if (axiosError.request) {
      return { message: 'لا يمكن الاتصال بالخادم، تحقق من الاتصال بالإنترنت.' };
    }
    return { message: axiosError.message || 'حدث خطأ غير متوقع' };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'حدث خطأ غير متوقع' };
};

export default apiClient;
