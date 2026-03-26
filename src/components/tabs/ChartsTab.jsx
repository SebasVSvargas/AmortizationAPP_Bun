import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLoanContext } from '../../context/LoanContext';
import { useCalculations } from '../../context/CalculationsContext';
import { formatCurrency } from '../../utils/formatters';
import { CHART_COLORS } from '../../constants/chartConfig';
import Card from '../ui/Card';

const ChartsTab = () => {
  const { loanAmount } = useLoanContext();
  const { optInterest } = useCalculations();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95">
      <Card>
        <h3 className="text-sm font-black text-slate-400 uppercase mb-6">Costo Total del Crédito</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Capital', value: loanAmount },
                  { name: 'Intereses', value: optInterest },
                ]}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill={CHART_COLORS.INDIGO} />
                <Cell fill={CHART_COLORS.ROSE} />
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default ChartsTab;
