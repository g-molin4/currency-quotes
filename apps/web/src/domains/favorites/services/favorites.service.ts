import type { Favorite } from '../favorites.types';
import { request } from '../../../shared/services/http.service';

function authorization(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` };
}

export function fetchFavorites(accessToken: string) {
  return request<Favorite[]>('/favorites', { headers: authorization(accessToken) });
}

export function createFavorite(currency: string, accessToken: string) {
  return request<Favorite>(`/favorites/${currency}`, { method: 'POST', headers: authorization(accessToken) });
}

export function removeFavorite(currency: string, accessToken: string) {
  return request<{ deleted: boolean }>(`/favorites/${currency}`, { method: 'DELETE', headers: authorization(accessToken) });
}
