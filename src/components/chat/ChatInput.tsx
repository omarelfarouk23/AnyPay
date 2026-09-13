import React from 'react';
import {View, Text, StyleSheet, ViewStyle, Keyboard, TextInput as RNTextInput} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography} from '../../config/theme';
import {Icon} from '../ui/Icon';

export interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  inputStyle?: any;
  containerStyle?: any;
  sendIcon?: React.ReactNode;
  multiline?: boolean;
  autoFocus?: boolean;
  onReturnKeyType?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
  placeholder = 'أكتب رسالة...',
  maxLength = 2000,
  disabled = false,
  inputStyle,
  containerStyle,
  sendIcon,
  multiline = false,
  autoFocus = false,
  onReturnKeyType,
}) => {
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.inputWrapper,
          disabled && styles.inputWrapperDisabled,
        ]}>
        <View style={styles.textInputContainer}>
            <RNTextInput
            style={[
              styles.textInput,
              multiline && styles.textInputMultiline,
              disabled && styles.textInputDisabled,
              inputStyle,
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textTertiary}
            multiline={multiline}
            maxLength={maxLength}
            editable={!disabled}
            autoFocus={autoFocus}
            returnKeyType={multiline ? 'none' : 'send'}
            onSubmitEditing={canSend ? onSend : undefined}
            textAlignVertical="top"
            selectTextOnFocus
          />
        </View>
      </View>
      <View style={[styles.actionsRow, disabled && styles.actionsRowDisabled]}>
        <View style={styles.actionButton}>
          <Icon name="attachment" size={24} color={colors.textSecondary} />
        </View>
        <View style={styles.actionButton}>
          <Icon name="emoji" size={24} color={colors.textSecondary} />
        </View>
        <View style={[styles.sendButton, canSend && styles.sendButtonActive]}>
          <View style={[styles.sendInner, canSend && styles.sendInnerActive]}>
            {sendIcon ?? (
              <Text style={[styles.sendText, canSend && styles.sendTextActive]}>➤</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  inputWrapperDisabled: {
    opacity: 0.5,
  },
  textInputContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  textInput: {
    flex: 1,
    fontSize: typography.md,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
    minHeight: 36,
    maxHeight: 120,
  },
  textInputMultiline: {
    textAlignVertical: 'top',
    paddingTop: spacing.xs,
  },
  textInputDisabled: {
    color: colors.textTertiary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  actionsRowDisabled: {
    opacity: 0.4,
  },
  actionButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceElevated,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  sendInner: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendInnerActive: {
    backgroundColor: 'transparent',
  },
  sendText: {
    fontSize: 20,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  sendTextActive: {
    color: colors.textOnPrimary,
  },
});
