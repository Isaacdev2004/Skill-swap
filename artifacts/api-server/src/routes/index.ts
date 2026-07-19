import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import matchesRouter from "./matches.js";
import swapRequestsRouter from "./swapRequests.js";
import sessionsRouter from "./sessions.js";
import conversationsRouter from "./conversations.js";
import notificationsRouter from "./notifications.js";
import reviewsRouter from "./reviews.js";
import adminRouter from "./admin.js";
import reportsRouter from "./reports.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/matches", matchesRouter);
router.use("/swap-requests", swapRequestsRouter);
router.use("/sessions", sessionsRouter);
router.use("/conversations", conversationsRouter);
router.use("/notifications", notificationsRouter);
router.use("/reviews", reviewsRouter);
router.use("/admin", adminRouter);
router.use("/reports", reportsRouter);

export default router;
