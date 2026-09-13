import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, shadows, typography} from '../../config/theme';
import {Avatar } from '../ui/Avatar';
import {Icon} from '../ui/Icon';

export interface ConversationItemProps {
  id: string;
  title: string;
  subtitle: string;
  avatarUri?: string;
  avatarName?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  online?: boolean;
  isActive?: boolean;
  onPress: () => void;
  showAvatar?: boolean;
  styling?: {
    lastMessageColor?: string;
    backgroundColor?: string;
    titleColor?: string;
  };
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  id,
  title,
  subtitle,
  avatarUri,
  avatarName,
  lastMessage,
  timestamp,
  unreadCount,
  online = false,
  isActive = false,
  onPress,
  showAvatar = true,
  styling,
}) => {
  const bgColor = isActive ? colors.primaryAlpha : undefined;
  const titleColor = isActive ? colors.primary : 'rgba(26, 46, 107, 0.9)';
  const lastColor = styling?.lastMessageColor ?? colors.textSecondary;

  const bgColorStyle: ViewStyle | undefined = bgColor === undefined
    ? undefined
    : { backgroundColor: bgColor };

  return (
    <TouchableOpacity
      style={[styles.container, bgColorStyle, isActive && styles.activeContainer]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Conversation with ${title}`}
      accessibilityState={{selected: isActive, busy: online}}>
      <View style={styles.leftSection}>
        {avatarUri && (
          <Avatar
            uri={avatarUri}
            name={avatarName}
            size={48}
            showOnline
            online={online}
          />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, {color: titleColor}]} numberOfLines={1}>
            {title}
          </Text>
          {timestamp && (
            <Text style={[styles.timestamp, isActive && {color: colors.textOnPrimary}]}>
              {timestamp}
            </Text>
          )}
        </View>

        <View style={styles.subtitleContainer}>
          <Text style={[styles.subtitle, isActive && {color: colors.textTertiary}]} numberOfLines={1}>
            {subtitle}
          </Text>
          {unreadCount !== undefined && unreadCount > 0 && (
            <View style={[styles.badge, {backgroundColor: colors.accent}]}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.lastMessageRow}>
          <Text style={[styles.lastMessage, {color: lastColor}]} numberOfLines={1}>
            {lastMessage}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        {!showAvatar && (
          <Icon name="chevronRight" size={20} color={isActive ? colors.accent : colors.textTertiary} />
        )}
        {showAvatar && (
          <Icon name="chevronRight" size={18} color={colors.textTertiary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  activeContainer: {
    backgroundColor: colors.primaryAlpha,
    borderBottomColor: colors.primaryAlpha,
  },
  leftSection: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.md,
    fontWeight: typography.weights.medium,
    flex: 1,
  },
  timestamp: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  badgeText: {
    color: colors.textOnAccent,
    fontSize: 11,
    fontWeight: typography.weights.bold,
  },
  lastMessageRow: {
    minHeight: 18,
  },
  lastMessage: {
    fontSize: typography.sm,
    color: colors.textTertiary,
    flex: 1,
  },
  rightSection: {
    marginLeft: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
