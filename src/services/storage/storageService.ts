// src/services/storage/storageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN: '@anypay_auth_token',
  USER_DATA: '@anypay_user',
  LANGUAGE: '@anypay_language',
  ONBOARDING_SEEN: '@anypay_onboarding_seen',
  PUSH_TOKEN: '@anypay_push_token',
};

export const storageService = {
  async setString(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('[Storage] Error setting item:', error);
    }
  },

  async getString(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('[Storage] Error getting item:', error);
      return null;
    }
  },

  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('[Storage] Error setting object:', error);
    }
  },

  async getObject<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[Storage] Error getting object:', error);
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('[Storage] Error removing item:', error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[Storage] Error clearing all:', error);
    }
  },

  // Auth helpers
  async saveAuthToken(token: string): Promise<void> {
    await this.setString(KEYS.AUTH_TOKEN, token);
  },

  async getAuthToken(): Promise<string | null> {
    return this.getString(KEYS.AUTH_TOKEN);
  },

  async saveUser(user: unknown): Promise<void> {
    await this.setObject(KEYS.USER_DATA, user);
  },

  async getUser(): Promise<unknown | null> {
    return this.getObject<unknown>(KEYS.USER_DATA);
  },

  async clearAuth(): Promise<void> {
    await this.remove(KEYS.AUTH_TOKEN);
    await this.remove(KEYS.USER_DATA);
  },

  // Settings
  async saveLanguage(lang: string): Promise<void> {
    await this.setString(KEYS.LANGUAGE, lang);
  },

  async getLanguage(): Promise<string | null> {
    return this.getString(KEYS.LANGUAGE);
  },

  async savePushToken(token: string): Promise<void> {
    await this.setString(KEYS.PUSH_TOKEN, token);
  },

  async getPushToken(): Promise<string | null> {
    return this.getString(KEYS.PUSH_TOKEN);
  },
};
