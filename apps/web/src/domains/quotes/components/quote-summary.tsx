import type { CurrencyQuote } from '@currency/shared';
import { formatPrice } from '../../../shared/utils/formatters';

const priority = ['USD', 'EUR', 'GBP', 'BTC', 'ETH'];

type Props = { quotes: CurrencyQuote[]; selectedPair: string; onSelect: (pair: string) => void };

export function QuoteSummary({ quotes, selectedPair, onSelect }: Props) {
  const featured = priority.flatMap((code) => quotes.filter((quote) => quote.code === code));
  if (!featured.length) return null;

  return <section className="quote-summary" aria-label="Principais cotações">
    {featured.map((quote) => {
      const pair = `${quote.code}-${quote.codeIn}`;
      const positive = quote.variation >= 0;
      return <button key={pair} type="button" className={`summary-quote ${pair === selectedPair ? 'selected' : ''}`} onClick={() => onSelect(pair)}>
        <span className="summary-code">{quote.code} / BRL</span>
        <strong>{formatPrice(quote.bid, quote.code)}</strong>
        <span className={`variation ${positive ? 'positive' : 'negative'}`}>{positive ? '▲' : '▼'} {Math.abs(quote.variation).toFixed(2)}%</span>
      </button>;
    })}
  </section>;
}
