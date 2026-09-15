import React, {useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography, shadows} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Avatar} from '../../components/ui/Avatar';
import {Icon} from '../../components/ui/Icon';
import {Card} from '../../components/ui/Card';
import {Button} from '../../components/ui/Button';
import {Badge} from '../../components/ui/Badge';
import {useAuthStore} from '../../store/authStore';
import {useTheme} from '../../hooks/useTheme';
import {formatDateAlgerian} from '../../utils/formatters';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigation/AppNavigator';
import {userService} from '../../services/api/user';

export const ProfileScreen: React.FC = () => {
  const {user, logout} = useAuthStore();
  const {colors: themeColors} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePickAvatar = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [1, 1],
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        await userService.updateProfile({avatarUrl: asset.uri ?? ''});
        Alert.alert('نجاح', 'تم تحديث الصورة الشخصية');
      }
    } catch (err) {
      console.error('[ProfileScreen] Failed to pick avatar:', err);
      Alert.alert('خطأ', 'تعذّر تحديث الصورة');
    }
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <Header
        title="الملف الشخصي"
        rightIcon={<Icon name="settings" size={20} color={colors.textOnPrimary} />}
        rightAction={() => navigation.navigate('Settings')}
        backgroundColor={colors.primary}
        tintColor={colors.textOnPrimary}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Avatar
            name={user?.fullName ?? 'مستخدم'}
            size={80}
            showOnline={false}
            onPress={handlePickAvatar}
          />
          <Text style={styles.profileName} numberOfLines={1}>
            {user?.fullName ?? 'غير محدد'}
          </Text>
          <Text style={styles.profilePhone}>
            {user?.phoneNumber ? `+213 ${user.phoneNumber.slice(1)}` : '-'}
          </Text>
          <View style={styles.badgesRow}>
            <Badge variant="success">مصادق عليه</Badge>
            <Badge variant="default">عضو منذ 2026</Badge>
          </View>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>الحساب</Text>
          <View style={styles.cardRow}>
            <Icon name="user" size={20} color={colors.textSecondary} />
            <Text style={styles.cardLabel}>الاسم الكامل</Text>
            <Text style={styles.cardValue}>{user?.fullName ?? 'غير محدد'}</Text>
            <Icon name="edit" size={16} color={colors.textTertiary} />
          </View>
          <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
          <View style={styles.cardRow}>
            <Icon name="phone" size={20} color={colors.textSecondary} />
            <Text style={styles.cardLabel}>رقم الهاتف</Text>
            <Text style={styles.cardValue}>{user?.phoneNumber ?? '-'}</Text>
          </View>
          <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
          <View style={styles.cardRow}>
            <Icon name="email" size={20} color={colors.textSecondary} />
            <Text style={styles.cardLabel}>البريد الإلكتروني</Text>
            <Text style={styles.cardValue}>{user?.email ?? '-'}</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>الإعدادات</Text>
          <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('Settings')}>
            <Icon name="bell" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>إشعارات</Text>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
          <TouchableOpacity style={styles.settingRow} onPress={() => {}}>
            <Icon name="globe" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>اللغة</Text>
            <Text style={styles.settingValue}>العربية</Text>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
          <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('Settings')}>
            <Icon name="shield" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>الخصوصية والأمان</Text>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>الدعم</Text>
          <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('CustomerSupport')}>
            <Icon name="support" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>خدمة العملاء</Text>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
          <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('FAQ')}>
            <Icon name="question" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>الأسئلة الشائعة</Text>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
          <TouchableOpacity style={styles.settingRow} onPress={() => {}}>
            <Icon name="star" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>تقييم التطبيق</Text>
            <Icon name="chevronRight" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </Card>

        <Button
          title="تسجيل الخروج"
          onPress={handleLogout}
          variant="outline"
          size="medium"
          fullWidth
          style={styles.logoutButton}
          icon={<Icon name="logout" size={18} color={colors.textSecondary} />}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>v1.0.0</Text>
          <Text style={styles.footerTextSmall}>جميع الحقوق محفوظة © 2026 Anypay</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  profileName: {
    fontSize: typography.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  profilePhone: {
    fontSize: typography.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    justifyContent: 'center',
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
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  cardLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  cardValue: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
    flex: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  settingLabel: {
    fontSize: typography.md,
    color: colors.textPrimary,
    flex: 1,
  },
  settingValue: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  logoutButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
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
