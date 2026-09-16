import { describe, expect, it, vi } from 'vitest';
import { ConflictError } from '../errors/application-errors.js';
import { RegisterUserUseCase } from './register-user.use-case.js';

describe('RegisterUserUseCase', () => {
  it('normalizes the email, hashes the password, and issues a token', async () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const users = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'user-1', email: 'ada@example.com', createdAt }),
    };
    const passwordHasher = { hash: vi.fn().mockResolvedValue('hashed-password') };
    const tokenIssuer = { issue: vi.fn().mockResolvedValue('access-token') };

    const result = await new RegisterUserUseCase(users, passwordHasher, tokenIssuer).execute({
      email: 'Ada@Example.COM',
      password: 'safe-password',
    });

    expect(users.findByEmail).toHaveBeenCalledWith('ada@example.com');
    expect(passwordHasher.hash).toHaveBeenCalledWith('safe-password');
    expect(users.create).toHaveBeenCalledWith('ada@example.com', 'hashed-password');
    expect(tokenIssuer.issue).toHaveBeenCalledWith('user-1', 'ada@example.com');
    expect(result).toEqual({
      user: { id: 'user-1', email: 'ada@example.com', createdAt },
      accessToken: 'access-token',
    });
  });

  it('rejects an email that is already registered without creating a user', async () => {
    const users = {
      findByEmail: vi.fn().mockResolvedValue({ id: 'user-1' }),
      create: vi.fn(),
    };
    const passwordHasher = { hash: vi.fn() };
    const tokenIssuer = { issue: vi.fn() };

    await expect(new RegisterUserUseCase(users, passwordHasher, tokenIssuer).execute({
      email: 'ada@example.com',
      password: 'safe-password',
    })).rejects.toBeInstanceOf(ConflictError);

    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(users.create).not.toHaveBeenCalled();
    expect(tokenIssuer.issue).not.toHaveBeenCalled();
  });
});
