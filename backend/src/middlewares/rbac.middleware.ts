import type { Request, Response, NextFunction } from "express";
import { UserRole } from "@/common/constants/enums";
import { ForbiddenError, hasMinimumRole } from "@/common/errors/AppError";

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError("Authentication required"));
      return;
    }

    const userRole = req.user.role as UserRole;
    const allowed = roles.some((role) => hasMinimumRole(userRole, role));

    if (!allowed) {
      next(new ForbiddenError("Insufficient permissions"));
      return;
    }

    next();
  };
}

export const requireVerifiedUser = requireRole(UserRole.VERIFIED_USER);
export const requireModerator = requireRole(UserRole.MODERATOR);
export const requireAdmin = requireRole(UserRole.ADMIN);
export const requireSuperAdmin = requireRole(UserRole.SUPER_ADMIN);

export function requireSelfOrAdmin(paramName = "id") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError("Authentication required"));
      return;
    }

    const targetId = req.params[paramName];
    const isAdmin = hasMinimumRole(req.user.role as UserRole, UserRole.MODERATOR);

    if (req.user.id !== targetId && !isAdmin) {
      next(new ForbiddenError("You can only access your own resource"));
      return;
    }

    next();
  };
}
