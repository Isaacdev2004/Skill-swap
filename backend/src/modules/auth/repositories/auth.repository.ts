import { Types } from "mongoose";
import { RefreshTokenModel } from "@/modules/admin/models/admin.model";
import { UserModel, type IUser } from "@/modules/users/models/user.model";

export class AuthRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).select("+password");
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return UserModel.findOne({ googleId });
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    return UserModel.create(data);
  }

  async saveRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await RefreshTokenModel.create({
      user: new Types.ObjectId(userId),
      token,
      expiresAt,
    });
  }

  async findRefreshToken(token: string) {
    return RefreshTokenModel.findOne({ token, revoked: false });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await RefreshTokenModel.updateOne({ token }, { revoked: true });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await RefreshTokenModel.updateMany(
      { user: new Types.ObjectId(userId), revoked: false },
      { revoked: true }
    );
  }

  async updateLastSeen(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { lastSeen: new Date() });
  }
}

export const authRepository = new AuthRepository();
