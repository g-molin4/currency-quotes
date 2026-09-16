import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { InfrastructureModule } from '../infrastructure/infrastructure.module.js';
import { FavoritesController } from './favorites.controller.js';

@Module({
  imports: [ApplicationModule, AuthModule, InfrastructureModule],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
