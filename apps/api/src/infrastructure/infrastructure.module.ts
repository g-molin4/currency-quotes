import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { FAVORITE_REPOSITORY } from '../application/ports/favorite-repository.port.js';
import { PASSWORD_HASHER } from '../application/ports/password-hasher.port.js';
import { QUOTES_CACHE } from '../application/ports/quotes-cache.port.js';
import { TOKEN_ISSUER } from '../application/ports/token-issuer.port.js';
import { USER_REPOSITORY } from '../application/ports/user-repository.port.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedisModule } from '../redis/redis.module.js';
import { RedisQuotesCacheAdapter } from './cache/redis-quotes-cache.adapter.js';
import { PrismaFavoriteRepository } from './persistence/prisma-favorite.repository.js';
import { PrismaUserRepository } from './persistence/prisma-user.repository.js';
import { JwtTokenIssuer } from './security/jwt-token-issuer.js';
import { ScryptPasswordHasher } from './security/scrypt-password-hasher.js';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [
    RedisQuotesCacheAdapter,
    PrismaUserRepository,
    PrismaFavoriteRepository,
    ScryptPasswordHasher,
    JwtTokenIssuer,
    { provide: QUOTES_CACHE, useExisting: RedisQuotesCacheAdapter },
    { provide: USER_REPOSITORY, useExisting: PrismaUserRepository },
    { provide: FAVORITE_REPOSITORY, useExisting: PrismaFavoriteRepository },
    { provide: PASSWORD_HASHER, useExisting: ScryptPasswordHasher },
    { provide: TOKEN_ISSUER, useExisting: JwtTokenIssuer },
  ],
  exports: [QUOTES_CACHE, USER_REPOSITORY, FAVORITE_REPOSITORY, PASSWORD_HASHER, TOKEN_ISSUER, JwtModule],
})
export class InfrastructureModule {}
