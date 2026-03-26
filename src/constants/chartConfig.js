export const CHART_COLORS = {
  INDIGO: '#4f46e5',
  INDIGO_LIGHT: '#6366f1',
  SLATE: '#94a3b8',
  EMERALD: '#10b981',
  ROSE: '#f43f5e',
  GRID: '#f1f5f9',
  FILL_INDIGO: '#e0e7ff',
  FILL_SLATE: '#f1f5f9',
};

export const AXIS_STYLE = {
  fontSize: 10,
  axisLine: false,
  tickLine: false,
};

export const TOOLTIP_STYLE = {
  borderRadius: '12px',
  border: 'none',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
};

export const TOOLTIP_STYLE_LARGE = {
  borderRadius: '16px',
  border: 'none',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
};

export const currencyTickFormatter = (value) => `$${value / 1_000_000}M`;
