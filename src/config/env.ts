// src/config/env.ts
// SECURITY: This file defines client-side environment variables.
// CRITICAL: NEVER store server-side secrets (FCM server keys, APNs private keys,
// database credentials, payment provider secrets) in EXPO_PUBLIC_* variables.
// They are embedded in the client bundle and can be extracted by anyone.
// Server-side secrets must be accessed ONLY from your backend API.
import { Platform } from 'react-native';

// SECURITY WARNING: dotenv is not recommended for Expo apps.
// Use app.json "extra" or expo-constants for env management instead.
// The code below uses process.env.EXPO_PUBLIC_* which Expo injects at build time.

// Environment configuration — all exposed via process.env.EXPO_PUBLIC_*
// These values are baked into the client bundle at build time.
export const env = {
  // API — must be HTTPS in production
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.anypay.dz/v1',
  apiTimeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '15000', 10),

  // WebSocket — must be WSS in production
  wsUrl: process.env.EXPO_PUBLIC_WS_URL || 'wss://ws.anypay.dz',

  // Auth
  authRefreshThreshold: parseInt(process.env.EXPO_PUBLIC_AUTH_REFRESH_THRESHOLD || '300', 10),

  // Payments — only the provider name goes here, never API keys
  paymentProvider: process.env.EXPO_PUBLIC_PAYMENT_PROVIDER || 'local',

  // SECURITY: FCM server keys and APNs team IDs are SERVER-ONLY secrets.
  // They must NOT be in EXPO_PUBLIC_* variables (which are in the client bundle).
  // Remove these and access them from your backend API instead.
  // If they exist in .env for testing, they will NOT be included in the build.
  // fcmServerKey: process.env.EXPO_PUBLIC_FCM_SERVER_KEY, // REMOVED - server-side only
  // apnsTeamId: process.env.EXPO_PUBLIC_APNS_TEAM_ID,     // REMOVED - server-side only

  // App metadata (safe to expose)
  appVersion: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',

  // Google Maps
  googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSy-your-google-maps-api-key',

  // Cloudinary
  cloudinaryCloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || 'p59obpkz',
  cloudinaryUploadPreset: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET || 'anypay-upload',
  cloudinaryApiKey: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY || '421356314353658',
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
