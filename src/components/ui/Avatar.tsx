import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography} from '../../config/theme';
import {Icon} from './Icon';

export interface AvatarProps {
  uri?: string;
  source?: any;
  size?: number;
  name?: string;
  backgroundColor?: string;
  textColor?: string;
  showOnline?: boolean;
  online?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
}

const initialLetter = (name: string) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 50%)`;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  source,
  size = 48,
  name,
  backgroundColor,
  textColor = colors.textOnPrimary,
  showOnline = false,
  online = false,
  children,
  style,
}) => {
  const bgColor = backgroundColor ?? (name ? getColorFromString(name) : colors.primary);
  const diameter = Math.max(size, 24);

  const renderImage = () => {
    if (uri) {
      return (
        <View style={[styles.imageContainer, {width: diameter, height: diameter}]}>
          <Text style={styles.imagePlaceholder}>🖼️</Text>
        </View>
      );
    }
    if (source) {
      return (
        <View style={[styles.imageContainer, {width: diameter, height: diameter}]}>
          <Text style={styles.imagePlaceholder}>🖼️</Text>
        </View>
      );
    }
    return null;
  };

  const renderFallback = () => {
    if (name) {
      return (
        <View
          style={[
            styles.fallbackContainer,
            {width: diameter, height: diameter, backgroundColor: bgColor, borderRadius: diameter / 2},
          ]}
          accessible={true}
          accessibilityLabel={`Avatar for ${name}`}>
          <Text style={[styles.fallbackText, {fontSize: diameter * 0.42, color: textColor}]}>
            {initialLetter(name)}
          </Text>
        </View>
      );
    }
    return (
      <View
        style={[
          styles.fallbackContainer,
          {width: diameter, height: diameter, backgroundColor: colors.primary, borderRadius: diameter / 2},
        ]}>
        <Icon name="user" size={diameter * 0.5} color={colors.textOnPrimary} />
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.avatarInner, {marginRight: showOnline ? -spacing.sm * 0.6 : 0}]}>
        {renderImage() ?? renderFallback()}
      </View>
      {showOnline && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: diameter * 0.28,
              height: diameter * 0.28,
              borderRadius: diameter * 0.14,
              borderColor: colors.card,
              borderWidth: 2,
              backgroundColor: online ? colors.success : colors.textTertiary,
            },
          ]}
        />
      )}
      {children && <View style={styles.childrenContainer}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarInner: {},
  imageContainer: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.surfaceElevated,
  },
  imagePlaceholder: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 40,
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fallbackText: {
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    lineHeight: 1,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  childrenContainer: {},
});
