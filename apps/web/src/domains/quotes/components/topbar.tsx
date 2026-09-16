import type { AuthSession } from '../../auth/auth.types';
import type { RealtimeStatus } from '../quotes.types';

type Props = { status: RealtimeStatus; session: AuthSession | null; onLogin: () => void; onRegister: () => void; onLogout: () => void };

export function Topbar({ status, session, onLogin, onRegister, onLogout }: Props) {
  const statusText = status === 'live' ? 'Dados em tempo real' : status === 'connecting' ? 'Conectando dados' : 'Atualização temporariamente indisponível';
  return <header className="topbar">
    <a className="brand" href="#inicio" aria-label="Câmbio BR, página inicial"><span className="brand-mark">↗</span><span>câmbio<span>.br</span></span></a>
    <div className="topbar-actions">
      <div className="connection" aria-live="polite"><span className={`status-dot ${status}`} />{statusText}</div>
      {session ? <div className="account"><span title={session.user.email}>{session.user.email}</span><button type="button" onClick={onLogout}>Sair</button></div>
        : <div className="auth-actions"><button type="button" className="text-button" onClick={onLogin}>Entrar</button><button type="button" className="sign-up-button" onClick={onRegister}>Criar conta</button></div>}
    </div>
  </header>;
}
