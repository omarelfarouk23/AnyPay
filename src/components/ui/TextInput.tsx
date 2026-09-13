import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput as RNTextInput, ViewStyle, TextStyle} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography} from '../../config/theme';

export interface TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad' | 'url' | 'number-pad';
  style?: ViewStyle;
  textStyle?: TextStyle;
  inputStyle?: TextStyle;
  textAlign?: 'left' | 'center' | 'right';
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  hint,
  containerStyle,
  value,
  onChangeText,
  placeholder,
  disabled = false,
  multiline = false,
  maxLength,
  autoFocus = false,
  returnKeyType,
  onSubmitEditing,
  keyboardType,
  style,
  textStyle,
}) => {
  const [focused, setFocused] = useState(false);

  const hasError = !!error;
  const borderColor = hasError ? colors.error : focused ? colors.primary : colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, hasError && styles.labelError]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {borderColor},
          focused && styles.inputContainerFocused,
          hasError && styles.inputContainerError,
          disabled && styles.inputContainerDisabled,
        ]}>
          <RNTextInput
          style={[styles.input, textStyle, style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          multiline={multiline}
          maxLength={maxLength}
          editable={!disabled}
          autoFocus={autoFocus}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          keyboardType={keyboardType}
          textAlignVertical="top"
          selectTextOnFocus
        />
      </View>
      {hint && !error && (
        <Text style={styles.hint}>{hint}</Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  labelError: {
    color: colors.error,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.input,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  inputContainerDisabled: {
    backgroundColor: colors.surfaceElevated,
    opacity: 0.6,
  },
  input: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  hint: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
