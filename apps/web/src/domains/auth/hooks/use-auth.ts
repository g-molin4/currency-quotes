import { useState } from 'react';
import type { FormEvent } from 'react';
import { authenticate } from '../services/auth.service';
import type { AuthMode, AuthSession } from '../auth.types';
import { useLocalStorage } from '../../../shared/hooks/use-local-storage';

const SESSION_KEY = 'currency-quotes:session';

export function useAuth() {
  const [session, setSession] = useLocalStorage<AuthSession | null>(SESSION_KEY, null);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function open(mode: AuthMode) { setError(null); setAuthMode(mode); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!authMode) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const nextSession = await authenticate(authMode, email, password);
      setSession(nextSession);
      setAuthMode(null);
      setEmail('');
      setPassword('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível autenticar.');
    } finally { setIsSubmitting(false); }
  }

  function logout() { setSession(null); }

  return { authMode, email, error, isSubmitting, logout, open, password, session, setAuthMode, setEmail, setError, setPassword, submit };
}
