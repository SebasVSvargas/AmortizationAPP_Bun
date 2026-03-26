import React from 'react';
import { Calculator } from 'lucide-react';
import { useUIContext } from '../../context/UIContext';
import { TABS } from '../../constants';

const AppHeader = () => {
  const { activeTab, setActiveTab } = useUIContext();

  return (
    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black text-indigo-900 flex items-center gap-2">
          <Calculator className="text-indigo-600" />
          Simulador Crédito
        </h1>
        <p className="text-slate-500">Optimización de deuda y gestión patrimonial</p>
      </div>

      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === key ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
};

export default AppHeader;
