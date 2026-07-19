import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import {
  createSwapRequestSchema,
  listSwapRequestsSchema,
} from "@/modules/swapRequests/validators/swapRequest.validator";
import * as swapRequestController from "@/modules/swapRequests/controllers/swapRequest.controller";

const swapRequestRouter = Router();

swapRequestRouter.use(authenticate);
swapRequestRouter.post("/", validate(createSwapRequestSchema), swapRequestController.create);
swapRequestRouter.get("/", validate(listSwapRequestsSchema, "query"), swapRequestController.list);
swapRequestRouter.get("/:id", swapRequestController.getById);
swapRequestRouter.patch("/:id/accept", swapRequestController.accept);
swapRequestRouter.patch("/:id/reject", swapRequestController.reject);
swapRequestRouter.patch("/:id/cancel", swapRequestController.cancel);
swapRequestRouter.patch("/:id/complete", swapRequestController.complete);

export default swapRequestRouter;
