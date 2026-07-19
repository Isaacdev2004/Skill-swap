import { z } from "zod";

export const browseMarketplaceSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  skill: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
