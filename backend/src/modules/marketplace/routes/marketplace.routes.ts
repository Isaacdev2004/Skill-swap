import { Router } from "express";
import { validate } from "@/middlewares/validate.middleware";
import { browseMarketplaceSchema } from "@/modules/marketplace/validators/marketplace.validator";
import * as marketplaceController from "@/modules/marketplace/controllers/marketplace.controller";

const marketplaceRouter = Router();

marketplaceRouter.get("/browse", validate(browseMarketplaceSchema, "query"), marketplaceController.browse);
marketplaceRouter.get("/popular-skills", marketplaceController.getPopularSkills);
marketplaceRouter.get("/top-mentors", marketplaceController.getTopMentors);
marketplaceRouter.get("/skills/:skillId/teachers", marketplaceController.getSkillTeachers);

export default marketplaceRouter;
