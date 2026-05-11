"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const AMORTIZATION_METHODS = [
  { value: "french", label: "Francés (Cuota fija)" },
  { value: "german", label: "Alemán (Cuota decreciente)" },
  { value: "american", label: "Americano (Solo interés)" },
];

export default function ScenarioForm({ initialData = null, isEditing = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    loanAmount: initialData?.loanAmount || "",
    interestRate: initialData?.interestRate || "",
    termMonths: initialData?.termMonths || "",
    method: initialData?.method || "french",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/scenarios/${initialData.id}`
        : "/api/scenarios";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          loanAmount: parseFloat(formData.loanAmount),
          interestRate: parseFloat(formData.interestRate),
          termMonths: parseInt(formData.termMonths),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al guardar el escenario");
        return;
      }

      router.push(`/dashboard/scenario/${data.id}`);
      router.refresh();
    } catch (err) {
      setError("Error al guardar el escenario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Nombre del Escenario
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Ej: Crédito Vivienda, Crédito Vehículo..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Monto del Préstamo
          </label>
          <input
            type="number"
            value={formData.loanAmount}
            onChange={(e) => handleChange("loanAmount", e.target.value)}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: 50000000"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Tasa de Interés (% Anual)
          </label>
          <input
            type="number"
            value={formData.interestRate}
            onChange={(e) => handleChange("interestRate", e.target.value)}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: 15"
            required
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Plazo (Meses)
          </label>
          <input
            type="number"
            value={formData.termMonths}
            onChange={(e) => handleChange("termMonths", e.target.value)}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: 60"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Método de Amortización
          </label>
          <select
            value={formData.method}
            onChange={(e) => handleChange("method", e.target.value)}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {AMORTIZATION_METHODS.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save size={16} />
              {isEditing ? "Actualizar" : "Crear Escenario"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
