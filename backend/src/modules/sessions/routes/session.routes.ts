import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import {
  createSessionSchema,
  listSessionsSchema,
} from "@/modules/sessions/validators/session.validator";
import * as sessionController from "@/modules/sessions/controllers/session.controller";

const sessionRouter = Router();

sessionRouter.use(authenticate);
sessionRouter.post("/", validate(createSessionSchema), sessionController.create);
sessionRouter.get("/", validate(listSessionsSchema, "query"), sessionController.list);
sessionRouter.get("/:id", sessionController.getById);
sessionRouter.patch("/:id/complete", sessionController.complete);
sessionRouter.patch("/:id/cancel", sessionController.cancel);

export default sessionRouter;
