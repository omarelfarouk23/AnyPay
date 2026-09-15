import {apiClient, handleApiError} from './client';
import {API_ENDPOINTS} from '../../config/endpoints';
import type {MerchantInfo, QRPaymentRequest, QRPaymentResult, ReceiveQRData} from '../../types/payment';

// Idempotency key per the AnyPay full-stack blueprint (prevents double-spend on retries)
const createIdempotencyKey = (): string =>
  `qr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const qrPaymentService = {
  async payMerchant(params: QRPaymentRequest): Promise<QRPaymentResult> {
    try {
      const res = await apiClient.post<QRPaymentResult>(API_ENDPOINTS.PAYMENTS_INITIATE, params, {
        headers: {'x-idempotency-key': createIdempotencyKey()},
      });
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  async getReceiveQR(presetAmount?: number): Promise<ReceiveQRData> {
    try {
      const res = await apiClient.get<ReceiveQRData>(
        `${API_ENDPOINTS.PAYMENTS_RECEIVE_QR}${presetAmount ? `?amount=${presetAmount}` : ''}`,
      );
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  async resolveQR(payload: string): Promise<MerchantInfo> {
    try {
      const res = await apiClient.post<MerchantInfo>(API_ENDPOINTS.PAYMENTS_QR_RESOLVE, {payload});
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },
};