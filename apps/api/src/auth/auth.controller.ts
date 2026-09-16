import { Body, ConflictException, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginUserUseCase } from '../application/auth/login-user.use-case.js';
import { RegisterUserUseCase } from '../application/auth/register-user.use-case.js';
import { ConflictError, InvalidCredentialsError } from '../application/errors/application-errors.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Criar uma conta',
    description: 'Cadastra um usuário e devolve um token JWT para uso imediato nos endpoints protegidos.',
  })
  @ApiCreatedResponse({
    description: 'Conta criada com sucesso. O token deve ser enviado como Bearer token nas requisições autenticadas.',
    schema: {
      example: {
        user: { id: 'e7c3f6f4-4b9d-4f0f-92a4-c8c67fdb2a1e', email: 'gabriel@example.com', createdAt: '2026-09-15T20:00:00.000Z' },
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiConflictResponse({ description: 'Já existe uma conta cadastrada com este e-mail.' })
  async register(@Body() input: RegisterDto) {
    try {
      return await this.registerUser.execute(input);
    } catch (error) {
      if (error instanceof ConflictError) throw new ConflictException(error.message);
      throw error;
    }
  }

  @Post('login')
  @ApiOperation({
    summary: 'Autenticar usuário',
    description: 'Valida as credenciais e devolve um token JWT para acesso aos favoritos.',
  })
  @ApiOkResponse({
    description: 'Credenciais válidas. Retorna o usuário público e o token de acesso.',
    schema: {
      example: {
        user: { id: 'e7c3f6f4-4b9d-4f0f-92a4-c8c67fdb2a1e', email: 'gabriel@example.com', createdAt: '2026-09-15T20:00:00.000Z' },
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'E-mail ou senha inválidos.' })
  async login(@Body() input: LoginDto) {
    try {
      return await this.loginUser.execute(input);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) throw new UnauthorizedException(error.message);
      throw error;
    }
  }
}
