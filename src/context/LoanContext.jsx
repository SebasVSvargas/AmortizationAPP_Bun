import React, { createContext, useContext, useState } from 'react';
import { LOAN_DEFAULTS } from '../constants';

const LoanContext = createContext(null);

export const LoanProvider = ({ children }) => {
  const [loanAmount, setLoanAmount] = useState(LOAN_DEFAULTS.AMOUNT);
  const [interestRate, setInterestRate] = useState(LOAN_DEFAULTS.INTEREST_RATE);
  const [termMonths, setTermMonths] = useState(LOAN_DEFAULTS.TERM_MONTHS);
  const [method] = useState(LOAN_DEFAULTS.METHOD);
  const [userSalary] = useState(LOAN_DEFAULTS.SALARY);
  const [debtRatio] = useState(LOAN_DEFAULTS.DEBT_RATIO);

  const [totalCapacity, setTotalCapacity] = useState(LOAN_DEFAULTS.TOTAL_CAPACITY);
  const [investmentROI, setInvestmentROI] = useState(LOAN_DEFAULTS.INVESTMENT_ROI);

  const [useCustomInstallment, setUseCustomInstallment] = useState(false);
  const [customInstallmentValue, setCustomInstallmentValue] = useState(0);
  const [extraPayments, setExtraPayments] = useState([]);
  const [newExtraMonth, setNewExtraMonth] = useState(1);
  const [newExtraAmount, setNewExtraAmount] = useState(0);

  const addExtraPayment = () => {
    const month = parseInt(newExtraMonth, 10);
    const amount = parseFloat(newExtraAmount);

    if (Number.isNaN(month) || Number.isNaN(amount) || amount <= 0 || month <= 0) {
      return;
    }

    setExtraPayments((prev) => [
      ...prev,
      { id: `extra-${Date.now()}-${Math.random()}`, month, amount },
    ]);
    setNewExtraAmount(0);
  };

  const removeExtraPayment = (id) => {
    setExtraPayments((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <LoanContext.Provider
      value={{
        loanAmount, setLoanAmount,
        interestRate, setInterestRate,
        termMonths, setTermMonths,
        method,
        userSalary, debtRatio,
        totalCapacity, setTotalCapacity,
        investmentROI, setInvestmentROI,
        useCustomInstallment, setUseCustomInstallment,
        customInstallmentValue, setCustomInstallmentValue,
        extraPayments,
        newExtraMonth, setNewExtraMonth,
        newExtraAmount, setNewExtraAmount,
        addExtraPayment,
        removeExtraPayment,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

export const useLoanContext = () => {
  const context = useContext(LoanContext);
  if (!context) throw new Error('useLoanContext must be used within LoanProvider');
  return context;
};
