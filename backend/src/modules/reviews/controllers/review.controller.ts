import { asyncHandler, sendSuccess, sendPaginatedSuccess } from "@/common/utils/response";
import { getRouteParam } from "@/common/utils/helpers";
import { reviewService } from "@/modules/reviews/services/review.service";

export const create = asyncHandler(async (req, res) => {
  const review = await reviewService.create(req.user!.id, req.body);
  sendSuccess(res, { review }, "Review submitted", 201);
});

export const listForUser = asyncHandler(async (req, res) => {
  const result = await reviewService.listForUser(getRouteParam(req.params.userId), req.query);
  sendPaginatedSuccess(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
});
