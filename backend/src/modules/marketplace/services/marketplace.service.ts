import { marketplaceRepository } from "@/modules/marketplace/repositories/marketplace.repository";

export class MarketplaceService {
  browse(filters: Parameters<typeof marketplaceRepository.browse>[0]) {
    return marketplaceRepository.browse(filters);
  }

  getSkillTeachers(skillId: string) {
    return marketplaceRepository.getSkillTeachers(skillId);
  }

  getPopularSkills(limit?: number) {
    return marketplaceRepository.getPopularSkills(limit);
  }

  getTopMentors(limit?: number) {
    return marketplaceRepository.getTopMentors(limit);
  }
}

export const marketplaceService = new MarketplaceService();
