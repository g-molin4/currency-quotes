import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { fetchQuoteHistory, fetchQuotes } from '../services/quotes.service';
import type { QuotesResponse, RealtimeStatus } from '../quotes.types';

const socketUrl = import.meta.env.VITE_WS_URL ?? 'http://localhost:3000';

export function useQuotes() {
  const queryClient = useQueryClient();
  const [selectedPair, setSelectedPair] = useState('USD-BRL');
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus>('connecting');
  const quotesQuery = useQuery({ queryKey: ['quotes'], queryFn: fetchQuotes, refetchInterval: 30_000 });
  const historyQuery = useQuery({
    queryKey: ['quote-history', selectedPair],
    queryFn: () => fetchQuoteHistory(selectedPair),
    enabled: Boolean(selectedPair),
  });

  useEffect(() => {
    const socket = io(`${socketUrl}/quotes`, { transports: ['websocket', 'polling'] });
    socket.on('connect', () => setRealtimeStatus('live'));
    socket.on('disconnect', () => setRealtimeStatus('offline'));
    socket.on('connect_error', () => setRealtimeStatus('offline'));
    socket.on('quotes:updated', (payload: QuotesResponse) => {
      queryClient.setQueryData(['quotes'], payload);
      queryClient.invalidateQueries({ queryKey: ['quote-history', selectedPair] });
    });
    return () => { socket.disconnect(); };
  }, [queryClient, selectedPair]);

  const quotes = useMemo(() => quotesQuery.data?.data ?? [], [quotesQuery.data]);
  const selectedQuote = quotes.find((quote) => `${quote.code}-${quote.codeIn}` === selectedPair) ?? quotes[0];
  const chartData = useMemo(() => {
    const history = historyQuery.data?.data;
    if (!Array.isArray(history)) return [];
    return history.map((point) => ({
      ...point,
      time: new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(point.recordedAt)),
    }));
  }, [historyQuery.data]);

  return { chartData, historyQuery, quotes, quotesQuery, realtimeStatus, selectedPair, selectedQuote, setSelectedPair };
}
