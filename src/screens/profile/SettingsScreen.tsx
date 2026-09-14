import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../config/colors';
import { borderRadius, spacing, typography, shadows } from '../../config/theme';
import { Header } from '../../components/ui/Header';
import { Icon } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import { useThemeStore } from '../../store/themeStore';

export const SettingsScreen: React.FC = () => {
  const { mode, setMode } = useThemeStore();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="الإعدادات"
        leftIcon={<Text style={styles.backText}>←</Text>}
        leftAction={() => {}}
        backgroundColor={colors.primary}
        tintColor={colors.textOnPrimary}
      />

      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>المظهر</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>وضع الظلام</Text>
              <Text style={styles.settingDescription}>
                {mode === 'dark' ? 'مفعّل' : 'غير مفعل'}
              </Text>
            </View>
            <Switch
              value={mode === 'dark'}
              onValueChange={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>استخدام نظام التشغيل</Text>
              <Text style={styles.settingDescription}>
                {mode === 'system' ? 'مفعّل' : 'غير مفعل'}
              </Text>
            </View>
            <Switch
              value={mode === 'system'}
              onValueChange={() => setMode(mode === 'system' ? 'light' : 'system')}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>التنبيهات</Text>
          <TouchableOpacity style={styles.settingRow}>
            <Icon name="bell" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>إشعارات المحادثات</Text>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
          <TouchableOpacity style={styles.settingRow}>
            <Icon name="bell" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>إشعارات الدفع</Text>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>الخصوصية</Text>
          <TouchableOpacity style={styles.settingRow}>
            <Icon name="lock" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>كلمة مرور التأكيد</Text>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
          <TouchableOpacity style={styles.settingRow}>
            <Icon name="shield" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>محاكاة الوجه</Text>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>منطقة التجربة</Text>
          <TouchableOpacity style={styles.settingRow}>
            <Icon name="flask" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>وضع المطوّر</Text>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backText: { fontSize: 24, color: colors.textOnPrimary, lineHeight: 24 },
  content: { flex: 1, paddingHorizontal: spacing.md, paddingBottom: spacing.xxxl },
  card: { marginBottom: spacing.md, borderRadius: borderRadius.lg, ...shadows.sm },
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
  settingInfo: { flex: 1, marginRight: spacing.md },
  settingLabel: { fontSize: typography.md, color: colors.textPrimary, fontWeight: typography.weights.medium },
  settingDescription: { fontSize: typography.xs, color: colors.textTertiary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.borderLight, marginLeft: spacing.md + 50 },
});
