import { Router } from "express";
import pool from "../lib/pool.js";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/requireAuth.js";

const router = Router();

// GET /api/notifications
router.get("/", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.user!.id]
    );
    const unreadCount = result.rows.filter((n: any) => !n.is_read).length;
    res.json({
      notifications: result.rows.map((n: any) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        isRead: n.is_read,
        createdAt: n.created_at,
      })),
      unreadCount,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/notifications/:id/read
router.put("/:id/read", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    await pool.query(
      `UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user!.id]
    );
    res.json({ message: "Marked as read" });
  } catch (err) {
    next(err);
  }
});

// PUT /api/notifications/read-all
router.put("/read-all", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    await pool.query(`UPDATE notifications SET is_read = true WHERE user_id = $1`, [req.user!.id]);
    res.json({ message: "All marked as read" });
  } catch (err) {
    next(err);
  }
});

export default router;
