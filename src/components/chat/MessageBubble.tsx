import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, shadows, typography} from '../../config/theme';

export interface MessageBubbleProps {
  text: string;
  outgoing?: boolean;
  timestamp?: string;
  status?: 'sent' | 'delivered' | 'read';
  isImage?: boolean;
  imageUri?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

const statusIcons = {
  sent: '✓',
  delivered: '✓✓',
  read: '✓✓',
};

const statusColors = {
  sent: colors.textTertiary,
  delivered: colors.textTertiary,
  read: colors.primaryLight,
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  outgoing = false,
  timestamp,
  status,
  isImage = false,
  imageUri,
  style,
  onPress,
}) => {
  const alignment = outgoing ? styles.outgoing : styles.incoming;
  const bubbleColor = outgoing ? colors.primary : colors.surface;
  const textColor = outgoing ? colors.textOnPrimary : colors.textPrimary;
  const borderWidth = outgoing ? 0 : 1;

  const showStatus = outgoing && status && !isImage;

  return (
    <View style={[styles.wrapper, alignment, style]}>
      {outgoing && <View style={styles.alignmentMarkerLeft} />}
      <View
        style={[
          styles.bubble,
          {backgroundColor: bubbleColor, borderWidth, borderColor: colors.borderLight},
          isImage && styles.imageBubble,
          outgoing && {borderBottomRightRadius: 4},
        ]}
        onTouchEnd={onPress}>
        {isImage ? (
          <View style={styles.imageContainer}>
            <Text style={styles.imagePlaceholder}>🖼️</Text>
          </View>
        ) : (
          <Text style={[styles.messageText, {color: textColor}]}>{text}</Text>
        )}
        <View style={[styles.footer, alignment]}>
          {timestamp && (
            <Text style={[styles.timestamp, {color: outgoing ? 'rgba(255,255,255,0.6)' : colors.textTertiary}]}>
              {timestamp}
            </Text>
          )}
          {showStatus && (
            <Text style={[styles.statusIcon, {color: statusColors[status ?? 'sent']}]}>
              {statusIcons[status ?? 'sent']}
            </Text>
          )}
        </View>
      </View>
      {!outgoing && <View style={styles.alignmentMarkerRight} />}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    maxWidth: '85%',
  },
  incoming: {
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
    marginRight: 'auto',
  },
  outgoing: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    marginLeft: 'auto',
  },
  bubble: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: 18,
    ...shadows.chatBubble,
  },
  outgoingBubble: {
    borderBottomRightRadius: 4,
  },
  imageBubble: {
    borderRadius: 12,
  },
  messageText: {
    fontSize: typography.md,
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  timestamp: {
    fontSize: typography.xs,
  },
  statusIcon: {
    fontSize: 11,
  },
  imageContainer: {
    width: 200,
    height: 150,
    borderRadius: 12,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    fontSize: 40,
  },
  alignmentMarkerLeft: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginLeft: spacing.md,
  },
  alignmentMarkerRight: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginRight: spacing.md,
  },
});
