import type { PublicUser, User } from '../../domain/users/user.js';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(email: string, passwordHash: string): Promise<PublicUser>;
}
