"use client";

import ScenarioForm from "../../../../components/dashboard/ScenarioForm";

export default function NewScenarioPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          Nuevo Escenario
        </h1>
        <p className="text-slate-500">
          Configura los parámetros de tu simulación de crédito
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <ScenarioForm />
      </div>
    </div>
  );
}
