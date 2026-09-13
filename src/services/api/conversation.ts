// src/services/api/conversation.ts
import { apiClient, handleApiError } from './client';
import type { Conversation, Message } from '../../types/chat';
import type { PaginatedResponse } from '../../types/api';

export const conversationService = {
  async getConversations(): Promise<Conversation[]> {
    try {
      const res = await apiClient.get<PaginatedResponse<Conversation>>('/conversations');
      return res.data.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  async getConversation(id: string): Promise<Conversation> {
    try {
      const res = await apiClient.get<Conversation>(`/conversations/${id}`);
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  async sendMessage(conversationId: string, text: string): Promise<Message> {
    try {
      const res = await apiClient.post<Message>(
        `/conversations/${conversationId}/messages`,
        { text }
      );
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  async getMessages(conversationId: string, before?: number, limit = 50): Promise<Message[]> {
    try {
      const res = await apiClient.get<Message[]>(
        `/conversations/${conversationId}/messages?limit=${limit}${before ? `&before=${before}` : ''}`
      );
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  async markAsRead(conversationId: string): Promise<void> {
    try {
      await apiClient.post(`/conversations/${conversationId}/read`);
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },
};
