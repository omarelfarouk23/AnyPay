// src/hooks/useWallet.ts
import {create} from 'zustand';
import type {Wallet, Transaction, PaymentMethod} from '../types/wallet';

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
  setBalance: (balance: number | null) => void;
  setTransactions: (txs: Transaction[]) => void;
  addTransaction: (tx: Transaction) => void;
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  setLoading: (loading: boolean) => void;
  setSending: (sending: boolean) => void;
  setError: (error: string | null) => void;
  clearWallet: () => void;
}

export const useWalletStore = create<WalletState & WalletActions>((set) => ({
  wallet: null,
  balance: null,
  currency: 'د.ج',
  transactions: [],
  paymentMethods: [],
  isLoading: false,
  isSending: false,
  error: null,

  setWallet: (wallet) => set({wallet}),
  setBalance: (balance) => set({balance}),
  setTransactions: (txs) => set({transactions: txs}),
  addTransaction: (tx) =>
    set((state) => ({
      transactions: [tx, ...state.transactions],
    })),
  setPaymentMethods: (methods) => set({paymentMethods: methods}),
  setLoading: (loading) => set({isLoading: loading}),
  setSending: (sending) => set({isSending: sending}),
  setError: (error) => set({error, isLoading: false}),
  clearWallet: () =>
    set({
      wallet: null,
      balance: null,
      transactions: [],
      paymentMethods: [],
      isLoading: false,
      isSending: false,
      error: null,
    }),
}));
