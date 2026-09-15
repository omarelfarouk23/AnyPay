import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography, shadows} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Icon} from '../../components/ui/Icon';
import {useNavigation} from '@react-navigation/native';

export const ChatInfoScreen: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <Header
        title="معلومات المحادثة"
        leftIcon={<Text style={styles.backText}>←</Text>}
        leftAction={() => navigation.goBack()}
        backgroundColor={colors.primary}
        tintColor={colors.textOnPrimary}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>تفاصيل المحادثة</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>المحادثة:</Text>
            <Text style={styles.infoValue}>مجموعة</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>المشاركون:</Text>
            <Text style={styles.infoValue}>3 أعضاء</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {padding: spacing.lg},
  section: {marginBottom: spacing.lg},
  sectionTitle: {fontSize: typography.md, fontWeight: typography.weights.semibold, color: colors.onSurface, marginBottom: spacing.md},
  infoRow: {flexDirection: 'row', marginBottom: spacing.sm},
  infoLabel: {fontSize: typography.sm, color: colors.textSecondary, width: 100},
  infoValue: {fontSize: typography.sm, color: colors.onSurface},
  backText: {fontSize: 18, color: '#fff'},
});
