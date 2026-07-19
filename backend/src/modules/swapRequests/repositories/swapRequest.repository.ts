import { Types } from "mongoose";
import { SwapRequestModel, type ISwapRequest } from "@/modules/swapRequests/models/swapRequest.model";
import { SwapRequestStatus } from "@/common/constants/enums";
import { buildSort, parsePagination } from "@/common/utils/helpers";

export class SwapRequestRepository {
  async create(data: Partial<ISwapRequest>) {
    return SwapRequestModel.create(data);
  }

  async findById(id: string) {
    return SwapRequestModel.findById(id)
      .populate("sender", "name avatarId rating verified")
      .populate("receiver", "name avatarId rating verified")
      .populate("offeredSkills requestedSkills", "name slug icon");
  }

  async findForUser(userId: string, filters: {
    status?: SwapRequestStatus;
    type?: "sent" | "received" | "all";
    page?: number;
    limit?: number;
  }) {
    const { page, limit, skip } = parsePagination(filters);
    const query: Record<string, unknown> = {};

    if (filters.status) query.status = filters.status;
    if (filters.type === "sent") query.sender = new Types.ObjectId(userId);
    else if (filters.type === "received") query.receiver = new Types.ObjectId(userId);
    else {
      query.$or = [
        { sender: new Types.ObjectId(userId) },
        { receiver: new Types.ObjectId(userId) },
      ];
    }

    const [items, total] = await Promise.all([
      SwapRequestModel.find(query)
        .populate("sender receiver", "name avatarId rating verified")
        .sort(buildSort("createdAt", "desc"))
        .skip(skip)
        .limit(limit),
      SwapRequestModel.countDocuments(query),
    ]);

    return { items, total, page, limit };
  }

  async updateStatus(id: string, status: SwapRequestStatus, extra: Partial<ISwapRequest> = {}) {
    return SwapRequestModel.findByIdAndUpdate(
      id,
      { status, ...extra },
      { new: true, runValidators: true }
    );
  }

  async hasPendingBetween(senderId: string, receiverId: string) {
    return SwapRequestModel.findOne({
      sender: new Types.ObjectId(senderId),
      receiver: new Types.ObjectId(receiverId),
      status: SwapRequestStatus.PENDING,
    });
  }
}

export const swapRequestRepository = new SwapRequestRepository();
