export const TOKEN_ISSUER = Symbol('TOKEN_ISSUER');

export interface TokenIssuer {
  issue(subject: string, email: string): Promise<string>;
}
