import type { NotificationType } from "@/common/constants/enums";
import { notificationRepository } from "@/modules/notifications/repositories/notification.repository";

export class NotificationService {
  create(data: Parameters<typeof notificationRepository.create>[0]) {
    return notificationRepository.create(data);
  }

  list(userId: string, filters: Parameters<typeof notificationRepository.list>[1]) {
    return notificationRepository.list(userId, filters);
  }

  markRead(userId: string, notificationId: string) {
    return notificationRepository.markRead(userId, notificationId);
  }

  markAllRead(userId: string) {
    return notificationRepository.markAllRead(userId);
  }
}

export const notificationService = new NotificationService();

export type { NotificationType };
