import { Router } from "express";
import pool from "../lib/pool.js";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/requireAuth.js";
import { shapeUser } from "../lib/userShape.js";

const router = Router();

async function enrichRequest(r: any) {
  const [fromRes, toRes, fromSkills, toSkills, fromBadges, toBadges] = await Promise.all([
    pool.query("SELECT * FROM users WHERE id = $1", [r.from_user_id]),
    pool.query("SELECT * FROM users WHERE id = $1", [r.to_user_id]),
    pool.query("SELECT * FROM skills WHERE user_id = $1", [r.from_user_id]),
    pool.query("SELECT * FROM skills WHERE user_id = $1", [r.to_user_id]),
    pool.query("SELECT * FROM badges WHERE user_id = $1", [r.from_user_id]),
    pool.query("SELECT * FROM badges WHERE user_id = $1", [r.to_user_id]),
  ]);
  return {
    id: r.id,
    fromUser: shapeUser(fromRes.rows[0], fromSkills.rows, fromBadges.rows),
    toUser: shapeUser(toRes.rows[0], toSkills.rows, toBadges.rows),
    teachSkillName: r.teach_skill_name,
    learnSkillName: r.learn_skill_name,
    frequency: r.frequency,
    duration: r.duration,
    message: r.message,
    status: r.status,
    createdAt: r.created_at,
  };
}

// GET /api/swap-requests
router.get("/", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const result = await pool.query(
      `SELECT * FROM swap_requests WHERE from_user_id = $1 OR to_user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    const requests = await Promise.all(result.rows.map(enrichRequest));
    res.json({ requests });
  } catch (err) {
    next(err);
  }
});

// POST /api/swap-requests
router.post("/", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { toUserId, teachSkillName, learnSkillName, frequency, duration, message } = req.body;
    const fromUserId = req.user!.id;

    if (!toUserId || !teachSkillName || !learnSkillName) {
      res.status(400).json({ message: "toUserId, teachSkillName and learnSkillName are required" });
      return;
    }

    // Check not duplicate pending
    const existing = await pool.query(
      `SELECT id FROM swap_requests WHERE from_user_id = $1 AND to_user_id = $2 AND status = 'pending'`,
      [fromUserId, toUserId]
    );
    if (existing.rows[0]) {
      res.status(409).json({ message: "You already have a pending request with this user" });
      return;
    }

    const result = await pool.query(
      `INSERT INTO swap_requests (from_user_id, to_user_id, teach_skill_name, learn_skill_name, frequency, duration, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [fromUserId, toUserId, teachSkillName, learnSkillName, frequency || "Weekly", duration || 60, message || ""]
    );

    // Create notification for recipient
    const fromUser = await pool.query("SELECT name FROM users WHERE id = $1", [fromUserId]);
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body) VALUES ($1, 'request', $2, $3)`,
      [toUserId, "New Swap Request", `${fromUser.rows[0]?.name} wants to swap ${teachSkillName} for ${learnSkillName}`]
    );

    const request = await enrichRequest(result.rows[0]);
    res.status(201).json({ request });
  } catch (err) {
    next(err);
  }
});

// PUT /api/swap-requests/:id — accept or decline
router.put("/:id", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { status } = req.body;
    if (!["accepted", "declined"].includes(status)) {
      res.status(400).json({ message: "status must be accepted or declined" });
      return;
    }

    const result = await pool.query(
      `UPDATE swap_requests SET status = $1 WHERE id = $2 AND to_user_id = $3 RETURNING *`,
      [status, req.params.id, req.user!.id]
    );

    if (!result.rows[0]) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    // Notify sender
    const r = result.rows[0];
    const meUser = await pool.query("SELECT name FROM users WHERE id = $1", [req.user!.id]);
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body) VALUES ($1, 'request', $2, $3)`,
      [r.from_user_id, `Swap Request ${status === "accepted" ? "Accepted" : "Declined"}`,
       `${meUser.rows[0]?.name} ${status === "accepted" ? "accepted" : "declined"} your swap request`]
    );

    const request = await enrichRequest(result.rows[0]);
    res.json({ request });
  } catch (err) {
    next(err);
  }
});

export default router;
