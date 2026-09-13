import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import {Card} from '../../components/ui/Card';
import { Header } from '../../components/ui/Header';
import { PaymentMethodsList } from '../../services/payment/PaymentMethods';
import { usePayment } from '../../services/payment/usePayment';
import { colors, spacing, borderRadius, typography } from '../../config/theme';
import { validateAmount } from '../../utils/validators';
import { formatCurrency } from '../../utils/formatters';

export const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { status, errorMessage, processPayment, balance, currency } = usePayment();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [amountError, setAmountError] = useState<string | null>(null);

  const handlePay = async () => {
    const parsedAmount = parseFloat(amount);
    const validation = validateAmount(parsedAmount, 1, 500000);

    if (!validation.valid) {
      setAmountError(validation.error ?? 'المبلغ غير صالح');
      return;
    }

    if (!selectedMethodId) {
      Alert.alert('اختر طريقة دفع', 'يرجى اختيار طريقة الدفع قبل المتابعة.');
      return;
    }

    setLoading(true);
    const success = await processPayment(parsedAmount, selectedMethodId, description || undefined);

    if (success) {
      Alert.alert(
        'الدفع ناجح ✅',
        `تم الدفع بنجاح — ${formatCurrency(parsedAmount)} ${currency}`
      );
      setAmount('');
      setDescription('');
      setSelectedMethodId(null);
      setAmountError(null);
      navigation.goBack();
    } else {
      Alert.alert('فشل الدفع', errorMessage ?? 'حاول مرة أخرى.');
    }
    setLoading(false);
  };

  const availableBalance = balance ?? 15000;
  const isProcessing = status === 'processing';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Header title="دفع إلكتروني" onRightPress={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* رصيد */}
          <Card style={styles.balanceCard} noShadow>
            <Text style={styles.balanceLabel}>الرصيد المتاح</Text>
            <Text style={styles.balanceNumber}>
              {formatCurrency(availableBalance)} <Text style={styles.currency}>د.ج</Text>
            </Text>
          </Card>

          {/* المبلغ */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>المبلغ المراد دفعته</Text>
            <TextInput
              label="بالدينار الجزائري (د.ج)"
              placeholder="1000"
              value={amount}
              onChangeText={(text) => {
                setAmount(text.replace(/[^0-9.]/g, ''));
                setAmountError(null);
              }}
              keyboardType="numeric"
              error={amountError ?? undefined}
              containerStyle={styles.input}
            />
            {amountError && <Text style={styles.errorText}>{amountError}</Text>}
            <Text style={styles.hint}>يجب أن يكون بين 1 و 500,000 د.ج</Text>
          </Card>

          {/* طرق الدفع */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>طريقة الدفع</Text>
            <PaymentMethodsList onSelect={setSelectedMethodId} />
          </Card>

          {/* ملاحظات */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>ملاحظات (اختياري)</Text>
            <TextInput
              placeholder="وصف الدفع"
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={200}
              containerStyle={styles.input}
            />
          </Card>

          {/* زر التأكيد */}
          <Button
            title={isProcessing ? 'جاري المعالجة...' : 'تأكيد الدفع'}
            onPress={handlePay}
            loading={isProcessing || loading}
            disabled={isProcessing || !amount || !selectedMethodId || loading}
            size="lg"
            style={styles.payBtn}
            textStyle={styles.payBtnText}
          />

          {status === 'success' && !isProcessing && (
            <View style={styles.successBanner}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successText}>تم الدفع بنجاح!</Text>
            </View>
          )}

          {errorMessage && status === 'error' && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorIcon}>❌</Text>
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  balanceCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.sizes.md,
    marginBottom: spacing.xs,
  },
  balanceNumber: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
  },
  currency: {
    fontSize: 18,
    color: colors.accent,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  card: { marginBottom: spacing.md },
  cardTitle: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  input: { marginBottom: 0 },
  errorText: { color: colors.error, fontSize: typography.sizes.sm, marginTop: spacing.xs, fontWeight: '500' },
  hint: { color: colors.textSecondary, fontSize: typography.sizes.sm, marginTop: spacing.sm },
  payBtn: { marginTop: spacing.md, backgroundColor: colors.primary },
  payBtnText: { color: '#FFFFFF', fontSize: typography.sizes.xl },
  successBanner: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  successIcon: { fontSize: 20 },
  successText: { color: '#FFFFFF', fontSize: typography.sizes.md, fontWeight: '600' },
  errorBanner: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  errorIcon: { fontSize: 20, marginRight: spacing.sm },
  errorBannerText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.md,
    fontWeight: '600',
    textAlign: 'center',
  },
});
