import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { TOKEN_TYPES } from "@/config/constants";
import { UnauthorizedError } from "@/common/errors/AppError";
import type { JwtPayload } from "@/common/types";
import { UserModel } from "@/modules/users/models/user.model";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : undefined;

    if (!token) {
      throw new UnauthorizedError("Access token required");
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    if (decoded.type !== TOKEN_TYPES.ACCESS) {
      throw new UnauthorizedError("Invalid token type");
    }

    const user = await UserModel.findById(decoded.sub).select("name email role verified status").lean();

    if (!user || user.status === "suspended") {
      throw new UnauthorizedError("User account unavailable");
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      verified: user.verified,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError("Invalid or expired token"));
      return;
    }
    next(error);
  }
}

export function optionalAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    next();
    return;
  }

  authenticate(req, res, next).catch(next);
}
