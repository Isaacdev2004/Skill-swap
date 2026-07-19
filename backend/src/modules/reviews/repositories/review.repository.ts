import { Types } from "mongoose";
import { ReviewModel } from "@/modules/reviews/models/review.model";
import { UserModel } from "@/modules/users/models/user.model";
import { parsePagination } from "@/common/utils/helpers";

export class ReviewRepository {
  async create(data: {
    reviewerId: string;
    revieweeId: string;
    sessionId: string;
    rating: number;
    communication: number;
    knowledge: number;
    recommend: boolean;
    comment?: string;
  }) {
    return ReviewModel.create({
      reviewer: new Types.ObjectId(data.reviewerId),
      reviewee: new Types.ObjectId(data.revieweeId),
      session: new Types.ObjectId(data.sessionId),
      rating: data.rating,
      communication: data.communication,
      knowledge: data.knowledge,
      recommend: data.recommend,
      comment: data.comment,
    });
  }

  async findBySession(sessionId: string) {
    return ReviewModel.findOne({ session: new Types.ObjectId(sessionId) });
  }

  async listForUser(revieweeId: string, filters: { page?: number; limit?: number }) {
    const { page, limit, skip } = parsePagination(filters);

    const [items, total] = await Promise.all([
      ReviewModel.find({ reviewee: new Types.ObjectId(revieweeId) })
        .populate("reviewer", "name avatarId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReviewModel.countDocuments({ reviewee: new Types.ObjectId(revieweeId) }),
    ]);

    return { items, total, page, limit };
  }

  async recalculateUserRating(revieweeId: string) {
    const [stats] = await ReviewModel.aggregate([
      { $match: { reviewee: new Types.ObjectId(revieweeId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const rating = stats ? Math.round(stats.avgRating * 10) / 10 : 0;
    const reviewCount = stats?.count ?? 0;

    await UserModel.findByIdAndUpdate(revieweeId, { rating, reviewCount });
    return { rating, reviewCount };
  }
}

export const reviewRepository = new ReviewRepository();
