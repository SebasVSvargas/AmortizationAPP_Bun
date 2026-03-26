import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useLoanContext } from '../../context/LoanContext';
import { formatCurrency } from '../../utils/formatters';
import Card from '../ui/Card';
import InputField from '../ui/InputField';

const ExtraPaymentsPanel = () => {
  const {
    newExtraMonth, setNewExtraMonth,
    newExtraAmount, setNewExtraAmount,
    addExtraPayment,
    extraPayments,
    removeExtraPayment,
  } = useLoanContext();

  const sortedExtras = [...extraPayments].sort((a, b) => a.month - b.month);

  return (
    <Card>
      <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-orange-600">
        <PlusCircle className="w-4 h-4" /> Abonos Puntuales
      </h3>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Mes</label>
          <input
            type="number"
            value={newExtraMonth}
            onChange={(event) => setNewExtraMonth(event.target.value)}
            className="w-full p-2 bg-slate-50 border rounded-lg text-sm outline-none focus:border-orange-300"
            placeholder="Ej: 12"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Monto</label>
          <InputField
            value={newExtraAmount}
            onChange={setNewExtraAmount}
            showThousands
            className="p-2 text-sm focus:ring-0 focus:border-orange-300"
            placeholder="$ Valor"
          />
        </div>
      </div>

      <button
        onClick={addExtraPayment}
        className="w-full py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm active:scale-95"
      >
        Agregar Abono
      </button>

      {extraPayments.length > 0 && (
        <div className="mt-6 space-y-2 border-t pt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Lista de abonos programados:</p>

          <div className="max-h-48 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            {sortedExtras.map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-orange-200 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Mes {payment.month}</span>
                  <span className="text-xs font-black text-slate-700">{formatCurrency(payment.amount)}</span>
                </div>

                <button
                  onClick={() => removeExtraPayment(payment.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  title="Eliminar abono"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ExtraPaymentsPanel;
