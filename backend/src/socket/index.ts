import type { Server as HttpServer } from "http";
import { Server, type Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env, allowedOrigins } from "@/config/env";
import { TOKEN_TYPES } from "@/config/constants";
import type { JwtPayload } from "@/common/types";
import { logger } from "@/common/utils/logger";
import { chatService } from "@/modules/chat/services/chat.service";
import { UserModel } from "@/modules/users/models/user.model";

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

const onlineUsers = new Map<string, string>();

export function initializeSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token as string | undefined;
      if (!token) {
        next(new Error("Authentication required"));
        return;
      }

      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
      if (decoded.type !== TOKEN_TYPES.ACCESS) {
        next(new Error("Invalid token"));
        return;
      }

      socket.userId = decoded.sub;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    onlineUsers.set(userId, socket.id);

    void UserModel.findByIdAndUpdate(userId, { lastSeen: new Date() });
    io.emit("presence:update", { userId, online: true });

    socket.on("conversation:join", (conversationId: string) => {
      void socket.join(`conversation:${conversationId}`);
    });

    socket.on("typing:start", ({ conversationId }: { conversationId: string }) => {
      socket.to(`conversation:${conversationId}`).emit("typing:start", { userId, conversationId });
    });

    socket.on("typing:stop", ({ conversationId }: { conversationId: string }) => {
      socket.to(`conversation:${conversationId}`).emit("typing:stop", { userId, conversationId });
    });

    socket.on(
      "message:send",
      async ({ conversationId, content }: { conversationId: string; content: string }) => {
        try {
          const message = await chatService.sendMessage(userId, conversationId, content);
          io.to(`conversation:${conversationId}`).emit("message:new", message);
        } catch (error) {
          socket.emit("error", {
            message: error instanceof Error ? error.message : "Failed to send message",
          });
        }
      }
    );

    socket.on("message:read", async ({ conversationId }: { conversationId: string }) => {
      await chatService.markRead(userId, conversationId);
      socket.to(`conversation:${conversationId}`).emit("message:seen", { userId, conversationId });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("presence:update", { userId, online: false });
      logger.debug("Socket disconnected", { userId });
    });
  });

  return io;
}

export function emitNotification(userId: string, notification: unknown, io: Server): void {
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("notification:new", notification);
  }
}

export function isUserOnline(userId: string): boolean {
  return onlineUsers.has(userId);
}
