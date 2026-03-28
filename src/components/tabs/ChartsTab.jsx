import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from 'recharts';
import { TrendingDown, Clock } from 'lucide-react';
import { useLoanContext } from '../../context/LoanContext';
import { useCalculations } from '../../context/CalculationsContext';
import { formatCurrency } from '../../utils/formatters';
import { CHART_COLORS, AXIS_STYLE, TOOLTIP_STYLE, currencyTickFormatter } from '../../constants/chartConfig';
import Card from '../ui/Card';

const PieLegend = ({ items }) => (
  <div className="mt-4 space-y-2">
    {items.map(({ name, value, percent, color }) => (
      <div key={name} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-xs font-bold text-slate-600">{name}</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-black text-slate-800">{formatCurrency(value)}</span>
          <span className="text-[10px] text-slate-400 ml-2">{(percent * 100).toFixed(1)}%</span>
        </div>
      </div>
    ))}
  </div>
);

const ChartsTab = () => {
  const { loanAmount } = useLoanContext();
  const { optInterest, optCost, baseline, optSchedule, interestSaved, monthsSaved } = useCalculations();

  // Barras apiladas: muestreo para no saturar el eje X
  const barData = useMemo(() => {
    const step = Math.max(1, Math.floor(optSchedule.length / 24));
    return optSchedule
      .filter((_, i) => i % step === 0)
      .map((row) => ({
        month: row.month,
        Capital: Math.round(row.principal + row.extra),
        Interes: Math.round(row.interest),
      }));
  }, [optSchedule]);

  // Intereses acumulados mes a mes: banco vs optimizado
  const cumulativeData = useMemo(() => {
    const maxLen = Math.max(baseline.schedule.length, optSchedule.length);
    const step = Math.max(1, Math.floor(maxLen / 36));
    let cumBase = 0;
    let cumOpt = 0;
    const result = [];
    for (let i = 0; i < maxLen; i++) {
      if (baseline.schedule[i]) cumBase += baseline.schedule[i].interest;
      if (optSchedule[i]) cumOpt += optSchedule[i].interest;
      if (i % step === 0) {
        result.push({ month: i + 1, Banco: Math.round(cumBase), TuPlan: Math.round(cumOpt) });
      }
    }
    return result;
  }, [baseline.schedule, optSchedule]);

  const hasOptimization = interestSaved > 0 || monthsSaved > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Fila 1: Donuts comparativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-black text-slate-400 uppercase mb-1">Costo Total — Escenario Banco</h3>
          <p className="text-xs text-slate-400 mb-4">Sin abonos ni cuota mayor</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Capital', value: loanAmount },
                    { name: 'Intereses', value: Math.round(baseline.totalInterest) },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  labelLine={false}
                  label={false}
                >
                  <Cell fill={CHART_COLORS.INDIGO} />
                  <Cell fill={CHART_COLORS.ROSE} />
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <PieLegend items={[
            { name: 'Capital', value: loanAmount, percent: loanAmount / baseline.totalCost, color: CHART_COLORS.INDIGO },
            { name: 'Intereses', value: Math.round(baseline.totalInterest), percent: baseline.totalInterest / baseline.totalCost, color: CHART_COLORS.ROSE },
          ]} />
          <div className="flex justify-between text-xs mt-3 pt-3 border-t border-slate-100">
            <span className="text-slate-500 font-bold">Total a pagar</span>
            <span className="font-black text-slate-800">{formatCurrency(baseline.totalCost)}</span>
          </div>
        </Card>

        <Card className={hasOptimization ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}>
          <h3 className="text-sm font-black text-slate-400 uppercase mb-1">Costo Total — Tu Plan</h3>
          <p className="text-xs text-slate-400 mb-4">Con tu cuota y abonos actuales</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Capital', value: loanAmount },
                    { name: 'Intereses', value: Math.round(optInterest) },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  labelLine={false}
                  label={false}
                >
                  <Cell fill={CHART_COLORS.INDIGO} />
                  <Cell fill={CHART_COLORS.ROSE} />
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <PieLegend items={[
            { name: 'Capital', value: loanAmount, percent: loanAmount / optCost, color: CHART_COLORS.INDIGO },
            { name: 'Intereses', value: Math.round(optInterest), percent: optInterest / optCost, color: CHART_COLORS.ROSE },
          ]} />
          <div className="flex justify-between text-xs mt-3 pt-3 border-t border-slate-100">
            <span className="text-slate-500 font-bold">Total a pagar</span>
            <span className="font-black text-slate-800">{formatCurrency(optCost)}</span>
          </div>
        </Card>
      </div>

      {/* Banner de ahorro */}
      {hasOptimization && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
            <TrendingDown className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Ahorro en intereses</p>
              <p className="text-2xl font-black text-emerald-700">{formatCurrency(interestSaved)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-4">
            <Clock className="w-8 h-8 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Tiempo ahorrado</p>
              <p className="text-2xl font-black text-indigo-700">{monthsSaved} meses antes</p>
            </div>
          </div>
        </div>
      )}

      {/* Fila 2: Composición de cuota */}
      <Card>
        <h3 className="text-sm font-black text-slate-700 uppercase mb-1">Composición de Cuota por Mes</h3>
        <p className="text-xs text-slate-400 mb-6">Al inicio casi todo es interés; al final casi todo es capital</p>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.GRID} />
              <XAxis dataKey="month" {...AXIS_STYLE} label={{ value: 'Mes', position: 'insideBottom', offset: -2, fontSize: 10 }} />
              <YAxis {...AXIS_STYLE} tickFormatter={currencyTickFormatter} />
              <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={TOOLTIP_STYLE} />
              <Legend iconType="circle" iconSize={8} />
              <Bar dataKey="Capital" stackId="a" fill={CHART_COLORS.INDIGO} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Interes" stackId="a" fill={CHART_COLORS.ROSE} radius={[4, 4, 0, 0]} name="Interés" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Fila 3: Intereses acumulados */}
      <Card>
        <h3 className="text-sm font-black text-slate-700 uppercase mb-1">Intereses Acumulados</h3>
        <p className="text-xs text-slate-400 mb-6">El área entre las dos curvas es el dinero que te ahorras</p>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulativeData}>
              <defs>
                <linearGradient id="gradBanco" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.ROSE} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.ROSE} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPlan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.INDIGO} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.INDIGO} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.GRID} />
              <XAxis dataKey="month" {...AXIS_STYLE} label={{ value: 'Mes', position: 'insideBottom', offset: -2, fontSize: 10 }} />
              <YAxis {...AXIS_STYLE} tickFormatter={currencyTickFormatter} />
              <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={TOOLTIP_STYLE} />
              <Legend iconType="circle" iconSize={8} />
              <Area type="monotone" dataKey="Banco" stroke={CHART_COLORS.ROSE} strokeWidth={2} fill="url(#gradBanco)" />
              <Area type="monotone" dataKey="TuPlan" stroke={CHART_COLORS.INDIGO} strokeWidth={2} fill="url(#gradPlan)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  );
};

export default ChartsTab;
