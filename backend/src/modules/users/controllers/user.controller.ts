import { asyncHandler, sendSuccess, sendPaginatedSuccess } from "@/common/utils/response";
import { getRouteParam } from "@/common/utils/helpers";
import { userService } from "@/modules/users/services/user.service";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(getRouteParam(req.params.id));
  sendSuccess(res, { user }, "User profile retrieved");
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user!.id, req.body);
  sendSuccess(res, { user }, "Profile updated");
});

export const listUsers = asyncHandler(async (req, res) => {
  const result = await userService.listUsers(req.query);
  sendPaginatedSuccess(
    res,
    result.items.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      avatarId: u.avatarId,
      rating: u.rating,
      reviewCount: u.reviewCount,
      verified: u.verified,
    })),
    { page: result.page, limit: result.limit, total: result.total }
  );
});

export const getUserSkills = asyncHandler(async (req, res) => {
  const skills = await userService.getUserSkills(getRouteParam(req.params.id));
  sendSuccess(res, { skills }, "User skills retrieved");
});
