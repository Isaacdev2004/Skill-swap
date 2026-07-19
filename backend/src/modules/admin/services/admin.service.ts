import { NotFoundError } from "@/common/errors/AppError";
import { adminRepository } from "@/modules/admin/repositories/admin.repository";
import type { UserStatus } from "@/common/constants/enums";

export class AdminService {
  getDashboard() {
    return adminRepository.getDashboardStats();
  }

  listUsers(filters: Parameters<typeof adminRepository.listUsers>[0]) {
    return adminRepository.listUsers(filters);
  }

  async updateUserStatus(adminId: string, userId: string, status: UserStatus, ip?: string) {
    const user = await adminRepository.updateUserStatus(userId, status);
    if (!user) throw new NotFoundError("User not found");

    await adminRepository.createAdminLog({
      adminId,
      action: "UPDATE_USER_STATUS",
      targetType: "User",
      targetId: userId,
      metadata: { status },
      ipAddress: ip,
    });

    return user;
  }

  async updateUserRole(adminId: string, userId: string, role: string, ip?: string) {
    const user = await adminRepository.updateUserRole(userId, role);
    if (!user) throw new NotFoundError("User not found");

    await adminRepository.createAdminLog({
      adminId,
      action: "UPDATE_USER_ROLE",
      targetType: "User",
      targetId: userId,
      metadata: { role },
      ipAddress: ip,
    });

    return user;
  }

  listReports(filters: Parameters<typeof adminRepository.listReports>[0]) {
    return adminRepository.listReports(filters);
  }

  async resolveReport(adminId: string, reportId: string, resolution: string, ip?: string) {
    const report = await adminRepository.resolveReport(reportId, adminId, resolution);
    if (!report) throw new NotFoundError("Report not found");

    await adminRepository.createAdminLog({
      adminId,
      action: "RESOLVE_REPORT",
      targetType: "Report",
      targetId: reportId,
      metadata: { resolution },
      ipAddress: ip,
    });

    return report;
  }

  listVerifications(filters: Parameters<typeof adminRepository.listVerifications>[0]) {
    return adminRepository.listVerifications(filters);
  }

  async reviewVerification(
    adminId: string,
    verificationId: string,
    status: "approved" | "rejected",
    ip?: string
  ) {
    const verification = await adminRepository.reviewVerification(
      verificationId,
      adminId,
      status
    );
    if (!verification) throw new NotFoundError("Verification not found");

    await adminRepository.createAdminLog({
      adminId,
      action: "REVIEW_VERIFICATION",
      targetType: "Verification",
      targetId: verificationId,
      metadata: { status },
      ipAddress: ip,
    });

    return verification;
  }

  listCategories() {
    return adminRepository.listCategories();
  }

  listSkills(filters: Parameters<typeof adminRepository.listSkills>[0]) {
    return adminRepository.listSkills(filters);
  }
}

export const adminService = new AdminService();
