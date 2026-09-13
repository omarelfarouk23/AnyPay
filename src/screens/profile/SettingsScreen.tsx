import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography, shadows} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Icon} from '../../components/ui/Icon';
import {Switch} from '../../components/ui/Switch';
import {Card} from '../../components/ui/Card';
import {useTheme} from '../../hooks/useTheme';

export const SettingsScreen: React.FC = () => {
  const {colors: themeColors, toggleTheme} = useTheme();
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [biometric, setBiometric] = React.useState(true);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <Header
        title="الإعدادات"
        leftIcon={<Text style={styles.backText}>←</Text>}
        leftAction={() => {}}
        backgroundColor={colors.primary}
        tintColor={colors.textOnPrimary}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>التفضيلات</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Icon name="globe" size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>اللغة</Text>
                <Text style={styles.settingValue}>العربية</Text>
              </View>
            </View>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </View>
          <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Icon name="format" size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>تنسيق التاريخ</Text>
                <Text style={styles.settingValue}> DD/MM/YYYY</Text>
              </View>
            </View>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>الخصوصية والأمان</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Icon name="lock" size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>قفل التطبيق</Text>
                <Text style={styles.settingValue}> biométrico</Text>
              </View>
            </View>
            <Switch value={biometric} onValueChange={setBiometric} />
          </View>
          <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Icon name="user" size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>إخفاء الرصيد</Text>
                <Text style={styles.settingValue}>عرض رصيد كامل</Text>
              </View>
            </View>
            <Switch value={false} onValueChange={() => {}} />
          </View>
          <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Icon name="shield" size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>الخصوصية</Text>
                <Text style={styles.settingValue}>سياسة الخصوصية</Text>
              </View>
            </View>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>حسابي</Text>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Icon name="user" size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>تعديل الملف الشخصي</Text>
              </View>
            </View>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Icon name="card" size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>طرق الدفع</Text>
              </View>
            </View>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>v1.0.0 — Anypay</Text>
          <Text style={styles.footerTextSmall}>جميع الحقوق محفوظة © 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backText: {
    fontSize: 24,
    color: colors.textOnPrimary,
    lineHeight: 24,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: typography.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  settingValue: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  footerText: {
    fontSize: typography.sm,
    color: colors.textTertiary,
  },
  footerTextSmall: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
