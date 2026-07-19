import type { IUser } from "@/modules/users/models/user.model";

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseDto {
  user: PublicUserDto;
  tokens: AuthTokensDto;
}

export interface PublicUserDto {
  id: string;
  name: string;
  email: string;
  avatarId: string;
  bio?: string;
  languages: string[];
  timezone: string;
  availability: IUser["availability"];
  rating: number;
  reviewCount: number;
  badges: string[];
  verified: boolean;
  role: string;
  status: string;
  lastSeen?: Date;
  createdAt: Date;
}

export function toPublicUserDto(
  user: Pick<
    IUser,
    | "name"
    | "email"
    | "avatarId"
    | "bio"
    | "languages"
    | "timezone"
    | "availability"
    | "rating"
    | "reviewCount"
    | "badges"
    | "verified"
    | "role"
    | "status"
    | "lastSeen"
    | "createdAt"
  > & { _id: { toString(): string } }
): PublicUserDto {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatarId: user.avatarId,
    bio: user.bio,
    languages: user.languages,
    timezone: user.timezone,
    availability: user.availability,
    rating: user.rating,
    reviewCount: user.reviewCount,
    badges: user.badges,
    verified: user.verified,
    role: user.role,
    status: user.status,
    lastSeen: user.lastSeen,
    createdAt: user.createdAt,
  };
}
