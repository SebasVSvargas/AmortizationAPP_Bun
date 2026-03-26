import { useMemo } from 'react';
import { useLoanContext } from '../context/LoanContext';
import { CALCULATION } from '../constants';

export const useInvestmentStrategy = (baselineMonthlyPmt) => {
  const { loanAmount, interestRate, termMonths, totalCapacity, investmentROI } = useLoanContext();

  return useMemo(() => {
    const monthlyDebtRate = (interestRate / 100) / 12;
    const monthlyInvRate = (investmentROI / 100) / 12;
    const bankPmt = baselineMonthlyPmt;
    const surplus = Math.max(0, totalCapacity - bankPmt);

    const scenarioData = [];
    let balanceA = loanAmount;
    let investmentA = 0;
    let totalIntA = 0;
    let balanceB = loanAmount;
    let investmentB = 0;
    let totalIntB = 0;
    let debtFreeMonth = termMonths;

    for (let month = 1; month <= termMonths; month += 1) {
      const intA = balanceA * monthlyDebtRate;
      const capA = Math.min(balanceA, bankPmt - intA);
      balanceA -= capA;
      totalIntA += intA;
      investmentA = (investmentA + surplus) * (1 + monthlyInvRate);

      if (balanceB > CALCULATION.BALANCE_THRESHOLD) {
        const intB = balanceB * monthlyDebtRate;
        const capB = Math.min(balanceB, totalCapacity - intB);
        balanceB -= capB;
        totalIntB += intB;
        if (balanceB <= CALCULATION.BALANCE_THRESHOLD) {
          debtFreeMonth = month;
        }
      } else {
        investmentB = (investmentB + totalCapacity) * (1 + monthlyInvRate);
      }

      scenarioData.push({ month, patrimonioA: investmentA, patrimonioB: investmentB });
    }

    return {
      scenarioData,
      totalIntA,
      totalIntB,
      debtFreeMonth,
      finalWealthA: investmentA,
      finalWealthB: investmentB,
      ahorroIntB: totalIntA - totalIntB,
    };
  }, [loanAmount, interestRate, termMonths, totalCapacity, investmentROI, baselineMonthlyPmt]);
};
