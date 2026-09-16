import type { CurrencyQuote } from '@currency/shared';
import { formatPrice } from '../../../shared/utils/formatters';
import { currencyName } from './currency-meta';

type Props = { quotes: CurrencyQuote[]; selectedPair: string; favorites: string[]; isLoading: boolean; onSelect: (pair: string) => void; onToggleFavorite: (pair: string) => void };

export function QuotesGrid({ quotes, selectedPair, favorites, isLoading, onSelect, onToggleFavorite }: Props) {
  return <div className="quote-grid" aria-busy={isLoading}>
    <div className="quote-table-head" aria-hidden="true"><span>Moeda</span><span>Cotação</span><span>Variação</span><span /></div>
    {isLoading ? Array.from({ length: 10 }, (_, index) => <div className="quote-card skeleton" key={index} />) : null}
    {!isLoading && quotes.length === 0 ? <p className="empty-quotes">Nenhuma moeda encontrada.</p> : null}
    {quotes.map((quote) => {
      const pair = `${quote.code}-${quote.codeIn}`; const favorite = favorites.includes(pair);
      const positive = quote.variation >= 0;
      return <article className={`quote-card ${pair === selectedPair ? 'selected' : ''}`} key={pair}><button type="button" className="quote-main" onClick={() => onSelect(pair)} aria-label={`Ver histórico de ${currencyName(quote.code)}`}><span className="quote-identity"><span className="quote-code">{quote.code} / BRL</span><small>{currencyName(quote.code)}</small></span><strong>{formatPrice(quote.bid, quote.code)}</strong><span className={`variation ${positive ? 'positive' : 'negative'}`}>{positive ? '▲' : '▼'} {Math.abs(quote.variation).toFixed(2)}%</span></button><button type="button" className={`card-favorite ${favorite ? 'is-favorite' : ''}`} onClick={() => onToggleFavorite(pair)} aria-label={`${favorite ? 'Remover' : 'Adicionar'} ${currencyName(quote.code)} dos favoritos`}>{favorite ? '★' : '☆'}</button></article>;
    })}
  </div>;
}
