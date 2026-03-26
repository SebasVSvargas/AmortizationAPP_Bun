import React from 'react';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLoanContext } from '../../context/LoanContext';
import { useCalculations } from '../../context/CalculationsContext';
import { formatCurrency } from '../../utils/formatters';
import { CHART_COLORS, AXIS_STYLE, TOOLTIP_STYLE_LARGE, currencyTickFormatter } from '../../constants/chartConfig';

const StrategyTab = () => {
  const { totalCapacity, setTotalCapacity, investmentROI, setInvestmentROI } = useLoanContext();
  const { strategyAnalysis } = useCalculations();

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-black text-indigo-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" /> Pagar Deuda vs. Invertir Excedente
          </h2>
          <p className="text-slate-500 text-sm">Compara el beneficio de pagar la deuda primero vs. pagar la cuota mínima e invertir el excedente.</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400">Capacidad Mensual</label>
          <input
            type="number"
            value={totalCapacity}
            onChange={(event) => setTotalCapacity(Number(event.target.value))}
            className="w-full p-3 bg-slate-50 border rounded-xl font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400">Rentabilidad (% Anual)</label>
          <input
            type="number"
            value={investmentROI}
            onChange={(event) => setInvestmentROI(Number(event.target.value))}
            className="w-full p-3 bg-slate-50 border rounded-xl font-black text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`lg:col-span-2 p-8 rounded-3xl text-white shadow-2xl flex flex-col justify-center relative overflow-hidden ${
            strategyAnalysis.finalWealthB > strategyAnalysis.finalWealthA ? 'bg-emerald-600' : 'bg-indigo-600'
          }`}
        >
          <TrendingUp className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10" />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-80">Estrategia Óptima</h3>
          <h4 className="text-5xl font-black mb-6 leading-tight">
            {strategyAnalysis.finalWealthB > strategyAnalysis.finalWealthA
              ? 'Liquidar Deuda Primero'
              : 'Invertir el Excedente'}
          </h4>
          <p className="text-lg opacity-90 max-w-xl">
            Diferencia de patrimonio final:
            <span className="font-black bg-white/20 px-3 py-1 rounded-lg ml-1">
              {formatCurrency(Math.abs(strategyAnalysis.finalWealthA - strategyAnalysis.finalWealthB))}
            </span>
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">Detalles Estratégicos</h4>
            <p className="text-xs text-slate-500 mb-1">Intereses evitados (Plan B):</p>
            <p className="text-2xl font-black text-emerald-600">{formatCurrency(strategyAnalysis.ahorroIntB)}</p>
          </div>
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-slate-500 mb-1">Tiempo de deuda Plan B:</p>
            <p className="text-2xl font-black text-slate-800">{strategyAnalysis.debtFreeMonth} Meses</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h3 className="text-lg font-bold mb-8">Evolución del Patrimonio Neto Acumulado</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={strategyAnalysis.scenarioData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.GRID} />
              <XAxis dataKey="month" {...AXIS_STYLE} />
              <YAxis {...AXIS_STYLE} tickFormatter={currencyTickFormatter} />
              <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={TOOLTIP_STYLE_LARGE} />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="patrimonioA" stroke={CHART_COLORS.INDIGO_LIGHT} strokeWidth={4} dot={false} name="Invertir desde el Mes 1" />
              <Line type="monotone" dataKey="patrimonioB" stroke={CHART_COLORS.EMERALD} strokeWidth={4} dot={false} name="Liquidar Deuda e Invertir" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StrategyTab;
