import { Types } from "mongoose";
import { NotificationModel } from "@/modules/notifications/models/notification.model";
import type { NotificationType } from "@/common/constants/enums";
import { parsePagination } from "@/common/utils/helpers";

export class NotificationRepository {
  async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
  }) {
    return NotificationModel.create({
      user: new Types.ObjectId(data.userId),
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data,
    });
  }

  async list(userId: string, filters: { unreadOnly?: boolean; page?: number; limit?: number }) {
    const { page, limit, skip } = parsePagination(filters);
    const query: Record<string, unknown> = { user: new Types.ObjectId(userId) };
    if (filters.unreadOnly) query.read = false;

    const [items, total, unreadCount] = await Promise.all([
      NotificationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      NotificationModel.countDocuments(query),
      NotificationModel.countDocuments({ user: new Types.ObjectId(userId), read: false }),
    ]);

    return { items, total, unreadCount, page, limit };
  }

  async markRead(userId: string, notificationId: string) {
    return NotificationModel.findOneAndUpdate(
      { _id: notificationId, user: new Types.ObjectId(userId) },
      { read: true, readAt: new Date() },
      { new: true }
    );
  }

  async markAllRead(userId: string) {
    await NotificationModel.updateMany(
      { user: new Types.ObjectId(userId), read: false },
      { read: true, readAt: new Date() }
    );
  }
}

export const notificationRepository = new NotificationRepository();
