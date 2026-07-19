import type { Request, Response, NextFunction, RequestHandler } from "express";

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler =
  (handler: AsyncRequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendPaginatedSuccess<T>(
  res: Response,
  items: T[],
  meta: {
    page: number;
    limit: number;
    total: number;
  },
  message = "Success"
): void {
  const totalPages = Math.ceil(meta.total / meta.limit) || 1;

  res.status(200).json({
    success: true,
    message,
    data: {
      items,
      meta: {
        page: meta.page,
        limit: meta.limit,
        total: meta.total,
        totalPages,
        hasNextPage: meta.page < totalPages,
        hasPrevPage: meta.page > 1,
      },
    },
  });
}
