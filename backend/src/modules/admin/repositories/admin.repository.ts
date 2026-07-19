import { Types } from "mongoose";
import {
  AdminLogModel,
  ReportModel,
  VerificationModel,
} from "@/modules/admin/models/admin.model";
import { UserModel } from "@/modules/users/models/user.model";
import { SkillModel } from "@/modules/skills/models/skill.model";
import { CategoryModel } from "@/modules/skills/models/category.model";
import { SessionModel } from "@/modules/sessions/models/session.model";
import { SwapRequestModel } from "@/modules/swapRequests/models/swapRequest.model";
import { ReviewModel } from "@/modules/reviews/models/review.model";
import { UserStatus } from "@/common/constants/enums";
import { parsePagination } from "@/common/utils/helpers";

export class AdminRepository {
  async getDashboardStats() {
    const [users, skills, sessions, swapRequests, reviews, reports] = await Promise.all([
      UserModel.countDocuments(),
      SkillModel.countDocuments({ active: true }),
      SessionModel.countDocuments(),
      SwapRequestModel.countDocuments(),
      ReviewModel.countDocuments(),
      ReportModel.countDocuments({ status: "open" }),
    ]);

    return { users, skills, sessions, swapRequests, reviews, openReports: reports };
  }

  async listUsers(filters: { search?: string; page?: number; limit?: number }) {
    const { page, limit, skip } = parsePagination(filters);
    const query: Record<string, unknown> = {};

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      UserModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      UserModel.countDocuments(query),
    ]);

    return { items, total, page, limit };
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    return UserModel.findByIdAndUpdate(userId, { status }, { new: true });
  }

  async updateUserRole(userId: string, role: string) {
    return UserModel.findByIdAndUpdate(userId, { role }, { new: true });
  }

  async listReports(filters: { status?: string; page?: number; limit?: number }) {
    const { page, limit, skip } = parsePagination(filters);
    const query: Record<string, unknown> = {};
    if (filters.status) query.status = filters.status;

    const [items, total] = await Promise.all([
      ReportModel.find(query)
        .populate("reporter reportedUser", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ReportModel.countDocuments(query),
    ]);

    return { items, total, page, limit };
  }

  async resolveReport(reportId: string, adminId: string, resolution: string) {
    return ReportModel.findByIdAndUpdate(
      reportId,
      {
        status: "resolved",
        resolvedBy: new Types.ObjectId(adminId),
        resolution,
      },
      { new: true }
    );
  }

  async listVerifications(filters: { status?: string; page?: number; limit?: number }) {
    const { page, limit, skip } = parsePagination(filters);
    const query: Record<string, unknown> = {};
    if (filters.status) query.status = filters.status;

    const [items, total] = await Promise.all([
      VerificationModel.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      VerificationModel.countDocuments(query),
    ]);

    return { items, total, page, limit };
  }

  async reviewVerification(
    verificationId: string,
    adminId: string,
    status: "approved" | "rejected"
  ) {
    const verification = await VerificationModel.findByIdAndUpdate(
      verificationId,
      {
        status,
        reviewedBy: new Types.ObjectId(adminId),
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (verification && status === "approved") {
      await UserModel.findByIdAndUpdate(verification.user, {
        verified: true,
        role: "verified_user",
      });
    }

    return verification;
  }

  async createAdminLog(data: {
    adminId: string;
    action: string;
    targetType: string;
    targetId?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
  }) {
    return AdminLogModel.create({
      admin: new Types.ObjectId(data.adminId),
      action: data.action,
      targetType: data.targetType,
      targetId: data.targetId,
      metadata: data.metadata,
      ipAddress: data.ipAddress,
    });
  }

  async listCategories() {
    return CategoryModel.find().sort({ name: 1 });
  }

  async listSkills(filters: { page?: number; limit?: number }) {
    const { page, limit, skip } = parsePagination(filters);
    const [items, total] = await Promise.all([
      SkillModel.find().populate("category").skip(skip).limit(limit),
      SkillModel.countDocuments(),
    ]);
    return { items, total, page, limit };
  }
}

export const adminRepository = new AdminRepository();
