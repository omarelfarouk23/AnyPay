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
