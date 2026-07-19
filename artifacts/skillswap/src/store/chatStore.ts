import { create } from "zustand";
import { api } from "@/lib/api";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  joinConversation,
  markConversationRead,
  sendSocketMessage,
} from "@/lib/socket";
import type { Conversation, Message } from "@/mock/data";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  loading: boolean;
  connected: boolean;
  currentUserId: string | null;
  fetchConversations: (userId: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  setActiveConversation: (id: string) => void;
  sendMessage: (
    convId: string,
    text: string,
    type?: "text" | "meet-link"
  ) => Promise<void>;
  connect: (userId: string) => void;
  disconnect: () => void;
}

function mapConversation(
  raw: Record<string, unknown>,
  currentUserId: string
): Conversation {
  const participants = (raw.participants ?? []) as Record<string, unknown>[];
  const other =
    participants.find((p) => String(p._id ?? p.id) !== currentUserId) ??
    participants[0] ??
    {};
  const avatarId = String(other.avatarId ?? "indigo:U");
  const [color = "indigo", initials = "U"] = avatarId.split(":");

  return {
    id: String(raw._id ?? raw.id ?? ""),
    participant: {
      id: String(other._id ?? other.id ?? ""),
      name: String(other.name ?? "User"),
      email: "",
      avatar: "initials",
      initials,
      avatarColor: `bg-${color}-500`,
      bio: "",
      rating: 0,
      reviewCount: 0,
      verified: false,
      isAdmin: false,
      languages: [],
      availability: { days: [], timeSlot: "" },
      skillsTeach: [],
      skillsLearn: [],
      badges: [],
      joinedAt: new Date().toISOString(),
    },
    lastMessage: String(raw.lastMessage ?? "No messages yet"),
    lastAt: String(raw.lastMessageAt ?? raw.updatedAt ?? new Date().toISOString()),
    unread: 0,
    isOnline: false,
  };
}

function mapMessage(raw: Record<string, unknown>): Message {
  const content = String(raw.content ?? "");
  const isMeetLink = content.startsWith("https://meet.google.com");

  return {
    id: String(raw._id ?? raw.id ?? ""),
    senderId: String(
      (raw.sender as Record<string, unknown> | undefined)?._id ??
        (raw.sender as Record<string, unknown> | undefined)?.id ??
        raw.sender ??
        ""
    ),
    text: content,
    sentAt: String(raw.createdAt ?? new Date().toISOString()),
    type: isMeetLink ? "meet-link" : "text",
  };
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  loading: false,
  connected: false,
  currentUserId: null,

  connect: (userId) => {
    const socket = connectSocket();
    if (!socket) return;

    set({ currentUserId: userId, connected: socket.connected });

    socket.off("connect");
    socket.off("disconnect");
    socket.off("message:new");
    socket.off("presence:update");

    socket.on("connect", () => set({ connected: true }));
    socket.on("disconnect", () => set({ connected: false }));

    socket.on("message:new", (raw: Record<string, unknown>) => {
      const conversationId = String(raw.conversation ?? "");
      const message = mapMessage(raw);

      set((state) => {
        const existing = state.messages[conversationId] ?? [];
        if (existing.some((m) => m.id === message.id)) return state;

        return {
          messages: {
            ...state.messages,
            [conversationId]: [...existing, message],
          },
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage:
                    message.type === "meet-link"
                      ? "Shared a Meet link"
                      : message.text,
                  lastAt: message.sentAt,
                }
              : c
          ),
        };
      });
    });

    socket.on(
      "presence:update",
      ({ userId: onlineUserId, online }: { userId: string; online: boolean }) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.participant.id === onlineUserId ? { ...c, isOnline: online } : c
          ),
        }));
      }
    );
  },

  disconnect: () => {
    disconnectSocket();
    set({ connected: false, currentUserId: null });
  },

  fetchConversations: async (userId) => {
    set({ loading: true });
    try {
      const data = await api.conversations.list();
      set({
        conversations: (data.conversations ?? []).map((c) =>
          mapConversation(c, userId)
        ),
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  fetchMessages: async (conversationId) => {
    try {
      const data = await api.conversations.messages(conversationId);
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: (data.messages ?? []).map((m) =>
            mapMessage(m as Record<string, unknown>)
          ),
        },
      }));
      joinConversation(conversationId);
      markConversationRead(conversationId);
      await api.conversations.markRead(conversationId).catch(() => undefined);
    } catch {
      /* ignore */
    }
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
    void get().fetchMessages(id);
  },

  sendMessage: async (convId, text, type = "text") => {
    const content = type === "meet-link" ? text : text.trim();
    if (!content) return;

    const userId = get().currentUserId;
    const socket = getSocket();

    if (socket?.connected) {
      sendSocketMessage(convId, content);
      return;
    }

    const data = await api.conversations.send(convId, content);
    const message = mapMessage(data.message);

    set((state) => {
      const existing = state.messages[convId] ?? [];
      return {
        messages: {
          ...state.messages,
          [convId]: [...existing, message],
        },
        conversations: state.conversations.map((c) =>
          c.id === convId
            ? {
                ...c,
                lastMessage:
                  message.type === "meet-link" ? "Shared a Meet link" : message.text,
                lastAt: message.sentAt,
              }
            : c
        ),
      };
    });
  },
}));
