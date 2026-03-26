import React from 'react';
import { useUIContext } from './context/UIContext';
import AppHeader from './components/layout/AppHeader';
import SidePanel from './components/layout/SidePanel';
import Footer from './components/layout/Footer';
import SummaryTab from './components/tabs/SummaryTab';
import StrategyTab from './components/tabs/StrategyTab';
import TableTab from './components/tabs/TableTab';
import ChartsTab from './components/tabs/ChartsTab';

const App = () => {
  const { activeTab } = useUIContext();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <AppHeader />

        <div className={`grid gap-8 ${activeTab === 'strategy' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
          {activeTab !== 'strategy' && <SidePanel />}

          <main className={activeTab === 'strategy' ? 'col-span-full' : 'lg:col-span-8'}>
            {activeTab === 'summary' && <SummaryTab />}
            {activeTab === 'strategy' && <StrategyTab />}
            {activeTab === 'table' && <TableTab />}
            {activeTab === 'charts' && <ChartsTab />}
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default App;
