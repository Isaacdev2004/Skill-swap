import { asyncHandler, sendSuccess } from "@/common/utils/response";
import { getRouteParam } from "@/common/utils/helpers";
import { matchService } from "@/modules/matches/services/match.service";

export const getMyMatches = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const matches = await matchService.getMatchesForUser(req.user!.id, limit);
  sendSuccess(res, { matches }, "Matches retrieved");
});

export const getMatchWithUser = asyncHandler(async (req, res) => {
  const match = await matchService.getMatchWithUser(req.user!.id, getRouteParam(req.params.userId));
  sendSuccess(res, { match }, "Match details retrieved");
});
