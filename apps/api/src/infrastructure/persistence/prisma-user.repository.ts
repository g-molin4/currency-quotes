import { Injectable } from '@nestjs/common';
import type { PublicUser, User } from '../../domain/users/user.js';
import type { UserRepository } from '../../application/ports/user-repository.port.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.client.user.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true, createdAt: true },
    });
  }

  async create(email: string, passwordHash: string): Promise<PublicUser> {
    return this.prisma.client.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true, createdAt: true },
    });
  }
}
