import { io, type Socket } from "socket.io-client";
import { getAccessToken, getSocketUrl } from "@/lib/api";

let socket: Socket | null = null;

export function connectSocket(): Socket | null {
  const token = getAccessToken();
  if (!token) return null;

  if (socket?.connected) return socket;

  socket?.disconnect();

  socket = io(getSocketUrl(), {
    auth: { token },
    transports: ["websocket", "polling"],
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}

export function joinConversation(conversationId: string) {
  socket?.emit("conversation:join", conversationId);
}

export function sendSocketMessage(conversationId: string, content: string) {
  socket?.emit("message:send", { conversationId, content });
}

export function markConversationRead(conversationId: string) {
  socket?.emit("message:read", { conversationId });
}
