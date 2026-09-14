import React from 'react';
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

export const WalletScreen: React.FC = () => {
  const {wallet, transactions, isLoading} = useWalletStore();
  const {user} = useAuthStore();

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
        rightIcon={<Icon name="settings" size={20} color={colors.textOnPrimary} />}
        rightAction={() => {}}
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
          onSend={() => {}}
          size="large"
        />

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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
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
