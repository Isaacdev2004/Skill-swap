import { ForbiddenError, NotFoundError } from "@/common/errors/AppError";
import { NotificationType } from "@/common/constants/enums";
import { chatRepository } from "@/modules/chat/repositories/chat.repository";
import { notificationService } from "@/modules/notifications/services/notification.service";

export class ChatService {
  async startConversation(userId: string, participantId: string, swapRequestId?: string) {
    return chatRepository.findOrCreateConversation(userId, participantId, swapRequestId);
  }

  getConversations(userId: string) {
    return chatRepository.getUserConversations(userId);
  }

  async getConversation(userId: string, conversationId: string) {
    const conversation = await chatRepository.getConversationById(conversationId);
    if (!conversation) throw new NotFoundError("Conversation not found");

    const isParticipant = conversation.participants.some(
      (p) => p._id.toString() === userId
    );
    if (!isParticipant) throw new ForbiddenError("Access denied");

    return conversation;
  }

  async sendMessage(userId: string, conversationId: string, content: string) {
    await this.getConversation(userId, conversationId);
    const message = await chatRepository.createMessage(conversationId, userId, content);

    const conversation = await chatRepository.getConversationById(conversationId);
    const recipient = conversation!.participants.find((p) => p._id.toString() !== userId);

    if (recipient) {
      await notificationService.create({
        userId: recipient._id.toString(),
        type: NotificationType.NEW_MESSAGE,
        title: "New message",
        message: content.slice(0, 100),
        data: { conversationId, messageId: message._id.toString() },
      });
    }

    return message;
  }

  async getMessages(userId: string, conversationId: string, filters: { page?: number; limit?: number }) {
    await this.getConversation(userId, conversationId);
    return chatRepository.getMessages(conversationId, filters);
  }

  async markRead(userId: string, conversationId: string) {
    await this.getConversation(userId, conversationId);
    await chatRepository.markMessagesRead(conversationId, userId);
  }
}

export const chatService = new ChatService();
