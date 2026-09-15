// src/screens/auth/LoginScreen.tsx
// SECURITY: OTP is sent by the server (via SMS), never generated client-side.
// RATE LIMITING: OTP resend is throttled to prevent SMS spam/abuse.
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet,
  KeyboardAvoidingView, Platform, SafeAreaView,
  TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { Avatar } from '../../components/ui/Avatar';
import {colors, spacing, borderRadius, shadows, typography} from '../../config/theme';
import {validatePhoneNumber} from '../../utils/validators';
import {useAuthStore} from '../../store/authStore';
import type {User} from '../../types/user';

// Rate limit: minimum 60 seconds between OTP resend attempts.
// This prevents SMS cost abuse and carrier throttling.
const OTP_RESEND_COOLDOWN_SECONDS = 60;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { setError, setUser } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Rate limiting state for OTP resend
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup cooldown timer on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimer.current) {
        clearInterval(cooldownTimer.current);
        cooldownTimer.current = null;
      }
    };
  }, []);

  // Start cooldown timer after OTP is sent
  const startResendCooldown = useCallback(() => {
    setResendCooldown(OTP_RESEND_COOLDOWN_SECONDS);
    cooldownTimer.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownTimer.current) {
            clearInterval(cooldownTimer.current);
            cooldownTimer.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\s/g, '');
    if (!validatePhoneNumber(cleaned)) {
      Alert.alert('رقم غير صالح', 'يرجى إدخال رقم هاتف صحيح (10-15 خانة).');
      return;
    }

    // Enforce rate limit on resend
    if (resendCooldown > 0) {
      Alert.alert('انتظر', `يمكنك إعادة الإرسال بعد ${resendCooldown} ثانية.`);
      return;
    }

    setLoading(true);
    try {
      // SECURITY: The server generates and sends the OTP via SMS.
      // The client only triggers the send — it never generates or stores OTPs.
      const { apiClient } = await import('../../services/api/client');
      const res = await apiClient.post('/auth/otp/send', { phoneNumber: cleaned });
      const data = res.data as { success: boolean; message?: string };

      if (!data.success) {
        setError(data.message ?? 'فشل إرسال الرمز.');
        Alert.alert('خطأ', data.message ?? 'حاول مرة أخرى.');
        return;
      }

      setStep('otp');
      setOtpSent(true);
      startResendCooldown();
    } catch {
      setError('فشل إرسال الرمز.');
      Alert.alert('خطأ', 'حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert('رمز مطلوب', 'يرجى إدخال رمز التحقق.');
      return;
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      Alert.alert('رمز غير صالح', 'الرمز يجب أن يكون 6 أرقام.');
      return;
    }

    setLoading(true);
    try {
      // SECURITY: Verify OTP against the server. The server validates
      // the OTP and returns an auth token — never trust client-side OTP checks.
      const { apiClient, setAuthToken } = await import('../../services/api/client');
      const cleaned = phone.replace(/\s/g, '');
      const res = await apiClient.post('/auth/otp/verify', {
        phoneNumber: cleaned,
        otp: otp.trim(),
      });
      const data = res.data as {
        success: boolean;
        user?: { id: string; phoneNumber: string; fullName: string; status: string; createdAt: string; updatedAt: string; isVerified: boolean };
        token?: string;
        message?: string;
      };

      if (!data.success || !data.user || !data.token) {
        setError(data.message ?? 'رمز غير صحيح.');
        Alert.alert('رمز غير صحيح', 'يرجى إعادة محاولة الرمز.');
        return;
      }

      // Store the server-issued auth token
      setAuthToken(data.token);

      // Set user from server response — never fabricate user data client-side
      setUser(data.user as User);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'رمز غير صحيح.');
      Alert.alert('رمز غير صحيح', 'يرجى إعادة محاولة الرمز.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>A</Text>
            </View>
            <Text style={styles.logoName}>Anypay</Text>
          </View>
          <Text style={styles.subtitle}>
            محادثاتك. دفوعك. في مكان واحد.
          </Text>
        </View>

        {step === 'phone' && (
          <View style={styles.form}>
            <TextInput
              label="رقم هاتفك"
              placeholder="05xxxxxxxx"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              containerStyle={styles.inputContainer}
            />

            <Button
              title="إرسال رمز التحقق"
              onPress={handleSendOtp}
              loading={loading}
              size="large"
              style={styles.sendButton}
              textStyle={styles.sendButtonText}
            />

            <Text style={styles.terms}>
              بالضغطة على إرسال، تؤكد موافقتك على{' '}
              <Text style={styles.termsLink}>شروط الاستخدام</Text>
              {' '}و{' '}
              <Text style={styles.termsLink}>سياسة الخصوصية</Text>.
            </Text>
          </View>
        )}

        {step === 'otp' && (
          <View style={styles.form}>
            <TouchableOpacity style={styles.backButton} onPress={() => setStep('phone')}>
              <Text style={styles.backText}>‹ العودة</Text>
            </TouchableOpacity>

            <Text style={styles.otpTitle}>رمز التحقق</Text>
            <Text style={styles.otpSubtitle}>
              أرسلنا رمزاً إلى{' '}
              <Text style={styles.phoneHighlight}>{phone}</Text>
            </Text>

            <TextInput
              label="الرمز السداسي"
              placeholder="000000"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              containerStyle={styles.otpInputContainer}
              textAlign="center"
              maxLength={6}
            />

            {otpSent && (
              <Text style={styles.resendText}>
                {resendCooldown > 0
                  ? `يمكنك إعادة الإرسال بعد ${resendCooldown} ثانية`
                  : 'لم يصلك الرمز؟ '}
                {resendCooldown === 0 && (
                  <Text style={styles.resendLink} onPress={handleSendOtp}>أعد الإرسال</Text>
                )}
              </Text>
            )}

            <Button
              title="تأكيد الدخول"
              onPress={handleVerifyOtp}
              loading={loading}
              size="large"
              style={styles.verifyButton}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles defined outside component to prevent recreation on every render
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
  },
  logoCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
    ...shadows.md,
  },
  logoText: {
    fontSize: 28, fontWeight: '700', color: '#FFFFFF',
  },
  logoName: {
    fontSize: typography.sizes.xxl, fontWeight: '700',
    color: colors.primary, letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: spacing.md, fontSize: typography.sizes.lg,
    color: colors.textSecondary, textAlign: 'center',
    lineHeight: 22, paddingHorizontal: spacing.xl,
  },
  form: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  sendButton: {
    marginTop: spacing.sm,
  },
  sendButtonText: {
    fontSize: typography.sizes.xl,
  },
  terms: {
    fontSize: typography.sizes.sm, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 20, marginTop: spacing.md,
  },
  termsLink: {
    color: colors.primary, fontWeight: '600', textDecorationLine: 'underline',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
  },
  backText: {
    fontSize: typography.sizes.md, color: colors.textSecondary, fontWeight: '500',
  },
  otpTitle: {
    fontSize: typography.sizes.xxl, fontWeight: '700',
    color: colors.textPrimary, marginBottom: spacing.sm,
  },
  otpSubtitle: {
    fontSize: typography.sizes.md, color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  phoneHighlight: {
    color: colors.primary, fontWeight: '600',
  },
  otpInputContainer: {
    marginBottom: spacing.md,
  },
  resendText: {
    fontSize: typography.sizes.sm, color: colors.textSecondary,
    textAlign: 'center', marginBottom: spacing.md,
  },
  resendLink: {
    color: colors.primary, fontWeight: '600', textDecorationLine: 'underline',
  },
  verifyButton: {
    marginTop: spacing.sm,
  },
});
