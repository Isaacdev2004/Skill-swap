import { Types } from "mongoose";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@/common/errors/AppError";
import { SwapRequestStatus, NotificationType } from "@/common/constants/enums";
import { swapRequestRepository } from "@/modules/swapRequests/repositories/swapRequest.repository";
import { matchService } from "@/modules/matches/services/match.service";
import { notificationService } from "@/modules/notifications/services/notification.service";
import type { CreateSwapRequestInput } from "@/modules/swapRequests/validators/swapRequest.validator";

export class SwapRequestService {
  async create(senderId: string, input: CreateSwapRequestInput) {
    if (senderId === input.receiverId) {
      throw new ConflictError("Cannot send swap request to yourself");
    }

    const pending = await swapRequestRepository.hasPendingBetween(senderId, input.receiverId);
    if (pending) {
      throw new ConflictError("A pending swap request already exists");
    }

    let matchScore = 0;
    try {
      const match = await matchService.getMatchWithUser(senderId, input.receiverId);
      matchScore = match.matchPercentage;
    } catch {
      matchScore = 0;
    }

    const swapRequest = await swapRequestRepository.create({
      sender: new Types.ObjectId(senderId),
      receiver: new Types.ObjectId(input.receiverId),
      message: input.message,
      offeredSkills: input.offeredSkillIds.map((id) => new Types.ObjectId(id)),
      requestedSkills: input.requestedSkillIds.map((id) => new Types.ObjectId(id)),
      matchScore,
      status: SwapRequestStatus.PENDING,
    });

    await notificationService.create({
      userId: input.receiverId,
      type: NotificationType.NEW_MATCH,
      title: "New swap request",
      message: "You received a new skill swap request",
      data: { swapRequestId: swapRequest._id.toString() },
    });

    return swapRequestRepository.findById(swapRequest._id.toString());
  }

  list(userId: string, filters: Parameters<typeof swapRequestRepository.findForUser>[1]) {
    return swapRequestRepository.findForUser(userId, filters);
  }

  async getById(userId: string, id: string) {
    const swapRequest = await swapRequestRepository.findById(id);
    if (!swapRequest) throw new NotFoundError("Swap request not found");

    const senderId = swapRequest.sender._id?.toString?.() ?? swapRequest.sender.toString();
    const receiverId = swapRequest.receiver._id?.toString?.() ?? swapRequest.receiver.toString();

    if (userId !== senderId && userId !== receiverId) {
      throw new ForbiddenError("Access denied");
    }

    return swapRequest;
  }

  async accept(userId: string, id: string) {
    const swapRequest = await this.getById(userId, id);
    const receiverId = swapRequest.receiver._id?.toString?.() ?? swapRequest.receiver.toString();

    if (userId !== receiverId) throw new ForbiddenError("Only the receiver can accept");
    if (swapRequest.status !== SwapRequestStatus.PENDING) {
      throw new ConflictError("Swap request is not pending");
    }

    const updated = await swapRequestRepository.updateStatus(id, SwapRequestStatus.ACCEPTED, {
      respondedAt: new Date(),
    });

    const senderId = swapRequest.sender._id?.toString?.() ?? swapRequest.sender.toString();
    await notificationService.create({
      userId: senderId,
      type: NotificationType.SWAP_ACCEPTED,
      title: "Swap request accepted",
      message: "Your swap request was accepted",
      data: { swapRequestId: id },
    });

    return updated;
  }

  async reject(userId: string, id: string) {
    const swapRequest = await this.getById(userId, id);
    const receiverId = swapRequest.receiver._id?.toString?.() ?? swapRequest.receiver.toString();

    if (userId !== receiverId) throw new ForbiddenError("Only the receiver can reject");
    if (swapRequest.status !== SwapRequestStatus.PENDING) {
      throw new ConflictError("Swap request is not pending");
    }

    const updated = await swapRequestRepository.updateStatus(id, SwapRequestStatus.REJECTED, {
      respondedAt: new Date(),
    });

    const senderId = swapRequest.sender._id?.toString?.() ?? swapRequest.sender.toString();
    await notificationService.create({
      userId: senderId,
      type: NotificationType.SWAP_REJECTED,
      title: "Swap request rejected",
      message: "Your swap request was rejected",
      data: { swapRequestId: id },
    });

    return updated;
  }

  async cancel(userId: string, id: string) {
    const swapRequest = await this.getById(userId, id);
    const senderId = swapRequest.sender._id?.toString?.() ?? swapRequest.sender.toString();

    if (userId !== senderId) throw new ForbiddenError("Only the sender can cancel");
    if (swapRequest.status !== SwapRequestStatus.PENDING) {
      throw new ConflictError("Only pending requests can be cancelled");
    }

    return swapRequestRepository.updateStatus(id, SwapRequestStatus.CANCELLED, {
      respondedAt: new Date(),
    });
  }

  async complete(userId: string, id: string) {
    const swapRequest = await this.getById(userId, id);
    if (swapRequest.status !== SwapRequestStatus.ACCEPTED) {
      throw new ConflictError("Only accepted requests can be completed");
    }

    return swapRequestRepository.updateStatus(id, SwapRequestStatus.COMPLETED, {
      completedAt: new Date(),
    });
  }
}

export const swapRequestService = new SwapRequestService();
