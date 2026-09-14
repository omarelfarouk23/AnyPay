import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export interface MediaPickerResult {
  uri: string;
  type: string;
  fileName: string;
  size: number;
  width?: number;
  height?: number;
}

const CACHE_DIR: string =
  (FileSystem as any).cacheDirectory ||
  (FileSystem as any).documentDirectory ||
  '';

export const pickImage = async (): Promise<MediaPickerResult | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    return {
      uri: asset.uri ?? '',
      type: asset.mimeType ?? 'image/jpeg',
      fileName: asset.fileName ?? `image_${Date.now()}.jpg`,
      size: asset.fileSize ?? 0,
      width: asset.width,
      height: asset.height,
    };
  }
  return null;
};

export const pickFile = async (): Promise<MediaPickerResult | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    return {
      uri: asset.uri ?? '',
      type: asset.mimeType ?? 'application/octet-stream',
      fileName: asset.fileName ?? `file_${Date.now()}.bin`,
      size: asset.fileSize ?? 0,
    };
  }
  return null;
};

export const uploadFileToServer = async (
  fileUri: string,
  endpoint: string,
  token: string,
): Promise<string | null> => {
  const formData = new FormData();
  const fileName = fileUri.split('/').pop() ?? 'file';
  formData.append('file', {
    uri: fileUri,
    type: 'application/octet-stream',
    name: fileName,
  } as any);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data.url ?? null;
  } catch (error) {
    console.error('uploadFileToServer error:', error);
    return null;
  }
};

export const compressImage = async (
  uri: string,
  maxWidth = 1200,
  quality = 0.7,
): Promise<string> => {
  const asset = await FileSystem.getInfoAsync(uri);
  if (!asset.exists) {
    throw new Error('File does not exist');
  }

  const fileName = `compressed_${Date.now()}.jpg`;
  const destPath = CACHE_DIR + fileName;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [16, 9],
    quality: quality,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    return result.assets[0].uri ?? uri;
  }
  return uri;
};
