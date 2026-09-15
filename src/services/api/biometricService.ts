// src/services/api/biometricService.ts
// Device biometric authentication (fingerprint, face ID)
import * as LocalAuthentication from 'expo-local-authentication';
import { apiClient, handleApiError } from './client';
import type { User } from '../../types/user';

export const biometricService = {
  /**
   * Check if biometric authentication is available on the device
   */
  async isAvailable(): Promise<{ available: boolean; types: string[] }> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return { available: false, types: [] };
      }

      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const typeNames = types.map(t =>
        t === LocalAuthentication.AuthenticationType.FINGERPRINT ? 'بصمة الإصبع' :
        t === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION ? 'التعرف على الوجه' :
        'PIN'
      );

      return { available: true, types: typeNames };
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  /**
   * Authenticate the user with biometrics
   */
  async authenticate(): Promise<{ authenticated: boolean; userId?: string }> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return { authenticated: false };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'أكد هويتك للدخول',
        cancelLabel: 'إلغاء',
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Get the authenticated user from the backend
        const user = await apiClient.get<User>('/auth/biometric');
        return { authenticated: true, userId: user.data.id };
      }

      return { authenticated: false };
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  /**
   * Enable biometric authentication for the user account
   */
  async enableBiometric(): Promise<{ enabled: boolean }> {
    try {
      const res = await apiClient.post('/auth/biometric/enable');
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  /**
   * Disable biometric authentication for the user account
   */
  async disableBiometric(): Promise<{ enabled: boolean }> {
    try {
      const res = await apiClient.post('/auth/biometric/disable');
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  /**
   * Check if biometric auth is enabled for the current account
   */
  async isBiometricEnabled(): Promise<{ enabled: boolean }> {
    try {
      const res = await apiClient.get('/auth/biometric/status');
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },
};
