import { Router } from "express";
import pool from "../lib/pool.js";
import { requireAdmin, type AuthenticatedRequest } from "../middlewares/requireAuth.js";
import { shapeUser } from "../lib/userShape.js";

const router = Router();

// GET /api/admin/stats
router.get("/stats", requireAdmin as any, async (_req, res, next) => {
  try {
    const [users, sessions, messages, reports] = await Promise.all([
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE is_verified) AS verified, COUNT(*) FILTER (WHERE is_suspended) AS suspended FROM users"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status = 'upcoming') AS upcoming, COUNT(*) FILTER (WHERE status = 'completed') AS completed FROM sessions"),
      pool.query("SELECT COUNT(*) AS total FROM messages"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status = 'open') AS open FROM reports"),
    ]);
    res.json({
      users: { total: parseInt(users.rows[0].total), verified: parseInt(users.rows[0].verified), suspended: parseInt(users.rows[0].suspended) },
      sessions: { total: parseInt(sessions.rows[0].total), upcoming: parseInt(sessions.rows[0].upcoming), completed: parseInt(sessions.rows[0].completed) },
      messages: parseInt(messages.rows[0].total),
      reports: { total: parseInt(reports.rows[0].total), open: parseInt(reports.rows[0].open) },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users
router.get("/users", requireAdmin as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { q, status } = req.query;
    let query = "SELECT * FROM users WHERE 1=1";
    const params: any[] = [];
    let idx = 1;

    if (q) {
      query += ` AND (name ILIKE $${idx} OR email ILIKE $${idx})`;
      params.push(`%${q}%`);
      idx++;
    }
    if (status === "suspended") { query += ` AND is_suspended = true`; }
    else if (status === "verified") { query += ` AND is_verified = true`; }
    else if (status === "unverified") { query += ` AND is_verified = false`; }

    query += " ORDER BY joined_at DESC LIMIT 100";

    const result = await pool.query(query, params);
    const skillsRes = await pool.query("SELECT * FROM skills WHERE user_id = ANY($1::uuid[])", [result.rows.map((r: any) => r.id)]);
    const badgesRes = await pool.query("SELECT * FROM badges WHERE user_id = ANY($1::uuid[])", [result.rows.map((r: any) => r.id)]);

    const users = result.rows.map((u: any) => ({
      ...shapeUser(u, skillsRes.rows.filter((s: any) => s.user_id === u.id), badgesRes.rows.filter((b: any) => b.user_id === u.id)),
      isSuspended: u.is_suspended,
    }));
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/users/:id
router.put("/users/:id", requireAdmin as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { isVerified, isSuspended, isAdmin } = req.body;
    await pool.query(
      `UPDATE users SET
        is_verified = COALESCE($1, is_verified),
        is_suspended = COALESCE($2, is_suspended),
        is_admin = COALESCE($3, is_admin),
        updated_at = NOW()
       WHERE id = $4`,
      [isVerified ?? null, isSuspended ?? null, isAdmin ?? null, req.params.id]
    );
    res.json({ message: "User updated" });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/reports
router.get("/reports", requireAdmin as any, async (_req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name AS reporter_name, ru.name AS reported_name
       FROM reports r
       LEFT JOIN users u ON u.id = r.reporter_id
       LEFT JOIN users ru ON ru.id = r.reported_user_id
       ORDER BY r.created_at DESC LIMIT 100`
    );
    res.json({ reports: result.rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/reports/:id/resolve
router.post("/reports/:id/resolve", requireAdmin as any, async (req, res, next) => {
  try {
    const { status } = req.body;
    await pool.query(
      `UPDATE reports SET status = $1 WHERE id = $2`,
      [status || "resolved", req.params.id]
    );
    res.json({ message: "Report updated" });
  } catch (err) {
    next(err);
  }
});

// POST /api/reports — submit a report (any auth user)
router.post("/", requireAdmin as any, async (_req, _res, next) => {
  next(); // fall through — handled below
});

export default router;
