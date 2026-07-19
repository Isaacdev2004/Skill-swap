import { matchingEngine } from "@/modules/matches/services/matching.engine";
import { RecommendationLevel } from "@/common/constants/enums";

describe("MatchingEngine", () => {
  it("calculates mutual skill matches", () => {
    const skillNames = new Map([
      ["1", "Python"],
      ["2", "Guitar"],
      ["3", "Design"],
    ]);

    const result = matchingEngine.calculateMatch(
      {
        teachSkillIds: new Set(["1"]),
        learnSkillIds: new Set(["2"]),
        skillNames,
      },
      {
        id: "user-b",
        name: "User B",
        avatarId: "blue:UB",
        rating: 4.5,
        reviewCount: 10,
        verified: true,
        timezone: "UTC",
        teachSkillIds: new Set(["2"]),
        learnSkillIds: new Set(["1"]),
      }
    );

    expect(result).not.toBeNull();
    expect(result!.matchPercentage).toBeGreaterThan(0);
    expect(result!.mutualSkills.youTeachTheyLearn).toContain("Python");
    expect(result!.mutualSkills.theyTeachYouLearn).toContain("Guitar");
    expect(result!.recommendationLevel).not.toBe(RecommendationLevel.NONE);
  });

  it("returns null when no mutual skills exist", () => {
    const result = matchingEngine.calculateMatch(
      {
        teachSkillIds: new Set(["1"]),
        learnSkillIds: new Set(["2"]),
        skillNames: new Map([["1", "Python"], ["2", "Guitar"]]),
      },
      {
        id: "user-c",
        name: "User C",
        avatarId: "red:UC",
        rating: 3,
        reviewCount: 0,
        verified: false,
        timezone: "UTC",
        teachSkillIds: new Set(["3"]),
        learnSkillIds: new Set(["4"]),
      }
    );

    expect(result).toBeNull();
  });
});

describe("Auth validation", () => {
  it("requires strong passwords on register schema", async () => {
    const { registerSchema } = await import("@/modules/auth/validators/auth.validator");

    const valid = registerSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
    });

    expect(valid.success).toBe(true);

    const invalid = registerSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "short",
    });

    expect(invalid.success).toBe(false);
  });
});
