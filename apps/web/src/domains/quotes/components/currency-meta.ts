const CURRENCY_NAMES: Record<string, string> = {
  USD: 'Dólar americano',
  EUR: 'Euro',
  GBP: 'Libra esterlina',
  JPY: 'Iene japonês',
  CAD: 'Dólar canadense',
  AUD: 'Dólar australiano',
  CHF: 'Franco suíço',
  CNY: 'Yuan chinês',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
};

export function currencyName(code: string) {
  return CURRENCY_NAMES[code] ?? code;
}
