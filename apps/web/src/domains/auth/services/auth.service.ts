import type { AuthMode, AuthSession } from '../auth.types';
import { request } from '../../../shared/services/http.service';

export function authenticate(mode: AuthMode, email: string, password: string) {
  return request<AuthSession>(`/auth/${mode}`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
