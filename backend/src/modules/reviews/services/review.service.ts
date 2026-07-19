import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@/common/errors/AppError";
import { NotificationType, SessionStatus } from "@/common/constants/enums";
import { reviewRepository } from "@/modules/reviews/repositories/review.repository";
import { sessionRepository } from "@/modules/sessions/repositories/session.repository";
import { notificationService } from "@/modules/notifications/services/notification.service";
import { badgeService } from "@/modules/badges/services/badge.service";
import type { CreateReviewInput } from "@/modules/reviews/validators/review.validator";

export class ReviewService {
  async create(reviewerId: string, input: CreateReviewInput) {
    const session = await sessionRepository.findById(input.sessionId);
    if (!session) throw new NotFoundError("Session not found");
    if (session.status !== SessionStatus.COMPLETED) {
      throw new ConflictError("Reviews can only be left for completed sessions");
    }

    const hostId = session.host._id?.toString?.() ?? session.host.toString();
    const participantId = session.participant._id?.toString?.() ?? session.participant.toString();

    if (reviewerId !== hostId && reviewerId !== participantId) {
      throw new ForbiddenError("Access denied");
    }

    if (input.revieweeId !== hostId && input.revieweeId !== participantId) {
      throw new ForbiddenError("Invalid reviewee");
    }

    if (reviewerId === input.revieweeId) {
      throw new ConflictError("Cannot review yourself");
    }

    const existing = await reviewRepository.findBySession(input.sessionId);
    if (existing) throw new ConflictError("Review already exists for this session");

    const review = await reviewRepository.create({
      reviewerId,
      revieweeId: input.revieweeId,
      sessionId: input.sessionId,
      rating: input.rating,
      communication: input.communication,
      knowledge: input.knowledge,
      recommend: input.recommend,
      comment: input.comment,
    });

    const stats = await reviewRepository.recalculateUserRating(input.revieweeId);

    await notificationService.create({
      userId: input.revieweeId,
      type: NotificationType.REVIEW_RECEIVED,
      title: "New review received",
      message: `You received a ${input.rating}-star review`,
      data: { reviewId: review._id.toString() },
    });

    await badgeService.evaluateUserBadges(input.revieweeId, stats);

    return review.populate("reviewer", "name avatarId");
  }

  listForUser(revieweeId: string, filters: { page?: number; limit?: number }) {
    return reviewRepository.listForUser(revieweeId, filters);
  }
}

export const reviewService = new ReviewService();
