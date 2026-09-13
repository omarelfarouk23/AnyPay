import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography, shadows} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Avatar} from '../../components/ui/Avatar';
import {Icon} from '../../components/ui/Icon';
import {Badge} from '../../components/ui/Badge';
import {Card} from '../../components/ui/Card';
import {useAuthStore} from '../../store/authStore';
import {useTheme} from '../../hooks/useTheme';

interface AuthScreenProps {
  onLoginSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({onLoginSuccess}) => {
  const {user, isAuthenticated, loginWithCredentials} = useAuthStore();
  const {colors: themeColors} = useTheme();

  React.useEffect(() => {
    if (isAuthenticated && onLoginSuccess) {
      onLoginSuccess();
    }
  }, [isAuthenticated, onLoginSuccess]);

  const handleLoginSuccess = () => {
    onLoginSuccess?.();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
      paddingHorizontal: spacing.md,
    },
    headerTitle: {
      fontSize: typography.xxl,
      fontWeight: typography.weights.bold,
      color: colors.textOnPrimary,
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: typography.md,
      color: 'rgba(255,255,255,0.75)',
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    logoSection: {
      alignItems: 'center',
      marginTop: spacing.xl,
      marginBottom: spacing.xl,
    },
    logoCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.accent,
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
      marginBottom: spacing.md,
    },
    logoText: {
      fontSize: 32,
      fontWeight: typography.weights.bold,
      color: colors.textOnPrimary,
    },
    logoName: {
      fontSize: typography.xxl,
      fontWeight: typography.weights.bold,
      color: colors.textOnPrimary,
      letterSpacing: 1.5,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    welcomeText: {
      fontSize: typography.lg,
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.sm,
      marginBottom: spacing.lg,
    },
    infoTitle: {
      fontSize: typography.md,
      fontWeight: typography.weights.semibold,
      color: colors.primary,
      marginBottom: spacing.sm,
    },
    infoText: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    divider: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginVertical: spacing.lg,
    },
    quickActions: {
      gap: spacing.md,
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      ...shadows.sm,
    },
    actionLeft: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primaryAlpha,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    actionIcon: {
      fontSize: 22,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: typography.md,
      fontWeight: typography.weights.medium,
      color: colors.textPrimary,
    },
    actionDesc: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      marginTop: 2,
    },
    actionArrow: {
      fontSize: 18,
      color: colors.textTertiary,
      marginLeft: spacing.sm,
    },
    footer: {
      padding: spacing.lg,
      alignItems: 'center',
    },
    footerText: {
      fontSize: typography.sm,
      color: colors.textTertiary,
    },
    versionBadge: {
      backgroundColor: colors.surfaceElevated,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      marginTop: spacing.sm,
    },
    versionText: {
      fontSize: typography.xs,
      color: colors.textSecondary,
      fontWeight: typography.weights.medium,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Anypay</Text>
        <Text style={styles.headerSubtitle}>محفظة الدفع المجتمعية</Text>
      </View>

      <View style={styles.logoSection}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>A</Text>
        </View>
        <Text style={styles.logoName}>أنيباي</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>مرحباً بك في عالم الدفع السريع</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>لماذا تختار Anypay؟</Text>
          <Text style={styles.infoText}>
            تطبيق دفع آمن وموثوق يستهدف المستخدمين الجزائريين. إرسال واستقبال أموال
            بسرعة فائقة، إدارة المحفظة، وخدمة عملاء على مدار الساعة.
          </Text>
        </View>

        <View style={styles.quickActions}>
          <View style={styles.actionRow}>
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>💳</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>الدفع الفوري</Text>
              <Text style={styles.actionDesc}>أرسل واستقبل بلا حدود</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </View>

          <View style={styles.actionRow}>
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>🔒</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>أمان معرف</Text>
              <Text style={styles.actionDesc}>تشفير متقدم + تأكيد SMS</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </View>

          <View style={styles.actionRow}>
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>💬</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>محادثات مجموعة</Text>
              <Text style={styles.actionDesc}>ادفع مع أصدقائك معاً</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>v1.0.0 — التجريبي</Text>
        </View>
        <Text style={styles.footerText}>جميع الحقوق محفوظة © 2026 Anypay</Text>
      </View>
    </SafeAreaView>
  );
};
