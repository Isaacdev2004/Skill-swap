import { z } from "zod";
import { SkillIntent } from "@/common/constants/enums";

export const createSkillSchema = z.object({
  name: z.string().min(2).max(100),
  categoryId: z.string().min(1),
  description: z.string().max(1000).optional(),
  icon: z.string().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
});

export const upsertUserSkillSchema = z.object({
  skillId: z.string().min(1),
  intent: z.nativeEnum(SkillIntent),
  level: z.string().min(1),
  yearsExperience: z.number().min(0).optional(),
});

export const listSkillsSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpsertUserSkillInput = z.infer<typeof upsertUserSkillSchema>;
