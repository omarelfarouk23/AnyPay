import { create } from 'zustand';
import { Conversation, Message } from '../types/chat';

interface ChatStore {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isTyping: boolean;
  isLoading: boolean;
  error: string | null;

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setTyping: (isTyping: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  markConversationRead: (conversationId: string) => void;
  incrementUnread: (conversationId: string) => void;
}

export const useChatStore = create<ChatStore>()((set) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isTyping: false,
  isLoading: false,
  error: null,

  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (conversation) => set({ activeConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setTyping: (isTyping) => set({ isTyping }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  markConversationRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    })),
  incrementUnread: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: (c.unreadCount || 0) + 1 } : c
      ),
    })),
}));
