import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ApplicationModule } from './application/application.module.js';
import { AuthModule } from './auth/auth.module.js';
import { FavoritesModule } from './favorites/favorites.module.js';
import { HealthModule } from './health/health.module.js';
import { InfrastructureModule } from './infrastructure/infrastructure.module.js';
import { QuotesModule } from './quotes/quotes.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, envFilePath: ['.env.local', '.env'] }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    InfrastructureModule,
    ApplicationModule,
    QuotesModule,
    HealthModule,
    AuthModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
