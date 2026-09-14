// src/screens/auth/LoginScreen.tsx
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
import { colors, spacing, borderRadius, shadows, typography } from '../../config/theme';
import { validatePhoneNumber } from '../../utils/validators';
import { useAuthStore } from '../../store';
import { apiClient } from '../../services/api/client';

function generateOtp(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % 900000 + 100000).toString();
}

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { setError, setUser } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const otpRef = useRef<string>('');

  useEffect(() => {
    setUser(null);
  }, []);

  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\s/g, '');
    if (!validatePhoneNumber(cleaned)) {
      Alert.alert('رقم غير صالح', 'يرجى إدخال رقم هاتف صحيح (10-15 خانة).');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/auth/otp/send', { phoneNumber: cleaned });
      const data = res.data;
      if (!data.success) {
        setError(data.message ?? 'فشل إرسال الرمز.');
        Alert.alert('خطأ', data.message ?? 'حاول مرة أخرى.');
        return;
      }
      otpRef.current = generateOtp();
      setStep('otp');
      setOtpSent(true);
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
      setUser({
        id: 'user_demo',
        phoneNumber: phone,
        phone: phone,
        fullName: 'مستخدم',
        name: 'مستخدم',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: true,
      });

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
                لم يصلك الرمز؟{' '}
                <Text style={styles.resendLink} onPress={handleSendOtp}>أعد الإرسال</Text>
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
