import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Icon } from '../../components/ui/Icon';
import { colors, spacing, borderRadius, typography } from '../../config/theme';

export interface AttachmentFile {
  uri: string;
  type: string;
  name: string;
  size: number;
}

export const AttachmentPicker: React.FC<{
  onSelect: (file: AttachmentFile) => void;
  onCancel: () => void;
}> = ({ onSelect, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        onSelect({
          uri: asset.uri ?? '',
          type: asset.mimeType ?? 'image/jpeg',
          name: asset.fileName ?? 'image.jpg',
          size: asset.fileSize ?? 0,
        });
      }
    } catch (err) {
      console.error('AttachmentPicker: image pick error', err);
    } finally {
      setLoading(false);
    }
  };

  const pickFile = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        onSelect({
          uri: asset.uri ?? '',
          type: asset.mimeType ?? 'application/octet-stream',
          name: asset.fileName ?? 'file.bin',
          size: asset.fileSize ?? 0,
        });
      }
    } catch (err) {
      console.error('AttachmentPicker: file pick error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إرفاق ملف</Text>
      <TouchableOpacity
        style={[styles.option, loading && styles.optionDisabled]}
        onPress={pickImage}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Icon name="image" size={28} color={colors.primary} />
        <Text style={styles.optionText}>صورة</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, loading && styles.optionDisabled]}
        onPress={pickFile}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Icon name="document" size={28} color={colors.primary} />
        <Text style={styles.optionText}>ملف</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancel}
        onPress={onCancel}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelText}>إلغاء</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '85%',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 5 },
    }),
  },
  title: {
    fontSize: typography.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    width: '100%',
    marginBottom: spacing.sm,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  cancel: {
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  cancelText: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
});
