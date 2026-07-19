import { Router } from "express";
import pool from "../lib/pool.js";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/requireAuth.js";
import { getUserShape, shapeUser, shapeSkill } from "../lib/userShape.js";

const router = Router();

// GET /api/users — marketplace listing with optional search/filter
router.get("/", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { q, category, level } = req.query;

    let query = `
      SELECT DISTINCT u.*,
        array_agg(DISTINCT jsonb_build_object('id', s.id, 'name', s.name, 'category', s.category, 'level', s.level)) 
          FILTER (WHERE s.type = 'teach') AS teach_skills
      FROM users u
      LEFT JOIN skills s ON s.user_id = u.id
      WHERE u.id != $1 AND u.is_suspended = false
    `;
    const params: any[] = [req.user!.id];
    let idx = 2;

    if (q) {
      query += ` AND (u.name ILIKE $${idx} OR EXISTS (
        SELECT 1 FROM skills sk WHERE sk.user_id = u.id AND sk.name ILIKE $${idx}
      ))`;
      params.push(`%${q}%`);
      idx++;
    }
    if (category) {
      query += ` AND EXISTS (SELECT 1 FROM skills sk WHERE sk.user_id = u.id AND sk.category = $${idx})`;
      params.push(category);
      idx++;
    }
    if (level) {
      query += ` AND EXISTS (SELECT 1 FROM skills sk WHERE sk.user_id = u.id AND sk.level = $${idx})`;
      params.push(level);
      idx++;
    }

    query += " GROUP BY u.id ORDER BY u.rating DESC LIMIT 50";

    const result = await pool.query(query, params);
    const skillsRes = await pool.query("SELECT * FROM skills WHERE user_id = ANY($1::uuid[])", [result.rows.map((r: any) => r.id)]);
    const badgesRes = await pool.query("SELECT * FROM badges WHERE user_id = ANY($1::uuid[])", [result.rows.map((r: any) => r.id)]);

    const users = result.rows.map((u: any) => {
      const skills = skillsRes.rows.filter((s: any) => s.user_id === u.id);
      const badges = badgesRes.rows.filter((b: any) => b.user_id === u.id);
      return shapeUser(u, skills, badges);
    });

    res.json({ users });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/me
router.get("/me", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await getUserShape(req.user!.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/me — update profile
router.put("/me", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { name, bio, languages, availabilityDays, availabilityTimeSlot, skillsTeach, skillsLearn } = req.body;
    const userId = req.user!.id;

    await pool.query(
      `UPDATE users SET
        name = COALESCE($1, name),
        bio = COALESCE($2, bio),
        languages = COALESCE($3, languages),
        availability_days = COALESCE($4, availability_days),
        availability_time_slot = COALESCE($5, availability_time_slot),
        initials = CASE WHEN $1 IS NOT NULL THEN LEFT(REGEXP_REPLACE($1, '[^A-Za-z ]', ''), 2) ELSE initials END,
        updated_at = NOW()
       WHERE id = $6`,
      [name || null, bio || null, languages || null, availabilityDays || null, availabilityTimeSlot || null, userId]
    );

    // Replace skills if provided
    if (skillsTeach !== undefined || skillsLearn !== undefined) {
      if (skillsTeach !== undefined) {
        await pool.query("DELETE FROM skills WHERE user_id = $1 AND type = 'teach'", [userId]);
        for (const s of skillsTeach || []) {
          await pool.query(
            "INSERT INTO skills (user_id, name, category, level, type) VALUES ($1, $2, $3, $4, 'teach')",
            [userId, s.name, s.category || "Technology", s.level || "Beginner"]
          );
        }
      }
      if (skillsLearn !== undefined) {
        await pool.query("DELETE FROM skills WHERE user_id = $1 AND type = 'learn'", [userId]);
        for (const s of skillsLearn || []) {
          await pool.query(
            "INSERT INTO skills (user_id, name, category, level, type) VALUES ($1, $2, $3, $4, 'learn')",
            [userId, s.name, s.category || "Technology", s.level || "Beginner"]
          );
        }
      }
    }

    const user = await getUserShape(userId);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:id — public profile
router.get("/:id", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await getUserShape(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
