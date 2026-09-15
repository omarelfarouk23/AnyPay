import React, {useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography, shadows} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Icon} from '../../components/ui/Icon';
import {BalanceCard} from '../../components/wallet/BalanceCard';
import {useWalletStore} from '../../store/walletStore';
import {useAuthStore} from '../../store/authStore';
import {formatDateAlgerian} from '../../utils/formatters';
import type {RootStackParamList} from '../../navigation/AppNavigator';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {walletService} from '../../services/api/wallet';
import {qrPaymentService} from '../../services/api/payment';

const ACTION_GRID = [
  {icon: 'sendMoney' as const, label: 'إرسال', sub: 'إلى أرقام', screen: 'SendMoney'},
  {icon: 'qrCodeScanner' as const, label: 'مسح رمز', sub: 'QR Code', screen: 'Scanner'},
  {icon: 'qrCode2' as const, label: 'استلام', sub: 'رمز QR', screen: 'ReceiveQR'},
  {icon: 'history' as const, label: 'سجل', sub: 'المعاملات', screen: 'TransactionHistory'},
] as const;

export const WalletScreen: React.FC = () => {
  const navigation = useNavigation();
  const stack = navigation.getParent();
  const {wallet, transactions, isLoading, setLoading, setTransactions, setWallet} = useWalletStore();
  const {user} = useAuthStore();

  const loadWalletData = useCallback(async () => {
    setLoading(true);
    try {
      const [balanceData, txData] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions(10),
      ]);
      setWallet({id: 'default', userId: user?.id ?? '', balance: balanceData.balance, totalBalance: balanceData.balance, currency: balanceData.currency, createdAt: '', updatedAt: ''});
      setTransactions(txData);
    } catch (err) {
      console.error('[WalletScreen] Failed to load wallet:', err);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setWallet, setTransactions, user?.id]);

  const handleRefresh = useCallback(() => {
    loadWalletData();
  }, [loadWalletData]);

  useEffect(() => {
    loadWalletData();
  }, []);

  const recentTransactions = transactions.slice(0, 5);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
        <Header title="محفظتي" backgroundColor={colors.primary} tintColor={colors.textOnPrimary} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <Header
        title="محفظتي"
        rightIcon={<Icon name="refresh" size={20} color={colors.textOnPrimary} />}
        rightAction={handleRefresh}
        backgroundColor={colors.primary}
        tintColor={colors.textOnPrimary}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.balanceHeader}>
          <View style={styles.greetingRow}>
            <Icon name="user" size={28} color={colors.primary} />
            <Text style={styles.greetingText}>
              مرحباً{user ? `، ${user.fullName.split(' ')[0]}` : ''}
            </Text>
          </View>
          <Text style={styles.subtitleText}>رصيدك الحالي</Text>
        </View>

        <BalanceCard
          balance={wallet?.balance ?? 0}
          currency={wallet?.currency ?? 'د.ج'}
          walletLabel={user ? `${user.fullName} — المحفظة الرئيسية` : 'محفظة رئيسية'}
          size="large"
        />

        {/* Action grid (Stitch-inspired: Send / Scan QR / Receive QR / History) */}
        <View style={styles.actionGridSection}>
          <Text style={styles.sectionTitle}>سريع</Text>
          <View style={styles.actionGrid}>
            {ACTION_GRID.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.actionButton}
                onPress={() => {
                  if (!stack) return;
                  if (item.screen === 'SendMoney') {
                    stack.navigate('PayTabs', {screen: 'SendMoney'} as never);
                  } else if (item.screen === 'Scanner') {
                    stack.navigate('PayTabs', {screen: 'Scanner'} as never);
                  } else if (item.screen === 'ReceiveQR') {
                    stack.navigate('PayTabs', {screen: 'ReceiveQR'} as never);
                  } else if (item.screen === 'TransactionHistory') {
                    stack.navigate('PayTabs', {screen: 'TransactionHistory'} as never);
                  }
                }}>
                <View style={styles.actionIcon}>
                  <Icon name={item.icon} size={22} color={colors.primary} />
                </View>
                <Text style={styles.actionLabel}>{item.label}</Text>
                <Text style={styles.actionSub}>{item.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>المعاملات الأخيرة</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>عرض الكل</Text>
            <Icon name="chevronRight" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {recentTransactions.length > 0 ? (
          recentTransactions.map((tx) => {
            const isIncoming = tx.type === 'receive' || tx.type === 'transfer' || tx.type === 'refund';
            const isOutgoing = tx.type === 'send' || tx.type === 'fee';
            return (
              <View key={tx.id} style={[styles.transactionItem, {backgroundColor: colors.card}]}>
                <View style={styles.txLeft}>
                  <View
                    style={[
                      styles.txIcon,
                      {
                        backgroundColor: isIncoming
                          ? colors.successLight
                          : colors.errorLight,
                      },
                    ]}>
                    <Icon
                      name={isIncoming ? 'money' : 'sendMoney'}
                      size={18}
                      color={isIncoming ? colors.success : colors.error}
                    />
                  </View>
                  <View style={styles.txContent}>
                    <Text style={styles.txType}>
                      {tx.type === 'send' && 'إرسال'}
                      {tx.type === 'receive' && 'استلام'}
                      {tx.type === 'transfer' && 'تحويل'}
                      {tx.type === 'fee' && 'رسوم'}
                      {tx.type === 'refund' && 'استرداد'}
                    </Text>
                    <Text style={styles.txDescription} numberOfLines={1}>
                      {tx.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.txRight}>
                  <Text
                    style={[
                      styles.txAmount,
                      {color: isOutgoing ? colors.error : colors.success},
                    ]}>
                    {tx.amount < 0 ? '-' : '+'}
                    {Math.abs(tx.amount).toLocaleString('ar-DZ')} دج
                  </Text>
                  <Text style={styles.txDate}>{formatDateAlgerian(tx.createdAt)}</Text>
                  <View
                    style={[
                      styles.txStatusBadge,
                      {
                        backgroundColor:
                          tx.status === 'completed'
                            ? colors.successLight
                            : tx.status === 'pending'
                            ? colors.warningLight
                            : tx.status === 'failed'
                            ? colors.errorLight
                            : colors.infoLight,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.txStatusText,
                        {
                          color:
                            tx.status === 'completed'
                              ? colors.success
                              : tx.status === 'pending'
                              ? colors.warning
                              : tx.status === 'failed'
                              ? colors.error
                              : colors.info,
                        },
                      ]}>
                      {tx.status === 'completed' ? 'مكتمل' : tx.status}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Icon name="money" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>لا توجد معاملات حتى الآن</Text>
            <Text style={styles.emptySubtext}>ستظهر هنا عندما تقوم بإرسال أو استلام أموال</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  balanceHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  greetingText: {
    fontSize: typography.xl,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  subtitleText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  actionGridSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryAlpha,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  actionLabel: {
    fontSize: typography.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  actionSub: {
    fontSize: typography.xs,
    color: colors.textTertiary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewAllText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txContent: {
    flex: 1,
    minWidth: 0,
  },
  txType: {
    fontSize: typography.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  txDescription: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  txAmount: {
    fontSize: typography.md,
    fontWeight: typography.weights.bold,
  },
  txDate: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
  txStatusBadge: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  txStatusText: {
    fontSize: 10,
    fontWeight: typography.weights.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: typography.lg,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: typography.md,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
