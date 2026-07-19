import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { authRateLimiter } from "@/middlewares/rateLimit.middleware";
import { validate } from "@/middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  refreshTokenSchema,
} from "@/modules/auth/validators/auth.validator";
import * as authController from "@/modules/auth/controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", authRateLimiter, validate(registerSchema), authController.register);
authRouter.post("/login", authRateLimiter, validate(loginSchema), authController.login);
authRouter.post("/google", authRateLimiter, validate(googleAuthSchema), authController.googleAuth);
authRouter.post("/refresh", validate(refreshTokenSchema), authController.refresh);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.get("/me", authenticate, authController.getMe);

export default authRouter;
