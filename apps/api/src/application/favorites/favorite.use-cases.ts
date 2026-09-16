import { Inject, Injectable } from '@nestjs/common';
import { ConflictError, NotFoundError, ValidationError } from '../errors/application-errors.js';
import { FAVORITE_REPOSITORY, type FavoriteRepository } from '../ports/favorite-repository.port.js';
import { isSupportedCurrency } from '../../domain/quotes/supported-pairs.js';

@Injectable()
export class ListFavoritesUseCase {
  constructor(@Inject(FAVORITE_REPOSITORY) private readonly favorites: FavoriteRepository) {}
  execute(userId: string) { return this.favorites.listByUser(userId); }
}

@Injectable()
export class AddFavoriteUseCase {
  constructor(@Inject(FAVORITE_REPOSITORY) private readonly favorites: FavoriteRepository) {}

  async execute(userId: string, currency: string) {
    const normalizedCurrency = currency.toUpperCase();
    if (!isSupportedCurrency(normalizedCurrency)) throw new ValidationError('Unsupported currency.');
    if (await this.favorites.findByUserAndCurrency(userId, normalizedCurrency)) {
      throw new ConflictError('Currency is already a favorite.');
    }
    return this.favorites.create(userId, normalizedCurrency);
  }
}

@Injectable()
export class RemoveFavoriteUseCase {
  constructor(@Inject(FAVORITE_REPOSITORY) private readonly favorites: FavoriteRepository) {}

  async execute(userId: string, currency: string) {
    const normalizedCurrency = currency.toUpperCase();
    if (!isSupportedCurrency(normalizedCurrency)) throw new ValidationError('Unsupported currency.');
    const favorite = await this.favorites.findByUserAndCurrency(userId, normalizedCurrency);
    if (!favorite) throw new NotFoundError('Favorite not found.');
    await this.favorites.remove(favorite.id);
    return { deleted: true };
  }
}
