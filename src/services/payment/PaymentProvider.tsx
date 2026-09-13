// src/services/payment/PaymentProvider.tsx
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { PaymentMethod } from '../../types/wallet';

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

type PaymentContextType = {
  balance: number | null;
  currency: string;
  methods: PaymentMethod[];
  status: PaymentStatus;
  errorMessage: string | null;
  isLoading: boolean;
  checkBalance: () => Promise<void>;
  processPayment: (amount: number, methodId: string, description?: string) => Promise<boolean>;
  refundPayment: (transactionId: string) => Promise<boolean>;
};

const PaymentContext = createContext<PaymentContextType | null>(null);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [currency] = useState('د.ج');
  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: 'baridimob', type: 'bank', label: 'بارودي موب', isAvailable: false },
    { id: 'cih', type: 'bank', label: 'CIH Bank', isAvailable: false },
    { id: 'edahabia', type: 'bank', label: 'Edahabia', isAvailable: false },
    { id: 'cash', type: 'cash', label: 'نقد', isAvailable: true },
  ]);
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkBalance = useCallback(async () => {
    // TODO: ربط مع الخدمة الفعلية
    setStatus('idle');
    setErrorMessage(null);
    // محاكاة: الرصيد يأتي لاحقاً من الخدمة
    // const res = await walletService.getBalance();
    // setBalance(res.balance);
  }, []);

  const processPayment = useCallback(async (amount: number, methodId: string, description?: string): Promise<boolean> => {
    if (amount <= 0) {
      setErrorMessage('المبلغ يجب أن يكون أكبر من صفر.');
      setStatus('error');
      return false;
    }
    setStatus('processing');
    setErrorMessage(null);
    try {
      // TODO: دمج مع بوابة الدفع المحلية / الخدمة
      // const tx = await walletService.makePayment(amount, methodId, description);
      // setBalance(prev => (prev ?? 0) - amount);
      // @simulate
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'فشل الدفع.');
      setStatus('error');
      return false;
    } finally {
      // لا نرجع الـ status ← 'idle' هنا لأن UI يحتاج يعرف النتيجة
      // يمكن لاحقاً تعيين timeout لاستعادة idle
    }
  }, []);

  const refundPayment = useCallback(async (transactionId: string): Promise<boolean> => {
    setStatus('processing');
    try {
      // TODO: ربط مع خدمة الاسترداد
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('idle');
      return true;
    } catch {
      setStatus('error');
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      balance,
      currency,
      methods,
      status,
      errorMessage,
      isLoading,
      checkBalance,
      processPayment,
      refundPayment,
    }),
    [balance, methods, status, errorMessage, isLoading]
  );

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

export const usePayment = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment يجب أن يستخدم داخل PaymentProvider');
  return ctx;
};
