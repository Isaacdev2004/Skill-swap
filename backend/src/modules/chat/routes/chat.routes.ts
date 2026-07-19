import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import {
  startConversationSchema,
  sendMessageSchema,
  listMessagesSchema,
} from "@/modules/chat/validators/chat.validator";
import * as chatController from "@/modules/chat/controllers/chat.controller";

const chatRouter = Router();

chatRouter.use(authenticate);
chatRouter.post("/conversations", validate(startConversationSchema), chatController.startConversation);
chatRouter.get("/conversations", chatController.listConversations);
chatRouter.get("/conversations/:id", chatController.getConversation);
chatRouter.get("/conversations/:id/messages", validate(listMessagesSchema, "query"), chatController.getMessages);
chatRouter.post("/conversations/:id/messages", validate(sendMessageSchema), chatController.sendMessage);
chatRouter.patch("/conversations/:id/read", chatController.markRead);

export default chatRouter;
