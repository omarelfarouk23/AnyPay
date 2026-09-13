export const ENV = {
  ENV_TYPE: process.env.EXPO_PUBLIC_ENV_TYPE ?? 'development',
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api',
  WS_URL: process.env.EXPO_PUBLIC_WS_URL ?? 'ws://localhost:3001',
  APP_NAME: 'Anypay',
  APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION ?? '1.0.0',
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
  DEBUG: process.env.EXPO_PUBLIC_DEBUG === 'true',
};

export function isDev(): boolean {
  return ENV.ENV_TYPE === 'development';
}

export function isProd(): boolean {
  return ENV.ENV_TYPE === 'production';
}

export function isStaging(): boolean {
  return ENV.ENV_TYPE === 'staging';
}
