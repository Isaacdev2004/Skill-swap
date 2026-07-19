import { Router } from "express";
import bcrypt from "bcrypt";
import pool from "../lib/pool.js";
import { getUserShape } from "../lib/userShape.js";

const router = Router();

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-purple-500", "bg-emerald-500",
  "bg-rose-500", "bg-amber-500", "bg-blue-500", "bg-teal-500",
];

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "Name, email and password are required" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existing.rows[0]) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const initials = getInitials(name);
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, initials, avatar_color)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, email.toLowerCase(), passwordHash, initials, avatarColor]
    );

    const userId = result.rows[0].id;
    (req.session as any).userId = userId;
    req.session.save(() => {});

    const user = await getUserShape(userId);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    const u = result.rows[0];
    if (!u) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    if (u.is_suspended) {
      res.status(403).json({ message: "Account suspended. Contact support." });
      return;
    }

    const valid = await bcrypt.compare(password, u.password_hash);
    if (!valid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    (req.session as any).userId = u.id;
    req.session.save(() => {});

    const user = await getUserShape(u.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

// GET /api/auth/me
router.get("/me", async (req, res, next) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    const user = await getUserShape(userId);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
