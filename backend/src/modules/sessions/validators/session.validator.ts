import { z } from "zod";
import { SessionStatus } from "@/common/constants/enums";

export const createSessionSchema = z.object({
  swapRequestId: z.string().min(1),
  title: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  scheduledAt: z.coerce.date(),
  durationMinutes: z.number().min(15).max(240).optional(),
  timezone: z.string().optional(),
});

export const listSessionsSchema = z.object({
  status: z.nativeEnum(SessionStatus).optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
