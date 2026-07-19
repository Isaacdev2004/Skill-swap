import { Types } from "mongoose";
import {
  ConversationModel,
  MessageModel,
} from "@/modules/chat/models/chat.model";
import { buildSort, parsePagination } from "@/common/utils/helpers";

export class ChatRepository {
  async findOrCreateConversation(userA: string, userB: string, swapRequestId?: string) {
    const participants = [
      new Types.ObjectId(userA),
      new Types.ObjectId(userB),
    ].sort((a, b) => a.toString().localeCompare(b.toString()));

    let conversation = await ConversationModel.findOne({ participants });
    if (!conversation) {
      conversation = await ConversationModel.create({
        participants,
        swapRequest: swapRequestId ? new Types.ObjectId(swapRequestId) : undefined,
      });
    }

    return conversation;
  }

  async getUserConversations(userId: string) {
    return ConversationModel.find({ participants: new Types.ObjectId(userId) })
      .populate("participants", "name avatarId lastSeen")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 })
      .lean();
  }

  async getConversationById(id: string) {
    return ConversationModel.findById(id).populate("participants", "name avatarId");
  }

  async createMessage(conversationId: string, senderId: string, content: string) {
    const message = await MessageModel.create({
      conversation: new Types.ObjectId(conversationId),
      sender: new Types.ObjectId(senderId),
      content,
      readBy: [new Types.ObjectId(senderId)],
    });

    await ConversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: message.createdAt,
    });

    return message.populate("sender", "name avatarId");
  }

  async getMessages(conversationId: string, filters: { page?: number; limit?: number }) {
    const { page, limit, skip } = parsePagination(filters);

    const [items, total] = await Promise.all([
      MessageModel.find({ conversation: new Types.ObjectId(conversationId) })
        .populate("sender", "name avatarId")
        .sort(buildSort("createdAt", "desc"))
        .skip(skip)
        .limit(limit),
      MessageModel.countDocuments({ conversation: new Types.ObjectId(conversationId) }),
    ]);

    return { items: items.reverse(), total, page, limit };
  }

  async markMessagesRead(conversationId: string, userId: string) {
    await MessageModel.updateMany(
      {
        conversation: new Types.ObjectId(conversationId),
        readBy: { $ne: new Types.ObjectId(userId) },
      },
      { $addToSet: { readBy: new Types.ObjectId(userId) } }
    );
  }
}

export const chatRepository = new ChatRepository();
