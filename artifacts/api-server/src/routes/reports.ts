import { Router } from "express";
import pool from "../lib/pool.js";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/requireAuth.js";

const router = Router();

// POST /api/reports — any authenticated user can file a report
router.post("/", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { reportedUserId, type, description } = req.body;
    if (!type || !description) {
      res.status(400).json({ message: "type and description are required" });
      return;
    }
    await pool.query(
      `INSERT INTO reports (reporter_id, reported_user_id, type, description) VALUES ($1, $2, $3, $4)`,
      [req.user!.id, reportedUserId || null, type, description]
    );
    res.status(201).json({ message: "Report submitted" });
  } catch (err) {
    next(err);
  }
});

export default router;
