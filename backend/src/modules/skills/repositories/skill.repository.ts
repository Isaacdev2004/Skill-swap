import { Types } from "mongoose";
import { SkillModel, type ISkill } from "@/modules/skills/models/skill.model";
import { CategoryModel, type ICategory } from "@/modules/skills/models/category.model";
import { UserSkillModel, type IUserSkill } from "@/modules/skills/models/userSkill.model";
import { buildSort, parsePagination, slugify } from "@/common/utils/helpers";

export class SkillRepository {
  async listCategories() {
    return CategoryModel.find({ active: true }).sort({ name: 1 }).lean();
  }

  async listSkills(filters: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    active?: boolean;
  }) {
    const { page, limit, skip } = parsePagination(filters);
    const query: Record<string, unknown> = {};

    if (filters.active !== false) query.active = true;
    if (filters.category) query.category = new Types.ObjectId(filters.category);
    if (filters.search) query.$text = { $search: filters.search };

    const [items, total] = await Promise.all([
      SkillModel.find(query)
        .populate("category", "name slug icon")
        .sort(buildSort(filters.sortBy ?? "popularity", filters.sortOrder ?? "desc"))
        .skip(skip)
        .limit(limit)
        .lean(),
      SkillModel.countDocuments(query),
    ]);

    return { items, total, page, limit };
  }

  async findById(id: string) {
    return SkillModel.findById(id).populate("category", "name slug icon").lean();
  }

  async createSkill(data: Partial<ISkill>) {
    return SkillModel.create(data);
  }

  async createCategory(data: Partial<ICategory>) {
    return CategoryModel.create(data);
  }

  async upsertUserSkill(userId: string, data: {
    skillId: string;
    intent: IUserSkill["intent"];
    level: string;
    yearsExperience?: number;
  }) {
    return UserSkillModel.findOneAndUpdate(
      {
        user: new Types.ObjectId(userId),
        skill: new Types.ObjectId(data.skillId),
        intent: data.intent,
      },
      {
        user: new Types.ObjectId(userId),
        skill: new Types.ObjectId(data.skillId),
        intent: data.intent,
        level: data.level,
        yearsExperience: data.yearsExperience ?? 0,
      },
      { upsert: true, new: true, runValidators: true }
    ).populate("skill", "name slug icon");
  }

  async deleteUserSkill(userId: string, userSkillId: string) {
    return UserSkillModel.findOneAndDelete({
      _id: new Types.ObjectId(userSkillId),
      user: new Types.ObjectId(userId),
    });
  }

  async incrementPopularity(skillId: string) {
    await SkillModel.findByIdAndUpdate(skillId, { $inc: { popularity: 1 } });
  }

  generateSlug(name: string) {
    return slugify(name);
  }
}

export const skillRepository = new SkillRepository();
