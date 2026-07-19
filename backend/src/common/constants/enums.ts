export enum UserRole {
  GUEST = "guest",
  USER = "user",
  VERIFIED_USER = "verified_user",
  MODERATOR = "moderator",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING = "pending",
}

export enum SkillIntent {
  TEACH = "teach",
  LEARN = "learn",
}

export enum SwapRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum SessionStatus {
  UPCOMING = "upcoming",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  MISSED = "missed",
}

export enum NotificationType {
  NEW_MATCH = "new_match",
  SWAP_ACCEPTED = "swap_accepted",
  SWAP_REJECTED = "swap_rejected",
  SESSION_REMINDER = "session_reminder",
  NEW_MESSAGE = "new_message",
  REVIEW_RECEIVED = "review_received",
  ADMIN = "admin",
}

export enum ReportStatus {
  OPEN = "open",
  REVIEWING = "reviewing",
  RESOLVED = "resolved",
  DISMISSED = "dismissed",
}

export enum VerificationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum RecommendationLevel {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
  NONE = "none",
}

export enum BadgeType {
  FIRST_SESSION = "first_session",
  TOP_MENTOR = "top_mentor",
  FAST_RESPONDER = "fast_responder",
  FIVE_STAR_TEACHER = "five_star_teacher",
  TEN_SESSIONS = "ten_sessions",
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.GUEST]: 0,
  [UserRole.USER]: 1,
  [UserRole.VERIFIED_USER]: 2,
  [UserRole.MODERATOR]: 3,
  [UserRole.ADMIN]: 4,
  [UserRole.SUPER_ADMIN]: 5,
};

export const ADMIN_ROLES: UserRole[] = [
  UserRole.MODERATOR,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];
