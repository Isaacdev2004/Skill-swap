import { z } from "zod";

export const startConversationSchema = z.object({
  participantId: z.string().min(1),
  swapRequestId: z.string().optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
});

export const listMessagesSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
