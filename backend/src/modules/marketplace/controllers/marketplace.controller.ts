import { asyncHandler, sendSuccess, sendPaginatedSuccess } from "@/common/utils/response";
import { getRouteParam } from "@/common/utils/helpers";
import { marketplaceService } from "@/modules/marketplace/services/marketplace.service";

export const browse = asyncHandler(async (req, res) => {
  const result = await marketplaceService.browse(req.query);
  sendPaginatedSuccess(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
});

export const getSkillTeachers = asyncHandler(async (req, res) => {
  const teachers = await marketplaceService.getSkillTeachers(getRouteParam(req.params.skillId));
  sendSuccess(res, { teachers }, "Skill teachers retrieved");
});

export const getPopularSkills = asyncHandler(async (_req, res) => {
  const skills = await marketplaceService.getPopularSkills();
  sendSuccess(res, { skills }, "Popular skills retrieved");
});

export const getTopMentors = asyncHandler(async (_req, res) => {
  const mentors = await marketplaceService.getTopMentors();
  sendSuccess(res, { mentors }, "Top mentors retrieved");
});
