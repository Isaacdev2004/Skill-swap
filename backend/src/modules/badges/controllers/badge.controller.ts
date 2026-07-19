import { asyncHandler, sendSuccess } from "@/common/utils/response";
import { getRouteParam } from "@/common/utils/helpers";
import { badgeService } from "@/modules/badges/services/badge.service";

export const listBadges = asyncHandler(async (_req, res) => {
  const badges = await badgeService.listBadges();
  sendSuccess(res, { badges }, "Badges retrieved");
});

export const getUserBadges = asyncHandler(async (req, res) => {
  const badges = await badgeService.getUserBadges(getRouteParam(req.params.userId));
  sendSuccess(res, { badges }, "User badges retrieved");
});
