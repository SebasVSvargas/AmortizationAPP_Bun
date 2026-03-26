import React from 'react';
import { useCalculations } from '../../context/CalculationsContext';
import { formatCurrency } from '../../utils/formatters';

const TableTab = () => {
  const { optSchedule } = useCalculations();

  return (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="px-6 py-4 font-bold text-slate-600">Mes</th>
            <th className="px-6 py-4 font-bold text-slate-600">Cuota</th>
            <th className="px-6 py-4 font-bold text-slate-600">Capital</th>
            <th className="px-6 py-4 font-bold text-slate-600">Interés</th>
            <th className="px-6 py-4 font-bold text-slate-600">Saldo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {optSchedule.map((row) => (
            <tr key={row.month} className={`hover:bg-slate-50 transition-colors ${row.extra > 0 ? 'bg-orange-50/30' : ''}`}>
              <td className="px-6 py-3 text-slate-400">{row.month}</td>
              <td className="px-6 py-3 font-black text-slate-800">
                {formatCurrency(row.payment)}
                {row.extra > 0 && <span className="block text-[8px] text-orange-600 font-bold uppercase">Incluye Abono</span>}
              </td>
              <td className="px-6 py-3 text-emerald-600 font-bold">{formatCurrency(row.principal + row.extra)}</td>
              <td className="px-6 py-3 text-rose-500">{formatCurrency(row.interest)}</td>
              <td className="px-6 py-3 font-bold text-slate-600">{formatCurrency(row.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default TableTab;
