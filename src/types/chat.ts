export interface Conversation {
  id: string;
  title: string;
  avatarUrl?: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  isTyping: boolean;
  typingBy?: string;
  status: 'active' | 'archived';
}

export interface ConversationParticipant {
  id: string;
  user: UserSummary;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface UserSummary {
  id: string;
  fullName: string;
  avatarUrl?: string;
  phoneNumber?: string;
  status: 'active' | 'suspended';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: UserSummary;
  content: string;
  type: 'text' | 'image' | 'file' | 'location' | 'system';
  createdAt: string;
  updatedAt?: string;
  readBy: string[];
  status: 'sent' | 'delivered' | 'read';
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'video' | 'audio';
  url: string;
  name: string;
  size: number;
  mimeType: string;
  thumbnailUrl?: string;
}
