import { NotFoundError } from "@/common/errors/AppError";
import {
  matchingRepository,
  matchingEngine,
  type MatchResult,
} from "@/modules/matches/services/matching.engine";

interface PopulatedSkill {
  _id: { toString(): string };
  name: string;
}

function getSkillId(skill: PopulatedSkill | { toString(): string }): string {
  if ("name" in skill && skill._id) {
    return skill._id.toString();
  }
  return skill.toString();
}

function getSkillName(skill: PopulatedSkill | { toString(): string }): string {
  if ("name" in skill) {
    return skill.name;
  }
  return skill.toString();
}

export class MatchService {
  async getMatchesForUser(userId: string, limit = 20): Promise<MatchResult[]> {
    const currentSkills = await matchingRepository.getUserSkillMap(userId);
    if (currentSkills.teach.length === 0 && currentSkills.learn.length === 0) {
      return [];
    }

    const skillNames = new Map<string, string>();
    const teachSkillIds = new Set<string>();
    const learnSkillIds = new Set<string>();

    for (const item of currentSkills.teach) {
      const skillId = getSkillId(item.skill);
      teachSkillIds.add(skillId);
      skillNames.set(skillId, getSkillName(item.skill));
    }

    for (const item of currentSkills.learn) {
      const skillId = getSkillId(item.skill);
      learnSkillIds.add(skillId);
      skillNames.set(skillId, getSkillName(item.skill));
    }

    const candidates = await matchingRepository.findCandidateUsers(userId);
    const candidateIds = candidates.map((c) => c._id.toString());
    const allSkills = await matchingRepository.getSkillsForUsers(candidateIds);

    const skillsByUser = new Map<string, { teach: Set<string>; learn: Set<string> }>();
    for (const skill of allSkills) {
      const uid = skill.user.toString();
      if (!skillsByUser.has(uid)) {
        skillsByUser.set(uid, { teach: new Set(), learn: new Set() });
      }
      const entry = skillsByUser.get(uid)!;
      const skillId = getSkillId(skill.skill);
      skillNames.set(skillId, getSkillName(skill.skill));
      if (skill.intent === "teach") entry.teach.add(skillId);
      else entry.learn.add(skillId);
    }

    const matches: MatchResult[] = [];

    for (const candidate of candidates) {
      const cid = candidate._id.toString();
      const userSkills = skillsByUser.get(cid) ?? { teach: new Set(), learn: new Set() };

      const match = matchingEngine.calculateMatch(
        { teachSkillIds, learnSkillIds, skillNames },
        {
          id: cid,
          name: candidate.name,
          avatarId: candidate.avatarId,
          rating: candidate.rating,
          reviewCount: candidate.reviewCount,
          verified: candidate.verified,
          timezone: candidate.timezone,
          teachSkillIds: userSkills.teach,
          learnSkillIds: userSkills.learn,
        }
      );

      if (match) matches.push(match);
    }

    return matches.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  async getMatchWithUser(userId: string, targetUserId: string): Promise<MatchResult> {
    const matches = await this.getMatchesForUser(userId, 200);
    const match = matches.find((m) => m.userId === targetUserId);
    if (!match) throw new NotFoundError("No match found with this user");
    return match;
  }
}

export const matchService = new MatchService();
