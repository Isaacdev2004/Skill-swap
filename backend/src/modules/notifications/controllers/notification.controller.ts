import { asyncHandler, sendSuccess, sendPaginatedSuccess } from "@/common/utils/response";
import { getRouteParam } from "@/common/utils/helpers";
import { notificationService } from "@/modules/notifications/services/notification.service";

export const list = asyncHandler(async (req, res) => {
  const unreadOnly = req.query.unreadOnly === "true";
  const result = await notificationService.list(req.user!.id, {
    unreadOnly,
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });

  sendPaginatedSuccess(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const result = await notificationService.list(req.user!.id, { unreadOnly: true, limit: 1 });
  sendSuccess(res, { unreadCount: result.unreadCount }, "Unread count retrieved");
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markRead(req.user!.id, getRouteParam(req.params.id));
  sendSuccess(res, { notification }, "Notification marked as read");
});

export const markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllRead(req.user!.id);
  sendSuccess(res, null, "All notifications marked as read");
});
