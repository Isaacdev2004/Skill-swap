import { Types, type PipelineStage } from "mongoose";
import { UserModel } from "@/modules/users/models/user.model";
import { UserSkillModel } from "@/modules/skills/models/userSkill.model";
import { SkillModel } from "@/modules/skills/models/skill.model";
import { buildSort, parsePagination } from "@/common/utils/helpers";

export class MarketplaceRepository {
  async browse(filters: {
    search?: string;
    category?: string;
    skill?: string;
    minRating?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const { page, limit, skip } = parsePagination(filters);

    const skillMatch: Record<string, unknown> = {};
    if (filters.category) skillMatch.category = new Types.ObjectId(filters.category);
    if (filters.skill) skillMatch._id = new Types.ObjectId(filters.skill);
    if (filters.search) skillMatch.$text = { $search: filters.search };

    const pipeline: PipelineStage[] = [
      { $match: { active: true, ...skillMatch } },
      {
        $lookup: {
          from: "userskills",
          localField: "_id",
          foreignField: "skill",
          as: "userSkills",
        },
      },
      { $unwind: "$userSkills" },
      { $match: { "userSkills.intent": "teach" } },
      {
        $lookup: {
          from: "users",
          localField: "userSkills.user",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: "$teacher" },
      { $match: { "teacher.status": "active" } },
    ];

    if (filters.minRating) {
      pipeline.push({ $match: { "teacher.rating": { $gte: filters.minRating } } });
    }

    pipeline.push(
      {
        $project: {
          skill: {
            id: "$_id",
            name: "$name",
            slug: "$slug",
            icon: "$icon",
            popularity: "$popularity",
          },
          teacher: {
            id: "$teacher._id",
            name: "$teacher.name",
            avatarId: "$teacher.avatarId",
            rating: "$teacher.rating",
            reviewCount: "$teacher.reviewCount",
            verified: "$teacher.verified",
            timezone: "$teacher.timezone",
          },
          level: "$userSkills.level",
          yearsExperience: "$userSkills.yearsExperience",
        },
      },
      { $sort: buildSort(filters.sortBy ?? "teacher.rating", filters.sortOrder ?? "desc") },
      {
        $facet: {
          items: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      }
    );

    const [result] = await SkillModel.aggregate(pipeline);
    const items = result?.items ?? [];
    const total = result?.total?.[0]?.count ?? 0;

    return { items, total, page, limit };
  }

  async getSkillTeachers(skillId: string) {
    return UserSkillModel.find({
      skill: new Types.ObjectId(skillId),
      intent: "teach",
    })
      .populate("user", "name avatarId rating reviewCount verified timezone")
      .lean();
  }

  async getPopularSkills(limit = 10) {
    return SkillModel.find({ active: true }).sort({ popularity: -1 }).limit(limit).lean();
  }

  async getTopMentors(limit = 10) {
    return UserModel.find({ status: "active", reviewCount: { $gt: 0 } })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(limit)
      .select("name avatarId rating reviewCount verified badges")
      .lean();
  }
}

export const marketplaceRepository = new MarketplaceRepository();
