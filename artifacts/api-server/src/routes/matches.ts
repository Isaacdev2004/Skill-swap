import { Router } from "express";
import pool from "../lib/pool.js";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/requireAuth.js";
import { shapeUser } from "../lib/userShape.js";

const router = Router();

// GET /api/matches — compute matches for the current user
router.get("/", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;

    // Get current user's teach/learn skill names
    const mySkills = await pool.query("SELECT name, type FROM skills WHERE user_id = $1", [userId]);
    const myTeachNames = mySkills.rows.filter((s: any) => s.type === "teach").map((s: any) => s.name as string);
    const myLearnNames = mySkills.rows.filter((s: any) => s.type === "learn").map((s: any) => s.name as string);

    if (myTeachNames.length === 0 && myLearnNames.length === 0) {
      res.json({ matches: [] });
      return;
    }

    // Find users with complementary skills (they teach what I learn, or they learn what I teach)
    const matchQuery = `
      SELECT
        u.*,
        COUNT(DISTINCT s_they_teach.id) AS teach_overlap,
        COUNT(DISTINCT s_they_learn.id) AS learn_overlap,
        array_agg(DISTINCT s_they_teach.name) FILTER (WHERE s_they_teach.id IS NOT NULL) AS they_teach_match,
        array_agg(DISTINCT s_they_learn.name) FILTER (WHERE s_they_learn.id IS NOT NULL) AS they_learn_match
      FROM users u
      LEFT JOIN skills s_they_teach
        ON s_they_teach.user_id = u.id
        AND s_they_teach.type = 'teach'
        AND ($2::text[] IS NULL OR s_they_teach.name = ANY($2::text[]))
      LEFT JOIN skills s_they_learn
        ON s_they_learn.user_id = u.id
        AND s_they_learn.type = 'learn'
        AND ($3::text[] IS NULL OR s_they_learn.name = ANY($3::text[]))
      WHERE u.id != $1 AND u.is_suspended = false
      GROUP BY u.id
      HAVING COUNT(DISTINCT s_they_teach.id) > 0 OR COUNT(DISTINCT s_they_learn.id) > 0
      ORDER BY (COUNT(DISTINCT s_they_teach.id) + COUNT(DISTINCT s_they_learn.id)) DESC, u.rating DESC
      LIMIT 20
    `;

    const learnParam = myLearnNames.length > 0 ? myLearnNames : null;
    const teachParam = myTeachNames.length > 0 ? myTeachNames : null;

    const result = await pool.query(matchQuery, [userId, learnParam, teachParam]);

    if (result.rows.length === 0) {
      res.json({ matches: [] });
      return;
    }

    const userIds = result.rows.map((r: any) => r.id);
    const [skillsRes, badgesRes] = await Promise.all([
      pool.query("SELECT * FROM skills WHERE user_id = ANY($1::uuid[])", [userIds]),
      pool.query("SELECT * FROM badges WHERE user_id = ANY($1::uuid[])", [userIds]),
    ]);

    const matches = result.rows.map((row: any) => {
      const skills = skillsRes.rows.filter((s: any) => s.user_id === row.id);
      const badges = badgesRes.rows.filter((b: any) => b.user_id === row.id);
      const user = shapeUser(row, skills, badges);

      const teachOverlap = parseInt(row.teach_overlap) || 0;
      const learnOverlap = parseInt(row.learn_overlap) || 0;
      const maxPossible = Math.max(myLearnNames.length, 1) + Math.max(myTeachNames.length, 1);
      const rawScore = ((teachOverlap + learnOverlap) / maxPossible) * 100;
      const compatibilityScore = Math.min(99, Math.round(rawScore * 0.6 + 40 + (user.rating / 5) * 15));

      const theyTeach = skills.filter((s: any) => s.type === "teach" && myLearnNames.includes(s.name));
      const theyWant = skills.filter((s: any) => s.type === "learn" && myTeachNames.includes(s.name));

      return {
        id: `match-${userId}-${row.id}`,
        user,
        compatibilityScore,
        theyTeach: theyTeach.map((s: any) => ({ id: s.id, name: s.name, category: s.category, level: s.level })),
        theyWant: theyWant.map((s: any) => ({ id: s.id, name: s.name, category: s.category, level: s.level })),
        mutualSkills: [...new Set([...theyTeach.map((s: any) => s.name), ...theyWant.map((s: any) => s.name)])],
        status: "pending" as const,
      };
    });

    res.json({ matches });
  } catch (err) {
    next(err);
  }
});

export default router;
