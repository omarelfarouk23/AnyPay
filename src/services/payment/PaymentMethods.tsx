// src/services/payment/PaymentMethods.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import {usePayment} from './usePayment';
import {colors, spacing, borderRadius, typography} from '../../config/theme';

type Props = {
  onSelect?: (methodId: string) => void;
};

export const PaymentMethodsList: React.FC<Props> = ({onSelect}) => {
  const {methods} = usePayment();

  return (
    <View style={styles.list}>
      {methods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodItem,
            !method.isAvailable && styles.methodUnavailable,
          ]}
          onPress={() => method.isAvailable && onSelect?.(method.id)}
          disabled={!method.isAvailable}
          activeOpacity={0.7}
        >
          <View style={styles.methodIcon}>
            <Text style={styles.methodIconText}>
              {method.id === 'cash' ? '💵' : '🏦'}
            </Text>
          </View>
          <View style={styles.methodInfo}>
            <Text style={[styles.methodName, !method.isAvailable && styles.methodNameDisabled]}>
              {method.label}
            </Text>
            {!method.isAvailable && (
              <Text style={styles.methodStatus}>قريباً</Text>
            )}
          </View>
          {onSelect && method.isAvailable && (
            <Text style={styles.selector}>→</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {gap: spacing.sm},
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  methodUnavailable: {opacity: 0.5},
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodIconText: {fontSize: 22},
  methodInfo: {flex: 1},
  methodName: {fontSize: typography.sizes.md, fontWeight: '600', color: colors.textPrimary},
  methodNameDisabled: {color: colors.textSecondary},
  methodStatus: {fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: 2},
  selector: {fontSize: 18, color: colors.textOnPrimary, fontWeight: '600'},
});
