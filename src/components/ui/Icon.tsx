import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../../config/colors';

const IMAGE_BASE_URL = 'https://img.icons8.com/';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
  backgroundColor?: string;
  accessibilityLabel?: string;
}

// Simple text-based icon names (map to emoji / Unicode symbols)
const iconMap: Record<string, string> = {
  // Navigation / general
  home: '🏠',
  chat: '💬',
  wallet: '👛',
  profile: '👤',
  settings: '⚙️',
  support: '🛟',
  search: '🔍',
  menu: '☰',
  close: '✕',
  back: '←',
  chevronRight: '›',
  chevronDown: '⌄',
  chevronUp: '⌃',
  arrowLeft: '←',
  arrowRight: '→',
  check: '✓',
  checkCircle: '✅',
  closeCircle: '❌',

  // Chat
  send: '➤',
  attachment: '📎',
  image: '🖼️',
  emoji: '😊',
  mic: '🎤',
  phone: '☎️',
  video: '📹',
  link: '🔗',
  file: '📄',
  pin: '📌',
  mute: '🔇',
  unmute: '🔊',
  info: 'ℹ️',

  // Wallet / payment
  money: '💰',
  coin: '🪙',
  creditCard: '💳',
  bank: '🏦',
  dollar: '$',
  euro: '€',
  sendMoney: '↗️',
  receiveMoney: '↙️',
  transaction: '📋',
  history: '🕒',

  // Status
  online: '🟢',
  offline: '⚫',
  busy: '🔴',
  away: '🟡',

  // Misc
  star: '⭐',
  heart: '❤️',
  flag: '🚩',
  bell: '🔔',
  eye: '👁️',
  copy: '📋',
  refresh: '🔄',
  trash: '🗑️',
  edit: '✏️',
  plus: '+',
  minus: '−',
  lock: '🔒',
  unlock: '🔓',
  user: '👤',
  users: '👥',
  globe: '🌐',
  download: '⬇️',
  upload: '⬆️',
  question: '?',
  alert: '!',
  shield: '🛡️',
  inbox: '📥',
  outbox: '📤',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  style,
  backgroundColor,
  accessibilityLabel,
}) => {
  const character = iconMap[name] ?? name;
  const fontSize = Math.max(size, 12);

  return (
    <View style={[styles.container, {width: size, height: size, backgroundColor}, style]}>
      <Text
        style={[styles.icon, {fontSize, color: color ?? colors.textSecondary}]}
        accessibilityLabel={accessibilityLabel ?? name}
        accessibilityRole="image">
        {character}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  icon: {
    textAlign: 'center',
    lineHeight: 1,
  },
});
