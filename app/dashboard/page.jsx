"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, FolderOpen } from "lucide-react";
import Link from "next/link";
import ScenarioCard from "../../components/dashboard/ScenarioCard";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const res = await fetch("/api/scenarios");
      if (res.ok) {
        const data = await res.json();
        setScenarios(data);
      }
    } catch (error) {
      console.error("Error al cargar escenarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/scenarios/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setScenarios((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar escenario:", error);
    }
  };

  const handleUpdate = (updated) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          Mis Escenarios
        </h1>
        <p className="text-slate-500">
          Gestiona tus simulaciones de crédito guardadas
        </p>
      </div>

      {scenarios.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-2xl mb-6">
            <FolderOpen className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">
            No tienes escenarios guardados
          </h2>
          <p className="text-slate-500 mb-6">
            Crea tu primer escenario para empezar a simular créditos
          </p>
          <Link
            href="/dashboard/scenario/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors"
          >
            <Plus size={20} />
            Crear Primer Escenario
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
