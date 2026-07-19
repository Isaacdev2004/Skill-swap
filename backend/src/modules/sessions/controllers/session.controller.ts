import { asyncHandler, sendSuccess, sendPaginatedSuccess } from "@/common/utils/response";
import { getRouteParam } from "@/common/utils/helpers";
import { SessionStatus } from "@/common/constants/enums";
import { sessionService } from "@/modules/sessions/services/session.service";

export const create = asyncHandler(async (req, res) => {
  const session = await sessionService.create(req.user!.id, req.body);
  sendSuccess(res, { session }, "Session scheduled", 201);
});

export const list = asyncHandler(async (req, res) => {
  const result = await sessionService.list(req.user!.id, req.query);
  sendPaginatedSuccess(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
});

export const getById = asyncHandler(async (req, res) => {
  const session = await sessionService.getById(req.user!.id, getRouteParam(req.params.id));
  sendSuccess(res, { session }, "Session retrieved");
});

export const complete = asyncHandler(async (req, res) => {
  const session = await sessionService.updateStatus(req.user!.id, getRouteParam(req.params.id), SessionStatus.COMPLETED);
  sendSuccess(res, { session }, "Session marked completed");
});

export const cancel = asyncHandler(async (req, res) => {
  const session = await sessionService.updateStatus(req.user!.id, getRouteParam(req.params.id), SessionStatus.CANCELLED);
  sendSuccess(res, { session }, "Session cancelled");
});
