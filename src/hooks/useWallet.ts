// src/hooks/useWallet.ts
// Re-exports the canonical wallet store from src/store/walletStore.ts.
// DO NOT create a separate useWalletStore here — it would shadow the
// canonical store and cause state inconsistency across the app.
// If you need additional wallet logic, add it as actions in the store.
export { useWalletStore } from '../store/walletStore';
