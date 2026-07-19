import { Router } from "express";
import pool from "../lib/pool.js";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/requireAuth.js";
import { shapeUser } from "../lib/userShape.js";

const router = Router();

// GET /api/reviews?userId= — reviews for a user (defaults to me)
router.get("/", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const targetId = (req.query.userId as string) || req.user!.id;

    const result = await pool.query(
      `SELECT * FROM reviews WHERE reviewee_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [targetId]
    );

    const reviews = await Promise.all(result.rows.map(async (r: any) => {
      const [userRes, skillsRes, badgesRes] = await Promise.all([
        pool.query("SELECT * FROM users WHERE id = $1", [r.reviewer_id]),
        pool.query("SELECT * FROM skills WHERE user_id = $1", [r.reviewer_id]),
        pool.query("SELECT * FROM badges WHERE user_id = $1", [r.reviewer_id]),
      ]);
      return {
        id: r.id,
        reviewer: shapeUser(userRes.rows[0], skillsRes.rows, badgesRes.rows),
        rating: parseFloat(r.rating),
        comment: r.comment,
        recommend: r.recommend,
        session: r.session_id,
        createdAt: r.created_at,
      };
    }));

    res.json({ reviews });
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews
router.post("/", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { revieweeId, sessionId, rating, comment, recommend } = req.body;
    const reviewerId = req.user!.id;

    if (!revieweeId || !rating) {
      res.status(400).json({ message: "revieweeId and rating are required" });
      return;
    }
    if (rating < 1 || rating > 5) {
      res.status(400).json({ message: "rating must be between 1 and 5" });
      return;
    }

    const result = await pool.query(
      `INSERT INTO reviews (reviewer_id, reviewee_id, session_id, rating, comment, recommend)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (reviewer_id, reviewee_id, session_id) DO UPDATE
         SET rating = $4, comment = $5, recommend = $6
       RETURNING *`,
      [reviewerId, revieweeId, sessionId || null, rating, comment || "", recommend !== false]
    );

    // Recompute reviewee's average rating
    await pool.query(
      `UPDATE users SET
        rating = (SELECT AVG(rating) FROM reviews WHERE reviewee_id = $1),
        review_count = (SELECT COUNT(*) FROM reviews WHERE reviewee_id = $1)
       WHERE id = $1`,
      [revieweeId]
    );

    // Notify reviewee
    const meUser = await pool.query("SELECT name FROM users WHERE id = $1", [reviewerId]);
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body) VALUES ($1, 'review', $2, $3)`,
      [revieweeId, "New Review", `${meUser.rows[0]?.name} left you a ${rating}★ review`]
    );

    res.status(201).json({ review: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
