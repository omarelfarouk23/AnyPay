import React, {useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography, shadows} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Icon} from '../../components/ui/Icon';
import {TransactionItem} from '../../components/wallet/TransactionItem';
import {useWalletStore} from '../../store/walletStore';
import {useTheme} from '../../hooks/useTheme';
import {formatDateAlgerian} from '../../utils/formatters';
import {walletService} from '../../services/api/wallet';

export const TransactionHistoryScreen: React.FC = () => {
  const {transactions, setTransactions, isLoading, setLoading} = useWalletStore();
  const {colors: themeColors} = useTheme();

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await walletService.getTransactions(20);
      setTransactions(data);
    } catch (err) {
      console.error('[TransactionHistory] Failed:', err);
    } finally {
      setLoading(false);
    }
  }, [setTransactions, setLoading]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const renderItem = ({item}: {item: any}) => (
    <TransactionItem
      id={item.id}
      type={item.type}
      amount={item.amount}
      currency={item.currency}
      description={item.description}
      status={item.status}
      date={item.createdAt}
      onPress={() => {}}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="history" size={52} color={colors.textTertiary} />
      <Text style={styles.emptyTitle}>لا توجد سجلاات</Text>
      <Text style={styles.emptySubtitle}>ستظهر هنا كل معاملاتك</Text>
    </View>
  );

  const filterHeader = () => (
    <View style={styles.filterContainer}>
      <View style={[styles.filterOption, styles.activeFilter]}>
        <Text style={styles.filterText}>الكل</Text>
      </View>
      <View style={styles.filterOption}>
        <Text style={styles.filterTextInactive}>إرسال</Text>
      </View>
      <View style={styles.filterOption}>
        <Text style={styles.filterTextInactive}>استلام</Text>
      </View>
      <View style={styles.filterOption}>
        <Text style={styles.filterTextInactive}>تحويل</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <Header
        title="سجل المعاملات"
        leftIcon={<Text style={styles.backText}>←</Text>}
        leftAction={() => {}}
        backgroundColor={colors.primary}
        tintColor={colors.textOnPrimary}
      />
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={filterHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{height: 1}} />}
      />
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
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  filterOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    borderRadius: borderRadius.sm,
  },
  activeFilter: {
    borderBottomColor: colors.primary,
  },
  filterText: {
    fontSize: typography.sm,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
  filterTextInactive: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: typography.lg,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: typography.md,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
