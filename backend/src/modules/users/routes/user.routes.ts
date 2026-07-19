import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { requireSelfOrAdmin } from "@/middlewares/rbac.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { updateProfileSchema, listUsersSchema } from "@/modules/users/validators/user.validator";
import * as userController from "@/modules/users/controllers/user.controller";

const userRouter = Router();

userRouter.get("/", validate(listUsersSchema, "query"), userController.listUsers);
userRouter.get("/:id", userController.getProfile);
userRouter.patch("/:id", authenticate, requireSelfOrAdmin("id"), validate(updateProfileSchema), userController.updateProfile);
userRouter.get("/:id/skills", userController.getUserSkills);

export default userRouter;
