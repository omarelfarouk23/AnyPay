// src/services/api/client.ts
import axios, {AxiosInstance, AxiosError} from 'axios';
import {API_BASE_URL} from '../../config/endpoints';

export interface ApiError {
  kind: 'unauthorized' | 'server' | 'network' | 'unknown';
  message: string;
  statusCode?: number;
  code?: string;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

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

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data;
    if (data && typeof data === 'object' && 'message' in data) {
      const msg = (data as {message: string}).message;
      const code = (data as {code?: string}).code;
      return {
        kind:
          code === 'UNAUTHORIZED' || axiosError.response?.status === 401
            ? 'unauthorized'
            : axiosError.response
              ? 'server'
              : 'network',
        message: msg,
        statusCode: axiosError.response?.status,
        code,
      };
    }
    if (axiosError.response) {
      return {
        kind: 'server',
        message: `خطأ الخادم (${axiosError.response.status})`,
        statusCode: axiosError.response.status,
      };
    }
    if (axiosError.request) {
      return {
        kind: 'network',
        message: 'لا يمكن الاتصال بالخادم، تحقق من الاتصال بالإنترنت.',
      };
    }
    return {
      kind: 'unknown',
      message: axiosError.message || 'حدث خطأ غير متوقع',
    };
  }
  if (error instanceof Error) {
    return {kind: 'unknown', message: error.message};
  }
  return {kind: 'unknown', message: 'حدث خطأ غير متوقع'};
};

export class ApiErrorClass extends Error {
  readonly kind: ApiError['kind'];
  readonly statusCode?: number;
  readonly code?: string;
  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = 'ApiError';
    this.kind = apiError.kind;
    this.statusCode = apiError.statusCode;
    this.code = apiError.code;
  }
}

export default apiClient;
