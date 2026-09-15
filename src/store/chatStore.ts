import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, Message } from '../types/chat';
import { createSocket, disconnectSocket, onNewMessage, emitRead } from '../services/socket/socketService';
import { useAuthStore } from './authStore';

interface PendingMessage {
  conversationId: string;
  content: string;
  type: string;
  attachment?: { uri: string; type: string; fileName: string; size: number };
  timestamp: string;
}

interface ChatStore {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isTyping: boolean;
  isLoading: boolean;
  error: string | null;
  socketConnected: boolean;
  pendingMessages: PendingMessage[];

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setTyping: (isTyping: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSocketConnected: (connected: boolean) => void;
  markConversationRead: (conversationId: string) => void;
  incrementUnread: (conversationId: string) => void;
  connectSocket: () => void;
  disconnectSocketManually: () => void;
  addPendingMessage: (msg: PendingMessage) => void;
  sendPendingMessages: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversation: null,
      messages: [],
      isTyping: false,
      isLoading: false,
      error: null,
      socketConnected: false,
      pendingMessages: [],

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
      setSocketConnected: (socketConnected) => set({ socketConnected }),

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

      connectSocket: () => {
        const authStore = useAuthStore.getState();
        const token = authStore.token;
        if (!token) return;
        try {
          const socket = createSocket(token);
          set({ socketConnected: true });

          socket.on('connect', () => {
            set({ socketConnected: true });
            // Send pending messages when reconnected
            get().sendPendingMessages();
          });

          socket.on('disconnect', () => {
            set({ socketConnected: false });
          });

          socket.on('connect_error', () => {
            set({ socketConnected: false });
          });

          onNewMessage((data) => {
            const { conversationId, message } = data as { conversationId: string; message: Message };
            set((state) => ({
              messages: [...state.messages, message],
              conversations: state.conversations.map((c) =>
                c.id === conversationId
                  ? { ...c, lastMessage: message, updatedAt: new Date().toISOString() }
                  : c
              ),
            }));
            const active = get().activeConversation;
            if (active && active.id === conversationId) {
              emitRead(conversationId);
            } else {
              get().incrementUnread(conversationId);
            }
          });
        } catch (err) {
          console.error('[ChatStore] Socket connection failed:', err);
          set({ socketConnected: false });
        }
      },

      disconnectSocketManually: () => {
        disconnectSocket();
        set({ socketConnected: false });
      },

      addPendingMessage: (msg) =>
        set((state) => ({
          pendingMessages: [...state.pendingMessages, msg],
        })),

      sendPendingMessages: async () => {
        const { pendingMessages } = get();
        if (pendingMessages.length === 0) return;
        set({ pendingMessages: [] });
      },
    }),
    {
      name: 'anypay-chat',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        socketConnected: state.socketConnected,
        pendingMessages: state.pendingMessages,
      }),
    }
  )
);

export default useChatStore;
