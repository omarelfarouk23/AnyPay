import React from 'react';
import {View, StyleSheet, ViewStyle, Pressable, StyleProp} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, shadows} from '../../config/theme';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  noBorder?: boolean;
  noShadow?: boolean;
  onPress?: () => void;
  activeOpacity?: number;
}

const paddingMap = {
  none: 0,
  small: spacing.sm,
  medium: spacing.md,
  large: spacing.lg,
};

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevated = false,
  padding = 'medium',
  noBorder = false,
  noShadow = false,
  onPress,
  activeOpacity = 0.7,
}) => {
  const paddingValue = paddingMap[padding];
  const cardStyle: StyleProp<ViewStyle> = [
    styles.card,
    (onPress || noShadow) && (onPress ? styles.pressableCard : null),
    (elevated && shadows.md) as ViewStyle,
    (noBorder && styles.noBorder) as ViewStyle,
    (noShadow && styles.noShadowStyle) as ViewStyle,
    paddingValue > 0 ? {padding: paddingValue} as ViewStyle : undefined,
    style,
  ].filter(Boolean);

  const background = onPress
    ? <Pressable style={cardStyle} onPress={onPress}>{children}</Pressable>
    : <View style={cardStyle}>{children}</View>;

  return background;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  noBorder: {
    borderWidth: 0,
  },
  noShadowStyle: {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  pressableCard: {
    opacity: 0.95,
  },
});
