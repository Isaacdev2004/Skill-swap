import { Types } from "mongoose";
import { BadgeModel, UserBadgeModel } from "@/modules/badges/models/badge.model";
import { UserModel } from "@/modules/users/models/user.model";
import { SessionModel } from "@/modules/sessions/models/session.model";
import { SwapRequestModel } from "@/modules/swapRequests/models/swapRequest.model";
import { BadgeType, SessionStatus } from "@/common/constants/enums";

export class BadgeRepository {
  async listBadges() {
    return BadgeModel.find({ active: true }).lean();
  }

  async getUserBadges(userId: string) {
    return UserBadgeModel.find({ user: new Types.ObjectId(userId) })
      .populate("badge")
      .lean();
  }

  async awardBadge(userId: string, badgeType: BadgeType) {
    const badge = await BadgeModel.findOne({ type: badgeType });
    if (!badge) return null;

    const existing = await UserBadgeModel.findOne({
      user: new Types.ObjectId(userId),
      badge: badge._id,
    });
    if (existing) return existing;

    await UserBadgeModel.create({
      user: new Types.ObjectId(userId),
      badge: badge._id,
    });

    await UserModel.findByIdAndUpdate(userId, {
      $addToSet: { badges: badgeType },
    });

    return badge;
  }

  async getCompletedSessionCount(userId: string) {
    return SessionModel.countDocuments({
      status: SessionStatus.COMPLETED,
      $or: [
        { host: new Types.ObjectId(userId) },
        { participant: new Types.ObjectId(userId) },
      ],
    });
  }

  async getAverageResponseTime(userId: string) {
    const requests = await SwapRequestModel.find({
      receiver: new Types.ObjectId(userId),
      respondedAt: { $exists: true },
    }).select("createdAt respondedAt");

    if (requests.length === 0) return null;

    const totalMs = requests.reduce((sum, req) => {
      return sum + (req.respondedAt!.getTime() - req.createdAt.getTime());
    }, 0);

    return totalMs / requests.length;
  }
}

export const badgeRepository = new BadgeRepository();

export class BadgeService {
  listBadges() {
    return badgeRepository.listBadges();
  }

  getUserBadges(userId: string) {
    return badgeRepository.getUserBadges(userId);
  }

  async evaluateUserBadges(
    userId: string,
    stats?: { rating: number; reviewCount: number }
  ) {
    const sessionCount = await badgeRepository.getCompletedSessionCount(userId);

    if (sessionCount >= 1) {
      await badgeRepository.awardBadge(userId, BadgeType.FIRST_SESSION);
    }
    if (sessionCount >= 10) {
      await badgeRepository.awardBadge(userId, BadgeType.TEN_SESSIONS);
    }

    if (stats && stats.rating >= 4.8 && stats.reviewCount >= 5) {
      await badgeRepository.awardBadge(userId, BadgeType.FIVE_STAR_TEACHER);
    }
    if (stats && stats.rating >= 4.5 && stats.reviewCount >= 10) {
      await badgeRepository.awardBadge(userId, BadgeType.TOP_MENTOR);
    }

    const avgResponse = await badgeRepository.getAverageResponseTime(userId);
    if (avgResponse !== null && avgResponse <= 2 * 60 * 60 * 1000) {
      await badgeRepository.awardBadge(userId, BadgeType.FAST_RESPONDER);
    }
  }
}

export const badgeService = new BadgeService();
