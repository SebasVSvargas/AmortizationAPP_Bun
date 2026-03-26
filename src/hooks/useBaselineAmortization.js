import { useMemo } from 'react';
import { useLoanContext } from '../context/LoanContext';

export const useBaselineAmortization = () => {
  const { loanAmount, interestRate, termMonths } = useLoanContext();

  return useMemo(() => {
    let balance = loanAmount;
    const monthlyRate = (interestRate / 100) / 12;
    let totalInterest = 0;
    const schedule = [];

    const pmt = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));

    for (let month = 1; month <= termMonths; month += 1) {
      const interest = balance * monthlyRate;
      const capital = pmt - interest;
      balance -= capital;
      totalInterest += interest;
      schedule.push({ month, balance: Math.max(0, balance), interest, capital });
    }

    return {
      totalInterest,
      totalCost: loanAmount + totalInterest,
      duration: termMonths,
      monthlyPmt: pmt,
      schedule,
    };
  }, [loanAmount, interestRate, termMonths]);
};
