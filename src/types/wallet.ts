// src/types/wallet.ts
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  totalBalance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  isKycVerified?: boolean;
  twoFactorEnabled?: boolean;
}

export interface Transaction {
  id: string;
  walletId: string;
  userId: string;
  type: 'send' | 'receive' | 'transfer' | 'fee' | 'refund';
  amount: number;
  fee?: number;
  balanceAfter: number;
  counterparty?: {
    id: string;
    name: string;
    phoneNumber?: string;
    avatarUrl?: string;
  };
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  description?: string;
  reference?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'bank' | 'wallet' | 'cash' | 'card' | 'other';
  label: string;
  isAvailable: boolean;
  isDefault?: boolean;
  metadata?: Record<string, unknown>;
}

export interface SendMoneyRequest {
  recipientPhoneNumber: string;
  amount: number;
  description?: string;
  currency?: string;
  message?: string;
}

export interface TransactionFilter {
  type?: Transaction['type'];
  status?: Transaction['status'];
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}
