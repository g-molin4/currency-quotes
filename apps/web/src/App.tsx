import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { AuthModal } from './domains/auth/components/auth-modal';
import { useAuth } from './domains/auth/hooks/use-auth';
import { useFavorites } from './domains/favorites/hooks/use-favorites';
import { Hero } from './domains/quotes/components/hero';
import { QuoteOverview } from './domains/quotes/components/quote-overview';
import { QuoteSummary } from './domains/quotes/components/quote-summary';
import { QuotesGrid } from './domains/quotes/components/quotes-grid';
import { currencyName } from './domains/quotes/components/currency-meta';
import { Topbar } from './domains/quotes/components/topbar';
import { useQuotes } from './domains/quotes/hooks/use-quotes';

function App() {
  const auth = useAuth();
  const migratedSession = useRef<string | null>(null);
  const favorites = useFavorites(auth.session, () => {
    auth.logout();
    auth.open('login');
    auth.setError('Sua sessão expirou. Entre novamente para salvar favoritos.');
  });
  const quotes = useQuotes();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const accessToken = auth.session?.accessToken;
    if (!auth.session || !accessToken) {
      migratedSession.current = null;
      return;
    }
    if (migratedSession.current === accessToken) return;
    migratedSession.current = accessToken;
    void favorites.migrateGuestFavorites(auth.session);
  }, [auth.session, favorites]);

  const orderedQuotes = useMemo(() => [...quotes.quotes].sort((left, right) =>
    Number(favorites.favorites.includes(`${right.code}-${right.codeIn}`)) - Number(favorites.favorites.includes(`${left.code}-${left.codeIn}`)),
  ), [favorites.favorites, quotes.quotes]);
  const filteredQuotes = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-BR');
    if (!query) return orderedQuotes;
    return orderedQuotes.filter((quote) => `${quote.code} ${currencyName(quote.code)}`.toLocaleLowerCase('pt-BR').includes(query));
  }, [orderedQuotes, search]);

  function logout() {
    favorites.clearLoggedUserCache();
    auth.logout();
  }

  return <main className="app-shell">
    <Topbar status={quotes.realtimeStatus} session={auth.session} onLogin={() => auth.open('login')} onRegister={() => auth.open('register')} onLogout={logout} />
    <Hero updatedAt={quotes.quotesQuery.data?.updatedAt ?? null} />
    <QuoteSummary quotes={quotes.quotes} selectedPair={quotes.selectedPair} onSelect={quotes.setSelectedPair} />
    {quotes.quotesQuery.isError && quotes.quotes.length === 0 ? <section className="feedback error" role="alert"><h2>Não foi possível carregar as cotações.</h2><p>Confira se a API está em execução e tente novamente.</p><button type="button" onClick={() => quotes.quotesQuery.refetch()}>Tentar de novo</button></section> : null}
    {favorites.feedback ? <p className="favorite-feedback" role="status">{favorites.feedback}</p> : null}
    <QuoteOverview quote={quotes.selectedQuote} chartData={quotes.chartData} isLoading={quotes.historyQuery.isLoading} favorites={favorites.favorites} onToggleFavorite={favorites.toggle} />
    <section className="quotes-section" aria-labelledby="quotes-heading">
      <div className="section-heading"><div><p className="eyebrow">MERCADO</p><h2 id="quotes-heading">Todas as cotações</h2></div><span>{filteredQuotes.length || quotes.quotes.length || 10} ativos</span></div>
      <label className="currency-search"><span className="search-icon" aria-hidden="true">⌕</span><span className="sr-only">Buscar moeda</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar moeda..." /></label>
      {!auth.session ? <p className="guest-note">Entre ou crie uma conta para manter seus favoritos salvos em todos os dispositivos.</p> : null}
      <QuotesGrid quotes={filteredQuotes} selectedPair={quotes.selectedPair} favorites={favorites.favorites} isLoading={quotes.quotesQuery.isLoading || favorites.remoteFavoritesQuery.isLoading} onSelect={quotes.setSelectedPair} onToggleFavorite={favorites.toggle} />
    </section>
    <footer>Dados fornecidos por AwesomeAPI · Valores informativos, não constituem recomendação de investimento.</footer>
    <AuthModal mode={auth.authMode} email={auth.email} password={auth.password} error={auth.error} isSubmitting={auth.isSubmitting} onClose={() => auth.setAuthMode(null)} onEmailChange={auth.setEmail} onPasswordChange={auth.setPassword} onSubmit={auth.submit} onSwitch={() => { auth.setError(null); auth.setAuthMode(auth.authMode === 'register' ? 'login' : 'register'); }} />
  </main>;
}

export default App;
