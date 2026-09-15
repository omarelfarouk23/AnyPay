// src/screens/pay/ReceiveQRScreen.tsx
// Stitch design: baridipay_receive_qr — show own QR, timer, presets, share
import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Svg, Rect, Circle, Path} from 'react-native-svg';
import {colors} from '../../config/colors';
import {borderRadius, spacing, shadows, typography} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Icon} from '../../components/ui/Icon';
import {Button} from '../../components/ui/Button';
import {TextInput} from '../../components/ui/TextInput';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type ReceiveQRScreenProps = NativeStackScreenProps<{
  ReceiveQR: {presetAmount?: number};
}, 'ReceiveQR'>;

export const ReceiveQRScreen: React.FC<ReceiveQRScreenProps> = ({navigation}) => {
  const [expiresIn, setExpiresIn] = useState(60);
  const [showRefresh, setShowRefresh] = useState(false);
  const [presetChipVisible, setPresetChipVisible] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [modalAmount, setModalAmount] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setExpiresIn((prev) => {
        if (prev <= 1) {
          setShowRefresh(true);
          setTimeout(() => setShowRefresh(false), 500);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  }, []);

  const triggerRefresh = useCallback(() => {
    setShowRefresh(true);
    setTimeout(() => {
      setShowRefresh(false);
      showToast('تم تحديث الشفرة الأمنية للرمز');
    }, 500);
  }, [showToast]);

  const savePreset = useCallback(() => {
    const val = parseFloat(modalAmount.replace(/[^0-9.]/g, ''));
    if (val > 0) {
      setPresetChipVisible(true);
      setShowPresetModal(false);
      triggerRefresh();
      showToast('تم تضمين المبلغ في الرمز');
    } else {
      setShowPresetModal(false);
    }
  }, [modalAmount, triggerRefresh, showToast]);

  const cancelPreset = useCallback(() => {
    setPresetChipVisible(false);
    setModalAmount('');
    triggerRefresh();
    showToast('تم إلغاء تحديد المبلغ');
  }, [triggerRefresh, showToast]);

  const shareAction = useCallback(() => {
    showToast('تم نسخ رابط الاستلام وحفظ الرمز في الصور');
  }, [showToast]);

  // Timer ring: circumference = 2 * π * 6 ≈ 37.7
  const circumference = 37.7;
  const offset = circumference - (expiresIn / 60) * circumference;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrowBack" size={20} color={colors.onSurface} />
            </TouchableOpacity>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>استلام أموال</Text>
              <Text style={styles.headerSubtitle}>(Recevoir)</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Icon name="moreHoriz" size={20} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Brand row: AnyPay logo + label */}
        <View style={styles.brandRow}>
          <View style={styles.brandLeft}>
            <View style={styles.brandAnyPayLogo}>
              <Text style={styles.brandAnyPayLogoText}>AnyPay</Text>
            </View>
            <Text style={styles.brandLabel}>محفظة AnyPay • استلام فوري</Text>
          </View>
        </View>

        {/* QR Card */}
        <View style={styles.qrCard}>
          <View style={styles.qrSvgWrapper}>
            <Svg width={220} height={220}>
              <Rect x={0} y={0} width={220} height={220} fill="#FFFFFF" rx={12} />
              {/* Finder patterns */}
              <Rect x={16} y={16} width={56} height={56} fill={colors.textPrimary} rx={6} />
              <Rect x={22} y={22} width={44} height={44} fill="#FFFFFF" rx={4} />
              <Rect x={30} y={30} width={28} height={28} fill={colors.textPrimary} rx={2} />
              <Rect x={148} y={16} width={56} height={56} fill={colors.textPrimary} rx={6} />
              <Rect x={154} y={22} width={44} height={44} fill="#FFFFFF" rx={4} />
              <Rect x={162} y={30} width={28} height={28} fill={colors.textPrimary} rx={2} />
              <Rect x={16} y={148} width={56} height={56} fill={colors.textPrimary} rx={6} />
              <Rect x={22} y={154} width={44} height={44} fill="#FFFFFF" rx={4} />
              <Rect x={30} y={162} width={28} height={28} fill={colors.textPrimary} rx={2} />
              {/* Inner data blocks */}
              {Array.from({length: 16}).map((_, i) => (
                <Rect key={i} x={30 + (i % 4) * 20} y={30 + Math.floor(i / 4) * 20} width={10} height={10} fill={colors.textPrimary} />
              ))}
              {Array.from({length: 16}).map((_, i) => (
                <Rect key={`b-${i}`} x={145 + (i % 4) * 20} y={30 + Math.floor(i / 4) * 20} width={10} height={10} fill={colors.textPrimary} />
              ))}
              {Array.from({length: 16}).map((_, i) => (
                <Rect key={`c-${i}`} x={30 + (i % 4) * 20} y={145 + Math.floor(i / 4) * 20} width={10} height={10} fill={colors.textPrimary} />
              ))}
              {Array.from({length: 16}).map((_, i) => (
                <Rect key={`d-${i}`} x={145 + (i % 4) * 20} y={145 + Math.floor(i / 4) * 20} width={10} height={10} fill={colors.textPrimary} />
              ))}
              {/* Center logo circle */}
              <Circle cx={110} cy={110} r={24} fill={colors.paymentGreen} />
              <Circle cx={110} cy={110} r={21} fill="#FFFFFF" />
              <Path d="M101 106 L119 106 L119 114 L101 114 Z" fill={colors.paymentGreen} />
              <Path d="M106 109 L109 112 L115 106" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </Svg>
            {/* AnyPay logo badge overlay */}
            <View style={styles.qrLogoBadge}>
              <View style={styles.anypayBadgeLogo}>
                <Text style={styles.anypayBadgeText}>AnyPay</Text>
              </View>
            </View>
          </View>

          {/* Preset amount chip */}
          {presetChipVisible && (
            <View style={styles.presetChip}>
              <Text style={styles.presetChipLabel}>المبلغ المحدد:</Text>
              <Text style={styles.presetChipValue}>0.00</Text>
              <Text style={styles.presetChipCurrency}>د.ج</Text>
              <TouchableOpacity onPress={() => setPresetChipVisible(false)}>
                <Icon name="cancel" size={14} color={colors.outline} />
              </TouchableOpacity>
            </View>
          )}

          {/* Timer ring */}
          <View style={styles.timerRow}>
            <View style={styles.timerRingInner}>
              <Svg width={16} height={16}>
                <Circle cx={8} cy={8} r={6} stroke={colors.outline} strokeWidth={2} fill="none" />
                <Circle
                  cx={8} cy={8} r={6}
                  stroke={colors.paymentGreen}
                  strokeWidth={2}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  transform={`rotate(-90 8 8)`}
                />
              </Svg>
            </View>
            <Text style={styles.timerLabel}>
              يتجدد الرمز تلقائياً خلال{' '}
              <Text style={styles.timerValue}>{expiresIn}</Text>{' '}
              ثانية
            </Text>
            <TouchableOpacity onPress={triggerRefresh}>
              <Icon name="replay" size={16} color={colors.paymentGreen} />
            </TouchableOpacity>
          </View>

          {/* Refresh overlay when regenerating */}
          {showRefresh && (
            <View style={styles.refreshIndicator}>
              <Icon name="sync" size={32} color={colors.paymentGreen} />
              <Text style={styles.refreshIndicatorText}>جاري تحديث الرمز المشفر...</Text>
            </View>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtnOutline} onPress={() => setShowPresetModal(true)}>
            <Icon name="sell" size={18} color={colors.paymentGreen} />
            <Text style={styles.actionBtnLabel}>تحديد مبلغ</Text>
            <Text style={styles.actionBtnSub}>(د.ج)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnGreen} onPress={shareAction}>
            <Icon name="iosShare" size={18} color={colors.onPaymentGreen} />
            <Text style={[styles.actionBtnLabel, {color: colors.onPaymentGreen}]}>حفظ / مشاركة</Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          تنبيه: الرمز خاص بحسابك الشخصي ومطابق لمعايير الأمان الوطنية EMVCo.
        </Text>

        {/* Info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Icon name="bolt" size={18} color={colors.onPaymentGreen} />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>تحويل حر وفوري 100%</Text>
            <Text style={styles.infoBody}>
              استلم أموالك فورياً ومجاناً عبر مسح الرمز من أي تطبيق بريدي موب، بريدي باي،
              أو تطبيق بنكي معتمد من شبكة SATIM.
            </Text>
          </View>
        </View>

        {/* Trust stamps */}
        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Icon name="lock" size={14} color={colors.paymentGreen} />
            <Text style={styles.trustLabel}>Secured by Algérie Poste • GIE Monétique</Text>
          </View>
          <Text style={styles.trustDivider}>•</Text>
          <View style={styles.trustItem}>
            <Icon name="verifiedUser" size={14} color={colors.outline} />
            <Text style={[styles.trustLabel, {color: colors.outline}]}>SATIM Interoperable</Text>
          </View>
        </View>
      </ScrollView>

      {/* Amount preset modal */}
      {showPresetModal && (
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Icon name="priceChange" size={20} color={colors.paymentGreen} />
                <Text style={styles.modalTitle}>تحديد مبلغ الاستلام المسبق</Text>
              </View>
              <TouchableOpacity onPress={() => setShowPresetModal(false)}>
                <Icon name="close" size={20} color={colors.outline} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDesc}>
              أدخل القيمة المطلوبة لتضمينها مباشرة في رمز QR، لتسهيل عملية الدفع
              للطرف الآخر بدون إدخال يدوي.
            </Text>
            <View style={styles.modalAmountRow}>
              <TextInput
                value={modalAmount}
                onChangeText={setModalAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                containerStyle={styles.modalAmountInput}
                inputStyle={styles.modalAmountInputText}
                textAlign="left"
              />
              <Text style={styles.modalAmountCurrency}>د.ج (DZD)</Text>
            </View>
            <View style={styles.quickAmtsGrid}>
              {[500, 1000, 2000, 5000].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={styles.quickAmtBtn}
                  onPress={() => setModalAmount(v.toString())}>
                  <Text style={styles.quickAmtText}>{v.toLocaleString()} دج</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <Button
                title="تحديث رمز QR"
                onPress={savePreset}
                variant="primary"
                fullWidth
              />
              <Button
                title="إلغاء"
                onPress={cancelPreset}
                variant="ghost"
                fullWidth
                style={{marginTop: spacing.sm}}
              />
            </View>
          </View>
        </View>
      )}

      {/* Toast */}
      <View style={[styles.toast, toastVisible && styles.toastVisible]}>
        <Icon name="checkCircle" size={18} color={colors.paymentGreen} />
        <Text style={styles.toastText}>{toastMsg}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  scrollContent: {paddingBottom: spacing.xxxl},

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.md,
  },
  headerLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1},
  headerTitleRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  headerTitle: {fontSize: typography.sizes.md, fontWeight: '600', color: colors.textPrimary},
  headerSubtitle: {fontSize: typography.sizes.xs, color: colors.textSecondary},

  // Brand row
  brandRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingBottom: spacing.md,
  },
  brandLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  brandAnyPayLogo: {
    width: 32, height: 32, borderRadius: 6,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center', justifyContent: 'center',
  },
  brandAnyPayLogoText: {fontSize: 12, fontWeight: '700', color: colors.textPrimary},
  brandLabel: {fontSize: typography.sizes.md, fontWeight: '600', color: colors.textPrimary},

  // QR Card
  qrCard: {
    marginHorizontal: spacing.md, marginBottom: spacing.md,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.xl, padding: spacing.lg,
    alignItems: 'center', ...shadows.sm,
  },
  qrSvgWrapper: {position: 'relative', width: 220, height: 220},
  qrLogoBadge: {
    position: 'absolute', left: '50%', top: '50%',
    marginLeft: -24, marginTop: -24,
    width: 48, height: 48, borderRadius: borderRadius.md,
    backgroundColor: "#FFFFFF",
    borderWidth: 2, borderColor: colors.surfaceContainerHighest,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.sm,
  },
  anypayBadgeLogo: {alignItems: 'center', justifyContent: 'center'},
  anypayBadgeText: {fontSize: 8, fontWeight: '700', color: colors.paymentGreen},

  // Preset chip
  presetChip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full, marginTop: spacing.md,
  },
  presetChipLabel: {fontSize: typography.sizes.xs, color: colors.textSecondary},
  presetChipValue: {
    fontSize: typography.sizes.md, fontWeight: '700',
    color: colors.paymentGreen, fontFamily: 'monospace',
  },
  presetChipCurrency: {fontSize: typography.sizes.xs, color: colors.paymentGreen, fontWeight: '600'},

  // Timer row
  timerRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full, marginTop: spacing.md,
  },
  timerRingInner: {width: 16, height: 16},
  timerLabel: {flex: 1, fontSize: typography.sizes.xs, color: colors.textSecondary},
  timerValue: {fontWeight: '600', color: colors.textPrimary, fontFamily: 'monospace'},
  refreshIndicator: {
    position: 'absolute', inset: 0, backgroundColor: colors.surfaceContainerHighest + 'EE',
    borderRadius: borderRadius.xl, alignItems: 'center', justifyContent: 'center',
  },
  refreshIndicatorText: {marginTop: spacing.sm, fontSize: typography.sizes.xs, color: colors.textPrimary},

  // Action buttons
  actionRow: {
    flexDirection: 'row', gap: spacing.sm, marginHorizontal: spacing.md, marginBottom: spacing.sm,
  },
  actionBtnOutline: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.surfaceContainerHighest,
    paddingVertical: spacing.md, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border,
  },
  actionBtnGreen: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.paymentGreen,
    paddingVertical: spacing.md, borderRadius: borderRadius.md,
  },
  actionBtnLabel: {fontSize: typography.sizes.sm, fontWeight: '600', color: colors.textPrimary},
  actionBtnSub: {fontSize: typography.sizes.xs, color: colors.textSecondary},

  // Disclaimer
  disclaimer: {
    textAlign: 'center', fontSize: typography.sizes.xs, color: colors.textSecondary,
    marginHorizontal: spacing.md, marginBottom: spacing.md,
  },

  // Info card
  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    backgroundColor: colors.surfaceContainerLow,
    marginHorizontal: spacing.md, padding: spacing.md, borderRadius: borderRadius.lg,
  },
  infoIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.paymentGreenAlpha,
    alignItems: 'center', justifyContent: 'center',
  },
  infoText: {flex: 1},
  infoTitle: {fontSize: typography.sizes.md, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.xs / 2},
  infoBody: {fontSize: typography.sizes.xs, color: colors.textSecondary, lineHeight: 18},

  // Trust stamps
  trustRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    marginTop: spacing.md, marginHorizontal: spacing.md,
  },
  trustItem: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  trustLabel: {fontSize: typography.sizes.xs, color: colors.textSecondary, fontWeight: '500'},
  trustDivider: {color: colors.textSecondary},

  // Modal
  modalBackdrop: {
    position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end', paddingBottom: 20,
  },
  modalCard: {
    backgroundColor: colors.surfaceContainerHighest, borderRadius: borderRadius.xl * 2,
    padding: spacing.lg, maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  modalHeaderLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1},
  modalTitle: {fontSize: typography.sizes.md, fontWeight: '600', color: colors.textPrimary},
  modalDesc: {fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: spacing.md, lineHeight: 18},
  modalAmountRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderRadius: borderRadius.lg, gap: spacing.md,
  },
  modalAmountInput: {flex: 1},
  modalAmountInputText: {fontSize: typography.sizes.md, fontWeight: '700', color: colors.textPrimary},
  modalAmountCurrency: {fontSize: typography.sizes.sm, fontWeight: '700', color: colors.textSecondary},
  quickAmtsGrid: {flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md},
  quickAmtBtn: {
    flex: 1, backgroundColor: colors.surface,
    paddingVertical: spacing.sm, borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  quickAmtText: {fontSize: typography.sizes.xs, fontWeight: '500', color: colors.textPrimary, fontFamily: 'monospace'},
  modalActions: {gap: 0},

  // Toast
  toast: {
    position: 'absolute', bottom: 90, left: 0, right: 0, alignItems: 'center',
    flexDirection: 'row', gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    opacity: 0, pointerEvents: 'none',
    ...shadows.sm,
  },
  toastVisible: {opacity: 1},
  toastText: {fontSize: typography.sizes.xs, color: colors.textPrimary, fontWeight: '500'},
});
