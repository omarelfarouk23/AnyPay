import React from 'react';
import {View, Text, StyleSheet, Pressable, ViewStyle, ActivityIndicator, Text as RNText} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, shadows, typography} from '../../config/theme';
import {Icon} from '../ui/Icon';
import {formatCurrency} from '../../utils/formatters';

export interface PaymentButtonProps {
  amount?: number;
  currency?: string;
  label?: string;
  variant?: PaymentButtonVariant;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: ViewStyle;
}

export type PaymentButtonVariant = 'primary' | 'secondary' | 'outline' | 'accent' | 'minimal' | 'textPrimary';

const variantStyles: Record<
  PaymentButtonVariant,
  {container: ViewStyle; textColor: string; background: string}
> = {
  primary: {
    container: {backgroundColor: colors.primary, ...shadows.md},
    textColor: colors.textOnPrimary,
    background: colors.primary,
  },
  secondary: {
    container: {backgroundColor: colors.primaryLight, ...shadows.md},
    textColor: colors.textOnPrimary,
    background: colors.primaryLight,
  },
  accent: {
    container: {backgroundColor: colors.accent, ...shadows.md},
    textColor: colors.textOnAccent,
    background: colors.accent,
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.primary,
    },
    textColor: colors.primary,
    background: 'transparent',
  },
  minimal: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    textColor: colors.textPrimary,
    background: 'transparent',
  },
  textPrimary: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    textColor: colors.textPrimary,
    background: 'transparent',
  },
};

const sizeStyles = {
  small: {paddingVertical: spacing.xs, paddingHorizontal: spacing.md, minHeight: 40, fontSize: typography.sm},
  medium: {paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, minHeight: 48, fontSize: typography.md},
  large: {paddingVertical: spacing.md, paddingHorizontal: spacing.xl, minHeight: 56, fontSize: typography.lg},
};

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  currency = 'DA',
  label,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onPress,
  rightElement,
  leftElement,
  style,
  textStyle,
}) => {
  const vs = variantStyles[variant];
  const sz = sizeStyles[size];

  const displayText = label ?? (
    amount !== undefined
      ? `${formatCurrency(amount, currency)}`
      : 'إرسال'
  );

  if (!onPress) {
    return (
      <View style={[styles.container, {backgroundColor: vs.background, opacity: disabled ? 0.5 : 1}, style]}>
        <View style={[styles.content, vs.container]}>
          {leftElement && <View style={styles.leftElement}>{leftElement}</View>}
          <Text style={[styles.label, {color: vs.textColor, ...sz, ...textStyle}]}>
            {displayText}
          </Text>
          {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
        </View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.container, vs.container, sz, disabled || loading ? {opacity: 0.5} : {}, style]}
      accessibilityRole="button"
      accessibilityLabel={label ?? displayText}
      accessibilityState={{disabled: disabled || loading, busy: loading}}>
      <View style={styles.content}>
        {leftElement && <View style={styles.leftElement}>{leftElement}</View>}
        {loading ? (
          <ActivityIndicator size="small" color={vs.textColor} />
        ) : (
          <Text style={[styles.label, {color: vs.textColor, ...sz, ...textStyle}]}>
            {displayText}
          </Text>
        )}
        {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  leftElement: {
    marginRight: spacing.sm,
  },
  rightElement: {
    marginLeft: spacing.sm,
  },
  label: {
    textAlign: 'center',
    fontWeight: typography.weights.semibold,
  },
});
