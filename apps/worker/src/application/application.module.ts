import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module.js';
import { RefreshQuotesUseCase } from './refresh-quotes.use-case.js';

@Module({
  imports: [InfrastructureModule],
  providers: [RefreshQuotesUseCase],
  exports: [RefreshQuotesUseCase],
})
export class ApplicationModule {}
