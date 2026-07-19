import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import * as notificationController from "@/modules/notifications/controllers/notification.controller";

const notificationRouter = Router();

notificationRouter.use(authenticate);
notificationRouter.get("/", notificationController.list);
notificationRouter.get("/unread-count", notificationController.getUnreadCount);
notificationRouter.patch("/read-all", notificationController.markAllRead);
notificationRouter.patch("/:id/read", notificationController.markRead);

export default notificationRouter;
