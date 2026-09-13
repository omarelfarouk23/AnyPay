// src/components/common/LoadingScreen.tsx
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../../config/colors';
import { spacing, borderRadius, shadows, typography } from '../../config/theme';

type Props = {
  message?: string;
};

export const LoadingScreen: React.FC<Props> = ({ message = 'جاري التحميل...' }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: { marginTop: spacing.md, fontSize: typography.md, color: colors.textSecondary },
});
