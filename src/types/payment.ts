export interface MerchantInfo {
  id: string;
  name: string;
  nameFr?: string;
  location?: string;
  ccpId?: string;
  isVerified: boolean;
  icon?: string;
  suggestedAmount?: number;
}

export interface QRPaymentRequest {
  merchantId: string;
  amount: number;
  note?: string;
}

export interface QRPaymentResult {
  transactionId: string;
  reference: string;
  amount: number;
  fee: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  balanceAfter: number;
  merchantName: string;
  createdAt: string;
  rewardPoints?: number;
}

export interface ReceiveQRData {
  qrValue: string;
  userId: string;
  displayName: string;
  ccpNumber?: string;
  expiresInSeconds: number;
  presetAmount?: number;
}