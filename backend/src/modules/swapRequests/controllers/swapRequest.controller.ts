import { asyncHandler, sendSuccess, sendPaginatedSuccess } from "@/common/utils/response";
import { getRouteParam } from "@/common/utils/helpers";
import { swapRequestService } from "@/modules/swapRequests/services/swapRequest.service";

export const create = asyncHandler(async (req, res) => {
  const swapRequest = await swapRequestService.create(req.user!.id, req.body);
  sendSuccess(res, { swapRequest }, "Swap request created", 201);
});

export const list = asyncHandler(async (req, res) => {
  const result = await swapRequestService.list(req.user!.id, req.query);
  sendPaginatedSuccess(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
});

export const getById = asyncHandler(async (req, res) => {
  const swapRequest = await swapRequestService.getById(req.user!.id, getRouteParam(req.params.id));
  sendSuccess(res, { swapRequest }, "Swap request retrieved");
});

export const accept = asyncHandler(async (req, res) => {
  const swapRequest = await swapRequestService.accept(req.user!.id, getRouteParam(req.params.id));
  sendSuccess(res, { swapRequest }, "Swap request accepted");
});

export const reject = asyncHandler(async (req, res) => {
  const swapRequest = await swapRequestService.reject(req.user!.id, getRouteParam(req.params.id));
  sendSuccess(res, { swapRequest }, "Swap request rejected");
});

export const cancel = asyncHandler(async (req, res) => {
  const swapRequest = await swapRequestService.cancel(req.user!.id, getRouteParam(req.params.id));
  sendSuccess(res, { swapRequest }, "Swap request cancelled");
});

export const complete = asyncHandler(async (req, res) => {
  const swapRequest = await swapRequestService.complete(req.user!.id, getRouteParam(req.params.id));
  sendSuccess(res, { swapRequest }, "Swap request completed");
});
