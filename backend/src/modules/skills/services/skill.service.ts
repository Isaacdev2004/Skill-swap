import { NotFoundError } from "@/common/errors/AppError";
import { skillRepository } from "@/modules/skills/repositories/skill.repository";
import type { CreateSkillInput, UpsertUserSkillInput } from "@/modules/skills/validators/skill.validator";

export class SkillService {
  listCategories() {
    return skillRepository.listCategories();
  }

  listSkills(filters: Parameters<typeof skillRepository.listSkills>[0]) {
    return skillRepository.listSkills(filters);
  }

  async getSkill(id: string) {
    const skill = await skillRepository.findById(id);
    if (!skill) throw new NotFoundError("Skill not found");
    return skill;
  }

  async createSkill(input: CreateSkillInput) {
    return skillRepository.createSkill({
      name: input.name,
      slug: skillRepository.generateSlug(input.name),
      category: input.categoryId as unknown as import("mongoose").Types.ObjectId,
      description: input.description,
      icon: input.icon,
    });
  }

  upsertUserSkill(userId: string, input: UpsertUserSkillInput) {
    return skillRepository.upsertUserSkill(userId, {
      skillId: input.skillId,
      intent: input.intent,
      level: input.level,
      yearsExperience: input.yearsExperience,
    });
  }

  deleteUserSkill(userId: string, userSkillId: string) {
    return skillRepository.deleteUserSkill(userId, userSkillId);
  }
}

export const skillService = new SkillService();
