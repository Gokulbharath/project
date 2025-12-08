import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

let socket: Socket | null = null;

// Only enable sockets when a URL is provided. In mock/dev without a server,
// we skip connecting to avoid console spam.
const isSocketEnabled = Boolean(SOCKET_URL);

export const initSocket = (): Socket | null => {
  if (!isSocketEnabled) {
    return null;
  }

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const connectSocket = (): void => {
  if (!isSocketEnabled) return;
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = (): void => {
  if (!isSocketEnabled) return;
  if (socket && socket.connected) {
    socket.disconnect();
  }
};
