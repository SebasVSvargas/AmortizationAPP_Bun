import { useMemo } from 'react';
import { useLoanContext } from '../context/LoanContext';
import { AMORTIZATION_METHODS, CALCULATION } from '../constants';

export const useOptimizedAmortization = (baseline) => {
  const {
    loanAmount, interestRate, termMonths, method,
    extraPayments, useCustomInstallment, customInstallmentValue,
  } = useLoanContext();

  const amortization = useMemo(() => {
    const schedule = [];
    let balance = loanAmount;
    const monthlyRate = (interestRate / 100) / 12;
    let totalInterest = 0;
    const activeExtras = [...extraPayments].sort((a, b) => a.month - b.month);

    let pmt;
    if (method === AMORTIZATION_METHODS.FRENCH) {
      pmt = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    } else if (method === AMORTIZATION_METHODS.GERMAN) {
      pmt = (loanAmount / termMonths) + (balance * monthlyRate);
    } else {
      pmt = balance * monthlyRate;
    }

    let effectivePmt = pmt;
    if (useCustomInstallment && customInstallmentValue > pmt) {
      effectivePmt = customInstallmentValue;
    }

    for (let month = 1; month <= CALCULATION.MAX_AMORTIZATION_MONTHS && balance > CALCULATION.BALANCE_THRESHOLD; month += 1) {
      const interest = balance * monthlyRate;
      let currentPmt =
        method === AMORTIZATION_METHODS.GERMAN && !useCustomInstallment
          ? (loanAmount / termMonths) + interest
          : effectivePmt;

      if (method === AMORTIZATION_METHODS.AMERICAN && month === termMonths && !useCustomInstallment) {
        currentPmt = balance + interest;
      }

      currentPmt = Math.max(currentPmt, interest + 1);
      const capital = Math.min(balance, currentPmt - interest);

      const extra = activeExtras.find((item) => item.month === month);
      const extraValue = extra ? Math.min(extra.amount, balance - capital) : 0;

      balance -= capital + extraValue;
      totalInterest += interest;

      schedule.push({
        month,
        payment: currentPmt + extraValue,
        principal: capital,
        interest,
        extra: extraValue,
        balance: Math.max(0, balance),
      });
    }

    return {
      schedule,
      totalInterest,
      totalCost: loanAmount + totalInterest,
      duration: schedule.length,
    };
  }, [loanAmount, interestRate, termMonths, extraPayments, useCustomInstallment, customInstallmentValue, method]);

  const { schedule: optSchedule, totalInterest: optInterest, totalCost: optCost, duration: optDuration } = amortization;

  const comparisonData = useMemo(() => {
    const maxMonths = Math.max(baseline.duration, optDuration);
    const combined = new Array(maxMonths);

    for (let i = 0; i < maxMonths; i += 1) {
      combined[i] = {
        month: i + 1,
        balanceOriginal: baseline.schedule[i]?.balance ?? 0,
        balanceOptimized: optSchedule[i]?.balance ?? 0,
      };
    }

    return combined;
  }, [baseline, optSchedule, optDuration]);

  const interestSaved = baseline.totalInterest - optInterest;
  const monthsSaved = baseline.duration - optDuration;
  const firstInstallment = optSchedule[0]?.payment || 0;

  return {
    optSchedule,
    optInterest,
    optCost,
    optDuration,
    comparisonData,
    interestSaved,
    monthsSaved,
    firstInstallment,
  };
};
