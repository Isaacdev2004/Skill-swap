import { asyncHandler, sendSuccess, sendPaginatedSuccess } from "@/common/utils/response";
import { getRouteParam } from "@/common/utils/helpers";
import { skillService } from "@/modules/skills/services/skill.service";

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await skillService.listCategories();
  sendSuccess(res, { categories }, "Categories retrieved");
});

export const listSkills = asyncHandler(async (req, res) => {
  const result = await skillService.listSkills(req.query);
  sendPaginatedSuccess(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
});

export const getSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.getSkill(getRouteParam(req.params.id));
  sendSuccess(res, { skill }, "Skill retrieved");
});

export const createSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.createSkill(req.body);
  sendSuccess(res, { skill }, "Skill created", 201);
});

export const upsertUserSkill = asyncHandler(async (req, res) => {
  const userSkill = await skillService.upsertUserSkill(req.user!.id, req.body);
  sendSuccess(res, { userSkill }, "User skill saved");
});

export const deleteUserSkill = asyncHandler(async (req, res) => {
  await skillService.deleteUserSkill(req.user!.id, getRouteParam(req.params.userSkillId));
  sendSuccess(res, null, "User skill removed");
});
