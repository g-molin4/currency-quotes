import type { Favorite } from '../../domain/users/user.js';

export const FAVORITE_REPOSITORY = Symbol('FAVORITE_REPOSITORY');

export interface FavoriteRepository {
  listByUser(userId: string): Promise<Favorite[]>;
  findByUserAndCurrency(userId: string, currency: string): Promise<Favorite | null>;
  create(userId: string, currency: string): Promise<Favorite>;
  remove(id: string): Promise<void>;
}
