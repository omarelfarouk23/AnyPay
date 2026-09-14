import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ViewStyle,
  TextInput as RNTextInput, TouchableOpacity, Modal,
} from 'react-native';
import { colors } from '../../config/colors';
import { borderRadius, spacing, typography } from '../../config/theme';
import { Icon } from '../ui/Icon';
import { AttachmentPicker, AttachmentFile } from './AttachmentPicker';

export type { AttachmentFile } from './AttachmentPicker';

export interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: (content: string, attachment?: AttachmentFile) => void;
  onAttachment?: (file: AttachmentFile) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  inputStyle?: any;
  containerStyle?: any;
  sendIcon?: React.ReactNode;
  multiline?: boolean;
  autoFocus?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
  onAttachment,
  placeholder = 'أكتب رسالة...',
  maxLength = 2000,
  disabled = false,
  inputStyle,
  containerStyle,
  sendIcon,
  multiline = false,
  autoFocus = false,
}) => {
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<AttachmentFile | null>(null);

  const canSend = (value.trim().length > 0 || pendingAttachment !== null) && !disabled;

  const handleSend = () => {
    onSend(value, pendingAttachment ?? undefined);
    setPendingAttachment(null);
    setShowAttachmentModal(false);
  };

  const handleAttachmentSelect = (file: AttachmentFile) => {
    setPendingAttachment(file);
    setShowAttachmentModal(false);
    onAttachment?.(file);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputWrapper, disabled && styles.inputWrapperDisabled]}>
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
            onSubmitEditing={canSend ? handleSend : undefined}
            textAlignVertical="top"
            selectTextOnFocus
          />
          {pendingAttachment && (
            <View style={styles.attachmentIndicator}>
              <Icon name="attachment" size={16} color={colors.primary} />
              <Text style={styles.attachmentName} numberOfLines={1}>
                {pendingAttachment.name}
              </Text>
              <TouchableOpacity onPress={() => setPendingAttachment(null)}>
                <Icon name="close" size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <View style={[styles.actionsRow, disabled && styles.actionsRowDisabled]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowAttachmentModal(true)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Icon name="attachment" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.emojiButton}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Icon name="emoji" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sendButton, canSend && styles.sendButtonActive]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.7}
        >
          <View style={[styles.sendInner, canSend && styles.sendInnerActive]}>
            {sendIcon ?? (
              <Text style={[styles.sendText, canSend && styles.sendTextActive]}>➤</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showAttachmentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAttachmentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AttachmentPicker
              onSelect={handleAttachmentSelect}
              onCancel={() => setShowAttachmentModal(false)}
            />
          </View>
        </View>
      </Modal>
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
    position: 'relative',
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
  attachmentIndicator: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryAlpha,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
    maxWidth: '60%',
  },
  attachmentName: {
    fontSize: typography.xs,
    color: colors.textOnPrimary,
    flex: 1,
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
  emojiButton: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
  },
});
