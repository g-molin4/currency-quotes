import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ApplicationModule } from './application/application.module.js';
import { InfrastructureModule } from './infrastructure/infrastructure.module.js';
import { QuotesScheduler } from './presentation/quotes-scheduler.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, envFilePath: ['.env.local', '.env'] }),
    ScheduleModule.forRoot(),
    InfrastructureModule,
    ApplicationModule,
  ],
  providers: [QuotesScheduler],
})
export class AppModule {}
