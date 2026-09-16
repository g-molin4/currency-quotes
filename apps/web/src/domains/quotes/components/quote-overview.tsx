import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { CurrencyQuote } from '@currency/shared';
import { formatPrice } from '../../../shared/utils/formatters';
import { currencyName } from './currency-meta';

type ChartPoint = { bid: number; time: string };
type Props = { quote?: CurrencyQuote; chartData: ChartPoint[]; isLoading: boolean; favorites: string[]; onToggleFavorite: (pair: string) => void };

export function QuoteOverview({ quote, chartData, isLoading, favorites, onToggleFavorite }: Props) {
  const pair = quote ? `${quote.code}-${quote.codeIn}` : '';
  const favorite = Boolean(pair && favorites.includes(pair));
  return <section className="overview" aria-label="Cotação selecionada">
    <div className="featured-card">
      <div className="card-heading"><div><span>{quote ? `${quote.code} / BRL` : 'CARREGANDO'}</span>{quote ? <small>{currencyName(quote.code)}</small> : null}</div><button type="button" className={`favorite-button ${favorite ? 'is-favorite' : ''}`} disabled={!quote} onClick={() => quote && onToggleFavorite(pair)} aria-label={`${favorite ? 'Remover dos' : 'Adicionar aos'} favoritos`}>{favorite ? '★' : '☆'}</button></div>
      <strong className="featured-price">{quote ? formatPrice(quote.bid, quote.code) : '—'}</strong>
      <span className={`variation ${(quote?.variation ?? 0) >= 0 ? 'positive' : 'negative'}`}>{(quote?.variation ?? 0) >= 0 ? '▲' : '▼'} {Math.abs(quote?.variation ?? 0).toFixed(2)}% hoje</span>
      <dl className="price-details"><div><dt>Máxima</dt><dd>{quote ? formatPrice(quote.high, quote.code) : '—'}</dd></div><div><dt>Mínima</dt><dd>{quote ? formatPrice(quote.low, quote.code) : '—'}</dd></div><div><dt>Venda</dt><dd>{quote ? formatPrice(quote.ask, quote.code) : '—'}</dd></div></dl>
    </div>
    <div className="chart-card">
      <div className="chart-title-row"><div><p className="eyebrow">HISTÓRICO DE PREÇO</p><h2>{quote ? `${quote.code} / BRL` : 'Carregando gráfico'}</h2></div><div className="chart-period" role="group" aria-label="Período do gráfico"><button type="button" className="active" aria-pressed="true">1H</button><button type="button" disabled title="Período ainda indisponível">1D</button><button type="button" disabled title="Período ainda indisponível">7D</button><button type="button" disabled title="Período ainda indisponível">30D</button></div></div>
      <div className="chart-wrap">
        {isLoading ? <p className="chart-message">Montando histórico…</p> : null}
        {!isLoading && chartData.length === 0 ? <p className="chart-message">O histórico aparecerá após a próxima coleta.</p> : null}
        {chartData.length > 0 ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="quote-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#65e6b3" stopOpacity={0.24} /><stop offset="100%" stopColor="#65e6b3" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#272d29" strokeDasharray="3 6" /><XAxis dataKey="time" minTickGap={42} axisLine={false} tickLine={false} tick={{ fill: '#8f9992', fontSize: 11 }} /><YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#8f9992', fontSize: 11 }} width={58} /><Tooltip formatter={(value) => formatPrice(Number(Array.isArray(value) ? value[0] : value ?? 0), quote?.code ?? 'USD')} labelFormatter={(label) => String(label)} contentStyle={{ background: '#141816', border: '1px solid #39423d', borderRadius: 7, padding: '8px 10px' }} labelStyle={{ color: '#8f9992', fontSize: 12, marginBottom: 3 }} itemStyle={{ color: '#f2f4f2', fontSize: 13 }} cursor={{ stroke: '#66736b', strokeDasharray: '3 4' }} /><Area type="monotone" dataKey="bid" stroke="#65e6b3" strokeWidth={2} fill="url(#quote-gradient)" /></AreaChart></ResponsiveContainer> : null}
      </div>
    </div>
  </section>;
}
