import type { FormEvent } from 'react';
import type { AuthMode } from '../auth.types';

type Props = {
  mode: AuthMode | null; email: string; password: string; error: string | null; isSubmitting: boolean;
  onClose: () => void; onEmailChange: (value: string) => void; onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void; onSwitch: () => void;
};

export function AuthModal({ mode, email, password, error, isSubmitting, onClose, onEmailChange, onPasswordChange, onSubmit, onSwitch }: Props) {
  if (!mode) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={() => !isSubmitting && onClose()}>
    <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}>
      <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
      <p className="eyebrow">SUA CONTA</p><h2 id="auth-title">{mode === 'register' ? 'Crie sua conta' : 'Que bom ter você de volta'}</h2>
      <p className="auth-description">{mode === 'register' ? 'Salve seus pares favoritos no banco de dados.' : 'Entre para acessar seus favoritos salvos.'}</p>
      <form onSubmit={onSubmit}>
        <label>E-mail<input type="email" autoComplete="email" value={email} onChange={(event) => onEmailChange(event.target.value)} required /></label>
        <label>Senha<input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={8} value={password} onChange={(event) => onPasswordChange(event.target.value)} required /></label>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <button className="form-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Aguarde…' : mode === 'register' ? 'Criar conta' : 'Entrar'}</button>
      </form>
      <p className="auth-switch">{mode === 'register' ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'} <button type="button" onClick={onSwitch}>{mode === 'register' ? 'Entrar' : 'Criar conta'}</button></p>
    </section>
  </div>;
}
