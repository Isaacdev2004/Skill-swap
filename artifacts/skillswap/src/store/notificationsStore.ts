import { create } from "zustand";
import { api, mapNotification } from "@/lib/api";
import type { Notification } from "@/mock/data";

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loaded: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loaded: false,

  fetchNotifications: async () => {
    try {
      const [listData, unreadCount] = await Promise.all([
        api.notifications.list(),
        api.notifications.unreadCount(),
      ]);
      set({
        notifications: listData.notifications,
        unreadCount,
        loaded: true,
      });
    } catch {
      set({ loaded: true });
    }
  },

  markAsRead: async (id) => {
    set((state) => {
      const next = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications: next,
        unreadCount: next.filter((n) => !n.isRead).length,
      };
    });
    try {
      await api.notifications.markRead(id);
    } catch {
      await get().fetchNotifications();
    }
  },

  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
    try {
      await api.notifications.markAll();
    } catch {
      await get().fetchNotifications();
    }
  },
}));
