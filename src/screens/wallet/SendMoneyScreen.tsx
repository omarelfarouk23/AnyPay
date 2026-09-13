import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography, shadows} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Icon} from '../../components/ui/Icon';
import {Button} from '../../components/ui/Button';
import {TextInput} from '../../components/ui/TextInput';
import {useWalletStore} from '../../store/walletStore';
import {useAuthStore} from '../../store/authStore';
import {useTheme} from '../../hooks/useTheme';

export const SendMoneyScreen: React.FC = () => {
  const {isSending} = useWalletStore();
  const {user} = useAuthStore();
  const {colors: themeColors} = useTheme();

  const [recipient, setRecipient] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [description, setDescription] = React.useState('');

  const amountNum = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;
  const isValidAmount = amountNum > 0 && amountNum <= 1000000;
  const canSend = recipient.trim().length > 0 && isValidAmount && !isSending;

  const handleSend = async () => {
    if (!canSend) return;
    await new Promise((r) => setTimeout(r, 1500));
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <Header
        title="إرسال أموال"
        leftIcon={<Text style={styles.backText}>←</Text>}
        leftAction={() => {}}
        backgroundColor={colors.primary}
        tintColor={colors.textOnPrimary}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات المستلم</Text>
          <View style={[styles.inputCard, {backgroundColor: colors.card}]}>
            <View style={styles.inputCardInner}>
              <Icon name="user" size={22} color={colors.textSecondary} />
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>رقم الهاتف أو الاسم</Text>
                <TextInput
                  value={recipient}
                  onChangeText={setRecipient}
                  placeholder="0555 123 456"
                  keyboardType="phone-pad"
                  containerStyle={styles.inputContainer}
                  inputStyle={styles.inputText}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المبلغ</Text>
          <View style={[styles.inputCard, {backgroundColor: colors.card}]}>
            <View style={styles.inputCardInner}>
              <Icon name="money" size={22} color={colors.primary} />
              <View style={styles.amountInput}>
                <Text style={styles.currencyPrefix}>دج</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  containerStyle={styles.amountContainer}
                  inputStyle={styles.amountText}
                />
              </View>
            </View>
            {!isValidAmount && amount.length > 0 && (
              <Text style={styles.errorText}>
                {amountNum === 0 ? 'أدخل مبلغ صالح' : amountNum > 1000000 ? 'المبلغ يجب أن لا يتجاوز 1,000,000 دج' : 'أدخل مبلغ صالح'}
              </Text>
            )}
            <View style={styles.quickAmounts}>
              {[500, 1000, 2500, 5000, 10000].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[
                    styles.quickAmountButton,
                    amount === v.toString() && styles.quickAmountButtonActive,
                  ]}
                  onPress={() => setAmount(v.toString())}>
                  <Text
                    style={[
                      styles.quickAmountText,
                      amount === v.toString() && styles.quickAmountTextActive,
                    ]}>
                    {v.toLocaleString('ar-DZ')} دج
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ملاحظة (اختياري)</Text>
          <View style={[styles.inputCard, {backgroundColor: colors.card}]}>
            <View style={styles.inputCardInner}>
              <Icon name="note" size={22} color={colors.textSecondary} />
              <View style={styles.inputField}>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="مثال: غداء، هدية، دين..."
                  multiline
                  containerStyle={styles.inputContainer}
                  inputStyle={styles.inputText}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>المستلم</Text>
            <Text style={styles.summaryValue} numberOfLines={1}>
              {recipient || '-'}
            </Text>
          </View>
          <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>المبلغ</Text>
            <Text style={[styles.summaryValue, styles.summaryValueAmount]}>
              {amountNum > 0 ? `${amountNum.toLocaleString('ar-DZ')} دج` : '-'}
            </Text>
          </View>
          <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>الرسوم</Text>
            <Text style={styles.summaryValue}>0 دج</Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>المجموع</Text>
            <Text style={styles.summaryTotalValue}>
              {amountNum > 0 ? `${amountNum.toLocaleString('ar-DZ')} دج` : '-'}
            </Text>
          </View>
        </View>

        <Button
          title={isSending ? 'جاري الإرسال...' : 'إرسال الأموال'}
          onPress={handleSend}
          disabled={!canSend}
          variant="primary"
          size="large"
          fullWidth
          style={styles.sendButton}
        />

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>نصائح:</Text>
          <Text style={styles.tipsText}>
            • تأكد من رقم الهاتف قبل الإرسال • الأموال غير قابلة للاسترداد بعد الإرسال • الحد الأقصى 1,000,000 دج
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backText: {
    fontSize: 24,
    color: colors.textOnPrimary,
    lineHeight: 24,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  inputCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  inputCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  inputField: {
    flex: 1,
  },
  inputLabel: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  inputText: {
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  amountInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  currencyPrefix: {
    fontSize: typography.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  amountContainer: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    paddingHorizontal: 0,
  },
  amountText: {
    fontSize: typography.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  errorText: {
    fontSize: typography.xs,
    color: colors.error,
    marginTop: spacing.sm,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  quickAmountButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickAmountButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickAmountText: {
    fontSize: typography.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  quickAmountTextActive: {
    color: colors.textOnPrimary,
  },
  summaryBox: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
    flex: 1,
    textAlign: 'right',
  },
  summaryValueAmount: {
    fontSize: typography.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  summaryTotalLabel: {
    fontSize: typography.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  summaryTotalValue: {
    fontSize: typography.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  sendButton: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
  },
  tips: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.md,
  },
  tipsTitle: {
    fontSize: typography.sm,
    fontWeight: typography.weights.semibold,
    color: colors.warning,
    marginBottom: spacing.xs,
  },
  tipsText: {
    fontSize: typography.xs,
    color: colors.warning,
    lineHeight: 18,
  },
});
