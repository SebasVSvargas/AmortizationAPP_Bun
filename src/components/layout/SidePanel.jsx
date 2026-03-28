import React from 'react';
import { X } from 'lucide-react';
import { useUIContext } from '../../context/UIContext';
import ConfigPanel from '../panels/ConfigPanel';
import ExtraPaymentsPanel from '../panels/ExtraPaymentsPanel';
import CustomInstallmentPanel from '../panels/CustomInstallmentPanel';

const PanelContent = () => (
  <>
    <ConfigPanel />
    <ExtraPaymentsPanel />
    <CustomInstallmentPanel />
  </>
);

const SidePanel = ({ alwaysVisible = false }) => {
  const { drawerOpen, setDrawerOpen } = useUIContext();

  // Modo siempre visible: comportamiento original, panel en el flujo del grid
  if (alwaysVisible) {
    return (
      <aside className="lg:col-span-4 space-y-6 animate-in slide-in-from-left duration-500">
        <PanelContent />
      </aside>
    );
  }

  // Modo drawer: panel fijo en móvil, estático en desktop
  return (
    <>
      {/* Overlay — solo en móvil cuando el drawer está abierto */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel lateral */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-80 bg-slate-50 shadow-2xl overflow-y-auto p-5 space-y-6
          transition-transform duration-300 ease-in-out
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0 lg:shadow-none lg:bg-transparent lg:p-0
          lg:col-span-4 lg:h-auto lg:overflow-visible
          animate-in slide-in-from-left duration-500
        `}
      >
        {/* Botón cerrar — solo visible en móvil */}
        <div className="flex justify-between items-center lg:hidden mb-2">
          <span className="text-sm font-black text-slate-700 uppercase tracking-widest">Configuración</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-xl hover:bg-slate-200 transition-colors text-slate-500"
          >
            <X size={18} />
          </button>
        </div>

        <PanelContent />
      </aside>
    </>
  );
};

export default SidePanel;
