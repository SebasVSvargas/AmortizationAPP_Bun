import React, { createContext, useContext } from 'react';
import { useBaselineAmortization } from '../hooks/useBaselineAmortization';
import { useOptimizedAmortization } from '../hooks/useOptimizedAmortization';
import { useInvestmentStrategy } from '../hooks/useInvestmentStrategy';

const CalculationsContext = createContext(null);

export const CalculationsProvider = ({ children }) => {
  const baseline = useBaselineAmortization();
  const optimized = useOptimizedAmortization(baseline);
  const strategyAnalysis = useInvestmentStrategy(baseline.monthlyPmt);

  return (
    <CalculationsContext.Provider value={{ baseline, ...optimized, strategyAnalysis }}>
      {children}
    </CalculationsContext.Provider>
  );
};

export const useCalculations = () => {
  const context = useContext(CalculationsContext);
  if (!context) throw new Error('useCalculations must be used within CalculationsProvider');
  return context;
};
