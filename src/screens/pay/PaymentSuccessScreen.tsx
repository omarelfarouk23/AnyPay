// src/screens/pay/PaymentSuccessScreen.tsx
// Stitch design: baridipay_payment_success — emerald check hero, receipt grid, reward, trust stamps
import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Svg, Rect, Circle, Path} from 'react-native-svg';
import {colors} from '../../config/colors';
import {borderRadius, spacing, shadows, typography} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Icon} from '../../components/ui/Icon';
import {Button} from '../../components/ui/Button';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type PaymentSuccessScreenProps = NativeStackScreenProps<{
  PaymentSuccess: {
    reference: string;
    amount: number;
    merchantName: string;
    balanceAfter: number;
    rewardPoints?: number;
  };
}, 'PaymentSuccess'>;

export const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({route, navigation}) => {
  const {reference, amount, merchantName, balanceAfter, rewardPoints} = route.params;
  const [copied, setCopied] = useState(false);

  const copyRef = useCallback(() => {
    // On native, use Clipboard; for now just toggle UI
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }, [reference]);

  const formattedAmount = new Intl.NumberFormat('fr-DZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  const formattedBalance = new Intl.NumberFormat('fr-DZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balanceAfter);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Close bar */}
        <View style={styles.closeBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="close" size={20} color={colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.closeBarPill}>
            <Icon name="verifiedUser" size={16} color={colors.paymentGreen} />
            <Text style={styles.closeBarText}>معاملة مشفرة وآمنة</Text>
          </View>
        </View>

        {/* Hero: AnyPay badge + emerald check */}
        <View style={styles.hero}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Svg width={20} height={20}>
                <Rect x={0} y={0} width={20} height={20} fill={colors.surfaceContainerHigh} rx={3} />
                <Rect x={4} y={4} width={12} height={12} fill={colors.primary} rx={2} />
                <Path d="M8 8 L12 8 L12 12 L8 12 Z" fill="#fff" />
              </Svg>
              <Text style={styles.badgeText}>AnyPay</Text>
            </View>
            <Text style={styles.badgeSub}>• إيصل AnyPay المعتمد</Text>
          </View>

          <View style={styles.checkHero}>
            <View style={styles.checkCircle}>
              <Icon name="check" size={44} color={colors.onPaymentGreen} />
            </View>
            <View style={styles.boltBadge}>
              <Icon name="bolt" size={12} color={colors.onPaymentGreen} />
            </View>
          </View>

          <Text style={styles.successHeadline}>تم الدفع بنجاح</Text>
          <Text style={styles.successSubheadline}>Paiement Réussi • Transaction Validée</Text>

          <View style={styles.recipientPill}>
            <Icon name="storefront" size={16} color={colors.paymentGreen} />
            <Text style={styles.recipientText}>{merchantName}</Text>
            <Text style={styles.recipientSub}>(Supermarché El-Saada)</Text>
          </View>

          <View style={styles.amountHero}>
            <Text style={styles.amountHeroValue}>{formattedAmount}</Text>
            <Text style={styles.amountHeroCurrency}>د.ج</Text>
          </View>

          <View style={styles.successPill}>
            <Icon name="checkCircle" size={14} color={colors.paymentGreen} />
            <Text style={styles.successPillText}>تم استلام الدفعة فوريًا</Text>
          </View>
        </View>

        {/* Merchant card + map preview */}
        <View style={styles.merchantCard}>
          <View style={styles.merchantTop}>
            <View style={styles.merchantAvatar}>
              <Svg width={48} height={48}>
                <Rect x={0} y={0} width={48} height={48} fill={colors.paymentGreen} rx={10} />
                <Rect x={8} y={8} width={32} height={32} fill="#fff" rx={6} />
                <Path d="M14 16 L34 16 L34 32 L14 32 Z" fill={colors.paymentGreen} />
                <Path d="M18 20 L30 20 L30 30 L18 30 Z" fill="#fff" />
              </Svg>
            </View>
            <View style={styles.merchantInfo}>
              <Text style={styles.merchantName}>متجر السعادة للمواد الغذائية</Text>
              <Text style={styles.merchantLoc}>الجزائر العاصمة • فرع ديدوش مراد</Text>
            </View>
            <Icon name="receiptLong" size={20} color={colors.paymentGreen} />
          </View>
          <View style={styles.mapPreview}>
            <Svg width="100%" height={96}>
              <Rect x={0} y={0} width="100%" height={96} fill={colors.infoLight} rx={8} />
              <Path
                d="M24 72 L48 40 L72 56 L96 24 L120 48 L144 20 L168 36 L192 16 L216 48 L240 28"
                stroke={colors.outline} strokeWidth={1.5} fill="none"
              />
              <Path d="M120 24 L128 24 L128 32 L120 32 Z" fill={colors.paymentGreen} />
              <Circle cx="124" cy="28" r={6} fill="#fff" />
            </Svg>
            <View style={styles.mapPin}>
              <Icon name="locationOn" size={10} color={colors.onPaymentGreen} />
            </View>
            <Text style={styles.mapLabel}>نقطة البيع #104</Text>
          </View>
        </View>

        {/* Receipt grid */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <View style={styles.receiptBadge}>
              <Svg width={12} height={12}>
                <Rect x={0} y={0} width={12} height={12} fill={colors.primary} rx={2} />
                <Path d="M3 6 L6 3 L9 6 L6 9 Z" fill="#fff" />
              </Svg>
              <Text style={styles.receiptBadgeText}>إيصال AnyPay المالي (Reçu)</Text>
            </View>
            <Text style={styles.receiptStatus}>مكتمل وموثق</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.rowIcon}><Icon name="creditCard" size={18} color={colors.outline} /></View>
            <Text style={styles.rowLabel}>طريقة الدفع</Text>
            <View style={styles.rowValue}>
              <View style={styles.dot} />
              <Text style={styles.rowValueText}>الحساب البريدي CCP (Edahabia •••• 8842)</Text>
            </View>
          </View>
          <View style={styles.hairline} />

          <View style={styles.row}>
            <View style={styles.rowIcon}><Icon name="tag" size={18} color={colors.outline} /></View>
            <Text style={styles.rowLabel}>الرقم المرجعي</Text>
            <TouchableOpacity style={styles.refButton} onPress={copyRef}>
              <Text style={[styles.refText, copied && styles.refTextCopied]}>{reference}</Text>
              <Icon name={copied ? 'check' : 'contentCopy'} size={16} color={colors.paymentGreen} />
            </TouchableOpacity>
          </View>
          <View style={styles.hairline} />

          <View style={styles.row}>
            <View style={styles.rowIcon}><Icon name="schedule" size={18} color={colors.outline} /></View>
            <Text style={styles.rowLabel}>التاريخ والوقت</Text>
            <Text style={styles.rowValueText}>اليوم، 14:32:15</Text>
          </View>
          <View style={styles.hairline} />

          <View style={styles.row}>
            <View style={styles.rowIcon}><Icon name="priceChange" size={18} color={colors.outline} /></View>
            <Text style={styles.rowLabel}>رسوم الخدمة (Frais)</Text>
            <View style={styles.feePill}>
              <Text style={styles.feePillText}>مجانيًا</Text>
              <Text style={styles.feeValue}>0.00 د.ج</Text>
            </View>
          </View>
          <View style={styles.hairline} />

          <View style={styles.row}>
            <View style={styles.rowIcon}><Icon name="accountBalanceWallet" size={18} color={colors.outline} /></View>
            <Text style={styles.rowLabel}>الرصيد المتبقي</Text>
            <View style={styles.balanceValue}>
              <Text style={styles.balanceText}>{formattedBalance}</Text>
              <Text style={styles.balanceCurrency}>د.ج</Text>
            </View>
          </View>
        </View>

        {/* Reward card */}
        <View style={styles.rewardCard}>
          <View style={styles.rewardLeft}>
            <View style={styles.rewardIcon}>
              <Icon name="cardGiftcard" size={22} color={colors.paymentGreen} />
            </View>
            <View style={styles.rewardText}>
              <Text style={styles.rewardTitle}>كسبت +42 نقطة مكافأة!</Text>
              <Text style={styles.rewardSub}>تمت إضافتها لرصيد الولاء الخاص بك</Text>
            </View>
          </View>
          <Icon name="arrowForward" size={18} color={colors.outline} />
        </View>

        {/* Primary + secondary actions */}
        <View style={styles.actions}>
          <Button
            title="تم (Terminé)"
            onPress={() => navigation.popToTop()}
            variant="primary"
            size="large"
            fullWidth
            icon={<Icon name="check" size={20} color={colors.onPaymentGreen} />}
          />
          <Button
            title="مشاركة الإيصال (Partager le reçu)"
            onPress={() => {}}
            variant="secondary"
            size="large"
            fullWidth
            icon={<Icon name="share" size={20} color={colors.primary} />}
          />
        </View>

        {/* Trust stamps */}
        <View style={styles.trustSection}>
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Icon name="verified" size={16} color={colors.paymentGreen} />
              <Text style={styles.trustText}>بريد الجزائر</Text>
            </View>
            <View style={styles.trustDot} />
            <View style={styles.trustItem}>
              <Icon name="security" size={16} color={colors.secondary} />
              <Text style={styles.trustText}>SATIM GIE Monétique</Text>
            </View>
          </View>
          <Text style={styles.trustBody}>
            معاملة رقمية مؤكدة عبر منصة AnyPay وشبكة بريد الجزائر • SATIM
          </Text>
          <View style={styles.trustCode}>
            <Text style={styles.trustCodeLabel}>رمز المصادقة:</Text>
            <Text style={styles.trustCodeValue}>#DZ-ALG-2025-993240</Text>
          </View>
        </View>
      </ScrollView>

      {/* Toast */}
      <TouchableOpacity style={styles.toast} onPress={copyRef} activeOpacity={0.8}>
        <Icon name={copied ? 'checkCircle' : 'contentCopy'} size={16} color={colors.paymentGreen} />
        <Text style={styles.toastText}>
          {copied ? 'تم نسخ الرقم المرجعي' : 'انقر لنسخ الرقم المرجعي'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {paddingBottom: spacing.xxxl},

  // Close bar
  closeBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  closeBarPill: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  closeBarText: {fontSize: typography.sizes.xs, color: colors.paymentGreen, fontWeight: '500'},

  // Hero
  hero: {
    alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg,
  },
  badgeRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md},
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: spacing.sm, paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeText: {fontSize: 10, fontWeight: '700', color: colors.textPrimary, letterSpacing: 0.5},
  badgeSub: {fontSize: typography.sizes.xs, color: colors.outline},
  checkHero: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.paymentGreen,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md, ...shadows.md,
    position: 'relative',
  },
  checkCircle: {alignItems: 'center', justifyContent: 'center'},
  boltBadge: {
    position: 'absolute', top: -4, right: -4,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.onPaymentGreen, alignItems: 'center', justifyContent: 'center',
  },
  successHeadline: {
    fontSize: typography.sizes.xl, fontWeight: '700',
    color: colors.textPrimary, marginBottom: spacing.xs,
  },
  successSubheadline: {fontSize: typography.sizes.xs, color: colors.outline},
  recipientPill: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.paymentGreenAlpha,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, marginTop: spacing.md,
  },
  recipientText: {fontSize: typography.sizes.md, fontWeight: '600', color: colors.textPrimary},
  recipientSub: {fontSize: typography.sizes.xs, color: colors.outline},
  amountHero: {flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs, marginTop: spacing.md},
  amountHeroValue: {
    fontSize: 36, fontWeight: '700', color: colors.textPrimary, letterSpacing: -1,
  },
  amountHeroCurrency: {
    fontSize: typography.sizes.md, fontWeight: '600', color: colors.paymentGreen,
  },
  successPill: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.paymentGreenAlpha,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full, marginTop: spacing.md,
  },
  successPillText: {fontSize: typography.sizes.xs, color: colors.paymentGreen, fontWeight: '600'},

  // Merchant card
  merchantCard: {
    marginHorizontal: spacing.md, backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.xl, padding: spacing.md, marginBottom: spacing.md, ...shadows.sm,
  },
  merchantTop: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  merchantAvatar: {
    width: 48, height: 48, borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  merchantInfo: {flex: 1, minWidth: 0},
  merchantName: {fontSize: typography.sizes.md, fontWeight: '600', color: colors.textPrimary},
  merchantLoc: {fontSize: typography.sizes.xs, color: colors.outline, marginTop: 2},
  mapPreview: {
    position: 'relative', marginTop: spacing.sm,
    borderRadius: borderRadius.md, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
  },
  mapPin: {
    position: 'absolute', top: spacing.sm, right: spacing.md,
    backgroundColor: colors.surfaceContainerHighest, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.sm,
  },
  mapLabel: {
    position: 'absolute', bottom: spacing.sm, right: spacing.md,
    fontSize: typography.sizes.xs, color: colors.onPaymentGreen, fontWeight: '600',
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: spacing.sm, paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },

  // Receipt card
  receiptCard: {
    marginHorizontal: spacing.md, backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.xl, padding: spacing.md, marginBottom: spacing.md, ...shadows.sm,
  },
  receiptHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  receiptBadge: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  receiptBadgeText: {fontSize: typography.sizes.xs, color: colors.textSecondary, fontWeight: '500'},
  receiptStatus: {
    fontSize: typography.sizes.xs, color: colors.paymentGreen,
    fontWeight: '600', backgroundColor: colors.paymentGreenAlpha,
    paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  rowIcon: {width: 32, height: 32, alignItems: 'center', justifyContent: 'center'},
  rowLabel: {fontSize: typography.sizes.sm, color: colors.outline, flex: 1},
  rowValue: {flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  rowValueText: {fontSize: typography.sizes.sm, color: colors.textPrimary, flex: 1, fontWeight: '500'},
  refButton: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  refText: {
    fontSize: typography.sizes.sm, fontWeight: '600', color: colors.paymentGreen,
    fontFamily: 'monospace',
  },
  refTextCopied: {color: colors.success},
  dot: {width: 6, height: 6, borderRadius: 3, backgroundColor: colors.paymentGreen},
  hairline: {height: 1, backgroundColor: colors.surfaceContainerHighest, marginVertical: spacing.sm},
  feePill: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1},
  feePillText: {
    fontSize: typography.sizes.xs, color: colors.textSecondary, fontWeight: '500',
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full,
  },
  feeValue: {fontSize: typography.sizes.sm, color: colors.textPrimary},
  balanceValue: {flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs},
  balanceText: {fontSize: typography.sizes.sm, fontWeight: '600', color: colors.paymentGreen},
  balanceCurrency: {fontSize: typography.sizes.xs, color: colors.textSecondary},

  // Reward card
  rewardCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: spacing.md, backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, ...shadows.sm,
  },
  rewardLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1},
  rewardIcon: {
    width: 40, height: 40, borderRadius: borderRadius.md,
    backgroundColor: colors.paymentGreenAlpha,
    alignItems: 'center', justifyContent: 'center',
  },
  rewardText: {flex: 1, minWidth: 0},
  rewardTitle: {fontSize: typography.sizes.md, fontWeight: '600', color: colors.textPrimary},
  rewardSub: {fontSize: typography.sizes.xs, color: colors.outline, marginTop: 2},

  // Actions
  actions: {marginHorizontal: spacing.md, gap: spacing.md, marginBottom: spacing.md},

  // Trust section
  trustSection: {
    alignItems: 'center', paddingHorizontal: spacing.md, marginBottom: spacing.xl,
  },
  trustRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.md, marginBottom: spacing.sm,
  },
  trustItem: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  trustText: {fontSize: typography.sizes.xs, color: colors.textSecondary, fontWeight: '500'},
  trustDot: {width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.outline},
  trustBody: {
    fontSize: typography.sizes.xs, color: colors.outline,
    textAlign: 'center', lineHeight: 18, marginBottom: spacing.sm,
  },
  trustCode: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  trustCodeLabel: {fontSize: typography.sizes.xs, color: colors.outline, fontWeight: '500'},
  trustCodeValue: {
    fontSize: typography.sizes.xs, color: colors.textPrimary,
    fontFamily: 'monospace', fontWeight: '600',
  },

  // Toast
  toast: {
    position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center',
    flexDirection: 'row', gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, elevation: 4,
  },
  toastText: {fontSize: typography.sizes.xs, color: colors.textSecondary, fontWeight: '500'},
});
