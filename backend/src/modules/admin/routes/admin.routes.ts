import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { requireModerator, requireAdmin } from "@/middlewares/rbac.middleware";
import { validate } from "@/middlewares/validate.middleware";
import {
  adminListSchema,
  updateUserStatusSchema,
  updateUserRoleSchema,
  resolveReportSchema,
  reviewVerificationSchema,
} from "@/modules/admin/validators/admin.validator";
import * as adminController from "@/modules/admin/controllers/admin.controller";

const adminRouter = Router();

adminRouter.use(authenticate, requireModerator);

adminRouter.get("/dashboard", adminController.dashboard);
adminRouter.get("/users", validate(adminListSchema, "query"), adminController.listUsers);
adminRouter.patch("/users/:userId/status", requireAdmin, validate(updateUserStatusSchema), adminController.updateUserStatus);
adminRouter.patch("/users/:userId/role", requireAdmin, validate(updateUserRoleSchema), adminController.updateUserRole);
adminRouter.get("/reports", validate(adminListSchema, "query"), adminController.listReports);
adminRouter.patch("/reports/:id/resolve", validate(resolveReportSchema), adminController.resolveReport);
adminRouter.get("/verifications", validate(adminListSchema, "query"), adminController.listVerifications);
adminRouter.patch("/verifications/:id", validate(reviewVerificationSchema), adminController.reviewVerification);
adminRouter.get("/categories", adminController.listCategories);
adminRouter.get("/skills", validate(adminListSchema, "query"), adminController.listSkills);

export default adminRouter;
