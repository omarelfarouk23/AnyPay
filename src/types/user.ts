export interface User {
  id: string;
  phoneNumber: string;
  phone?: string;
  fullName: string;
  name?: string;
  avatarUrl?: string;
  email?: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  lastLoginAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  phoneNumber: string;
  otp?: string;
}

export interface OtpResponse {
  success: boolean;
  message?: string;
  expiresIn?: number;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  message?: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Chat: {conversationId: string; conversationTitle: string};
  PayTabs: undefined;
  Scanner: undefined;
  ReceiveQR: {presetAmount?: number};
  PaymentConfirm: {merchantId: string; merchantName: string; amount: number; ccpId?: string};
  PaymentSuccess: {reference: string; amount: number; merchantName: string; balanceAfter: number; rewardPoints?: number};
  SendMoney: undefined;
  TransactionHistory: undefined;
};
