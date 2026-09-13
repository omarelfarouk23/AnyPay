import React from 'react';
import {View, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, shadows, typography} from '../../config/theme';
import {Icon} from '../ui/Icon';
import {Card} from '../ui/Card';

export interface BalanceCardProps {
  balance?: number;
  currency?: string;
  availableBalance?: number;
  pendingAmount?: number;
  label?: string;
  walletLabel?: string;
  onDeposit?: () => void;
  onWithdraw?: () => void;
  onSend?: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'elevated' | 'minimal';
  style?: StyleProp<ViewStyle>;
}

const sizeConfig = {
  small: {balanceSize: typography.xxl, labelSize: typography.xs, cardPadding: spacing.sm},
  medium: {balanceSize: typography.xxxl, labelSize: typography.sm, cardPadding: spacing.md},
  large: {balanceSize: typography.display, labelSize: typography.md, cardPadding: spacing.lg},
};

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance = 0,
  currency = 'DA',
  availableBalance,
  pendingAmount,
  label = 'رصيدك المتاح',
  walletLabel = 'محفظة رئيسية',
  onDeposit,
  onWithdraw,
  onSend,
  size = 'medium',
  variant = 'elevated',
  style,
}) => {
  const cfg = sizeConfig[size];
  const formattedBalance = new Intl.NumberFormat('ar-DZ', {
    style: 'currency',
    currency: currency === 'DA' ? 'DZD' : currency,
  }).format(balance);

  const showActions = !!onDeposit || !!onWithdraw || !!onSend;

  const cardStyle: ViewStyle = variant === 'minimal'
    ? {backgroundColor: colors.card, borderWidth: 0, ...shadows.sm}
    : variant === 'elevated'
      ? {backgroundColor: colors.card, ...shadows.lg}
      : {backgroundColor: colors.primary, ...shadows.lg};

  return (
    <Card style={[cardStyle, styles.card, style]} padding="none">
      <View style={[styles.cardInner, {padding: cfg.cardPadding}]}>
        <View style={styles.header}>
          <View style={styles.walletInfo}>
            <View style={styles.walletIcon}>
              <Icon name="wallet" size={20} color={variant === 'minimal' ? colors.primary : colors.textOnPrimary} />
            </View>
            <Text style={[styles.walletLabel, {color: variant === 'minimal' ? colors.textSecondary : 'rgba(255,255,255,0.7)'}]}>
              {walletLabel}
            </Text>
          </View>
          {onSend && (
            <View style={[styles.actionButton, variant === 'minimal' ? styles.actionButtonMinimal : styles.actionButtonPrimary]}>
              <Icon name="sendMoney" size={18} color={variant === 'minimal' ? colors.primary : colors.textOnPrimary} />
            </View>
          )}
        </View>

        <View style={styles.spacer} />

        <View style={styles.balanceSection}>
          <Text style={[styles.label, {color: variant === 'minimal' ? colors.textSecondary : 'rgba(255,255,255,0.7)' }]}>
            {label}
          </Text>
          <Text style={[styles.balance, {color: variant === 'minimal' ? colors.textPrimary : colors.textOnPrimary}]}>
            {formattedBalance}
          </Text>
          {pendingAmount !== undefined && pendingAmount > 0 && (
            <View style={[styles.pendingRow, {borderTopColor: variant === 'minimal' ? colors.borderLight : 'rgba(255,255,255,0.2)' }]}>
              <Text style={[styles.pendingLabel, {color: variant === 'minimal' ? colors.textSecondary : 'rgba(255,255,255,0.6)' }]}>قيد الانتظار</Text>
              <Text style={[styles.pendingAmount, {color: variant === 'minimal' ? colors.warning : 'rgba(255,255,255,0.8)' }]}>
                +{new Intl.NumberFormat('ar-DZ', {style: 'currency', currency: 'DZD'}).format(pendingAmount)}
              </Text>
            </View>
          )}
          {availableBalance !== undefined && availableBalance !== balance && (
            <View style={[styles.availableRow, {borderTopColor: variant === 'minimal' ? colors.borderLight : 'rgba(255,255,255,0.2)' }]}>
              <Text style={[styles.availableLabel, {color: variant === 'minimal' ? colors.textSecondary : 'rgba(255,255,255,0.6)' }]}>متاح للاستخدام</Text>
              <Text style={[styles.availableAmount, {color: variant === 'minimal' ? colors.success : 'rgba(255,255,255,0.9)' }]}>
                {new Intl.NumberFormat('ar-DZ', {style: 'currency', currency: 'DZD'}).format(availableBalance)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.spacer} />

        {showActions && (
          <View style={styles.actionsRow}>
            {onDeposit && (
              <View style={[styles.actionChip, {backgroundColor: variant === 'minimal' ? colors.primaryAlphaStrong : colors.accent}]}>
                <Icon name="plus" size={16} color={variant === 'minimal' ? colors.primary : colors.textOnAccent} />
                <Text style={[styles.actionChipText, {color: variant === 'minimal' ? colors.primary : colors.textOnAccent}]}>إيداع</Text>
              </View>
            )}
            {onWithdraw && (
              <View style={[styles.actionChip, {backgroundColor: variant === 'minimal' ? colors.surfaceElevated : colors.surfaceElevated}]}>
                <Icon name="minus" size={16} color={variant === 'minimal' ? colors.textSecondary : colors.textSecondary} />
                <Text style={[styles.actionChipText, {color: variant === 'minimal' ? colors.textSecondary : colors.textSecondary}]}>سحب</Text>
              </View>
            )}
            {onSend && (
              <View style={[styles.actionChip, {backgroundColor: variant === 'minimal' ? colors.primaryAlphaStrong : colors.primary}]}>
                <Icon name="sendMoney" size={16} color={variant === 'minimal' ? colors.primary : colors.textOnPrimary} />
                <Text style={[styles.actionChipText, {color: variant === 'minimal' ? colors.primary : colors.textOnPrimary}]}>إرسال</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  cardInner: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  walletIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletLabel: {
    fontSize: typography.sm,
    fontWeight: typography.weights.medium,
  },
  spacer: {
    height: spacing.md,
  },
  balanceSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: spacing.md,
  },
  label: {
    fontSize: typography.sm,
    fontWeight: typography.weights.medium,
    letterSpacing: 0.5,
  },
  balance: {
    fontSize: typography.xxxl,
    fontWeight: typography.weights.bold,
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    marginTop: spacing.sm,
  },
  pendingLabel: {
    fontSize: typography.xs,
    fontWeight: typography.weights.medium,
  },
  pendingAmount: {
    fontSize: typography.sm,
    fontWeight: typography.weights.semibold,
  },
  availableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  availableLabel: {
    fontSize: typography.xs,
    fontWeight: typography.weights.medium,
  },
  availableAmount: {
    fontSize: typography.sm,
    fontWeight: typography.weights.semibold,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  actionButtonPrimary: {
    backgroundColor: colors.accent,
  },
  actionButtonMinimal: {
    backgroundColor: colors.primaryAlphaStrong,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    minWidth: 72,
  },
  actionChipText: {
    fontSize: typography.sm,
    fontWeight: typography.weights.semibold,
  },
});
