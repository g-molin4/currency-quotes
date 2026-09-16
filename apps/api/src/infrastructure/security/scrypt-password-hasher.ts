import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { PasswordHasher } from '../../application/ports/password-hasher.port.js';

const scrypt = promisify(scryptCallback);

@Injectable()
export class ScryptPasswordHasher implements PasswordHasher {
  async hash(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    return `${salt}:${hash.toString('hex')}`;
  }

  async verify(password: string, storedHash: string) {
    const [salt, expectedHash] = storedHash.split(':');
    if (!salt || !expectedHash) return false;
    const actualHash = (await scrypt(password, salt, 64)) as Buffer;
    const expected = Buffer.from(expectedHash, 'hex');
    return expected.length === actualHash.length && timingSafeEqual(expected, actualHash);
  }
}
