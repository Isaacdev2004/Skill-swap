import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { createReviewSchema } from "@/modules/reviews/validators/review.validator";
import * as reviewController from "@/modules/reviews/controllers/review.controller";

const reviewRouter = Router();

reviewRouter.post("/", authenticate, validate(createReviewSchema), reviewController.create);
reviewRouter.get("/user/:userId", reviewController.listForUser);

export default reviewRouter;
