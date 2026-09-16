import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { TokenIssuer } from '../../application/ports/token-issuer.port.js';

@Injectable()
export class JwtTokenIssuer implements TokenIssuer {
  constructor(private readonly jwtService: JwtService) {}
  issue(subject: string, email: string) { return this.jwtService.signAsync({ sub: subject, email }); }
}
