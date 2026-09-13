import {create} from 'zustand';
import {Conversation, Message} from '../types/chat';

interface ChatStore {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;

  setLoading: (loading: boolean) => void;
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setSending: (sending: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  updateLastMessage: (conversationId: string, message: Message) => void;
  incrementUnread: (conversationId: string) => void;
}

export const useChatStore = create<ChatStore>()((set) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  isSending: false,
  error: null,

  setLoading: (isLoading) => set({isLoading}),
  setConversations: (conversations) => set({conversations}),
  setActiveConversation: (activeConversation) => set({activeConversation}),
  setMessages: (messages) => set({messages}),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setSending: (isSending) => set({isSending}),
  setError: (error) => set({error}),
  clearMessages: () => set({messages: []}),
  updateLastMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {...c, lastMessage: message, updatedAt: message.createdAt}
          : c,
      ),
    })),
  incrementUnread: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? {...c, unreadCount: c.unreadCount + 1} : c,
      ),
    })),
}));
