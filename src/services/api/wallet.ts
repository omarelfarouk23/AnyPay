// src/services/api/wallet.ts
import { apiClient, handleApiError } from './client';
import type { Transaction, PaymentMethod } from '../../types/wallet';
import type { PaginatedResponse } from '../../types/api';

export const walletService = {
  async getBalance(): Promise<{ balance: number; currency: string }> {
    try {
      const res = await apiClient.get('/wallet/balance');
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  async getTransactions(limit = 50, before?: number): Promise<Transaction[]> {
    try {
      const res = await apiClient.get<PaginatedResponse<Transaction>>(
        `/wallet/transactions?limit=${limit}${before ? `&before=${before}` : ''}`
      );
      return res.data.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const res = await apiClient.get<PaymentMethod[]>('/wallet/payment-methods');
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  async sendMoney(to: string, amount: number, description?: string): Promise<Transaction> {
    try {
      const res = await apiClient.post<Transaction>('/wallet/send', {
        to,
        amount,
        description,
      });
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  async makePayment(amount: number, methodId: string, description?: string): Promise<Transaction> {
    try {
      const res = await apiClient.post<Transaction>('/wallet/payment', {
        amount,
        methodId,
        description,
      });
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },
};
