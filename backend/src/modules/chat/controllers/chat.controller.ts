import { asyncHandler, sendSuccess, sendPaginatedSuccess } from "@/common/utils/response";
import { getRouteParam } from "@/common/utils/helpers";
import { chatService } from "@/modules/chat/services/chat.service";

export const startConversation = asyncHandler(async (req, res) => {
  const conversation = await chatService.startConversation(
    req.user!.id,
    req.body.participantId,
    req.body.swapRequestId
  );
  sendSuccess(res, { conversation }, "Conversation started", 201);
});

export const listConversations = asyncHandler(async (req, res) => {
  const conversations = await chatService.getConversations(req.user!.id);
  sendSuccess(res, { conversations }, "Conversations retrieved");
});

export const getConversation = asyncHandler(async (req, res) => {
  const conversation = await chatService.getConversation(req.user!.id, getRouteParam(req.params.id));
  sendSuccess(res, { conversation }, "Conversation retrieved");
});

export const sendMessage = asyncHandler(async (req, res) => {
  const message = await chatService.sendMessage(req.user!.id, getRouteParam(req.params.id), req.body.content);
  sendSuccess(res, { message }, "Message sent", 201);
});

export const getMessages = asyncHandler(async (req, res) => {
  const result = await chatService.getMessages(req.user!.id, getRouteParam(req.params.id), req.query);
  sendPaginatedSuccess(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
  });
});

export const markRead = asyncHandler(async (req, res) => {
  await chatService.markRead(req.user!.id, getRouteParam(req.params.id));
  sendSuccess(res, null, "Messages marked as read");
});
