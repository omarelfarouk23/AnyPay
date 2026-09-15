// src/screens/pay/ScannerScreen.tsx
// Stitch design: baridipay_qr_scanner — viewfinder + trusted merchants + payment sheet
import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Modal, StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Svg, Rect, Circle, Path} from 'react-native-svg';
import {colors} from '../../config/colors';
import {borderRadius, spacing, shadows, typography} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Icon} from '../../components/ui/Icon';
import {Button} from '../../components/ui/Button';
import {TextInput} from '../../components/ui/TextInput';
import {TRUSTED_MERCHANTS} from '../../data/mockData';
import {useAmountKeypad, KEYPAD_KEYS} from '../../hooks/useQRPayment';
import {qrPaymentService} from '../../services/api/payment';
import {walletService} from '../../services/api/wallet';
import {useWalletStore} from '../../store/walletStore';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import type {RootStackParamList} from '../../navigation/AppNavigator';

export type ScannerScreenProps = NativeStackScreenProps<{
  Scanner: undefined;
  ReceiveQR: {merchant: {name: string; ccpId: string}; amount: number; suggestedAmount: number};
  PaymentConfirm: {merchantId: string; merchantName: string; amount: number; ccpId?: string; note?: string};
}, 'Scanner'>;

export const ScannerScreen: React.FC<ScannerScreenProps> = ({navigation}) => {
  const [ccpBalance, setCcpBalance] = useState(0);
  const [torchOn, setTorchOn] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<typeof TRUSTED_MERCHANTS[0] | null>(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [myQrOpen, setMyQrOpen] = useState(false);
  const {display: amountDisplay, amount, pressKey, reset} = useAmountKeypad('1250');
  const [processing, setProcessing] = useState(false);
  const sheetRef = useRef<ScrollView>(null);
  const [laserPos, setLaserPos] = useState(4);

  const loadCcpBalance = useCallback(async () => {
    try {
      const data = await walletService.getBalance();
      setCcpBalance(data.balance);
    } catch {
      setCcpBalance(0);
    }
  }, []);

  useEffect(() => {
    loadCcpBalance();
  }, []);

  // Laser scanning animation
  useEffect(() => {
    const id = setInterval(() => {
      setLaserPos((p) => (p === 4 ? 95 : 4));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const openSheet = useCallback(() => {
    if (!selectedMerchant) return;
    setBottomSheetOpen(true);
  }, [selectedMerchant]);

  const quickFill = useCallback((merchant: typeof TRUSTED_MERCHANTS[0]) => {
    setSelectedMerchant(merchant);
    reset();
    setBottomSheetOpen(true);
  }, [reset]);

  const closeSheet = useCallback(() => {
    setBottomSheetOpen(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedMerchant || amount <= 0) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setBottomSheetOpen(false);
    setProcessing(false);
    // Navigate to payment confirm with merchant data
    navigation.navigate('PaymentConfirm', {
      merchantId: selectedMerchant.ccpId ?? '',
      merchantName: selectedMerchant.name,
      amount: amount,
      ccpId: selectedMerchant.ccpId,
    });
  }, [selectedMerchant, amount, navigation]);

  const torchToggle = useCallback(() => {
    setTorchOn((prev) => !prev);
  }, []);

  const merchantId = selectedMerchant?.ccpId ?? '00284918';
  const m = selectedMerchant ? selectedMerchant.name : 'متجر السعادة (Supermarché)';
  const merchantAvatarIcon = selectedMerchant ? 'point_of_sale' : 'storefront';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <Header
        title="AnyPay Scanner"
        leftIcon={<Text style={styles.backText}>←</Text>}
        leftAction={() => navigation.goBack()}
        backgroundColor={colors.primaryDark}
        tintColor={colors.textOnPrimary}
      />

      {/* Top action row: lock + gallery */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={[styles.topBtn, {backgroundColor: 'rgba(53,52,50,0.7)'}]}
          onPress={() => {}}>
          <Icon name="lock" size={18} color={colors.textOnPrimary} />
          <Text style={[styles.topLabel, {color: colors.textOnPrimary}]}>
            بريدي باي آمن (BaridiPay SSL)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.topBtn, {backgroundColor: 'rgba(53,52,50,0.7)'}]}
          onPress={() => {}}>
          <Icon name="image" size={20} color={colors.textOnPrimary} />
          <Text style={[styles.topLabel, {color: colors.textOnPrimary}]}>الصور (Album)</Text>
        </TouchableOpacity>
      </View>

      {/* Camera viewfinder */}
      <View style={styles.viewfinder}>
        {/* Simulated camera background */}
        <View style={styles.cameraBg}>
          <View style={styles.cameraGradient} />
        </View>

        {/* Reticle corners */}
        <View style={styles.reticle}>
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          {/* Laser line */}
          <View style={[styles.laserLine, {top: laserPos}]} />
        </View>

        {/* Center hint */}
        <View style={styles.centerHint}>
          <View style={styles.centerIcon}>
            <Icon name="filterCenterFocus" size={32} color={colors.textOnPrimary} />
          </View>
        </View>

        {/* Instruction text */}
        <View style={styles.instructionBox}>
          <Text style={styles.instructionText}>
            وجّه الكاميرا نحو رمز QR للتاجر أو المستلم للدفع الفوري
          </Text>
          <Text style={styles.instructionSub}>
            Alignez le code QR du commerçant dans le cadre
          </Text>
        </View>

        {/* Demo scan button */}
        <TouchableOpacity
          style={[styles.demoBtn, {backgroundColor: colors.paymentGreen}]}
          onPress={() => {
            if (TRUSTED_MERCHANTS.length > 0) {
              setSelectedMerchant(TRUSTED_MERCHANTS[0]);
              openSheet();
            }
          }}>
          <Icon name="qr_code_scanner" size={14} color={colors.onPaymentGreen} />
          <Text style={styles.demoLabel}>تجربة المسح (Scan QR)</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom utilities row: torch + my QR */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.utilityBtn}
          onPress={torchToggle}>
          <View style={[styles.utilityIconBg, {backgroundColor: 'rgba(53,52,50,0.8)'}]}>
            <Icon
              name={torchOn ? 'flashOn' : 'flashOff'}
              size={24}
              color={torchOn ? colors.paymentGreen : colors.textOnPrimary}
            />
          </View>
          <Text style={[styles.utilityLabel, {color: colors.textOnPrimary}]}>
            {torchOn ? 'إيقاف الفلاش' : 'تشغيل الفلاش'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.utilityBtn}
          onPress={() => setMyQrOpen(true)}>
          <View style={[styles.utilityIconBg, {backgroundColor: 'rgba(53,52,50,0.8)'}]}>
            <Icon name="qr_code_2" size={24} color={colors.textOnPrimary} />
          </View>
          <Text style={[styles.utilityLabel, {color: colors.textOnPrimary}]}>
            رمز الـ QR الخاص بي
          </Text>
        </TouchableOpacity>
      </View>

      {/* Trusted merchants section */}
      <View style={styles.merchantSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>تجار موثوقون بالقرب منك</Text>
          <TouchableOpacity>
            <View style={styles.sectionChevron}>
              <Icon name="chevronRight" size={14} color={colors.paymentGreen} />
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.merchantScroll}>
          {TRUSTED_MERCHANTS.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={styles.merchantCard}
              onPress={() => quickFill(m)}>
              <View style={styles.merchantAvatar}>
                <Text style={styles.merchantAvatarText}>{m.icon}</Text>
              </View>
              <View style={styles.merchantInfo}>
                <Text style={styles.merchantName}>{m.name}</Text>
                <Text style={styles.merchantSub}>
                  معرّف التاجر: {m.ccpId} • {m.location}
                </Text>
              </View>
              <View style={styles.merchantAction}>
                <View style={styles.quickBadge}>
                  <Text style={styles.quickBadgeText}>مسح سريع</Text>
                </View>
                <Icon name="chevronRight" size={18} color={colors.paymentGreen} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Payment bottom sheet */}
      <Modal
        visible={bottomSheetOpen}
        transparent
        animationType="slide"
        onRequestClose={closeSheet}>
        <View style={styles.sheetBackdrop}>
          <TouchableOpacity style={styles.sheetBackdropTouch} onPress={closeSheet} />
          <View style={styles.sheetPanel}>
            {/* Sheet handle */}
            <View style={styles.sheetHandleRow}>
              <View style={styles.sheetHandleDot} />
              <Text style={styles.sheetTitle}>تفاصيل الدفع الفوري (Paiement)</Text>
              <TouchableOpacity onPress={closeSheet}>
                <Icon name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={sheetRef}
              style={styles.sheetScroll}
              showsVerticalScrollIndicator={false}>
              {/* Merchant identity card */}
              <View style={styles.merchantCardInner}>
                <View style={styles.merchantRowInner}>
                  <View style={styles.merchantAvatarInner}>
                    <Icon name={merchantAvatarIcon} size={28} color={colors.paymentGreen} />
                  </View>
                  <View style={styles.merchantInfo}>
                    <Text style={styles.targetMerchantName} numberOfLines={1}>
                      {selectedMerchant?.name ?? 'متجر السعادة (Supermarché)'}
                    </Text>
                    <View style={styles.merchantIdRow}>
                      <Text style={styles.merchantIdLabel}>معرف التاجر:</Text>
                      <Text style={[styles.merchantIdValue, {color: colors.paymentGreen}]}>
                        {selectedMerchant?.ccpId ?? '00284918'}
                      </Text>
                      <Text style={styles.merchantIdNote}>| حساب بريد الجزائر</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.verifiedBadge}>
                  <Icon name="verified" size={18} color={colors.paymentGreen} />
                  <Text style={styles.verifiedBadgeText}>محل موثوق</Text>
                </View>
              </View>

              {/* Amount block */}
              <View style={styles.amountSection}>
                <Text style={styles.amountLabel}>المبلغ المطلوب للدفع (د.ج / DZD)</Text>
                <View style={styles.amountBox}>
                  <Text style={styles.amountCurrency}>د.ج</Text>
                  <Text style={styles.amountDisplay}>{amountDisplay}</Text>
                </View>
              </View>

              {/* CCP balance banner */}
              <View style={styles.ccpBanner}>
                <View style={styles.ccpBannerLeft}>
                  <Icon name="accountBalanceWallet" size={16} color={colors.paymentGreen} />
                  <Text style={styles.ccpBannerText}>الرصيد المتوفر في حساب CCP:</Text>
                </View>
                <Text style={styles.ccpBannerValue}>
                  {ccpBalance.toLocaleString('fr-DZ')} د.ج
                </Text>
              </View>

              {/* Keypad */}
              <View style={styles.keypad}>
                <View style={styles.keypadGrid}>
                  {KEYPAD_KEYS.map((key) => {
                    const isBack = key === 'backspace';
                    return (
                      <TouchableOpacity
                        key={key}
                        style={[styles.keyBtn, isBack && styles.keyBtnBack]}
                        onPress={() => pressKey(key as any)}>
                        <Text
                          style={[styles.keyText, isBack && styles.keyTextBack]}>
                          {isBack ? '⌫' : key}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Submit button */}
              <View style={styles.submitSection}>
                <Button
                  title={processing ? 'جاري معالجة الدفع...' : 'تأكيد ودفع عبر CCP / بريدي باي'}
                  onPress={handleSubmit}
                  disabled={!selectedMerchant || amount <= 0 || processing}
                  variant="primary"
                  size="large"
                  fullWidth
                  icon={
                    processing ? (
                      <View style={styles.spinner} />
                    ) : (
                      <Icon name="verified_user" size={22} color={colors.onPaymentGreen} />
                    )
                  }
                />
                <Text style={styles.securityNote}>
                  عملية مشفرة ومصادق عليها من بريد الجزائر (Algérie Poste)
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* My QR modal */}
      <Modal
        visible={myQrOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMyQrOpen(false)}>
        <View style={styles.myQrOverlay}>
          <View style={styles.myQrCard}>
            <Text style={styles.myQrTitle}>رمز الـ QR الشخصي</Text>
            <Svg width={180} height={180}>
              <Rect x={0} y={0} width={180} height={180} fill="#FFFFFF" rx={8} />
              <Rect x={16} y={16} width={60} height={60} fill={colors.paymentGreen} rx={6} />
              <Rect x={24} y={24} width={44} height={44} fill="#FFFFFF" rx={4} />
              <Rect x={100} y={16} width={60} height={60} fill={colors.paymentGreen} rx={6} />
              <Rect x={108} y={24} width={44} height={44} fill="#FFFFFF" rx={4} />
              <Rect x={16} y={100} width={60} height={60} fill={colors.paymentGreen} rx={6} />
              <Rect x={24} y={108} width={44} height={44} fill="#FFFFFF" rx={4} />
              <Rect x={100} y={100} width={60} height={60} fill={colors.paymentGreen} rx={6} />
              <Rect x={108} y={108} width={44} height={44} fill="#FFFFFF" rx={4} />
              <Circle cx={90} cy={90} r={24} fill={colors.paymentGreen} />
              <Circle cx={90} cy={90} r={18} fill="#FFFFFF" />
              <Path d="M81 86 L99 86 L99 102 L90 102 L90 94 L81 94 Z" fill={colors.paymentGreen} />
            </Svg>
            <Text style={styles.myQrSub}>رمز استلام آمن • ينتهي خلال 60 ثانية</Text>
            <Button
              title="إغلاق"
              onPress={() => setMyQrOpen(false)}
              variant="outline"
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.primaryDark},
  backText: {fontSize: 24, color: colors.textOnPrimary, lineHeight: 24},

  // Top row
  topRow: {
    position: 'absolute', top: 56, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  topBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  topLabel: {fontSize: typography.sizes.xs, fontWeight: '500'},

  // Viewfinder
  viewfinder: {flex: 1, position: 'relative'},
  cameraBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primaryDark,
  },
  cameraGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    opacity: 0.35,
    borderRadius: 0,
  },
  reticle: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', alignItems: 'center',
  },
  corner: {
    position: 'absolute', width: 28, height: 28,
    borderColor: colors.paymentGreen, borderWidth: 3,
  },
  cornerTL: {top: 40, left: 40, borderTopWidth: 3, borderLeftWidth: 3,
    borderBottomLeftRadius: 8, borderTopLeftRadius: 8,
    borderTopRightRadius: 0, borderBottomRightRadius: 0},
  cornerTR: {top: 40, right: 40, borderTopWidth: 3, borderRightWidth: 3,
    borderTopRightRadius: 8, borderBottomRightRadius: 8,
    borderBottomLeftRadius: 0, borderTopLeftRadius: 0},
  cornerBL: {bottom: 40, left: 40, borderBottomWidth: 3, borderLeftWidth: 3,
    borderBottomLeftRadius: 8, borderTopLeftRadius: 8,
    borderTopRightRadius: 0, borderBottomRightRadius: 0},
  cornerBR: {bottom: 40, right: 40, borderBottomWidth: 3, borderRightWidth: 3,
    borderBottomRightRadius: 8, borderTopRightRadius: 8,
    borderBottomLeftRadius: 0, borderTopLeftRadius: 0},
  laserLine: {
    position: 'absolute', left: 0, right: 0, height: 2,
    backgroundColor: colors.paymentGreen,
    shadowColor: colors.paymentGreen, shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6, shadowRadius: 12,
  },
  centerHint: {
    position: 'absolute', top: '40%', left: 0, right: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  centerIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(7,193,96,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  instructionBox: {
    position: 'absolute', bottom: 130, left: spacing.lg, right: spacing.lg,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: typography.sizes.md, color: colors.textOnPrimary,
    fontWeight: '500', textAlign: 'center', lineHeight: 20,
  },
  instructionSub: {
    fontSize: typography.sizes.xs, color: 'rgba(243,240,239,0.7)',
    textAlign: 'center', marginTop: spacing.xs,
  },
  demoBtn: {
    position: 'absolute', bottom: 110, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, gap: spacing.sm,
    elevation: 4, shadowColor: '#000', shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2, shadowRadius: 4,
  },
  demoLabel: {fontSize: typography.sizes.xs, fontWeight: '600', color: colors.onPaymentGreen},

  // Bottom utilities row
  bottomRow: {
    position: 'absolute', bottom: 16, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
  },
  utilityBtn: {
    alignItems: 'center', justifyContent: 'center',
  },
  utilityIconBg: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  utilityLabel: {fontSize: typography.sizes.xs, fontWeight: '500', textAlign: 'center'},

  // Merchant section
  merchantSection: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.md, fontWeight: '600',
    color: colors.textOnPrimary,
  },
  sectionChevron: {alignItems: 'center'},
  merchantScroll: {flexGrow: 0},
  merchantCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(53,52,50,0.8)',
    padding: spacing.md, marginRight: spacing.sm,
    borderRadius: borderRadius.md, minWidth: 160,
  },
  merchantAvatar: {
    width: 44, height: 44, borderRadius: borderRadius.md,
    backgroundColor: 'rgba(53,52,50,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  merchantAvatarText: {fontSize: 24},
  merchantInfo: {flex: 1, minWidth: 0, marginLeft: spacing.sm},
  merchantName: {
    fontSize: typography.sizes.md, fontWeight: '600',
    color: colors.textOnPrimary, marginBottom: 2,
  },
  merchantSub: {
    fontSize: typography.sizes.xs, color: 'rgba(243,240,239,0.7)',
  },
  merchantAction: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
  },
  quickBadge: {
    backgroundColor: 'rgba(7,193,96,0.3)',
    paddingHorizontal: spacing.sm, paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  quickBadgeText: {
    fontSize: typography.sizes.xs, color: colors.textOnPrimary,
    fontWeight: '500',
  },

  // Sheet
  sheetBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetBackdropTouch: {flex: 1},
  sheetPanel: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '85%',
  },
  sheetHandleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm,
  },
  sheetHandleDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.paymentGreen,
  },
  sheetTitle: {
    fontSize: typography.sizes.md, fontWeight: '600',
    color: colors.textPrimary, flex: 1,
  },
  sheetScroll: {paddingBottom: spacing.xl},

  // Merchant card in sheet
  merchantCardInner: {
    marginHorizontal: spacing.md, marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg, padding: spacing.md,
  },
  merchantRowInner: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: spacing.sm,
  },
  merchantAvatarInner: {
    width: 48, height: 48, borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center', justifyContent: 'center',
  },
  targetMerchantName: {
    fontSize: typography.sizes.lg, fontWeight: '700',
    color: colors.textPrimary, marginBottom: 2,
  },
  merchantIdRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    marginTop: spacing.xs,
  },
  merchantIdLabel: {fontSize: typography.sizes.xs, color: colors.textSecondary},
  merchantIdValue: {fontSize: typography.sizes.xs, fontWeight: '600'},
  merchantIdNote: {fontSize: typography.sizes.xs, color: colors.textTertiary},
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.paymentGreenAlpha,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full, alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  verifiedBadgeText: {
    fontSize: typography.sizes.xs, color: colors.paymentGreen,
    fontWeight: '600',
  },

  // Amount section
  amountSection: {paddingHorizontal: spacing.md, marginTop: spacing.md},
  amountLabel: {
    fontSize: typography.sizes.sm, color: colors.textSecondary,
    fontWeight: '500', marginBottom: spacing.xs,
  },
  amountBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  amountCurrency: {
    fontSize: typography.sizes.xl, fontWeight: '700',
    color: colors.paymentGreen,
  },
  amountDisplay: {
    fontSize: 28, fontWeight: '700', color: colors.textPrimary,
    letterSpacing: -1,
  },

  // CCP banner
  ccpBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.md, marginTop: spacing.sm,
    gap: spacing.sm,
  },
  ccpBannerLeft: {flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  ccpBannerText: {fontSize: typography.sizes.xs, color: colors.textSecondary},
  ccpBannerValue: {
    fontSize: typography.sizes.xs, fontWeight: '600',
    color: colors.textPrimary,
  },

  // Keypad
  keypad: {paddingHorizontal: spacing.md, marginTop: spacing.md},
  keypadGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: spacing.sm,
  },
  keyBtn: {
    width: 72, height: 48, borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  keyBtnBack: {backgroundColor: colors.surfaceContainerHigh},
  keyText: {
    fontSize: typography.sizes.headlineMd, fontWeight: '600',
    color: colors.textPrimary,
  },
  keyTextBack: {color: colors.error},

  // Submit
  submitSection: {paddingHorizontal: spacing.md, marginTop: spacing.md},
  spinner: {
    width: 20, height: 20,
    borderWidth: 2, borderColor: colors.onPaymentGreen,
    borderTopColor: 'transparent', borderRadius: 10,
  },
  securityNote: {
    fontSize: typography.sizes.xs, color: colors.textTertiary,
    textAlign: 'center', marginTop: spacing.xs,
  },

  // My QR modal
  myQrOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  myQrCard: {
    width: '90%', backgroundColor: colors.card,
    borderRadius: borderRadius.xl, padding: spacing.lg,
    alignItems: 'center',
  },
  myQrTitle: {
    fontSize: typography.sizes.md, fontWeight: '600',
    color: colors.textPrimary, marginBottom: spacing.md,
  },
  myQrSub: {
    fontSize: typography.sizes.xs, color: colors.textSecondary,
    marginTop: spacing.sm, textAlign: 'center',
  },
});
