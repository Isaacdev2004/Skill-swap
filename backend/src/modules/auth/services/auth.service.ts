import { OAuth2Client } from "google-auth-library";
import { env } from "@/config/env";
import { AVATAR_COLORS } from "@/config/constants";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "@/common/errors/AppError";
import { generateTokenPair, verifyRefreshToken } from "@/common/utils/jwt";
import { hashPassword, comparePassword } from "@/common/utils/password";
import { getInitials, pickRandom } from "@/common/utils/helpers";
import { UserRole, UserStatus } from "@/common/constants/enums";
import { AUTH_ERRORS, AUTH_MESSAGES } from "@/modules/auth/constants/auth.constants";
import { authRepository } from "@/modules/auth/repositories/auth.repository";
import { toPublicUserDto, type AuthResponseDto } from "@/modules/auth/dtos/auth.dto";
import type { RegisterInput, LoginInput, GoogleAuthInput } from "@/modules/auth/validators/auth.validator";

const googleClient = env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(env.GOOGLE_CLIENT_ID)
  : null;

export class AuthService {
  private async buildAuthResponse(userId: string): Promise<AuthResponseDto> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const tokens = generateTokenPair({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await authRepository.saveRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
      tokens.refreshExpiresAt
    );

    await authRepository.updateLastSeen(user._id.toString());

    return {
      user: toPublicUserDto(user),
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }

  async register(input: RegisterInput): Promise<{ data: AuthResponseDto; message: string }> {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError(AUTH_ERRORS.EMAIL_EXISTS);
    }

    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.createUser({
      name: input.name.trim(),
      email: input.email.toLowerCase(),
      password: passwordHash,
      avatarId: `${pickRandom(AVATAR_COLORS)}:${getInitials(input.name)}`,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });

    const data = await this.buildAuthResponse(user._id.toString());
    return { data, message: AUTH_MESSAGES.REGISTER_SUCCESS };
  }

  async login(input: LoginInput): Promise<{ data: AuthResponseDto; message: string }> {
    const user = await authRepository.findByEmail(input.email);
    if (!user?.password) {
      throw new UnauthorizedError(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedError(AUTH_ERRORS.ACCOUNT_SUSPENDED);
    }

    const valid = await comparePassword(input.password, user.password);
    if (!valid) {
      throw new UnauthorizedError(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    const data = await this.buildAuthResponse(user._id.toString());
    return { data, message: AUTH_MESSAGES.LOGIN_SUCCESS };
  }

  async googleAuth(input: GoogleAuthInput): Promise<{ data: AuthResponseDto; message: string }> {
    if (!googleClient || !env.GOOGLE_CLIENT_ID) {
      throw new UnauthorizedError("Google OAuth is not configured");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: input.idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new UnauthorizedError(AUTH_ERRORS.GOOGLE_AUTH_FAILED);
    }

    let user = await authRepository.findByGoogleId(payload.sub);
    if (!user) {
      user = await authRepository.findByEmail(payload.email);
    }

    if (user) {
      if (user.status === UserStatus.SUSPENDED) {
        throw new UnauthorizedError(AUTH_ERRORS.ACCOUNT_SUSPENDED);
      }

      if (!user.googleId) {
        user.googleId = payload.sub;
        await user.save();
      }
    } else {
      user = await authRepository.createUser({
        name: payload.name ?? payload.email.split("@")[0] ?? "User",
        email: payload.email.toLowerCase(),
        googleId: payload.sub,
        avatarId: `${pickRandom(AVATAR_COLORS)}:${getInitials(payload.name ?? "U")}`,
        verified: payload.email_verified ?? false,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      });
    }

    const data = await this.buildAuthResponse(user._id.toString());
    return { data, message: AUTH_MESSAGES.GOOGLE_AUTH_SUCCESS };
  }

  async refresh(refreshToken: string): Promise<{ data: AuthResponseDto; message: string }> {
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedError(AUTH_ERRORS.INVALID_REFRESH_TOKEN);
    }

    verifyRefreshToken(refreshToken);
    await authRepository.revokeRefreshToken(refreshToken);

    const data = await this.buildAuthResponse(stored.user.toString());
    return { data, message: AUTH_MESSAGES.TOKEN_REFRESHED };
  }

  async logout(refreshToken?: string, userId?: string): Promise<{ message: string }> {
    if (refreshToken) {
      await authRepository.revokeRefreshToken(refreshToken);
    }
    if (userId) {
      await authRepository.revokeAllUserTokens(userId);
    }
    return { message: AUTH_MESSAGES.LOGOUT_SUCCESS };
  }

  async getMe(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return toPublicUserDto(user);
  }
}

export const authService = new AuthService();
