// utils/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (token?: string): Socket => {
  if (!socket || !socket.connected) {
    socket = io(process.env.SOCKET_URL || 'http://localhost:3000', { transports: ['websocket'] })!, {
      // auth: {
      //   token, // Optional auth if needed
      // },
    };
    
  }
  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initSocket() first.');
  }
  return socket;
};

export const listenToUploadEvents = ({
  onProgress,
  onError,
  onComplete,
}: {
  onProgress: (data: { videoId: string; percentage: string }) => void;
  onError: (data: { videoId: string; error: string }) => void;
  onComplete: (data: { message: string; videoId: string; playbackUrl: string }) => void;
}) => {
  const socket = getSocket();
  socket.on('upload-progress', onProgress);
  socket.on('upload-error', onError);
  socket.on('upload-complete', onComplete);
};

export const removeUploadListeners = () => {
  const socket = getSocket();
  socket.off('upload-progress');
  socket.off('upload-error');
  socket.off('upload-complete');
};
