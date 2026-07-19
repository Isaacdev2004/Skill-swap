import type { Request, Response } from "express";
import { env, isProduction } from "@/config/env";
import { COOKIE_NAMES } from "@/config/constants";
import { asyncHandler, sendSuccess } from "@/common/utils/response";
import { parseDurationToMs } from "@/common/utils/helpers";
import { authService } from "@/modules/auth/services/auth.service";

function setRefreshCookie(res: Response, refreshToken: string): void {
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN),
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN);
}

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  setRefreshCookie(res, result.data.tokens.refreshToken);
  sendSuccess(res, result.data, result.message, 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  setRefreshCookie(res, result.data.tokens.refreshToken);
  sendSuccess(res, result.data, result.message);
});

export const googleAuth = asyncHandler(async (req, res) => {
  const result = await authService.googleAuth(req.body);
  setRefreshCookie(res, result.data.tokens.refreshToken);
  sendSuccess(res, result.data, result.message);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token =
    req.body.refreshToken ??
    (req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] as string | undefined);

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Refresh token required",
      errors: [],
      statusCode: 401,
    });
    return;
  }

  const result = await authService.refresh(token);
  setRefreshCookie(res, result.data.tokens.refreshToken);
  sendSuccess(res, result.data, result.message);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] as string | undefined;
  await authService.logout(token, req.user?.id);
  clearRefreshCookie(res);
  sendSuccess(res, null, "Logged out successfully");
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user!.id);
  sendSuccess(res, { user }, "Profile retrieved");
});
