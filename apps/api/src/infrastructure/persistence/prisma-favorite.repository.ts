import { Injectable } from '@nestjs/common';
import type { FavoriteRepository } from '../../application/ports/favorite-repository.port.js';
import type { Favorite } from '../../domain/users/user.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class PrismaFavoriteRepository implements FavoriteRepository {
  constructor(private readonly prisma: PrismaService) {}

  listByUser(userId: string): Promise<Favorite[]> {
    return this.prisma.client.favorite.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
  }

  findByUserAndCurrency(userId: string, currency: string): Promise<Favorite | null> {
    return this.prisma.client.favorite.findUnique({ where: { userId_currency: { userId, currency } } });
  }

  create(userId: string, currency: string): Promise<Favorite> {
    return this.prisma.client.favorite.create({ data: { userId, currency } });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.client.favorite.delete({ where: { id } });
  }
}
