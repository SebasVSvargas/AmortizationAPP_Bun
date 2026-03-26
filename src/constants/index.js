export const LOAN_DEFAULTS = {
  AMOUNT: 50_000_000,
  INTEREST_RATE: 15,
  TERM_MONTHS: 60,
  METHOD: 'french',
  SALARY: 5_000_000,
  DEBT_RATIO: 30,
  TOTAL_CAPACITY: 1_500_000,
  INVESTMENT_ROI: 10,
};

export const AMORTIZATION_METHODS = {
  FRENCH: 'french',
  GERMAN: 'german',
  AMERICAN: 'american',
};

export const TABS = [
  { key: 'summary', label: 'Resumen' },
  { key: 'table', label: 'Tabla Amortización' },
  { key: 'charts', label: 'Gráficos' },
  { key: 'strategy', label: 'Invertir vs Pagar deuda' },
];

export const CALCULATION = {
  MAX_AMORTIZATION_MONTHS: 480,
  BALANCE_THRESHOLD: 0.01,
};

export const LOCALE = {
  CODE: 'es-CO',
  CURRENCY: 'COP',
};
