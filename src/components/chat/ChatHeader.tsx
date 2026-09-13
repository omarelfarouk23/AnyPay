import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography} from '../../config/theme';
import {Avatar } from '../ui/Avatar';

export interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  avatarUri?: string;
  avatarName?: string;
  online?: boolean;
  typing?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onBack?: () => void;
  onMenu?: () => void;
  style?: ViewStyle;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  subtitle,
  avatarUri,
  avatarName,
  online = false,
  typing = false,
  leftIcon,
  rightIcon,
  onBack,
  onMenu,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftSection}>
        <View style={styles.backButton}>
          {leftIcon ?? (
            <Text style={styles.backIcon}>←</Text>
          )}
        </View>
        <View style={styles.avatarContainer}>
          <Avatar
            uri={avatarUri}
            name={avatarName}
            size={42}
            showOnline
            online={online}
          />
          {typing && (
            <View style={styles.typingContainer}>
              <Text style={styles.typingDot}>●</Text>
              <Text style={styles.typingDot}>●</Text>
              <Text style={styles.typingDot}>●</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.centerSection}>
        <View style={styles.titleRow}>
          {title && <Text style={styles.title} numberOfLines={1}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {title && (
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitleText}>{online ? 'متصل' : 'غير متصل'}</Text>
            <View style={styles.subtitleDot} />
            <Text style={styles.subtitleText}>الاثنين، ١٣ سبتمبر</Text>
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        <View style={styles.rightIconContainer}>
          {rightIcon ?? (
            <Text style={styles.menuIcon}>⋮</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    minHeight: 60,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  },
  backIcon: {
    fontSize: 24,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: spacing.xs,
  },
  typingDot: {
    fontSize: 8,
    color: colors.accent,
    lineHeight: 8,
  },
  centerSection: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    alignItems: 'center',
  },
  title: {
    fontSize: typography.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    maxWidth: 160,
    textAlign: 'center',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: typography.xs,
    color: colors.textTertiary,
  },
  subtitleDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightIconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  },
  menuIcon: {
    fontSize: 22,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
