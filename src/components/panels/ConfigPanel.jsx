import React from 'react';
import { DollarSign } from 'lucide-react';
import { useLoanContext } from '../../context/LoanContext';
import Card from '../ui/Card';
import InputField from '../ui/InputField';

const ConfigPanel = () => {
  const { loanAmount, setLoanAmount, interestRate, setInterestRate, termMonths, setTermMonths } = useLoanContext();

  return (
    <Card>
      <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-400">
        <DollarSign className="w-4 h-4" /> Configuración Inicial
      </h3>

      <div className="space-y-4">
        <InputField label="Monto del Préstamo" value={loanAmount} onChange={setLoanAmount} showThousands />

        <div className="grid grid-cols-2 gap-4">
          <InputField label="Interés (% Anual)" value={interestRate} onChange={setInterestRate} />
          <InputField label="Plazo (Meses)" value={termMonths} onChange={setTermMonths} />
        </div>
      </div>
    </Card>
  );
};

export default ConfigPanel;
