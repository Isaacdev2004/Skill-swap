import { Types } from "mongoose";
import { SessionModel, type ISession } from "@/modules/sessions/models/session.model";
import { SessionStatus } from "@/common/constants/enums";
import { buildSort, parsePagination } from "@/common/utils/helpers";

export class SessionRepository {
  async create(data: Partial<ISession>) {
    return SessionModel.create(data);
  }

  async findById(id: string) {
    return SessionModel.findById(id)
      .populate("host participant", "name avatarId timezone")
      .populate("swapRequest");
  }

  async findForUser(userId: string, filters: {
    status?: SessionStatus;
    page?: number;
    limit?: number;
  }) {
    const { page, limit, skip } = parsePagination(filters);
    const query: Record<string, unknown> = {
      $or: [
        { host: new Types.ObjectId(userId) },
        { participant: new Types.ObjectId(userId) },
      ],
    };

    if (filters.status) query.status = filters.status;

    const [items, total] = await Promise.all([
      SessionModel.find(query)
        .populate("host participant", "name avatarId")
        .sort(buildSort("scheduledAt", "asc"))
        .skip(skip)
        .limit(limit),
      SessionModel.countDocuments(query),
    ]);

    return { items, total, page, limit };
  }

  async update(id: string, data: Partial<ISession>) {
    return SessionModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async findUpcomingForReminder(before: Date) {
    return SessionModel.find({
      status: SessionStatus.UPCOMING,
      scheduledAt: { $lte: before },
      reminderSent: false,
    }).populate("host participant", "name email");
  }
}

export const sessionRepository = new SessionRepository();
