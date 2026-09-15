// src/screens/pay/PaymentConfirmScreen.tsx
// Stitch design: wechat_pay_payment_confirm — merchant card, PIN, keypad, green confirm
import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Svg, Rect, Path} from 'react-native-svg';
import {colors} from '../../config/colors';
import {borderRadius, spacing, shadows, typography} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Icon} from '../../components/ui/Icon';
import {Button} from '../../components/ui/Button';
import {TextInput} from '../../components/ui/TextInput';
import {usePinKeypad} from '../../hooks/useQRPayment';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {qrPaymentService} from '../../services/api/payment';
import {useWalletStore} from '../../store/walletStore';

export type PaymentConfirmScreenProps = NativeStackScreenProps<{
  PaymentConfirm: {
    merchantId: string;
    merchantName: string;
    amount: number;
    ccpId?: string;
    note?: string;
  };
  PaymentSuccess: {
    reference: string;
    amount: number;
    merchantName: string;
    balanceAfter: number;
    rewardPoints?: number;
  };
}, 'PaymentConfirm'>;

const CCP_BALANCE = 280300;
const CCP_AVAILABLE = 280300;

export const PaymentConfirmScreen: React.FC<PaymentConfirmScreenProps> = ({route, navigation}) => {
  const {merchantId, merchantName, amount, ccpId, note: initialNote} = route.params;
  const {pin, length, maxLength, isComplete, pressDigit, backspace, clear} = usePinKeypad(6);
  const [note, setNote] = useState(initialNote ?? '');
  const [processing, setProcessing] = useState(false);
  const [localAmount, setLocalAmount] = useState(amount);

  const formatAmount = (value: number) =>
    value.toLocaleString('ar-DZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' د.ج';

  const confirmPayment = useCallback(async () => {
    if (!isComplete) return;
    setProcessing(true);
    try {
      const result = await qrPaymentService.payMerchant({
        merchantId,
        amount: localAmount,
        note,
      });
      navigation.replace('PaymentSuccess', {
        reference: result.reference,
        amount: result.amount,
        merchantName,
        balanceAfter: result.balanceAfter,
        rewardPoints: result.rewardPoints,
      });
    } catch (err) {
      Alert.alert('خطأ', 'تعذّر إتمام الدفع، حاول مرة أخرى');
      console.error('[PaymentConfirmScreen] Failed:', err);
    } finally {
      setProcessing(false);
    }
  }, [isComplete, localAmount, merchantName, note, navigation]);

  const confirmWithBiometric = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 500));
    // Simulate biometric approval by auto-filling 6 digits
    for (let i = 0; i < 6; i++) {
      pressDigit(String(i));
    }
    setTimeout(() => {
      if (isComplete) {
        setProcessing(true);
        setTimeout(() => {
          navigation.replace('PaymentSuccess', {
            reference: `TX-2025-${Math.floor(10000000 + Math.random() * 89999999)}`,
            amount: localAmount,
            merchantName,
            balanceAfter: CCP_AVAILABLE - localAmount,
            rewardPoints: Math.floor(localAmount / 100),
          });
        }, 800);
      }
    }, 300);
  }, [pressDigit, isComplete, localAmount, merchantName, navigation]);

  const dots = Array.from({length: maxLength}, (_, index) => ({
    filled: index < length,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top dismiss bar + safety pill */}
        <View style={styles.dismissBar}>
          <View style={styles.safetyPill}>
            <View style={styles.logoMini}>
              <Svg width={14} height={14}>
                <Rect x={0} y={0} width={14} height={14} fill={colors.primary} rx={2} />
                <Path d="M4 4 H10 V10 H4 Z" fill="#fff" />
              </Svg>
              <Text style={styles.logoMiniText}>AnyPay</Text>
            </View>
            <Text style={styles.safetyText} numberOfLines={1}>
              نظام AnyPay المشفّر | AnyPay Secure
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.pop()}>
            <Icon name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Merchant verified card */}
        <View style={styles.merchantCard}>
          <View style={styles.merchantRow}>
            <View style={styles.merchantAvatar}>
              <Svg width={44} height={44}>
                <Rect x={0} y={0} width={44} height={44} fill={colors.paymentGreen} rx={10} />
                <Rect x={6} y={6} width={32} height={32} fill="#fff" rx={6} />
                <Path
                  d="M14 16 L30 16 L30 30 L14 30 Z"
                  stroke={colors.paymentGreen}
                  strokeWidth={2}
                  fill="none"
                />
              </Svg>
            </View>
            <View style={styles.merchantInfo}>
              <Text style={styles.merchantName} numberOfLines={1}>
                {merchantName}
              </Text>
              <Text style={styles.merchantNameFr} numberOfLines={1}>
                (Supermarché)
              </Text>
              <View style={styles.verifiedRow}>
                <View style={styles.verifiedDot} />
                <Text style={styles.verifiedText}>حساب تجاري موثق</Text>
                <Text style={styles.merchantIdText}>ID: {ccpId ?? '00284918'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.ccpBadge}>
            <Text style={styles.ccpBadgeText}>CCP PRO</Text>
          </View>
        </View>

        {/* Payment amount box */}
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>المبلغ المطلوب (Montant à régler)</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amountValue}>{formatAmount(localAmount)}</Text>
          </View>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="إضافة ملاحظة أو رقم الفاتورة (Optionnel)"
            containerStyle={styles.noteInput}
            maxLength={35}
          />
          <Text style={styles.noteOptional}>اختياري</Text>
        </View>

        {/* CCP balance selector */}
        <TouchableOpacity
          style={styles.ccpSelector}
          onPress={() => {}}
          activeOpacity={0.7}>
          <View style={styles.ccpRow}>
            <View style={styles.ccpAvatar}>
              <Icon name="accountBalanceWallet" size={20} color={colors.onSecondaryFixed} />
            </View>
            <View style={styles.ccpInfo}>
              <Text style={styles.ccpTitle} numberOfLines={1}>
                رصيد الحساب البريدي الجاري (CCP)
              </Text>
              <View style={styles.ccpBalanceSubRow}>
                <Text style={styles.ccpBalanceLabel}>الرصيد المتاح:</Text>
                <Text style={styles.ccpBalanceValue}>
                  {formatAmount(CCP_BALANCE)}
                </Text>
              </View>
            </View>
          </View>
          <Icon name="chevronRight" size={18} color={colors.outline} />
        </TouchableOpacity>

        {/* Security / biometric row */}
        <View style={styles.securityRow}>
          <View style={styles.securityLeft}>
            <Icon name="lock" size={16} color={colors.paymentGreen} />
            <Text style={styles.securityText}>رمز المعاملة المكون من 6 أرقام (PIN)</Text>
          </View>
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={confirmWithBiometric}>
            <Icon name="fingerprint" size={18} color={colors.paymentGreen} />
            <Text style={styles.biometricText}>استخدام البصمة</Text>
          </TouchableOpacity>
        </View>

        {/* PIN dots */}
        <View style={styles.pinDotsWrapper}>
          <View style={styles.pinDots}>
            {dots.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.pinDot,
                  item.filled && styles.pinDotFilled,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Numeric keypad */}
        <View style={styles.keypadContainer}>
          <View style={styles.keypadGrid}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.keyBtn}
                onPress={() => {
                  if (key === '.') {
                    pressDigit('.');
                  } else {
                    pressDigit(key);
                  }
                }}>
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.keyBtn, {justifyContent: 'center'}]}
              onPress={backspace}>
              <Icon name="backspace" size={22} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Primary green confirm button */}
        <View style={styles.confirmRow}>
          <Button
            title={
              processing
                ? 'جاري المعالجة...'
                : 'تأكيد والدفع (Confirmer le paiement)'
            }
            onPress={confirmPayment}
            loading={processing}
            disabled={!isComplete}
            variant="primary"
            size="large"
            fullWidth
            icon={
              !processing ? (
                <Icon name="checkCircle" size={20} color={colors.onPaymentGreen} />
              ) : (
                <View style={styles.spinner} />
              )
            }
          />
        </View>

        {/* Security footer + trust indicators */}
        <View style={styles.trustFooter}>
          <View style={styles.trustRow}>
            <Text style={styles.trustPillText}>SATIM</Text>
            <View style={styles.trustDivider} />
            <Text style={styles.trustPillText}>بريد الجزائر</Text>
            <View style={styles.trustDivider} />
            <Text style={styles.trustPillText}>GIM-TEL</Text>
          </View>
          <Text style={styles.trustText} numberOfLines={2}>
            معاملة محمية ومشفرة بمعايير SATIM و Algérie Poste المالية 256-bit
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  scrollContent: {paddingBottom: spacing.xxl},

  // Dismiss bar
  dismissBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.sm,
  },
  safetyPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full, gap: spacing.sm,
  },
  logoMini: {flexDirection: 'row', alignItems: 'center', gap: 2},
  logoMiniText: {fontSize: 8, fontWeight: '700', color: colors.textPrimary, letterSpacing: 0.3},
  safetyText: {
    fontSize: typography.sizes.xs, color: colors.textSecondary,
    fontWeight: '500', maxWidth: 120, textAlign: 'right',
  },
  closeButton: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center', justifyContent: 'center',
  },

  // Merchant card
  merchantCard: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.xl, padding: spacing.md,
    marginBottom: spacing.md, ...shadows.sm,
  },
  merchantRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  merchantAvatar: {
    width: 44, height: 44, borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  merchantInfo: {flex: 1, minWidth: 0},
  merchantName: {
    fontSize: typography.sizes.md, fontWeight: '600',
    color: colors.textPrimary, marginBottom: 2,
  },
  merchantNameFr: {fontSize: typography.sizes.xs, color: colors.textSecondary},
  verifiedRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs},
  verifiedDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: colors.paymentGreen},
  verifiedText: {fontSize: typography.sizes.xs, color: colors.paymentGreen, fontWeight: '500'},
  merchantIdText: {fontSize: typography.sizes.xs, color: colors.textSecondary, marginLeft: spacing.xs},
  ccpBadge: {
    alignSelf: 'flex-start', marginTop: spacing.sm,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  ccpBadgeText: {
    fontSize: typography.sizes.xs, color: colors.textSecondary,
    fontWeight: '500',
  },

  // Amount box
  amountBox: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.xl, padding: spacing.lg,
    marginBottom: spacing.md, ...shadows.sm,
  },
  amountLabel: {
    fontSize: typography.sizes.sm, color: colors.textSecondary,
    fontWeight: '500', marginBottom: spacing.xs,
  },
  amountRow: {flexDirection: 'row', alignItems: 'baseline'},
  amountValue: {
    fontSize: 32, fontWeight: '700', color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  noteInput: {marginTop: spacing.md, marginBottom: spacing.xs},
  noteOptional: {
    fontSize: typography.sizes.xs, color: colors.textTertiary,
    alignSelf: 'flex-end',
  },

  // CCP selector
  ccpSelector: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.xl, padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    ...shadows.sm,
  },
  ccpRow: {flexDirection: 'row', alignItems: 'center', flex: 1, gap: spacing.md},
  ccpAvatar: {
    width: 40, height: 40, borderRadius: borderRadius.md,
    backgroundColor: colors.secondaryFixed,
    alignItems: 'center', justifyContent: 'center',
  },
  ccpInfo: {flex: 1, minWidth: 0},
  ccpTitle: {
    fontSize: typography.sizes.md, fontWeight: '500',
    color: colors.textPrimary, marginBottom: spacing.xs,
  },
  ccpBalanceSubRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  ccpBalanceLabel: {fontSize: typography.sizes.xs, color: colors.textSecondary},
  ccpBalanceValue: {
    fontSize: typography.sizes.sm, fontWeight: '600',
    color: colors.textPrimary,
  },

  // Security row
  securityRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: spacing.md, marginBottom: spacing.md,
  },
  securityLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  securityText: {
    fontSize: typography.sizes.xs, color: colors.textSecondary,
    fontWeight: '500',
  },
  biometricButton: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  biometricText: {
    fontSize: typography.sizes.xs, color: colors.paymentGreen,
    fontWeight: '600',
  },

  // PIN dots
  pinDotsWrapper: {alignItems: 'center', marginBottom: spacing.md},
  pinDots: {flexDirection: 'row', gap: spacing.md},
  pinDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: colors.surfaceContainerHighest,
  },
  pinDotFilled: {backgroundColor: colors.paymentGreen},

  // Keypad
  keypadContainer: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.xl, padding: spacing.md,
    marginBottom: spacing.md, ...shadows.sm,
  },
  keypadGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  keyBtn: {
    width: 64, height: 48, borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  keyText: {
    fontSize: typography.sizes.md, fontWeight: '600',
    color: colors.textPrimary,
  },

  // Confirm button
  confirmRow: {marginHorizontal: spacing.md, marginBottom: spacing.lg},
  spinner: {
    width: 20, height: 20,
    borderWidth: 2, borderColor: colors.onPaymentGreen,
    borderTopColor: 'transparent', borderRadius: 10,
  },

  // Trust footer
  trustFooter: {alignItems: 'center', paddingHorizontal: spacing.md},
  trustRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  trustPillText: {
    fontSize: typography.sizes.xs, fontWeight: '600',
    color: colors.textSecondary,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  trustDivider: {width: 4, height: 4, borderRadius: 2, backgroundColor: colors.outline},
  trustText: {
    fontSize: typography.sizes.xs, color: colors.textTertiary,
    textAlign: 'center', marginTop: spacing.xs, lineHeight: 16,
  },
});
