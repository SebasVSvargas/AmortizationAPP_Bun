import { LOCALE } from '../constants';

export const formatCurrency = (value) =>
  new Intl.NumberFormat(LOCALE.CODE, {
    style: 'currency',
    currency: LOCALE.CURRENCY,
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatMonthsToYears = (months) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${months} Meses`;
  if (m === 0) return `${months} Meses (${y} años)`;
  return `${months} Meses (${y} años y ${m} meses)`;
};

export const formatYearsAndMonths = (months) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${months} Meses`;
  if (m === 0) return `${months} Meses (${y} años)`;
  return `${y} años y ${m} meses`;
};
