import dotenv from 'dotenv';
import { Platform } from 'react-native';

// Load environment variables based on platform
if (Platform.OS === 'web') {
  dotenv.config({ path: '.env.web' });
} else {
  dotenv.config({ path: '.env' });
}

// Environment configuration — all exposed via process.env.EXPO_PUBLIC_*
// Never hardcode secrets in source code
export const env = {
  // API
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.anypay.dz/v1',
  apiTimeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '15000', 10),

  // WebSocket
  wsUrl: process.env.EXPO_PUBLIC_WS_URL || 'wss://ws.anypay.dz',

  // Auth
  authRefreshThreshold: parseInt(process.env.EXPO_PUBLIC_AUTH_REFRESH_THRESHOLD || '300', 10),

  // Payments (placeholder — real keys from env)
  paymentProvider: process.env.EXPO_PUBLIC_PAYMENT_PROVIDER || 'local',

  // Push notifications
  fcmServerKey: process.env.EXPO_PUBLIC_FCM_SERVER_KEY || '',
  apnsTeamId: process.env.EXPO_PUBLIC_APNS_TEAM_ID || '',
  apnsBundleId: process.env.EXPO_PUBLIC_APNS_BUNDLE_ID || 'com.anypay.app',

  // App
  appVersion: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
};

// Type-safe access with fallback
export function getApiBaseUrl(): string {
  return env.apiBaseUrl;
}

export function getWsUrl(): string {
  return env.wsUrl;
}

export function isProduction(): boolean {
  return env.environment === 'production';
}
