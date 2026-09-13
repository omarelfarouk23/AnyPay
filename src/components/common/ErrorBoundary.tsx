// src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../config/colors';
import { spacing, borderRadius, shadows, typography } from '../../config/theme';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <View style={styles.container}>
            <Text style={styles.title}>حدث خطأ غير متوقع</Text>
            <Text style={styles.message}>{this.state.error?.message ?? 'يرجى إعادة تحميل التطبيق'}</Text>
            <TouchableOpacity style={styles.resetBtn} onPress={this.handleReset}>
              <Text style={styles.resetText}>إعادة المحاولة</Text>
            </TouchableOpacity>
          </View>
        )
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.background, padding: spacing.lg,
  },
  title: { fontSize: typography.xl, fontWeight: '700', color: colors.error, textAlign: 'center', marginBottom: spacing.sm },
  message: { fontSize: typography.md, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg, lineHeight: 22 },
  resetBtn: {
    backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 24,
    borderRadius: borderRadius.md,
  },
  resetText: { color: '#FFFFFF', fontSize: typography.md, fontWeight: '600' },
});
