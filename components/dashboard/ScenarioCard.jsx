"use client";

import { useRouter } from "next/navigation";
import { Calendar, DollarSign, Percent, Clock, Trash2, Pencil } from "lucide-react";
import { formatCurrency } from "../../lib/utils/formatters";

const METHOD_NAMES = {
  french: "Francés",
  german: "Alemán",
  american: "Americano",
};

export default function ScenarioCard({ scenario, onDelete, onUpdate }) {
  const router = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams({
      amount: scenario.loanAmount,
      rate: scenario.interestRate,
      term: scenario.termMonths,
      method: scenario.method,
    });
    router.push(`/?${params.toString()}`);
  };

  const handleEditName = async (e) => {
    e.stopPropagation();
    const newName = prompt("Nombre del escenario:", scenario.name);
    if (!newName || newName.trim() === "" || newName === scenario.name) return;

    try {
      const res = await fetch(`/api/scenarios/${scenario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          loanAmount: scenario.loanAmount,
          interestRate: scenario.interestRate,
          termMonths: scenario.termMonths,
          method: scenario.method,
          customInstallment: scenario.customInstallment,
          extraPayments: scenario.extraPayments,
        }),
      });

      if (res.ok && onUpdate) {
        onUpdate({ ...scenario, name: newName.trim() });
      }
    } catch (error) {
      console.error("Error al renombrar:", error);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro de eliminar este escenario?")) {
      onDelete(scenario.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group relative"
    >
      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={handleEditName}
          className="p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
          title="Renombrar"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Eliminar escenario"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <h3 className="text-lg font-black text-slate-800 mb-4 pr-16">
        {scenario.name}
      </h3>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-indigo-500" />
          <span className="text-slate-500">Monto:</span>
          <span className="font-bold text-slate-700">
            {formatCurrency(scenario.loanAmount)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Percent className="w-4 h-4 text-emerald-500" />
          <span className="text-slate-500">Interés:</span>
          <span className="font-bold text-slate-700">
            {scenario.interestRate}% anual
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-amber-500" />
          <span className="text-slate-500">Plazo:</span>
          <span className="font-bold text-slate-700">
            {scenario.termMonths} meses
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-purple-500" />
          <span className="text-slate-500">Método:</span>
          <span className="font-bold text-slate-700">
            {METHOD_NAMES[scenario.method] || scenario.method}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          Actualizado: {new Date(scenario.updatedAt).toLocaleDateString("es-CO")}
        </p>
      </div>
    </div>
  );
}
