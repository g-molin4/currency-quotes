export function formatPrice(value: number, code: string) {
  const digits = ['BTC', 'ETH'].includes(code) ? 2 : 4;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', minimumFractionDigits: digits, maximumFractionDigits: digits,
  }).format(value);
}

export function formatRelativeUpdate(value: string | null, now = Date.now()) {
  if (!value) return 'Aguardando atualização';
  const seconds = Math.max(0, Math.floor((now - new Date(value).getTime()) / 1000));
  if (seconds < 5) return 'Atualizado agora';
  if (seconds < 60) return `Atualizado há ${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `Atualizado há ${minutes} min`;
}
