import { z } from "zod";
import { SwapRequestStatus } from "@/common/constants/enums";

export const createSwapRequestSchema = z.object({
  receiverId: z.string().min(1),
  message: z.string().max(1000).optional(),
  offeredSkillIds: z.array(z.string()).min(1),
  requestedSkillIds: z.array(z.string()).min(1),
});

export const listSwapRequestsSchema = z.object({
  status: z.nativeEnum(SwapRequestStatus).optional(),
  type: z.enum(["sent", "received", "all"]).optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export type CreateSwapRequestInput = z.infer<typeof createSwapRequestSchema>;
