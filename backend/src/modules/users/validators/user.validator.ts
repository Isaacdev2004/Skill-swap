import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(1000).optional(),
  languages: z.array(z.string()).optional(),
  timezone: z.string().optional(),
  availability: z
    .array(
      z.object({
        day: z.string(),
        start: z.string(),
        end: z.string(),
      })
    )
    .optional(),
});

export const listUsersSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
