import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFavorite, fetchFavorites, removeFavorite } from '../services/favorites.service';
import type { AuthSession } from '../../auth/auth.types';
import { ApiError } from '../../../shared/services/http.service';
import { useLocalStorage } from '../../../shared/hooks/use-local-storage';

const FAVORITES_KEY = 'currency-quotes:favorites';

export function useFavorites(session: AuthSession | null, onSessionExpired: () => void) {
  const queryClient = useQueryClient();
  const [localFavorites, setLocalFavorites] = useLocalStorage<string[]>(FAVORITES_KEY, []);
  const [feedback, setFeedback] = useState<string | null>(null);
  const remoteFavoritesQuery = useQuery({
    queryKey: ['favorites', session?.user.id],
    queryFn: () => fetchFavorites(session!.accessToken),
    enabled: Boolean(session),
  });
  const favorites = useMemo(() => session
    ? (remoteFavoritesQuery.data ?? []).map((favorite) => `${favorite.currency}-BRL`)
    : localFavorites, [localFavorites, remoteFavoritesQuery.data, session]);

  async function migrateGuestFavorites(nextSession: AuthSession) {
    setFeedback(null);
    try {
      await Promise.all(localFavorites.map(async (pair) => {
        try { await createFavorite(pair.split('-')[0], nextSession.accessToken); }
        catch (reason) {
          if (!(reason instanceof ApiError) || reason.status !== 409) throw reason;
        }
      }));
      setLocalFavorites([]);
    } catch {
      setFeedback('Não foi possível migrar todos os favoritos de visitante.');
    }
    await queryClient.invalidateQueries({ queryKey: ['favorites', nextSession.user.id] });
  }

  async function toggle(pair: string) {
    setFeedback(null);
    if (!session) {
      setLocalFavorites((current) => current.includes(pair) ? current.filter((favorite) => favorite !== pair) : [...current, pair]);
      return;
    }
    try {
      if (favorites.includes(pair)) await removeFavorite(pair.split('-')[0], session.accessToken);
      else await createFavorite(pair.split('-')[0], session.accessToken);
      await queryClient.invalidateQueries({ queryKey: ['favorites', session.user.id] });
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 401) { onSessionExpired(); return; }
      setFeedback(reason instanceof Error ? reason.message : 'Não foi possível salvar o favorito.');
    }
  }

  function clearLoggedUserCache() {
    setFeedback(null);
    setLocalFavorites([]);
    queryClient.removeQueries({ queryKey: ['favorites'] });
  }

  return { favorites, feedback, migrateGuestFavorites, remoteFavoritesQuery, toggle, clearLoggedUserCache };
}
