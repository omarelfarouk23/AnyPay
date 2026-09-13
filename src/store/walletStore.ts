import {create} from 'zustand';
import {Wallet, Transaction} from '../types/wallet';

interface WalletStore {
  wallet: Wallet | null;
  transactions: Transaction[];
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
}

export const useWalletStore = create<WalletStore>()((set) => ({
  wallet: null,
  transactions: [],
  isLoading: false,
  isSending: false,
  error: null,

  setWallet: (wallet) => set({wallet}),
  setTransactions: (transactions) => set({transactions}),
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
  setLoading: (isLoading) => set({isLoading}),
  setSending: (isSending) => set({isSending}),
  setError: (error) => set({error}),
  clearWallet: () => set({wallet: null, transactions: []}),
}));
