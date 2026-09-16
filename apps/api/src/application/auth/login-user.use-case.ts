import { Inject, Injectable } from '@nestjs/common';
import { InvalidCredentialsError } from '../errors/application-errors.js';
import { PASSWORD_HASHER, type PasswordHasher } from '../ports/password-hasher.port.js';
import { TOKEN_ISSUER, type TokenIssuer } from '../ports/token-issuer.port.js';
import { USER_REPOSITORY, type UserRepository } from '../ports/user-repository.port.js';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_ISSUER) private readonly tokenIssuer: TokenIssuer,
  ) {}

  async execute(input: { email: string; password: string }) {
    const user = await this.users.findByEmail(input.email.toLowerCase());
    if (!user || !(await this.passwordHasher.verify(input.password, user.passwordHash))) {
      throw new InvalidCredentialsError('Invalid email or password.');
    }

    return {
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
      accessToken: await this.tokenIssuer.issue(user.id, user.email),
    };
  }
}
