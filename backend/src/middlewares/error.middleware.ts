import type { Request, Response, NextFunction } from "express";
import { AppError } from "@/common/errors/AppError";
import { logger } from "@/common/utils/logger";
import { isProduction } from "@/config/env";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    errors: [],
    statusCode: 404,
  });
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      statusCode: err.statusCode,
    });
    return;
  }

  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    message: isProduction ? "Internal server error" : err.message,
    errors: [],
    statusCode: 500,
  });
}
