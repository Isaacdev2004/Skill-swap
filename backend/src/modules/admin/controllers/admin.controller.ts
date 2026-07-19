import type { Request } from "express";
import { asyncHandler, sendSuccess, sendPaginatedSuccess } from "@/common/utils/response";
import { getRouteParam } from "@/common/utils/helpers";
import { adminService } from "@/modules/admin/services/admin.service";

function getIp(req: Request): string | undefined {
  return (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? req.ip;
}

export const dashboard = asyncHandler(async (_req, res) => {
  const stats = await adminService.getDashboard();
  sendSuccess(res, { stats }, "Dashboard stats retrieved");
});

export const listUsers = asyncHandler(async (req, res) => {
  const result = await adminService.listUsers(req.query);
  sendPaginatedSuccess(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserStatus(
    req.user!.id,
    getRouteParam(req.params.userId),
    req.body.status,
    getIp(req)
  );
  sendSuccess(res, { user }, "User status updated");
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserRole(
    req.user!.id,
    getRouteParam(req.params.userId),
    req.body.role,
    getIp(req)
  );
  sendSuccess(res, { user }, "User role updated");
});

export const listReports = asyncHandler(async (req, res) => {
  const result = await adminService.listReports(req.query);
  sendPaginatedSuccess(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
});

export const resolveReport = asyncHandler(async (req, res) => {
  const report = await adminService.resolveReport(
    req.user!.id,
    getRouteParam(req.params.id),
    req.body.resolution,
    getIp(req)
  );
  sendSuccess(res, { report }, "Report resolved");
});

export const listVerifications = asyncHandler(async (req, res) => {
  const result = await adminService.listVerifications(req.query);
  sendPaginatedSuccess(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
});

export const reviewVerification = asyncHandler(async (req, res) => {
  const verification = await adminService.reviewVerification(
    req.user!.id,
    getRouteParam(req.params.id),
    req.body.status,
    getIp(req)
  );
  sendSuccess(res, { verification }, "Verification reviewed");
});

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await adminService.listCategories();
  sendSuccess(res, { categories }, "Categories retrieved");
});

export const listSkills = asyncHandler(async (req, res) => {
  const result = await adminService.listSkills(req.query);
  sendPaginatedSuccess(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
});
