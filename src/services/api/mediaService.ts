// src/services/api/mediaService.ts
// Cloudinary integration for image/file uploads with CDN
import { apiClient, handleApiError } from './client';
import { env } from '../../config/env';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

export const mediaService = {
  /**
   * Upload an image to Cloudinary with automatic compression
   */
  async uploadImage(uri: string, folder: string = 'anypay/avatars'): Promise<{ url: string; publicId: string; width: number; height: number }> {
    try {
      // Compress image before upload
      const manipulated = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const formData = new FormData();
      formData.append("api_key", env.cloudinaryApiKey);
      const fileUri = manipulated.uri;
      const filename = fileUri.split('/').pop() || 'image.jpg';
      const fileType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';

      formData.append('file', {
        uri: fileUri,
        name: filename,
        type: fileType,
      } as any);
      formData.append('upload_preset', env.cloudinaryUploadPreset);
      formData.append('folder', folder);
      formData.append('public_id', `anypay_${Date.now()}`);

      const res = await apiClient.post(`https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return {
        url: res.data.secure_url,
        publicId: res.data.public_id,
        width: res.data.width,
        height: res.data.height,
      };
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  /**
   * Upload a file (PDF, document) to Cloudinary
   */
  async uploadFile(uri: string, folder: string = 'anypay/documents'): Promise<{ url: string; publicId: string }> {
    try {
      const formData = new FormData();
      formData.append("api_key", env.cloudinaryApiKey);
      const filename = uri.split('/').pop() || 'file';
      const fileType = filename.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream';

      formData.append('file', {
        uri,
        name: filename,
        type: fileType,
      } as any);
      formData.append('upload_preset', env.cloudinaryUploadPreset);
      formData.append('folder', folder);
      formData.append('resource_type', 'raw');

      const res = await apiClient.post(`https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return {
        url: res.data.secure_url,
        publicId: res.data.public_id,
      };
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  /**
   * Delete a file from Cloudinary by public ID
   */
  async deleteFile(publicId: string): Promise<{ result: string }> {
    try {
      const res = await apiClient.post(`https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/destroy`, {
        public_id: publicId,
        upload_preset: env.cloudinaryUploadPreset,
      });
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedUrl(publicId: string, width = 200, height = 200, crop = 'fill'): string {
    return `https://res.cloudinary.com/${env.cloudinaryCloudName}/image/upload/w_${width},h_${height},c_${crop}/${publicId}`;
  },
};
