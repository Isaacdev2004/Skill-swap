export const APP_NAME = "SkillSwap";

export const API_PREFIX = "/api/v1";

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const AVATAR_COLORS = [
  "indigo",
  "purple",
  "emerald",
  "rose",
  "amber",
  "blue",
  "teal",
] as const;

export const MATCH_THRESHOLDS = {
  HIGH: 75,
  MEDIUM: 50,
  LOW: 25,
} as const;

export const TOKEN_TYPES = {
  ACCESS: "access",
  REFRESH: "refresh",
} as const;

export const COOKIE_NAMES = {
  REFRESH_TOKEN: "refreshToken",
} as const;
