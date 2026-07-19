import { z } from "zod";

export const createReviewSchema = z.object({
  sessionId: z.string().min(1),
  revieweeId: z.string().min(1),
  rating: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  knowledge: z.number().min(1).max(5),
  recommend: z.boolean().default(true),
  comment: z.string().max(2000).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
