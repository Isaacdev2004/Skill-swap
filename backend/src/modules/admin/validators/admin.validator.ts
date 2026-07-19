import { z } from "zod";
import { UserRole, UserStatus } from "@/common/constants/enums";

export const updateUserStatusSchema = z.object({
  status: z.nativeEnum(UserStatus),
});

export const updateUserRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export const resolveReportSchema = z.object({
  resolution: z.string().min(1).max(2000),
});

export const reviewVerificationSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

export const adminListSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});
