import { Router } from "express";
import authRouter from "@/modules/auth/routes/auth.routes";
import userRouter from "@/modules/users/routes/user.routes";
import skillRouter from "@/modules/skills/routes/skill.routes";
import marketplaceRouter from "@/modules/marketplace/routes/marketplace.routes";
import matchRouter from "@/modules/matches/routes/match.routes";
import swapRequestRouter from "@/modules/swapRequests/routes/swapRequest.routes";
import sessionRouter from "@/modules/sessions/routes/session.routes";
import chatRouter from "@/modules/chat/routes/chat.routes";
import notificationRouter from "@/modules/notifications/routes/notification.routes";
import reviewRouter from "@/modules/reviews/routes/review.routes";
import badgeRouter from "@/modules/badges/routes/badge.routes";
import adminRouter from "@/modules/admin/routes/admin.routes";

const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillSwap API is healthy",
    data: { status: "ok", timestamp: new Date().toISOString() },
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/skills", skillRouter);
apiRouter.use("/marketplace", marketplaceRouter);
apiRouter.use("/matches", matchRouter);
apiRouter.use("/swap-requests", swapRequestRouter);
apiRouter.use("/sessions", sessionRouter);
apiRouter.use("/chat", chatRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/badges", badgeRouter);
apiRouter.use("/admin", adminRouter);

export default apiRouter;
