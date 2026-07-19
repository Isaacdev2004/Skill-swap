import { Router } from "express";
import pool from "../lib/pool.js";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/requireAuth.js";
import { shapeUser } from "../lib/userShape.js";

const router = Router();

async function enrichSession(s: any, currentUserId: string) {
  const otherId = s.user1_id === currentUserId ? s.user2_id : s.user1_id;
  const [userRes, skillsRes, badgesRes] = await Promise.all([
    pool.query("SELECT * FROM users WHERE id = $1", [otherId]),
    pool.query("SELECT * FROM skills WHERE user_id = $1", [otherId]),
    pool.query("SELECT * FROM badges WHERE user_id = $1", [otherId]),
  ]);

  return {
    id: s.id,
    withUser: shapeUser(userRes.rows[0], skillsRes.rows, badgesRes.rows),
    skill: { id: s.id, name: s.skill_name, category: s.skill_category, level: "Intermediate" },
    date: s.date instanceof Date ? s.date.toISOString().split("T")[0] : String(s.date).split("T")[0],
    time: s.time,
    duration: s.duration,
    status: s.status,
    googleMeetLink: s.google_meet_link,
    notes: s.notes,
    createdAt: s.created_at,
  };
}

// GET /api/sessions
router.get("/", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { status } = req.query;

    let query = `SELECT * FROM sessions WHERE (user1_id = $1 OR user2_id = $1)`;
    const params: any[] = [userId];

    if (status) {
      query += ` AND status = $2`;
      params.push(status);
    }

    query += ` ORDER BY date ASC, time ASC`;

    const result = await pool.query(query, params);
    const sessions = await Promise.all(result.rows.map((s: any) => enrichSession(s, userId)));
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
});

// POST /api/sessions
router.post("/", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { withUserId, skillName, skillCategory, date, time, duration, googleMeetLink, notes } = req.body;
    const userId = req.user!.id;

    if (!withUserId || !skillName || !date || !time) {
      res.status(400).json({ message: "withUserId, skillName, date and time are required" });
      return;
    }

    const result = await pool.query(
      `INSERT INTO sessions (user1_id, user2_id, skill_name, skill_category, date, time, duration, google_meet_link, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [userId, withUserId, skillName, skillCategory || "Technology", date, time, duration || 60, googleMeetLink || null, notes || ""]
    );

    // Notify partner
    const meUser = await pool.query("SELECT name FROM users WHERE id = $1", [userId]);
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body) VALUES ($1, 'session', $2, $3)`,
      [withUserId, "Session Scheduled", `${meUser.rows[0]?.name} scheduled a session with you on ${date} at ${time}`]
    );

    const session = await enrichSession(result.rows[0], userId);
    res.status(201).json({ session });
  } catch (err) {
    next(err);
  }
});

// PUT /api/sessions/:id
router.put("/:id", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { status, googleMeetLink, notes, date, time } = req.body;
    const userId = req.user!.id;

    const result = await pool.query(
      `UPDATE sessions SET
        status = COALESCE($1, status),
        google_meet_link = COALESCE($2, google_meet_link),
        notes = COALESCE($3, notes),
        date = COALESCE($4::date, date),
        time = COALESCE($5, time)
       WHERE id = $6 AND (user1_id = $7 OR user2_id = $7) RETURNING *`,
      [status || null, googleMeetLink || null, notes || null, date || null, time || null, req.params.id, userId]
    );

    if (!result.rows[0]) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    const session = await enrichSession(result.rows[0], userId);
    res.json({ session });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/sessions/:id — cancel
router.delete("/:id", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await pool.query(
      `UPDATE sessions SET status = 'cancelled' WHERE id = $1 AND (user1_id = $2 OR user2_id = $2) RETURNING *`,
      [req.params.id, req.user!.id]
    );
    if (!result.rows[0]) {
      res.status(404).json({ message: "Session not found" });
      return;
    }
    res.json({ message: "Session cancelled" });
  } catch (err) {
    next(err);
  }
});

export default router;
