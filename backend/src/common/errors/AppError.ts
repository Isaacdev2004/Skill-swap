import { UserRole } from "@/common/constants/enums";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors: string[];
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400, errors: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", errors: string[] = []) {
    super(message, 422, errors);
  }
}

export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    [UserRole.GUEST]: 0,
    [UserRole.USER]: 1,
    [UserRole.VERIFIED_USER]: 2,
    [UserRole.MODERATOR]: 3,
    [UserRole.ADMIN]: 4,
    [UserRole.SUPER_ADMIN]: 5,
  };

  return hierarchy[userRole] >= hierarchy[requiredRole];
}
