"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Play } from "lucide-react";
import Link from "next/link";
import ScenarioForm from "../../../../components/dashboard/ScenarioForm";
import { formatCurrency } from "../../../../lib/utils/formatters";

const METHOD_NAMES = {
  french: "Francés (Cuota fija)",
  german: "Alemán (Cuota decreciente)",
  american: "Americano (Solo interés)",
};

export default function ScenarioPage() {
  const router = useRouter();
  const params = useParams();
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchScenario();
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchScenario = async () => {
    try {
      const res = await fetch(`/api/scenarios/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setScenario(data);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error al cargar escenario:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de eliminar este escenario?")) {
      try {
        const res = await fetch(`/api/scenarios/${params.id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error al eliminar escenario:", error);
      }
    }
  };

  const handleSimulate = () => {
    router.push(`/?scenarioId=${params.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!scenario) {
    return null;
  }

  if (isEditing) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Editar Escenario
          </h1>
          <p className="text-slate-500">
            Modifica los parámetros de tu simulación
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <ScenarioForm initialData={scenario} isEditing={true} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-4"
        >
          <ArrowLeft size={16} />
          Volver a escenarios
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              {scenario.name}
            </h1>
            <p className="text-slate-500">
              Detalles del escenario de crédito
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              <Edit size={16} />
              Editar
            </button>

            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
            >
              <Trash2 size={16} />
              Eliminar
            </button>

            <button
              onClick={handleSimulate}
              className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500 transition-colors"
            >
              <Play size={16} />
              Simular
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
            Parámetros del Crédito
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Monto del Préstamo</span>
              <span className="font-black text-slate-800">
                {formatCurrency(scenario.loanAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Tasa de Interés</span>
              <span className="font-black text-slate-800">
                {scenario.interestRate}% anual
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Plazo</span>
              <span className="font-black text-slate-800">
                {scenario.termMonths} meses
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Método</span>
              <span className="font-black text-slate-800">
                {METHOD_NAMES[scenario.method] || scenario.method}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
            Información Adicional
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Cuota Personalizada</span>
              <span className="font-black text-slate-800">
                {scenario.customInstallment
                  ? formatCurrency(scenario.customInstallment)
                  : "No configurada"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Pagos Extra</span>
              <span className="font-black text-slate-800">
                {scenario.extraPayments?.length || 0} programados
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Creado</span>
              <span className="font-black text-slate-800">
                {new Date(scenario.createdAt).toLocaleDateString("es-CO")}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Última actualización</span>
              <span className="font-black text-slate-800">
                {new Date(scenario.updatedAt).toLocaleDateString("es-CO")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Play className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900">Simular este escenario</h3>
            <p className="text-sm text-indigo-600">
              Haz clic en &quot;Simular&quot; para ver el análisis completo de amortización con estos parámetros
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
