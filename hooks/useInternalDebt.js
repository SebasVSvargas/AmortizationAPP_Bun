import { useMemo } from 'react';
import { useLoanContext } from '../lib/context/LoanContext';
import {
  simulateSharedLoan,
  validateInternalDebtConfig,
  extraIncentive,
  MIN_PARTICIPANTS,
} from '../lib/internalDebt/engine';

export const useInternalDebt = () => {
  const {
    loanAmount,
    interestRate,
    termMonths,
    method,
    useCustomInstallment,
    customInstallmentValue,
    internalDebtEnabled,
    internalRate,
    settleMonths,
    participants,
    participantPayments,
    internalPlanPayments,
  } = useLoanContext();

  const configErrors = useMemo(
    () =>
      validateInternalDebtConfig({
        enabled: internalDebtEnabled,
        internalRate,
        bankRate: interestRate,
        participants,
      }),
    [internalDebtEnabled, internalRate, interestRate, participants],
  );

  const simulation = useMemo(() => {
    const canRun =
      internalDebtEnabled &&
      (participants || []).length >= MIN_PARTICIPANTS &&
      configErrors.length === 0;

    if (!canRun) {
      return {
        enabled: false,
        bankSchedule: null,
        ledger: [],
        extras: [],
        finalBalances: {},
        settlement: [],
        internalPlan: { months: 0, pairs: [], byDebtor: [], rows: [] },
        bankPaidOffMonth: 0,
        warnings: [],
        groupCoversQuota: true,
        totalInterest: 0,
        duration: 0,
        totalCost: 0,
      };
    }

    return simulateSharedLoan({
      loanAmount,
      interestRate,
      termMonths,
      method,
      useCustomInstallment,
      customInstallmentValue,
      participants,
      payments: participantPayments,
      internalRate,
      settleMonths,
      planPayments: internalPlanPayments,
    });
  }, [
    internalDebtEnabled,
    participants,
    configErrors,
    loanAmount,
    interestRate,
    termMonths,
    method,
    useCustomInstallment,
    customInstallmentValue,
    participantPayments,
    internalRate,
    settleMonths,
    internalPlanPayments,
  ]);

  const nameById = useMemo(
    () => Object.fromEntries((participants || []).map((person) => [person.id, person.name])),
    [participants],
  );

  return {
    ...simulation,
    enabled: Boolean(internalDebtEnabled && simulation.enabled && configErrors.length === 0),
    configErrors,
    extraIncentive: (participantId, delta) => extraIncentive(delta, participantId, participants),
    nameById,
  };
};
