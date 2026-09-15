// src/payment/PaymentProvider.tsx
// DEPRECATED: This is a legacy duplicate. The canonical PaymentProvider
// is at src/services/payment/PaymentProvider.tsx with full functionality
// (processPayment, refundPayment, error handling).
// Re-export from the canonical source to prevent state duplication.
export { PaymentProvider, usePayment } from '../services/payment/PaymentProvider';
