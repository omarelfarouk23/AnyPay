// src/services/socket/socketService.ts
// WebSocket service for real-time chat and notifications.
// SECURITY: Uses WSS (encrypted) URL from environment config, never plaintext HTTP.
// MEMORY: Tracks listener subscriptions for proper cleanup on disconnect.
import { io, Socket } from 'socket.io-client';
import { getWsUrl } from '../../config/env';

let socket: Socket | null = null;

// Track registered listeners so we can remove them on disconnect/reconnect
// to prevent memory leaks from accumulated duplicate listeners.
const listenerCleanup: Array<() => void> = [];

export const createSocket = (token: string, baseUrl?: string): Socket => {
  // Disconnect any existing socket before creating a new one
  if (socket?.connected) {
    socket.disconnect();
  }

  // SECURITY: Always use the configured WSS URL. The fallback uses the
  // environment-provided secure WebSocket endpoint, never plaintext HTTP.
  // In development, set EXPO_PUBLIC_WS_URL to your local dev server.
  const wsUrl = baseUrl || getWsUrl();

  socket = io(wsUrl, {
    auth: { token },
    // SECURITY: Only allow websocket transport (no long-polling fallback
    // which could leak auth tokens in query strings).
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    // Reject unauthorized SSL certificates in production
    secure: true,
    rejectUnauthorized: true,
  });

  socket.on('connect', () => {
    // SECURITY: Never log auth tokens or sensitive connection details in production.
    if (__DEV__) {
      console.log('[Socket] Connected');
    }
  });

  socket.on('disconnect', (reason: string) => {
    if (__DEV__) {
      console.log('[Socket] Disconnected:', reason);
    }
    // Clean up all registered listeners on disconnect to prevent
    // memory leaks from accumulated event handlers.
    cleanupListeners();
  });

  socket.on('connect_error', (err: Error) => {
    // SECURITY: Log only the error message, never the full error object
    // which may contain sensitive connection details.
    if (__DEV__) {
      console.error('[Socket] Connection error:', err.message);
    }
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    cleanupListeners();
    socket.disconnect();
    socket = null;
  }
};

// Remove all tracked listeners to prevent memory leaks
const cleanupListeners = () => {
  listenerCleanup.forEach((cleanup) => cleanup());
  listenerCleanup.length = 0;
};

// Event types for type-safe socket communication
export interface SocketEvents {
  'new-message': (data: { conversationId: string; message: unknown }) => void;
  'typing': (data: { conversationId: string; userId: string; isTyping: boolean }) => void;
  'user-status': (data: { userId: string; online: boolean }) => void;
  'conversation-updated': (data: { conversation: unknown }) => void;
}

// Register a listener and track it for cleanup.
// Returns an unsubscribe function for manual removal.
const registerListener = <T>(
  event: string,
  callback: (data: T) => void,
): (() => void) => {
  if (!socket) return () => {};

  const handler = (data: T) => callback(data);
  socket.on(event, handler);

  // Track cleanup function so listeners are removed on disconnect
  const cleanup = () => {
    socket?.off(event, handler);
  };
  listenerCleanup.push(cleanup);

  return cleanup;
};

export const onNewMessage = (callback: (data: { conversationId: string; message: unknown }) => void) => {
  return registerListener('new-message', callback);
};

export const onTyping = (callback: (data: { conversationId: string; userId: string; isTyping: boolean }) => void) => {
  return registerListener('typing', callback);
};

export const onUserStatus = (callback: (data: { userId: string; online: boolean }) => void) => {
  return registerListener('user-status', callback);
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

export const emitMessage = (conversationId: string, message: {
  content: string;
  type: string;
  senderId: string;
  attachment?: { uri: string; type: string; fileName: string; size: number };
}) => {
  if (socket?.connected) {
    socket.emit('new-message', { conversationId, message });
  }
};
