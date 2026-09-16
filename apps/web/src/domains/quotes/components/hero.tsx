import { useEffect, useState } from 'react';
import { formatRelativeUpdate } from '../../../shared/utils/formatters';

export function Hero({ updatedAt }: { updatedAt: string | null }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    setNow(Date.now());
    const interval = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(interval);
  }, [updatedAt]);

  return <section id="inicio" className="hero">
    <div><p className="eyebrow">MERCADO · BRL</p><h1>Cotações em tempo real</h1><p className="intro">Acompanhe moedas e criptoativos em relação ao real.</p></div>
    <p className="updated-at" aria-live="polite"><span className="status-dot live" />{formatRelativeUpdate(updatedAt, now)}</p>
  </section>;
}
