import { Router } from "express";
import pool from "../lib/pool.js";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/requireAuth.js";
import { shapeUser } from "../lib/userShape.js";

const router = Router();

async function getOrCreateConversation(user1Id: string, user2Id: string) {
  // Canonical ordering so the UNIQUE index works
  const [a, b] = [user1Id, user2Id].sort();

  const existing = await pool.query(
    `SELECT * FROM conversations WHERE
      (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)`,
    [a, b]
  );
  if (existing.rows[0]) return existing.rows[0];

  const result = await pool.query(
    `INSERT INTO conversations (user1_id, user2_id) VALUES ($1, $2) RETURNING *`,
    [a, b]
  );
  return result.rows[0];
}

// GET /api/conversations
router.get("/", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const result = await pool.query(
      `SELECT c.*,
        (SELECT m.text FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
        (SELECT m.created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_at,
        (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_id != $1 AND m.created_at > COALESCE(
          (SELECT MAX(m2.created_at) FROM messages m2 WHERE m2.conversation_id = c.id AND m2.sender_id = $1), '1970-01-01'
        )) AS unread_count
       FROM conversations c
       WHERE c.user1_id = $1 OR c.user2_id = $1
       ORDER BY c.updated_at DESC`,
      [userId]
    );

    const conversations = await Promise.all(result.rows.map(async (c: any) => {
      const otherId = c.user1_id === userId ? c.user2_id : c.user1_id;
      const [userRes, skillsRes, badgesRes] = await Promise.all([
        pool.query("SELECT * FROM users WHERE id = $1", [otherId]),
        pool.query("SELECT * FROM skills WHERE user_id = $1", [otherId]),
        pool.query("SELECT * FROM badges WHERE user_id = $1", [otherId]),
      ]);
      return {
        id: c.id,
        participant: shapeUser(userRes.rows[0], skillsRes.rows, badgesRes.rows),
        lastMessage: c.last_message || "",
        lastAt: c.last_at || c.created_at,
        unread: parseInt(c.unread_count) || 0,
        isOnline: false,
      };
    }));

    res.json({ conversations });
  } catch (err) {
    next(err);
  }
});

// POST /api/conversations — get or create with a user
router.post("/", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { userId: otherId } = req.body;
    if (!otherId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    const conv = await getOrCreateConversation(req.user!.id, otherId);
    res.json({ conversationId: conv.id });
  } catch (err) {
    next(err);
  }
});

// GET /api/conversations/:id/messages
router.get("/:id/messages", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;

    // Verify membership
    const conv = await pool.query(
      `SELECT * FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
      [req.params.id, userId]
    );
    if (!conv.rows[0]) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    const since = req.query.since as string | undefined;
    let query = `SELECT * FROM messages WHERE conversation_id = $1`;
    const params: any[] = [req.params.id];

    if (since) {
      query += ` AND created_at > $2`;
      params.push(new Date(since));
    }
    query += ` ORDER BY created_at ASC LIMIT 200`;

    const result = await pool.query(query, params);
    const messages = result.rows.map((m: any) => ({
      id: m.id,
      senderId: m.sender_id,
      text: m.text,
      sentAt: m.created_at,
      type: m.type,
    }));

    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

// POST /api/conversations/:id/messages — send
router.post("/:id/messages", requireAuth as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { text, type } = req.body;

    if (!text?.trim()) {
      res.status(400).json({ message: "text is required" });
      return;
    }

    // Verify membership
    const conv = await pool.query(
      `SELECT * FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
      [req.params.id, userId]
    );
    if (!conv.rows[0]) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    const msgType = text.includes("meet.google.com") ? "meet-link" : (type || "text");

    const result = await pool.query(
      `INSERT INTO messages (conversation_id, sender_id, text, type) VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.params.id, userId, text.trim(), msgType]
    );

    // Update conversation timestamp
    await pool.query(`UPDATE conversations SET updated_at = NOW() WHERE id = $1`, [req.params.id]);

    // Notify the other participant
    const c = conv.rows[0];
    const otherId = c.user1_id === userId ? c.user2_id : c.user1_id;
    const meUser = await pool.query("SELECT name FROM users WHERE id = $1", [userId]);
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body) VALUES ($1, 'message', $2, $3)`,
      [otherId, "New Message", `${meUser.rows[0]?.name}: ${text.slice(0, 80)}`]
    );

    const m = result.rows[0];
    res.status(201).json({
      message: { id: m.id, senderId: m.sender_id, text: m.text, sentAt: m.created_at, type: m.type },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
