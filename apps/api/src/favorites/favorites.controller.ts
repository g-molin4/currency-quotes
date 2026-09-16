import { BadRequestException, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ConflictError, NotFoundError, ValidationError } from '../application/errors/application-errors.js';
import { AddFavoriteUseCase, ListFavoritesUseCase, RemoveFavoriteUseCase } from '../application/favorites/favorite.use-cases.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard.js';

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly listFavorites: ListFavoritesUseCase,
    private readonly addFavorite: AddFavoriteUseCase,
    private readonly removeFavorite: RemoveFavoriteUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar favoritos', description: 'Retorna as moedas favoritas da conta autenticada.' })
  @ApiOkResponse({
    description: 'Lista de favoritos do usuário. Pode ser uma lista vazia.',
    schema: { example: [{ id: 'favorite-1', currency: 'USD', userId: 'user-1', createdAt: '2026-09-15T20:00:00.000Z' }] },
  })
  @ApiUnauthorizedResponse({ description: 'Token Bearer ausente, expirado ou inválido.' })
  getAll(@Req() request: AuthenticatedRequest) {
    return this.listFavorites.execute(request.user.sub);
  }

  @Post(':currency')
  @ApiOperation({ summary: 'Adicionar favorito', description: 'Salva uma moeda disponível na tela como favorita do usuário autenticado.' })
  @ApiParam({ name: 'currency', example: 'USD', description: 'Código da moeda base. Aceita maiúsculas ou minúsculas.' })
  @ApiCreatedResponse({
    description: 'Moeda adicionada aos favoritos.',
    schema: { example: { id: 'favorite-1', currency: 'USD', userId: 'user-1', createdAt: '2026-09-15T20:00:00.000Z' } },
  })
  @ApiBadRequestResponse({ description: 'A moeda informada não é suportada.' })
  @ApiConflictResponse({ description: 'A moeda já está nos favoritos do usuário.' })
  @ApiUnauthorizedResponse({ description: 'Token Bearer ausente, expirado ou inválido.' })
  async add(@Param('currency') currency: string, @Req() request: AuthenticatedRequest) {
    try {
      return await this.addFavorite.execute(request.user.sub, currency);
    } catch (error) {
      if (error instanceof ValidationError) throw new BadRequestException(error.message);
      if (error instanceof ConflictError) throw new ConflictException(error.message);
      throw error;
    }
  }

  @Delete(':currency')
  @ApiOperation({ summary: 'Remover favorito', description: 'Remove uma moeda da lista de favoritos da conta autenticada.' })
  @ApiParam({ name: 'currency', example: 'USD', description: 'Código da moeda base a remover.' })
  @ApiOkResponse({ description: 'Favorito removido com sucesso.', schema: { example: { deleted: true } } })
  @ApiBadRequestResponse({ description: 'A moeda informada não é suportada.' })
  @ApiNotFoundResponse({ description: 'A moeda não está nos favoritos do usuário.' })
  @ApiUnauthorizedResponse({ description: 'Token Bearer ausente, expirado ou inválido.' })
  async remove(@Param('currency') currency: string, @Req() request: AuthenticatedRequest) {
    try {
      return await this.removeFavorite.execute(request.user.sub, currency);
    } catch (error) {
      if (error instanceof ValidationError) throw new BadRequestException(error.message);
      if (error instanceof NotFoundError) throw new NotFoundException(error.message);
      throw error;
    }
  }
}
