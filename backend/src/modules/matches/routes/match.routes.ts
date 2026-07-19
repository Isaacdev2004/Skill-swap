import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import * as matchController from "@/modules/matches/controllers/match.controller";

const matchRouter = Router();

matchRouter.use(authenticate);
matchRouter.get("/", matchController.getMyMatches);
matchRouter.get("/:userId", matchController.getMatchWithUser);

export default matchRouter;
