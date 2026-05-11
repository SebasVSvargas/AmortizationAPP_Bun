import { LOCALE } from '../constants';

export const formatCurrency = (value) =>
  new Intl.NumberFormat(LOCALE.CODE, {
    style: 'currency',
    currency: LOCALE.CURRENCY,
    maximumFractionDigits: 0,
  }).format(value || 0);
