// src/services/api/auth.ts
import { apiClient, setAuthToken, getAuthToken, handleApiError } from './client';
import type { User } from '../../types/user';

export interface SendOTPRequest {
  phone: string;
}

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

export interface SendOTPResponse {
  success: boolean;
  message?: string;
}

export interface VerifyOTPResponse {
  user: User;
  token: string;
}

export const authService = {
  async sendOTP(phone: string): Promise<SendOTPResponse> {
    try {
      const res = await apiClient.post<SendOTPResponse>('/auth/send-otp', { phone });
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  async verifyOTP(phone: string, otp: string): Promise<VerifyOTPResponse> {
    try {
      const res = await apiClient.post<VerifyOTPResponse>('/auth/verify-otp', { phone, otp });
      setAuthToken(res.data.token);
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  async getCurrentUser(): Promise<User> {
    const token = getAuthToken();
    if (!token) throw new Error('غير مسجل الدخول');
    try {
      const res = await apiClient.get<User>('/auth/me');
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      setAuthToken(null);
    }
  },
};
