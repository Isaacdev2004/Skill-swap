import pool from "./pool.js";

/** Returns a full user object with skills and badges, shaped for the frontend. */
export async function getUserShape(userId: string) {
  const [userRes, skillsRes, badgesRes] = await Promise.all([
    pool.query("SELECT * FROM users WHERE id = $1", [userId]),
    pool.query("SELECT * FROM skills WHERE user_id = $1 ORDER BY created_at", [userId]),
    pool.query("SELECT * FROM badges WHERE user_id = $1", [userId]),
  ]);

  const u = userRes.rows[0];
  if (!u) return null;

  return shapeUser(u, skillsRes.rows, badgesRes.rows);
}

export function shapeUser(u: any, skills: any[], badges: any[]) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    bio: u.bio || "",
    languages: u.languages || [],
    availability: {
      days: u.availability_days || [],
      timeSlot: u.availability_time_slot || "Evening",
    },
    avatarColor: u.avatar_color || "bg-indigo-500",
    initials: u.initials || u.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
    isAdmin: u.is_admin,
    verified: u.is_verified,
    isSuspended: u.is_suspended || false,
    rating: parseFloat(u.rating) || 0,
    reviewCount: u.review_count || 0,
    joinedAt: u.joined_at,
    badges: badges.filter((b) => b.user_id === u.id || badges).map((b) => ({
      id: b.id,
      name: b.name,
      icon: b.icon,
    })),
    skillsTeach: skills.filter((s) => s.user_id === u.id && s.type === "teach").map(shapeSkill),
    skillsLearn: skills.filter((s) => s.user_id === u.id && s.type === "learn").map(shapeSkill),
  };
}

export function shapeSkill(s: any) {
  return {
    id: s.id,
    name: s.name,
    category: s.category,
    level: s.level,
  };
}
