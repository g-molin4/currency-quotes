import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module.js';
import { LoginUserUseCase } from './auth/login-user.use-case.js';
import { RegisterUserUseCase } from './auth/register-user.use-case.js';
import { AddFavoriteUseCase, ListFavoritesUseCase, RemoveFavoriteUseCase } from './favorites/favorite.use-cases.js';
import { CheckHealthUseCase } from './quotes/check-health.use-case.js';
import { GetLatestQuotesUseCase } from './quotes/get-latest-quotes.use-case.js';
import { GetQuoteHistoryUseCase } from './quotes/get-quote-history.use-case.js';

const useCases = [
  GetLatestQuotesUseCase, GetQuoteHistoryUseCase, CheckHealthUseCase,
  RegisterUserUseCase, LoginUserUseCase,
  ListFavoritesUseCase, AddFavoriteUseCase, RemoveFavoriteUseCase,
];

@Module({
  imports: [InfrastructureModule],
  providers: useCases,
  exports: useCases,
})
export class ApplicationModule {}
