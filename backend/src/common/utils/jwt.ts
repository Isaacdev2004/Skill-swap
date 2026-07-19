import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/config/env";
import { TOKEN_TYPES } from "@/config/constants";
import type { JwtPayload } from "@/common/types";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  refreshTokenId: string;
  refreshExpiresAt: Date;
}

export function signAccessToken(payload: Omit<JwtPayload, "type">): string {
  return jwt.sign({ ...payload, type: TOKEN_TYPES.ACCESS }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function signRefreshToken(payload: Omit<JwtPayload, "type">): string {
  return jwt.sign({ ...payload, type: TOKEN_TYPES.REFRESH }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
  if (decoded.type !== TOKEN_TYPES.ACCESS) {
    throw new Error("Invalid access token");
  }
  return decoded;
}

export function verifyRefreshToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
  if (decoded.type !== TOKEN_TYPES.REFRESH) {
    throw new Error("Invalid refresh token");
  }
  return decoded;
}

export function generateTokenPair(user: {
  id: string;
  email: string;
  role: string;
}): TokenPair {
  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const refreshTokenId = uuidv4();

  const refreshExpiresAt = new Date(
    Date.now() + parseRefreshExpiryMs(env.JWT_REFRESH_EXPIRES_IN)
  );

  return { accessToken, refreshToken, refreshTokenId, refreshExpiresAt };
}

function parseRefreshExpiryMs(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return amount * 1000;
    case "m":
      return amount * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    case "d":
      return amount * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}
