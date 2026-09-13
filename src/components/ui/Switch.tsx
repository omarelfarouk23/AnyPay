import React from 'react';
import {View, StyleSheet, ViewStyle, Switch as RNSwitch, Platform} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography} from '../../config/theme';

export interface SwitchProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  trackColor?: {false: string; true: string};
  thumbColor?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  value = false,
  onValueChange,
  disabled = false,
  style,
  trackColor,
  thumbColor,
}) => {
  return (
    <View style={[styles.wrapper, style]}>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={trackColor ?? {false: colors.border, true: colors.primaryLight}}
        thumbColor={thumbColor ?? colors.textOnPrimary}
        ios_backgroundColor={colors.border}
        style={styles.switch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Platform.OS === 'ios' ? 51 : 44,
    height: Platform.OS === 'ios' ? 31 : 28,
  },
  switch: {
    transform: [{scaleX: 0.9}, {scaleY: 0.9}],
  },
});
