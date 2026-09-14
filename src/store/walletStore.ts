import { create } from 'zustand';
import { Wallet, Transaction, SendMoneyRequest } from '../types/wallet';

interface WalletStore {
  wallet: Wallet | null;
  transactions: Transaction[];
  recentTransactions: Transaction[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;

  setWallet: (wallet: Wallet | null) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  setLoading: (loading: boolean) => void;
  setSending: (sending: boolean) => void;
  setError: (error: string | null) => void;
  clearWallet: () => void;
  updateBalance: (balance: number, totalBalance: number) => void;
}

export const useWalletStore = create<WalletStore>()((set) => ({
  wallet: null,
  transactions: [],
  recentTransactions: [],
  isLoading: false,
  isSending: false,
  error: null,

  setWallet: (wallet) => set({ wallet }),
  setTransactions: (transactions) =>
    set({
      transactions,
      recentTransactions: transactions.slice(0, 10),
    }),
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
      recentTransactions: [transaction, ...state.recentTransactions].slice(0, 10),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setSending: (isSending) => set({ isSending }),
  setError: (error) => set({ error }),
  clearWallet: () =>
    set({
      wallet: null,
      transactions: [],
      recentTransactions: [],
      error: null,
    }),
  updateBalance: (balance, totalBalance) =>
    set((state) => ({
      wallet: state.wallet
        ? { ...state.wallet, balance, totalBalance }
        : null,
    })),
}));
