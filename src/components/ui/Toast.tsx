import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography} from '../../config/theme';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
  position?: 'top' | 'bottom';
  style?: ViewStyle;
}

const typeStyles = {
  success: {backgroundColor: colors.success, icon: '✅'},
  error: {backgroundColor: colors.error, icon: '❌'},
  warning: {backgroundColor: colors.warning, icon: '⚠️'},
  info: {backgroundColor: colors.info, icon: 'ℹ️'},
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  visible,
  onDismiss,
  duration = 3000,
  position = 'bottom',
  style,
}) => {
  const [hiding, setHiding] = useState(false);
  const [hidden, setHidden] = useState(false);

  const vars = typeStyles[type];

  React.useEffect(() => {
    if (!visible) {
      setHidden(true);
      return;
    }
    setHidden(false);
    setHiding(false);

    const timer = setTimeout(() => {
      setHiding(true);
      setTimeout(() => {
        setHidden(true);
        onDismiss();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, onDismiss]);

  if (!visible || hidden) return null;

  const opacity = hiding ? 0 : 1;

  return (
    <View style={[styles.toastContainer, position === 'top' ? styles.topPosition : styles.bottomPosition, style]}>
      <View style={[styles.toastInner, {backgroundColor: vars.backgroundColor, opacity}]}>
        <Text style={styles.toastIcon}>{vars.icon}</Text>
        <Text style={styles.toastMessage}>{message}</Text>
        <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 9999,
  },
  topPosition: {
    top: 100,
    alignItems: 'center',
  },
  bottomPosition: {
    bottom: spacing.lg,
    alignItems: 'center',
  },
  toastInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    minHeight: 52,
    gap: spacing.sm,
  },
  toastIcon: {
    fontSize: 18,
    flexShrink: 0,
  },
  toastMessage: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textOnPrimary,
  },
  closeButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.textOnPrimary,
  },
});
