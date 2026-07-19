import { Types } from "mongoose";
import { UserModel, type IUser } from "@/modules/users/models/user.model";
import { UserSkillModel } from "@/modules/skills/models/userSkill.model";
import { buildSort, parsePagination } from "@/common/utils/helpers";

export class UserRepository {
  async findById(id: string) {
    return UserModel.findById(id).lean();
  }

  async updateProfile(id: string, data: Partial<IUser>) {
    return UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  }

  async listUsers(filters: {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const { page, limit, skip } = parsePagination(filters);
    const query: Record<string, unknown> = { status: "active" };

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      UserModel.find(query).sort(buildSort(filters.sortBy, filters.sortOrder)).skip(skip).limit(limit).lean(),
      UserModel.countDocuments(query),
    ]);

    return { items, total, page, limit };
  }

  async getUserSkills(userId: string) {
    return UserSkillModel.find({ user: new Types.ObjectId(userId) })
      .populate("skill", "name slug icon category")
      .lean();
  }
}

export const userRepository = new UserRepository();
