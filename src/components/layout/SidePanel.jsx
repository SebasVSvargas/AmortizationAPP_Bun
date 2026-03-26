import React from 'react';
import ConfigPanel from '../panels/ConfigPanel';
import ExtraPaymentsPanel from '../panels/ExtraPaymentsPanel';
import CustomInstallmentPanel from '../panels/CustomInstallmentPanel';

const SidePanel = () => (
  <aside className="lg:col-span-4 space-y-6 animate-in slide-in-from-left duration-500">
    <ConfigPanel />
    <ExtraPaymentsPanel />
    <CustomInstallmentPanel />
  </aside>
);

export default SidePanel;
