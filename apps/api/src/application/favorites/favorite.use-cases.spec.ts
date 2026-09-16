import { describe, expect, it, vi } from 'vitest';
import { ConflictError, NotFoundError, ValidationError } from '../errors/application-errors.js';
import { AddFavoriteUseCase, ListFavoritesUseCase, RemoveFavoriteUseCase } from './favorite.use-cases.js';

const favorite = {
  id: 'favorite-1',
  userId: 'user-1',
  currency: 'USD',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

function repository() {
  return {
    listByUser: vi.fn().mockResolvedValue([favorite]),
    findByUserAndCurrency: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(favorite),
    remove: vi.fn().mockResolvedValue(undefined),
  };
}

describe('favorite use cases', () => {
  it('lists the favorites belonging to the requested user', async () => {
    const favorites = repository();

    await expect(new ListFavoritesUseCase(favorites).execute('user-1')).resolves.toEqual([favorite]);
    expect(favorites.listByUser).toHaveBeenCalledWith('user-1');
  });

  it('normalizes a supported currency before saving it', async () => {
    const favorites = repository();

    await expect(new AddFavoriteUseCase(favorites).execute('user-1', 'usd')).resolves.toEqual(favorite);
    expect(favorites.findByUserAndCurrency).toHaveBeenCalledWith('user-1', 'USD');
    expect(favorites.create).toHaveBeenCalledWith('user-1', 'USD');
  });

  it('does not save unsupported or duplicated favorites', async () => {
    const unsupported = repository();
    await expect(new AddFavoriteUseCase(unsupported).execute('user-1', 'ABC')).rejects.toBeInstanceOf(ValidationError);
    expect(unsupported.findByUserAndCurrency).not.toHaveBeenCalled();
    expect(unsupported.create).not.toHaveBeenCalled();

    const duplicate = repository();
    duplicate.findByUserAndCurrency.mockResolvedValue(favorite);
    await expect(new AddFavoriteUseCase(duplicate).execute('user-1', 'USD')).rejects.toBeInstanceOf(ConflictError);
    expect(duplicate.create).not.toHaveBeenCalled();
  });

  it('removes a normalized favorite and rejects a missing favorite', async () => {
    const favorites = repository();
    favorites.findByUserAndCurrency.mockResolvedValue(favorite);

    await expect(new RemoveFavoriteUseCase(favorites).execute('user-1', 'usd')).resolves.toEqual({ deleted: true });
    expect(favorites.remove).toHaveBeenCalledWith('favorite-1');

    const missing = repository();
    await expect(new RemoveFavoriteUseCase(missing).execute('user-1', 'USD')).rejects.toBeInstanceOf(NotFoundError);
    expect(missing.remove).not.toHaveBeenCalled();
  });
});
