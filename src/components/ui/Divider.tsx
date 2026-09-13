import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../../config/colors';
import {spacing} from '../../config/theme';

export interface DividerProps {
  style?: ViewStyle;
  color?: string;
  thickness?: number;
  marginVertical?: number;
  inset?: boolean;
}

export const Divider: React.FC<DividerProps> = ({
  style,
  color,
  thickness = 1,
  marginVertical = spacing.md,
  inset = false,
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color ?? colors.divider,
          height: thickness,
          marginVertical,
          marginHorizontal: inset ? spacing.lg : 0,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {},
});
