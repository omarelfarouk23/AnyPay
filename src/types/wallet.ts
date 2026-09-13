export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  availableBalance: number;
  currency: string;
  status: 'active' | 'frozen' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  counterparty?: string;
  counterpartyId?: string;
  reference?: string;
  fee?: number;
  receiverId?: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType =
  | 'sent'
  | 'received'
  | 'transfer'
  | 'payment'
  | 'refund'
  | 'withdrawal'
  | 'deposit';

export type TransactionStatus =
  | 'completed'
  | 'pending'
  | 'failed'
  | 'processing';

export interface SendMoneyRequest {
  amount: number;
  currency: string;
  recipientId: string;
  description?: string;
  fee?: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet' | 'cash';
  label: string;
  icon?: string;
  isDefault?: boolean;
  lastFourDigits?: string;
  bankName?: string;
  expiresAt?: string;
  color?: string;
  isAvailable?: boolean;
  name?: string;
}

export interface WalletState {
  wallet: Wallet | null;
  balance: number | null;
  currency: string;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
}

export interface WalletActions {
  setWallet: (wallet: Wallet | null) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  setLoading: (loading: boolean) => void;
  setSending: (sending: boolean) => void;
  setError: (error: string | null) => void;
  clearWallet: () => void;
}
