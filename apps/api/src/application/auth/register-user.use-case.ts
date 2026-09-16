import { Inject, Injectable } from '@nestjs/common';
import { ConflictError } from '../errors/application-errors.js';
import { PASSWORD_HASHER, type PasswordHasher } from '../ports/password-hasher.port.js';
import { TOKEN_ISSUER, type TokenIssuer } from '../ports/token-issuer.port.js';
import { USER_REPOSITORY, type UserRepository } from '../ports/user-repository.port.js';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_ISSUER) private readonly tokenIssuer: TokenIssuer,
  ) {}

  async execute(input: { email: string; password: string }) {
    const email = input.email.toLowerCase();
    if (await this.users.findByEmail(email)) throw new ConflictError('Email is already registered.');

    const user = await this.users.create(email, await this.passwordHasher.hash(input.password));
    return { user, accessToken: await this.tokenIssuer.issue(user.id, user.email) };
  }
}
