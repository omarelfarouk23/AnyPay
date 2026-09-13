export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

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

  // Notifications
  NOTIFICATIONS_LIST: '/notifications',
  NOTIFICATIONS_READ: '/notifications/read',

  // Uploads
  UPLOAD_IMAGE: '/upload/image',
  UPLOAD_FILE: '/upload/file',
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
