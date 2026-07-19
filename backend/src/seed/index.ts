import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { env } from "@/config/env";
import { connectDatabase, disconnectDatabase } from "@/database/connection";
import { hashPassword } from "@/common/utils/password";
import { slugify, getInitials, pickRandom } from "@/common/utils/helpers";
import {
  UserRole,
  UserStatus,
  SkillIntent,
  SwapRequestStatus,
  SessionStatus,
  NotificationType,
  BadgeType,
  ReportStatus,
} from "@/common/constants/enums";
import { AVATAR_COLORS } from "@/config/constants";
import { UserModel } from "@/modules/users/models/user.model";
import { CategoryModel } from "@/modules/skills/models/category.model";
import { SkillModel } from "@/modules/skills/models/skill.model";
import { UserSkillModel } from "@/modules/skills/models/userSkill.model";
import { SwapRequestModel } from "@/modules/swapRequests/models/swapRequest.model";
import { SessionModel } from "@/modules/sessions/models/session.model";
import { ConversationModel, MessageModel } from "@/modules/chat/models/chat.model";
import { NotificationModel } from "@/modules/notifications/models/notification.model";
import { ReviewModel } from "@/modules/reviews/models/review.model";
import { BadgeModel } from "@/modules/badges/models/badge.model";
import { ReportModel } from "@/modules/admin/models/admin.model";
import { logger } from "@/common/utils/logger";

const CATEGORIES = [
  { name: "Programming", icon: "code" },
  { name: "Design", icon: "palette" },
  { name: "Music", icon: "music" },
  { name: "Languages", icon: "globe" },
  { name: "Business", icon: "briefcase" },
  { name: "Fitness", icon: "dumbbell" },
  { name: "Cooking", icon: "chef-hat" },
  { name: "Photography", icon: "camera" },
];

const SKILL_NAMES = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "GraphQL", "Docker", "Kubernetes",
  "UI Design", "UX Research", "Figma", "Adobe Photoshop", "Illustrator", "Branding",
  "Guitar", "Piano", "Singing", "Music Production", "Spanish", "French", "German", "Mandarin",
  "Public Speaking", "Marketing", "SEO", "Copywriting", "Project Management", "Data Analysis",
  "Machine Learning", "DevOps", "AWS", "Cybersecurity", "Mobile Development", "Swift",
  "Kotlin", "Flutter", "Video Editing", "Animation", "3D Modeling", "Game Development",
  "Yoga", "Personal Training", "Nutrition", "Meditation", "Baking", "Italian Cooking",
  "Portrait Photography", "Landscape Photography", "Lightroom", "Financial Planning",
  "Negotiation", "Leadership", "Time Management", "Creative Writing", "Blogging",
  "Social Media", "Content Strategy", "Email Marketing", "Sales", "Customer Success",
  "SQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Blockchain", "Solidity",
  "Rust", "Go", "Java", "C++", "System Design", "Architecture", "Interior Design",
  "Fashion Design", "Woodworking", "Pottery", "Drawing", "Watercolor", "Calligraphy",
  "Sign Language", "Arabic", "Japanese", "Korean", "Portuguese", "Hindi",
];

const FIRST_NAMES = [
  "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn",
  "Sam", "Jamie", "Drew", "Blake", "Cameron", "Skyler", "Reese", "Parker",
  "Dakota", "Emery", "Finley", "Harper",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Lee", "Walker", "Hall", "Allen", "Young", "King",
  "Wright", "Scott", "Green", "Baker",
];

const BADGE_DEFINITIONS = [
  { type: BadgeType.FIRST_SESSION, name: "First Session", description: "Completed your first session", icon: "star", criteria: "Complete 1 session" },
  { type: BadgeType.TOP_MENTOR, name: "Top Mentor", description: "Highly rated mentor", icon: "trophy", criteria: "Rating >= 4.5 with 10+ reviews" },
  { type: BadgeType.FAST_RESPONDER, name: "Fast Responder", description: "Responds quickly to swap requests", icon: "zap", criteria: "Average response under 2 hours" },
  { type: BadgeType.FIVE_STAR_TEACHER, name: "5 Star Teacher", description: "Consistently excellent ratings", icon: "award", criteria: "Rating >= 4.8 with 5+ reviews" },
  { type: BadgeType.TEN_SESSIONS, name: "10 Sessions", description: "Completed 10 sessions", icon: "medal", criteria: "Complete 10 sessions" },
];

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

async function clearDatabase(): Promise<void> {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key]?.deleteMany({});
  }
}

async function seed(): Promise<void> {
  await connectDatabase();
  await clearDatabase();

  logger.info("Seeding categories...");
  const categories = await CategoryModel.insertMany(
    CATEGORIES.map((c) => ({
      name: c.name,
      slug: slugify(c.name),
      description: `${c.name} skills and knowledge`,
      icon: c.icon,
      active: true,
    }))
  );

  logger.info("Seeding skills...");
  const skills = await SkillModel.insertMany(
    SKILL_NAMES.slice(0, 80).map((name, index) => ({
      name,
      slug: slugify(name),
      category: categories[index % categories.length]!._id,
      description: `Learn or teach ${name}`,
      icon: name.toLowerCase().replace(/\s+/g, "-"),
      popularity: Math.floor(Math.random() * 100),
      active: true,
    }))
  );

  logger.info("Seeding badges...");
  await BadgeModel.insertMany(BADGE_DEFINITIONS);

  logger.info("Seeding admin user...");
  const adminPassword = await hashPassword(env.SEED_ADMIN_PASSWORD);
  const admin = await UserModel.create({
    name: "SkillSwap Admin",
    email: env.SEED_ADMIN_EMAIL,
    password: adminPassword,
    avatarId: `${pickRandom(AVATAR_COLORS)}:SA`,
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    verified: true,
    rating: 5,
    reviewCount: 1,
    badges: [BadgeType.TOP_MENTOR],
  });

  logger.info("Seeding users...");
  const users = [admin];
  for (let i = 0; i < 19; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length]!;
    const lastName = LAST_NAMES[i % LAST_NAMES.length]!;
    const name = `${firstName} ${lastName}`;
    const password = await hashPassword("Password123!");

    const user = await UserModel.create({
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@skillswap.test`,
      password,
      avatarId: `${pickRandom(AVATAR_COLORS)}:${getInitials(name)}`,
      bio: `Passionate about learning and teaching. User ${i + 1}.`,
      languages: i % 2 === 0 ? ["English", "Spanish"] : ["English"],
      timezone: i % 3 === 0 ? "America/New_York" : i % 3 === 1 ? "Europe/London" : "Asia/Tokyo",
      availability: [
        { day: "Monday", start: "09:00", end: "12:00" },
        { day: "Wednesday", start: "14:00", end: "18:00" },
      ],
      rating: Math.round((3 + Math.random() * 2) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 15),
      verified: i % 4 === 0,
      role: i === 0 ? UserRole.MODERATOR : UserRole.USER,
      status: UserStatus.ACTIVE,
    });

    users.push(user);
  }

  logger.info("Seeding user skills...");
  for (const user of users.slice(1)) {
    const teachSkills = skills.sort(() => 0.5 - Math.random()).slice(0, 3);
    const learnSkills = skills.sort(() => 0.5 - Math.random()).slice(0, 3);

    for (const skill of teachSkills) {
      await UserSkillModel.create({
        user: user._id,
        skill: skill._id,
        intent: SkillIntent.TEACH,
        level: pickRandom(LEVELS),
        yearsExperience: Math.floor(Math.random() * 10) + 1,
      });
    }

    for (const skill of learnSkills) {
      await UserSkillModel.create({
        user: user._id,
        skill: skill._id,
        intent: SkillIntent.LEARN,
        level: pickRandom(LEVELS),
        yearsExperience: Math.floor(Math.random() * 3),
      });
    }
  }

  logger.info("Seeding swap requests...");
  const swapRequests = [];
  for (let i = 0; i < 10; i++) {
    const sender = users[i + 2]!;
    const receiver = users[i + 5]!;
    if (sender._id.equals(receiver._id)) continue;

    const senderSkills = await UserSkillModel.find({ user: sender._id, intent: SkillIntent.TEACH }).limit(2);
    const receiverSkills = await UserSkillModel.find({ user: receiver._id, intent: SkillIntent.LEARN }).limit(2);

    const swapRequest = await SwapRequestModel.create({
      sender: sender._id,
      receiver: receiver._id,
      message: "Would love to swap skills with you!",
      offeredSkills: senderSkills.map((s) => s.skill),
      requestedSkills: receiverSkills.map((s) => s.skill),
      matchScore: Math.floor(Math.random() * 40) + 40,
      status: i % 4 === 0 ? SwapRequestStatus.PENDING : i % 4 === 1 ? SwapRequestStatus.ACCEPTED : i % 4 === 2 ? SwapRequestStatus.COMPLETED : SwapRequestStatus.REJECTED,
      respondedAt: i % 4 !== 0 ? new Date() : undefined,
      completedAt: i % 4 === 2 ? new Date() : undefined,
    });

    swapRequests.push(swapRequest);
  }

  logger.info("Seeding sessions...");
  const sessions = [];
  for (let i = 0; i < 8; i++) {
    const swapRequest = swapRequests[i];
    if (!swapRequest || swapRequest.status === SwapRequestStatus.REJECTED) continue;

    const session = await SessionModel.create({
      swapRequest: swapRequest._id,
      host: swapRequest.sender,
      participant: swapRequest.receiver,
      title: `Skill Swap Session ${i + 1}`,
      description: "Let's exchange knowledge!",
      scheduledAt: new Date(Date.now() + (i - 4) * 24 * 60 * 60 * 1000),
      durationMinutes: 60,
      timezone: "UTC",
      status: i < 3 ? SessionStatus.COMPLETED : i < 6 ? SessionStatus.UPCOMING : SessionStatus.CANCELLED,
      completedAt: i < 3 ? new Date() : undefined,
    });

    sessions.push(session);
  }

  logger.info("Seeding conversations and messages...");
  for (let i = 0; i < 5; i++) {
    const userA = users[i + 2]!;
    const userB = users[i + 7]!;

    const conversation = await ConversationModel.create({
      participants: [userA._id, userB._id].sort((a, b) => a.toString().localeCompare(b.toString())),
      swapRequest: swapRequests[i]?._id,
    });

    const messages = [
      "Hey! Interested in swapping skills?",
      "Absolutely! I can teach Python if you help with Guitar.",
      "Sounds perfect. When are you free?",
      "How about Thursday at 3pm?",
      "Works for me! Here's my Meet link: https://meet.google.com/abc-defg-hij",
    ];

    for (let j = 0; j < messages.length; j++) {
      const sender = j % 2 === 0 ? userA : userB;
      const message = await MessageModel.create({
        conversation: conversation._id,
        sender: sender._id,
        content: messages[j]!,
        readBy: [sender._id],
      });

      if (j === messages.length - 1) {
        conversation.lastMessage = message._id;
        conversation.lastMessageAt = message.createdAt;
        await conversation.save();
      }
    }
  }

  logger.info("Seeding reviews...");
  for (let i = 0; i < 5; i++) {
    const session = sessions[i];
    if (!session || session.status !== SessionStatus.COMPLETED) continue;

    await ReviewModel.create({
      reviewer: session.host,
      reviewee: session.participant,
      session: session._id,
      rating: Math.floor(Math.random() * 2) + 4,
      communication: Math.floor(Math.random() * 2) + 4,
      knowledge: Math.floor(Math.random() * 2) + 4,
      recommend: true,
      comment: "Great session, learned a lot!",
    });
  }

  logger.info("Seeding notifications...");
  for (let i = 0; i < 15; i++) {
    const user = users[i % users.length]!;
    await NotificationModel.create({
      user: user._id,
      type: Object.values(NotificationType)[i % Object.values(NotificationType).length]!,
      title: "Notification",
      message: `Sample notification ${i + 1}`,
      read: i % 3 === 0,
      readAt: i % 3 === 0 ? new Date() : undefined,
    });
  }

  logger.info("Seeding reports...");
  await ReportModel.create({
    reporter: users[2]!._id,
    reportedUser: users[10]!._id,
    reason: "Inappropriate behavior",
    description: "Sample report for moderation testing",
    status: ReportStatus.OPEN,
  });

  logger.info("Seed completed successfully", {
    users: users.length,
    skills: skills.length,
    categories: categories.length,
    swapRequests: swapRequests.length,
    sessions: sessions.length,
    adminEmail: env.SEED_ADMIN_EMAIL,
  });

  await disconnectDatabase();
}

seed().catch(async (error) => {
  logger.error("Seed failed", { error: error instanceof Error ? error.message : error });
  await disconnectDatabase();
  process.exit(1);
});
