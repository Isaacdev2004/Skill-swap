import { Types } from "mongoose";
import {
  RecommendationLevel,
  SkillIntent,
} from "@/common/constants/enums";
import { MATCH_THRESHOLDS } from "@/config/constants";
import { UserModel } from "@/modules/users/models/user.model";
import { UserSkillModel } from "@/modules/skills/models/userSkill.model";

export interface MatchResult {
  userId: string;
  name: string;
  avatarId: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  timezone: string;
  matchPercentage: number;
  mutualSkills: {
    youTeachTheyLearn: string[];
    theyTeachYouLearn: string[];
  };
  score: number;
  recommendationLevel: RecommendationLevel;
}

export class MatchingRepository {
  async getUserSkillMap(userId: string) {
    const skills = await UserSkillModel.find({ user: new Types.ObjectId(userId) })
      .populate("skill", "name slug")
      .lean();

    const teach = skills.filter((s) => s.intent === SkillIntent.TEACH);
    const learn = skills.filter((s) => s.intent === SkillIntent.LEARN);

    return { teach, learn };
  }

  async findCandidateUsers(excludeUserId: string, limit = 100) {
    return UserModel.find({
      _id: { $ne: new Types.ObjectId(excludeUserId) },
      status: "active",
    })
      .select("name avatarId rating reviewCount verified timezone languages")
      .limit(limit)
      .lean();
  }

  async getSkillsForUsers(userIds: string[]) {
    return UserSkillModel.find({
      user: { $in: userIds.map((id) => new Types.ObjectId(id)) },
    })
      .populate("skill", "name slug")
      .lean();
  }
}

export const matchingRepository = new MatchingRepository();

export class MatchingEngine {
  calculateMatch(
    currentUser: {
      teachSkillIds: Set<string>;
      learnSkillIds: Set<string>;
      skillNames: Map<string, string>;
    },
    candidate: {
      id: string;
      name: string;
      avatarId: string;
      rating: number;
      reviewCount: number;
      verified: boolean;
      timezone: string;
      teachSkillIds: Set<string>;
      learnSkillIds: Set<string>;
    }
  ): MatchResult | null {
    const youTeachTheyLearn: string[] = [];
    const theyTeachYouLearn: string[] = [];

    for (const skillId of currentUser.teachSkillIds) {
      if (candidate.learnSkillIds.has(skillId)) {
        youTeachTheyLearn.push(currentUser.skillNames.get(skillId) ?? skillId);
      }
    }

    for (const skillId of candidate.teachSkillIds) {
      if (currentUser.learnSkillIds.has(skillId)) {
        theyTeachYouLearn.push(currentUser.skillNames.get(skillId) ?? skillId);
      }
    }

    const mutualCount = youTeachTheyLearn.length + theyTeachYouLearn.length;
    if (mutualCount === 0) return null;

    const maxPossible =
      Math.max(currentUser.teachSkillIds.size, 1) +
      Math.max(currentUser.learnSkillIds.size, 1);

    const matchPercentage = Math.round((mutualCount / maxPossible) * 100);
    const ratingBonus = candidate.rating * 2;
    const verifiedBonus = candidate.verified ? 5 : 0;
    const score = matchPercentage + ratingBonus + verifiedBonus;

    let recommendationLevel = RecommendationLevel.NONE;
    if (matchPercentage >= MATCH_THRESHOLDS.HIGH) recommendationLevel = RecommendationLevel.HIGH;
    else if (matchPercentage >= MATCH_THRESHOLDS.MEDIUM) recommendationLevel = RecommendationLevel.MEDIUM;
    else if (matchPercentage >= MATCH_THRESHOLDS.LOW) recommendationLevel = RecommendationLevel.LOW;

    return {
      userId: candidate.id,
      name: candidate.name,
      avatarId: candidate.avatarId,
      rating: candidate.rating,
      reviewCount: candidate.reviewCount,
      verified: candidate.verified,
      timezone: candidate.timezone,
      matchPercentage,
      mutualSkills: { youTeachTheyLearn, theyTeachYouLearn },
      score,
      recommendationLevel,
    };
  }
}

export const matchingEngine = new MatchingEngine();
