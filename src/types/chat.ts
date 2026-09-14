// src/types/chat.ts
export interface User {
  id: string;
  fullName: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'busy' | 'offline';
  phoneNumber?: string;
  email?: string;
}

export interface Conversation {
  id: string;
  title: string;
  avatarUrl?: string;
  lastMessage?: Message;
  unreadCount: number;
  isTyping: boolean;
  updatedAt: string;
  participants: User[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  createdAt: string;
  readBy: string[];
  status: 'sent' | 'delivered' | 'read' | 'failed';
  attachment?: AttachmentInfo;
}

export interface AttachmentInfo {
  uri: string;
  type: string;
  fileName: string;
  size: number;
  thumbnailUri?: string;
}

export interface ChatFilter {
  searchQuery?: string;
  status?: 'all' | 'unread' | 'archived';
  sortBy?: 'latest' | 'oldest' | 'unreadFirst';
}
