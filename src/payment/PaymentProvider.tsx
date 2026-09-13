// src/payment/PaymentProvider.tsx
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type PaymentMethod = {
  id: string;
  name: string;
  iconUri?: string;
  isAvailable: boolean;
};

type PaymentContextValue = {
  balance: number | null;
  methods: PaymentMethod[];
  isLoading: boolean;
};

const PaymentContext = createContext<PaymentContextValue | null>(null);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number | null>(12500);
  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: 'baridimob', name: 'بارودي موب', isAvailable: false },
    { id: 'cih', name: 'CIH Bank', isAvailable: false },
    { id: 'edahabia', name: 'Edahabia', isAvailable: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo(
    () => ({ balance, methods, isLoading }),
    [balance, methods, isLoading]
  );

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be used within PaymentProvider');
  return ctx;
};
