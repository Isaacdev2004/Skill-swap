import { create } from 'zustand';
import { Notification, MOCK_NOTIFICATIONS } from '../mock/data';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.isRead).length,
  
  markAsRead: (id) => set((state) => {
    const next = state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    return { notifications: next, unreadCount: next.filter(n => !n.isRead).length };
  }),
  
  markAllAsRead: () => set((state) => {
    const next = state.notifications.map(n => ({ ...n, isRead: true }));
    return { notifications: next, unreadCount: 0 };
  }),
  
  addNotification: (n) => set((state) => {
    const newNotif: Notification = {
      ...n,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    const next = [newNotif, ...state.notifications];
    return { notifications: next, unreadCount: next.filter(x => !x.isRead).length };
  })
}));
