// SECURITY: Default to HTTPS to protect auth tokens and user data in transit.
// In development, set EXPO_PUBLIC_API_URL=http://localhost:3000/api in .env
// (only allowed in non-production environments).
const rawUrl = process.env.EXPO_PUBLIC_API_URL;
const isDev = process.env.EXPO_PUBLIC_ENVIRONMENT === 'development';

// Validate: production must use HTTPS. Warn in dev if using HTTP.
if (!isDev && rawUrl && rawUrl.startsWith('http://')) {
  console.warn('[Security] Production API URL must use HTTPS. Current:', rawUrl);
}

export const API_BASE_URL = rawUrl ?? 'https://api.anypay.dz/v1';

export const API_ENDPOINTS = {
  // Auth
  AUTH_OTP_SEND: '/auth/otp/send',
  AUTH_OTP_VERIFY: '/auth/otp/verify',
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_REGISTER: '/auth/register',

  // User
  USER_PROFILE: '/user/profile',
  USER_UPDATE: '/user/update',
  USER_SETTINGS: '/user/settings',
  USER_AVATAR: '/user/avatar',

  // Conversations
  CONVERSATIONS_LIST: '/conversations',
  CONVERSATIONS_CREATE: '/conversations/create',
  CONVERSATIONS_REFRESH: '/conversations/refresh',
  CONVERSATIONS_READ: '/conversations/read',

  // Messages
  MESSAGES_LIST: '/conversations/:conversationId/messages',
  MESSAGES_SEND: '/conversations/:conversationId/messages',
  MESSAGES_TYPING: '/conversations/:conversationId/typing',
  MESSAGES_READ: '/conversations/:conversationId/read',

  // Wallet
  WALLET_BALANCE: '/wallet/balance',
  WALLET_TRANSACTIONS: '/wallet/transactions',
  WALLET_SEND: '/wallet/send',
  WALLET_DEPOSIT: '/wallet/deposit',
  WALLET_WITHDRAW: '/wallet/withdraw',

  // Customer Support
  SUPPORT_TICKETS: '/support/tickets',
  SUPPORT_TICKET_CREATE: '/support/tickets/create',
  SUPPORT_TICKET_DETAIL: '/support/tickets/:ticketId',
  SUPPORT_CHAT: '/support/chat',

  // Payments (future)
  PAYMENTS_METHODS: '/payments/methods',
  PAYMENTS_INITIATE: '/payments/initiate',
  PAYMENTS_STATUS: '/payments/:paymentId/status',
  PAYMENTS_WEBHOOK: '/payments/webhook',
  PAYMENTS_QR_RESOLVE: '/payments/qr/resolve',
  PAYMENTS_RECEIVE_QR: '/payments/qr/receive',

  // Notifications
  NOTIFICATIONS_LIST: '/notifications',
  NOTIFICATIONS_READ: '/notifications/read',

  // Uploads
  UPLOAD_IMAGE: '/upload/image',
  UPLOAD_FILE: '/upload/file',

  // Search
  USERS_SEARCH: '/users/search',
  USERS_CONTACTS: '/users/contacts',
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];

// Add these endpoints to the existing API_ENDPOINTS object
