import type { Request, Response, NextFunction } from "express";
import pool from "../lib/pool.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isVerified: boolean;
    isSuspended: boolean;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email, is_admin, is_verified, is_suspended FROM users WHERE id = $1",
      [userId]
    );
    if (!result.rows[0]) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    const u = result.rows[0];
    req.user = {
      id: u.id,
      name: u.name,
      email: u.email,
      isAdmin: u.is_admin,
      isVerified: u.is_verified,
      isSuspended: u.is_suspended,
    };
    next();
  } catch (err) {
    next(err);
  }
}

export async function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  await requireAuth(req, res, () => {
    if (!req.user?.isAdmin) {
      res.status(403).json({ message: "Admin access required" });
      return;
    }
    next();
  });
}
