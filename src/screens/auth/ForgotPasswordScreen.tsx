// src/screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { colors, spacing, borderRadius, typography } from '../../config/theme';

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!phone.trim()) {
      Alert.alert('رقم مطلوب', 'يرجى إدخال رقم هاتفك.');
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.successBox}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>تم إرسال رابط إعادة التعيين</Text>
          <Text style={styles.successText}>
            رابط إعادة تعيين كلمة المرور تم إرساله إلى{' '}
            <Text style={styles.phoneText}>{phone}</Text>
          </Text>
          <Button
            title="العودة للدخول"
            onPress={() => navigation.goBack()}
            style={styles.successBackButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>‹ العودة</Text>
      </TouchableOpacity>

      <Text style={styles.title}>إعادة تعيين كلمة المرور</Text>
      <Text style={styles.subtitle}>
        أدخل رقم هاتفك وسنرسل لك رابط إعادة تعيين كلمة المرور.
      </Text>

      <TextInput
        label="رقم هاتفك"
        placeholder="05xxxxxxxx"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        containerStyle={styles.inputContainer}
      />

      <Button
        title="إرسال الرابط"
        onPress={handleSend}
        loading={loading}
        size="large"
        style={styles.sendButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  backText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  inputContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sendButton: {
    marginTop: spacing.sm,
  },
  successBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  successIcon: {
    fontSize: 56,
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.success,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  successText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  phoneText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  successBackButton: {
    marginTop: spacing.xl,
  },
});
