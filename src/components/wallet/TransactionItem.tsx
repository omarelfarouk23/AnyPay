import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography, shadows} from '../../config/theme';
import {Icon} from '../ui/Icon';
import {formatDateAlgerian, formatCurrency} from '../../utils/formatters';

export interface TransactionItemProps {
  id: string;
  type: 'sent' | 'received' | 'transfer' | 'payment' | 'refund' | 'withdrawal' | 'deposit';
  amount: number;
  currency?: string;
  description: string;
  counterparty?: string;
  counterpartyAvatar?: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  date: string;
  timestamp?: string;
  reference?: string;
  fee?: number;
  onPress?: () => void;
  showIcon?: boolean;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

const typeConfig: Record<
  TransactionItemProps['type'],
  {icon: string; label: string; color: string}
> = {
  sent: {icon: 'sendMoney', label: 'إرسال', color: colors.error},
  received: {icon: 'money', label: 'استلام', color: colors.success},
  transfer: {icon: 'transfer', label: 'تحويل', color: colors.info},
  payment: {icon: 'creditCard', label: 'دفع', color: colors.warning},
  refund: {icon: 'refresh', label: 'استرداد', color: colors.success},
  withdrawal: {icon: 'withdrawal', label: 'سحب', color: colors.textSecondary},
  deposit: {icon: 'plus', label: 'إيداع', color: colors.success},
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
  id,
  type,
  amount,
  currency = 'DA',
  description,
  counterparty,
  counterpartyAvatar,
  status,
  date,
  timestamp,
  reference,
  fee,
  onPress,
  showIcon = true,
  rightElement,
  style,
}) => {
  const config = typeConfig[type] ?? typeConfig.payment;

  const statusStyles = {
    completed: {color: colors.success, bg: colors.successLight},
    pending: {color: colors.warning, bg: colors.warningLight},
    failed: {color: colors.error, bg: colors.errorLight},
    processing: {color: colors.info, bg: colors.infoLight},
  };

  const statusColor = statusStyles[status]?.color ?? colors.textSecondary;

  const displayAmount = amount < 0
    ? `- ${formatCurrency(Math.abs(amount), currency)}`
    : `+ ${formatCurrency(amount, currency)}`;

  const amountColor = amount < 0 ? colors.textPrimary : colors.success;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.leftSection}>
        {showIcon && (
          <View style={[styles.iconContainer, {backgroundColor: config.color}]}>
            <Icon name={config.icon} size={20} color={colors.textOnPrimary} />
          </View>
        )}
        {!showIcon && (counterparty || counterpartyAvatar) && (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{counterparty?.[0] ?? '👤'}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.typeLabel, {color: config.color}]}>{config.label}</Text>
          {rightElement ?? (
            <View style={[styles.statusBadge, {backgroundColor: statusStyles[status]?.bg}] as any}>
              <Text style={[styles.statusText, {color: statusColor}]}>
                {status === 'completed' ? 'مكتمل' :
                 status === 'pending' ? 'قيد الانتظار' :
                 status === 'failed' ? 'فاشل' : 'جاري المعالجة'}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>

        {counterparty && (
          <View style={styles.counterpartyRow}>
            {counterpartyAvatar ? (
              <Text style={styles.counterpartyInitial}>{counterpartyAvatar[0]}</Text>
            ) : (
              <Icon name="user" size={14} color={colors.textTertiary} />
            )}
            <Text style={styles.counterparty} numberOfLines={1}>
              {counterparty}
            </Text>
          </View>
        )}

        <View style={styles.footerRow}>
          <Text style={styles.date}>{formatDateAlgerian(date)}</Text>
          {timestamp && (
            <>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.time}>{timestamp}</Text>
            </>
          )}
          {reference && (
            <>
              <Text style={styles.dot}>•</Text>
              <Text style={[styles.reference, {color: colors.textTertiary}]}>
                {reference}
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.amountSection}>
        <Text style={[styles.amount, {color: amountColor}]}>
          {displayAmount}
        </Text>
        {fee !== undefined && fee > 0 && (
          <Text style={styles.fee}>
            +{formatCurrency(fee, currency)} رسوم
          </Text>
        )}
        {type === 'sent' && (
          <View style={styles.arrowIndicator}>
            <Icon name="sendMoney" size={14} color={colors.textTertiary} />
          </View>
        )}
        {type === 'received' && (
          <View style={styles.arrowIndicator}>
            <Icon name="money" size={14} color={colors.success} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  leftSection: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryAlpha,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  typeLabel: {
    fontSize: typography.sm,
    fontWeight: typography.weights.medium,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.xs,
    fontWeight: typography.weights.medium,
  },
  description: {
    fontSize: typography.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  counterpartyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  counterpartyInitial: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primaryAlpha,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  counterparty: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  date: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  dot: {
    fontSize: 8,
    color: colors.textTertiary,
    lineHeight: 8,
    marginHorizontal: spacing.xs,
  },
  time: {
    fontSize: typography.sm,
    color: colors.textTertiary,
  },
  reference: {
    fontSize: typography.sm,
    fontWeight: typography.weights.medium,
  },
  amountSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 90,
  },
  amount: {
    fontSize: typography.md,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.3,
    marginBottom: spacing.xs,
  },
  fee: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    fontWeight: typography.weights.medium,
  },
  arrowIndicator: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: colors.card,
    borderRadius: borderRadius.full,
    padding: 2,
  },
});
