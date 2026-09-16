import { describe, expect, it, vi } from 'vitest';
import { InvalidCredentialsError } from '../errors/application-errors.js';
import { LoginUserUseCase } from './login-user.use-case.js';

describe('LoginUserUseCase', () => {
  const user = {
    id: 'user-1',
    email: 'ada@example.com',
    passwordHash: 'stored-hash',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  it('returns a public user and an access token for valid credentials', async () => {
    const users = { findByEmail: vi.fn().mockResolvedValue(user), create: vi.fn() };
    const passwordHasher = { hash: vi.fn(), verify: vi.fn().mockResolvedValue(true) };
    const tokenIssuer = { issue: vi.fn().mockResolvedValue('access-token') };

    const result = await new LoginUserUseCase(users, passwordHasher, tokenIssuer).execute({
      email: 'ADA@EXAMPLE.COM',
      password: 'safe-password',
    });

    expect(users.findByEmail).toHaveBeenCalledWith('ada@example.com');
    expect(passwordHasher.verify).toHaveBeenCalledWith('safe-password', 'stored-hash');
    expect(tokenIssuer.issue).toHaveBeenCalledWith('user-1', 'ada@example.com');
    expect(result).toEqual({
      user: { id: 'user-1', email: 'ada@example.com', createdAt: user.createdAt },
      accessToken: 'access-token',
    });
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects unknown users without attempting password verification', async () => {
    const users = { findByEmail: vi.fn().mockResolvedValue(null), create: vi.fn() };
    const passwordHasher = { hash: vi.fn(), verify: vi.fn() };
    const tokenIssuer = { issue: vi.fn() };

    await expect(new LoginUserUseCase(users, passwordHasher, tokenIssuer).execute({
      email: 'missing@example.com',
      password: 'safe-password',
    })).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(passwordHasher.verify).not.toHaveBeenCalled();
    expect(tokenIssuer.issue).not.toHaveBeenCalled();
  });

  it('rejects an invalid password without issuing a token', async () => {
    const users = { findByEmail: vi.fn().mockResolvedValue(user), create: vi.fn() };
    const passwordHasher = { hash: vi.fn(), verify: vi.fn().mockResolvedValue(false) };
    const tokenIssuer = { issue: vi.fn() };

    await expect(new LoginUserUseCase(users, passwordHasher, tokenIssuer).execute({
      email: user.email,
      password: 'wrong-password',
    })).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(tokenIssuer.issue).not.toHaveBeenCalled();
  });
});
