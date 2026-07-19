import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { requireAdmin } from "@/middlewares/rbac.middleware";
import { validate } from "@/middlewares/validate.middleware";
import {
  createSkillSchema,
  listSkillsSchema,
  upsertUserSkillSchema,
} from "@/modules/skills/validators/skill.validator";
import * as skillController from "@/modules/skills/controllers/skill.controller";

const skillRouter = Router();

skillRouter.get("/categories", skillController.listCategories);
skillRouter.get("/", validate(listSkillsSchema, "query"), skillController.listSkills);
skillRouter.get("/:id", skillController.getSkill);
skillRouter.post("/", authenticate, requireAdmin, validate(createSkillSchema), skillController.createSkill);
skillRouter.post("/user-skills", authenticate, validate(upsertUserSkillSchema), skillController.upsertUserSkill);
skillRouter.delete("/user-skills/:userSkillId", authenticate, skillController.deleteUserSkill);

export default skillRouter;
