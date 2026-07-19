import { Router } from "express";
import * as badgeController from "@/modules/badges/controllers/badge.controller";

const badgeRouter = Router();

badgeRouter.get("/", badgeController.listBadges);
badgeRouter.get("/user/:userId", badgeController.getUserBadges);

export default badgeRouter;
