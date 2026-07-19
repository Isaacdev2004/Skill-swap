import { Types } from "mongoose";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@/common/errors/AppError";
import { SessionStatus, SwapRequestStatus, NotificationType } from "@/common/constants/enums";
import { sessionRepository } from "@/modules/sessions/repositories/session.repository";
import { swapRequestRepository } from "@/modules/swapRequests/repositories/swapRequest.repository";
import { notificationService } from "@/modules/notifications/services/notification.service";
import type { CreateSessionInput } from "@/modules/sessions/validators/session.validator";

export class SessionService {
  async create(userId: string, input: CreateSessionInput) {
    const swapRequest = await swapRequestRepository.findById(input.swapRequestId);
    if (!swapRequest) throw new NotFoundError("Swap request not found");
    if (swapRequest.status !== SwapRequestStatus.ACCEPTED) {
      throw new ConflictError("Sessions can only be created for accepted swap requests");
    }

    const senderId = swapRequest.sender._id?.toString?.() ?? swapRequest.sender.toString();
    const receiverId = swapRequest.receiver._id?.toString?.() ?? swapRequest.receiver.toString();

    if (userId !== senderId && userId !== receiverId) {
      throw new ForbiddenError("Access denied");
    }

    const participantId = userId === senderId ? receiverId : senderId;

    const session = await sessionRepository.create({
      swapRequest: new Types.ObjectId(input.swapRequestId),
      host: new Types.ObjectId(userId),
      participant: new Types.ObjectId(participantId),
      title: input.title,
      description: input.description,
      scheduledAt: input.scheduledAt,
      durationMinutes: input.durationMinutes ?? 60,
      timezone: input.timezone ?? "UTC",
      status: SessionStatus.UPCOMING,
    });

    await notificationService.create({
      userId: participantId,
      type: NotificationType.SESSION_REMINDER,
      title: "Session scheduled",
      message: `A session "${input.title}" has been scheduled`,
      data: { sessionId: session._id.toString() },
    });

    return sessionRepository.findById(session._id.toString());
  }

  list(userId: string, filters: Parameters<typeof sessionRepository.findForUser>[1]) {
    return sessionRepository.findForUser(userId, filters);
  }

  async getById(userId: string, id: string) {
    const session = await sessionRepository.findById(id);
    if (!session) throw new NotFoundError("Session not found");

    const hostId = session.host._id?.toString?.() ?? session.host.toString();
    const participantId = session.participant._id?.toString?.() ?? session.participant.toString();

    if (userId !== hostId && userId !== participantId) {
      throw new ForbiddenError("Access denied");
    }

    return session;
  }

  async updateStatus(userId: string, id: string, status: SessionStatus) {
    await this.getById(userId, id);
    const extra: Record<string, unknown> = {};
    if (status === SessionStatus.COMPLETED) extra.completedAt = new Date();

    return sessionRepository.update(id, { status, ...extra });
  }
}

export const sessionService = new SessionService();
