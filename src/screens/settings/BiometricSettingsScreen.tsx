import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../config/colors';
import { borderRadius, spacing, typography, shadows } from '../../config/theme';
import { Header } from '../../components/ui/Header';
import { Icon } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { biometricService } from '../../services/api/biometricService';

export const BiometricSettingsScreen: React.FC = () => {
  const { colors: themeColors } = useTheme();
  const [available, setAvailable] = useState(false);
  const [types, setTypes] = useState<string[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkAvailability(); }, []);

  const checkAvailability = async () => {
    try {
      const result = await biometricService.isAvailable();
      setAvailable(result.available);
      setTypes(result.types);
      const status = await biometricService.isBiometricEnabled();
      setEnabled(status.enabled);
    } catch {}
    finally { setLoading(false); }
  };

  const toggleBiometric = async () => {
    try {
      if (enabled) {
        await biometricService.disableBiometric();
        setEnabled(false);
      } else {
        const result = await biometricService.authenticate();
        if (result.authenticated) {
          await biometricService.enableBiometric();
          setEnabled(true);
        }
      }
    } catch {}
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="المصادقة الحيوية" leftIcon={<Text style={styles.backText}>←</Text>} leftAction={() => {}} backgroundColor={colors.primary} tintColor={colors.textOnPrimary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="المصادقة الحيوية" leftIcon={<Text style={styles.backText}>←</Text>} leftAction={() => {}} backgroundColor={colors.primary} tintColor={colors.textOnPrimary} />
      {!available ? (
        <View style={styles.centerContainer}>
          <Text style={styles.disabledIcon}>🔒</Text>
          <Text style={styles.title}>غير متوفر</Text>
          <Text style={styles.subtitle}>جهازك لا يدعم المصادقة الحيوية</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Card style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardLeft}>
                <Icon name="fingerprint" size={28} color={colors.primary} />
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>المصادقة بالبصمة</Text>
                  <Text style={styles.cardSub}>استخدم بصمة الإصبع للدخول السريع</Text>
                </View>
              </View>
              <Switch value={enabled} onValueChange={toggleBiometric} trackColor={{ false: colors.border, true: colors.primary }} />
            </View>
          </Card>
          <View style={styles.typesContainer}>
            <Text style={styles.typesTitle}>طرق المصادقة المتاحة:</Text>
            {types.map((type, i) => (
              <View key={i} style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{type === 'بصمة الإصبع' ? '🔸' : '🔶'} {type}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backText: { fontSize: 18, color: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  disabledIcon: { fontSize: 64, marginBottom: spacing.md },
  title: { fontSize: typography.lg, fontWeight: typography.weights.bold, color: colors.onSurface, marginBottom: spacing.sm },
  subtitle: { fontSize: typography.sm, color: colors.textSecondary, textAlign: 'center' },
  content: { padding: spacing.md },
  card: { marginBottom: spacing.md, ...shadows.sm },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  cardText: { marginLeft: spacing.md },
  cardTitle: { fontSize: typography.md, fontWeight: typography.weights.semibold, color: colors.onSurface },
  cardSub: { fontSize: typography.sm, color: colors.textSecondary, marginTop: 2 },
  typesContainer: { marginTop: spacing.md },
  typesTitle: { fontSize: typography.sm, color: colors.textSecondary, marginBottom: spacing.sm },
  typeBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, backgroundColor: colors.card, borderRadius: borderRadius.md, marginBottom: spacing.xs },
  typeBadgeText: { fontSize: typography.sm, color: colors.onSurface },
});
