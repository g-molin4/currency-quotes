import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module.js';
import { HealthController } from './health.controller.js';

@Module({
  imports: [ApplicationModule],
  controllers: [HealthController],
})
export class HealthModule {}
