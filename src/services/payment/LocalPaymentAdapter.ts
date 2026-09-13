// src/services/payment/LocalPaymentAdapter.ts
/**
 * LocalPaymentAdapter — محور التكامل مع بوابات الدفع المحلية
 *
 * ملاحظات هامة:
 * - هذا الملف هيكلية/Stub حالياً — التنفيذ الفعلي يتطلب:
 *   1. اتفاقية مع البوابة المحلية (CIH, Edahabia, BaridiMob, إلخ)
 *   2. Key/API Credential رسمية من الجهة
 *   3. امتثال أمني ورقابي (PCI، قوانين محلية)
 * - هذا ليس تنفيذاً حقيقياً — هو هيكل للدمج المستقبلي
 */

// أنواع البوابات المحلية المتاحة (وفق التوفر الفعلي)
export type LocalPaymentGateway =
  | 'baridimob'   // بارودي موب — نظام دفع جوال
  | 'cih'         // CIH Bank — بوابة دفع إلكترونية
  | 'edahabia'    // Edahabia — نظام الدفع الجزائري
  | 'unknown';

export interface LocalPaymentConfig {
  gateway: LocalPaymentGateway;
  apiKey?: string;       // يُعطى من بوابة الدفع (سرّي، يجب تأمينه)
  environment: 'sandbox' | 'production';
  webhookUrl?: string;   // URL يستقبل إشعار الدفع من البوابة
}

export interface LocalPaymentResult {
  success: boolean;
  transactionId?: string;
  message?: string;
  errorCode?: string;
}

// فحص التوفر العام (يُستبدل لاحقاً بفحص حقيقي مع البوابة)
export const isGatewayAvailable = (gateway: LocalPaymentGateway): boolean => {
  // 현재는 모두 사용 불가 (나중에 실제 통합 시 변경)
  return false;
};

// محاكاة لجلب رصيد افتراضي (يُستبدل بخدمة حقيقية)
export const fetchBalance = async (): Promise<number> => {
  // TODO: ربط مع الخدمة الحقيقية للرصيد
  return 0;
};

// محاكاة لإرسال الأمر للدفع (يُستبدل بتنفيذ حقيقي)
export const initiatePayment = async (
  amount: number,
  gateway: LocalPaymentGateway,
  config: LocalPaymentConfig,
  description?: string
): Promise<LocalPaymentResult> => {
  if (amount <= 0) {
    return { success: false, message: 'المبلغ يجب أن يكون أكبر من صفر.' };
  }

  if (!isGatewayAvailable(gateway)) {
    return { success: false, message: 'للأسف هذه الخدمة غير متاحة حالياً.' };
  }

  // TODO: إرسال طلب للبوابة المحلية (API حقيقية)
  // مثال: POST إلى endpoint البوابة مع الـ amount، config.apiKey، إلخ.

  return {
    success: false,
    message: 'هذه الميزة قيد التطوير — سيتم تشغيلها بمجرد الاتفاق مع البوابة.',
  };
};

export const getGatewayName = (gateway: LocalPaymentGateway): string => {
  const names: Record<LocalPaymentGateway, string> = {
    baridimob: 'بارودي موب',
    cih: 'CIH Bank',
    edahabia: 'Edahabia',
    unknown: 'غير معروف',
  };
  return names[gateway] ?? 'غير معروف';
};
