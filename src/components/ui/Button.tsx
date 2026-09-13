import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography} from '../../config/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
export type ButtonSize = 'small' | 'medium' | 'large' | 'lg';

const BUTTON_SIZE_MAP: Record<string, {paddingVertical: number; paddingHorizontal: number; minHeight: number; fontSize: number}> = {
  small: {paddingVertical: spacing.xs, paddingHorizontal: spacing.md, minHeight: 36, fontSize: typography.sizes.sm},
  medium: {paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, minHeight: 46, fontSize: typography.sizes.md},
  large: {paddingVertical: spacing.md, paddingHorizontal: spacing.xl, minHeight: 54, fontSize: typography.sizes.lg},
  lg: {paddingVertical: spacing.md, paddingHorizontal: spacing.xl, minHeight: 54, fontSize: typography.sizes.lg},
};

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

const variantStyles: Record<ButtonVariant, {container: ViewStyle; text: TextStyle}> = {
  primary: {
    container: {backgroundColor: colors.primary},
    text: {color: colors.textOnPrimary},
  },
  secondary: {
    container: {backgroundColor: colors.primaryLight},
    text: {color: colors.textOnPrimary},
  },
  accent: {
    container: {backgroundColor: colors.accent},
    text: {color: colors.textOnAccent},
  },
  outline: {
    container: {backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary},
    text: {color: colors.primary},
  },
  ghost: {
    container: {backgroundColor: 'transparent'},
    text: {color: colors.primary},
  },
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel = title,
}) => {
  const variantStyle = variantStyles[variant];
  const sizeKey = (size as keyof typeof BUTTON_SIZE_MAP) in BUTTON_SIZE_MAP ? (size as keyof typeof BUTTON_SIZE_MAP) : 'medium';
  const sizeStyle = BUTTON_SIZE_MAP[sizeKey] ?? BUTTON_SIZE_MAP.medium;

  const buttonStyle: ViewStyle[] = [
    styles.button,
    variantStyle.container,
    sizeStyle,
    fullWidth && {width: '100%'},
    (disabled || loading) && {opacity: 0.5},
    style,
  ].filter(Boolean) as ViewStyle[];

  const labelStyle: (TextStyle | undefined)[] = [
    styles.label,
    variantStyle.text,
    sizeStyle,
    textStyle,
  ].filter(Boolean) as TextStyle[];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyle}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{disabled: disabled || loading}}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.textOnPrimary} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={labelStyle}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconContainer}>{icon}</View>}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.button,
    gap: spacing.sm,
  },
  label: {
    fontWeight: typography.weights.medium,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
