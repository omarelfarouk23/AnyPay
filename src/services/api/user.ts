// src/services/api/user.ts
import { apiClient, handleApiError } from './client';
import type { User } from '../../types/user';

export const userService = {
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const res = await apiClient.patch<User>('/user/profile', data);
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  async updateSettings(data: { language?: string; notifications?: boolean }): Promise<void> {
    try {
      await apiClient.patch('/user/settings', data);
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },
};
