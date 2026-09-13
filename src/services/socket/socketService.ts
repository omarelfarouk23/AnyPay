// src/services/socket/socketService.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const createSocket = (token: string, baseUrl?: string): Socket => {
  if (socket?.connected) {
    socket.disconnect();
  }

  socket = io(baseUrl || 'http://10.0.2.2:3000', {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

socket.on('connect', () => {
    console.log('[Socket] Connected');
  });

  socket.on('disconnect', (reason: string) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (err: Error) => {
    console.error('[Socket] Connection error:', err.message);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Event types
export interface SocketEvents {
  'new-message': (data: { conversationId: string; message: unknown }) => void;
  'typing': (data: { conversationId: string; userId: string; isTyping: boolean }) => void;
  'user-status': (data: { userId: string; online: boolean }) => void;
  'conversation-updated': (data: { conversation: unknown }) => void;
}

export const onNewMessage = (callback: (data: { conversationId: string; message: unknown }) => void) => {
  if (socket) socket.on('new-message', callback as unknown as () => void);
};

export const onTyping = (callback: (data: { conversationId: string; userId: string; isTyping: boolean }) => void) => {
  if (socket) socket.on('typing', callback as unknown as () => void);
};

export const onUserStatus = (callback: (data: { userId: string; online: boolean }) => void) => {
  if (socket) socket.on('user-status', callback as unknown as () => void);
};

export const emitTyping = (conversationId: string, isTyping: boolean) => {
  if (socket?.connected) {
    socket.emit('typing', { conversationId, isTyping });
  }
};

export const emitRead = (conversationId: string) => {
  if (socket?.connected) {
    socket.emit('mark-read', { conversationId });
  }
};
