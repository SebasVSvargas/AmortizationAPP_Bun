import React, { useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useUIContext } from './context/UIContext';
import AppHeader from './components/layout/AppHeader';
import SidePanel from './components/layout/SidePanel';
import Footer from './components/layout/Footer';
import SummaryTab from './components/tabs/SummaryTab';
import StrategyTab from './components/tabs/StrategyTab';
import TableTab from './components/tabs/TableTab';
import ChartsTab from './components/tabs/ChartsTab';

const App = () => {
  const { activeTab, drawerOpen, setDrawerOpen } = useUIContext();

  // Cierra el drawer automáticamente al cambiar de tab en móvil
  useEffect(() => {
    setDrawerOpen(false);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <AppHeader />

        <div className={`grid gap-8 ${activeTab === 'strategy' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
          {activeTab !== 'strategy' && <SidePanel alwaysVisible={activeTab === 'summary'} />}

          <main className={activeTab === 'strategy' ? 'col-span-full' : 'lg:col-span-8'}>
            {activeTab === 'summary'  && <SummaryTab />}
            {activeTab === 'strategy' && <StrategyTab />}
            {activeTab === 'table'    && <TableTab />}
            {activeTab === 'charts'   && <ChartsTab />}
          </main>
        </div>

        <Footer />
      </div>

      {/* Botón flotante "Configurar" — solo en móvil, y no en summary ni strategy */}
      {activeTab !== 'strategy' && activeTab !== 'summary' && (
        <button
          onClick={() => setDrawerOpen(true)}
          className={`fixed bottom-6 right-6 z-20 lg:hidden inline-flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-sm font-bold shadow-xl transition-all ${
            drawerOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <SlidersHorizontal size={16} />
          Configurar
        </button>
      )}
    </div>
  );
};

export default App;
