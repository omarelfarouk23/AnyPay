// src/utils/validators.ts
export const validatePhoneNumber = (phone: string): boolean => {
  // يدعم الأرقام الدولية والداخلية (10-15 خانة)
  const cleaned = phone.replace(/[^0-9]/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export const validateAmount = (amount: number, min = 1, max = 1000000): { valid: boolean; error?: string } => {
  if (isNaN(amount) || amount <= 0) return { valid: false, error: 'المبلغ يجب أن يكون رقماً موجباً' };
  if (amount < min) return { valid: false, error: `الحد الأدنى هو ${min} د.ج` };
  if (amount > max) return { valid: false, error: `الحد الأقصى هو ${max} د.ج` };
  return { valid: true };
};
