import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <UIContext.Provider value={{ activeTab, setActiveTab, drawerOpen, setDrawerOpen }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUIContext must be used within UIProvider');
  return context;
};
