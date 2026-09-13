import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography} from '../../config/theme';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
  style?: ViewStyle;
  textStyle?: ViewStyle & {fontSize?: number};
  count?: number;
}

const variantStyles = {
  default: {backgroundColor: colors.surfaceElevated, color: colors.textSecondary},
  primary: {backgroundColor: colors.primaryAlphaStrong, color: colors.primary},
  accent: {backgroundColor: colors.accentAlpha, color: colors.accentDark},
  success: {backgroundColor: colors.successLight, color: colors.success},
  warning: {backgroundColor: colors.warningLight, color: colors.warning},
  error: {backgroundColor: colors.errorLight, color: colors.error},
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'small',
  style,
  textStyle,
  count,
}) => {
  const vars = variantStyles[variant];
  const fontSize = size === 'small' ? 11 : 13;
  const padding = size === 'small' ? spacing.xs : spacing.sm;

  const content =
    count !== undefined ? (
      <Text
        style={[
          {backgroundColor: vars.backgroundColor, color: vars.color, fontSize, paddingHorizontal: padding, paddingVertical: padding / 2, borderRadius: borderRadius.sm},
          textStyle,
        ]}
        numberOfLines={1}>
        {count > 99 ? '99+' : count}
      </Text>
    ) : (
      <Text
        style={[
          {backgroundColor: vars.backgroundColor, color: vars.color, fontSize, paddingHorizontal: padding, paddingVertical: padding / 2, borderRadius: borderRadius.sm},
          textStyle,
        ]}>
        {children}
      </Text>
    );

  return <View style={[style, {borderRadius: borderRadius.sm}]}>{content}</View>;
};
