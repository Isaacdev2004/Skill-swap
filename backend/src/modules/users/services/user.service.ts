import { NotFoundError } from "@/common/errors/AppError";
import { toPublicUserDto } from "@/modules/auth/dtos/auth.dto";
import { userRepository } from "@/modules/users/repositories/user.repository";
import type { UpdateProfileInput } from "@/modules/users/validators/user.validator";

function mapUser(user: Awaited<ReturnType<typeof userRepository.findById>>) {
  if (!user) throw new NotFoundError("User not found");
  return toPublicUserDto(user);
}

export class UserService {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    return mapUser(user);
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await userRepository.updateProfile(userId, input);
    return mapUser(user);
  }

  async listUsers(filters: Parameters<typeof userRepository.listUsers>[0]) {
    return userRepository.listUsers(filters);
  }

  async getUserSkills(userId: string) {
    return userRepository.getUserSkills(userId);
  }
}

export const userService = new UserService();
