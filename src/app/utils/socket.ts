// utils/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000";
let socket: Socket & { hasListeners?: boolean } | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    socket.hasListeners = false;
  }
  return socket;
};

