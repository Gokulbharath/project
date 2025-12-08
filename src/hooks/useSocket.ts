import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { initSocket, connectSocket, disconnectSocket, getSocket } from '@/services/socket';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = initSocket();
    if (!socketInstance) {
      return;
    }

    setSocket(socketInstance);

    const handleConnect = () => {
      setConnected(true);
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);

    connectSocket();

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      disconnectSocket();
    };
  }, []);

  const emit = (event: string, data?: any) => {
    if (socket && connected) {
      socket.emit(event, data);
    }
  };

  const on = (event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
      return () => socket.off(event, callback);
    }
    return () => {};
  };

  return {
    socket: getSocket(),
    connected,
    emit,
    on,
  };
};
