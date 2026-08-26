import React, { createContext, useContext, useState } from 'react';
import { LOAN_DEFAULTS } from '../constants';
import {
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
  createParticipant,
  defaultParticipants,
  normalizeInternalDebt,
  serializeInternalDebt,
} from '../internalDebt/engine';

const LoanContext = createContext(null);

export const LoanProvider = ({ children, initialData = null }) => {
  const initialInternal = normalizeInternalDebt(initialData?.internalDebt);

  const [scenarioName, setScenarioName] = useState(
    initialData?.name || ""
  );
  const [loanAmount, setLoanAmount] = useState(
    initialData?.loanAmount || LOAN_DEFAULTS.AMOUNT
  );
  const [interestRate, setInterestRate] = useState(
    initialData?.interestRate || LOAN_DEFAULTS.INTEREST_RATE
  );
  const [termMonths, setTermMonths] = useState(
    initialData?.termMonths || LOAN_DEFAULTS.TERM_MONTHS
  );
  const [method] = useState(
    initialData?.method || LOAN_DEFAULTS.METHOD
  );
  const [userSalary] = useState(LOAN_DEFAULTS.SALARY);
  const [debtRatio] = useState(LOAN_DEFAULTS.DEBT_RATIO);

  const [totalCapacity, setTotalCapacity] = useState(LOAN_DEFAULTS.TOTAL_CAPACITY);
  const [investmentROI, setInvestmentROI] = useState(LOAN_DEFAULTS.INVESTMENT_ROI);

  const [useCustomInstallment, setUseCustomInstallment] = useState(
    (initialData?.customInstallment || 0) > 0
  );
  const [customInstallmentValue, setCustomInstallmentValue] = useState(
    initialData?.customInstallment || 0
  );
  const [extraPayments, setExtraPayments] = useState(
    initialData?.extraPayments || []
  );
  const [newExtraMonth, setNewExtraMonth] = useState(1);
  const [newExtraAmount, setNewExtraAmount] = useState(0);

  const [internalDebtEnabled, setInternalDebtEnabledState] = useState(initialInternal.enabled);
  const [internalRate, setInternalRate] = useState(initialInternal.internalRate);
  const [settleMonths, setSettleMonths] = useState(initialInternal.settleMonths);
  const [participants, setParticipants] = useState(initialInternal.participants);
  const [participantPayments, setParticipantPayments] = useState(initialInternal.payments);
  const [internalPlanPayments, setInternalPlanPayments] = useState(initialInternal.planPayments || {});

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

  const setInternalDebtEnabled = (value) => {
    const enabled = Boolean(value);
    setInternalDebtEnabledState(enabled);
    setParticipants((prev) => (prev.length >= MIN_PARTICIPANTS ? prev : defaultParticipants()));
  };

  const addParticipant = () => {
    setParticipants((prev) => {
      if (prev.length >= MAX_PARTICIPANTS) return prev;
      const next = [
        ...prev,
        createParticipant({ sharePercent: 0, capacity: 0 }, prev.length),
      ];
      const even = Math.floor((100 / next.length) * 100) / 100;
      return next.map((person, index) => ({
        ...person,
        sharePercent: index === next.length - 1 ? 100 - even * (next.length - 1) : even,
      }));
    });
  };

  const removeParticipant = (id) => {
    setParticipants((prev) => {
      if (prev.length <= MIN_PARTICIPANTS) return prev;
      const removed = prev.find((person) => person.id === id);
      const next = prev.filter((person) => person.id !== id);
      const bonus = (Number(removed?.sharePercent) || 0) / next.length;
      const withBonus = next.map((person) => ({
        ...person,
        sharePercent: Number(person.sharePercent || 0) + bonus,
      }));
      const allocated = withBonus.slice(0, -1).reduce((total, person) => total + person.sharePercent, 0);
      withBonus[withBonus.length - 1] = {
        ...withBonus[withBonus.length - 1],
        sharePercent: 100 - allocated,
      };
      return withBonus;
    });
    setParticipantPayments((prev) => {
      const next = {};
      Object.entries(prev || {}).forEach(([month, payments]) => {
        if (!payments || typeof payments !== 'object') return;
        const rest = { ...payments };
        delete rest[id];
        next[month] = rest;
      });
      return next;
    });
    setInternalPlanPayments((prev) => {
      const next = {};
      Object.entries(prev || {}).forEach(([key, months]) => {
        if (String(key).split('__').includes(id)) return;
        next[key] = months;
      });
      return next;
    });
  };

  const updateParticipant = (id, patch) => {
    setParticipants((prev) =>
      prev.map((person) => (person.id === id ? { ...person, ...patch } : person))
    );
  };

  const splitSharesEvenly = () => {
    setParticipants((prev) => {
      if (prev.length === 0) return prev;
      const even = Math.floor((100 / prev.length) * 100) / 100;
      return prev.map((person, index) => ({
        ...person,
        sharePercent: index === prev.length - 1 ? 100 - even * (prev.length - 1) : even,
      }));
    });
  };

  const setParticipantPayment = (month, participantId, amount, seed = null) => {
    setParticipantPayments((prev) => {
      const current = prev[month] || prev[String(month)] || seed || {};
      return {
        ...prev,
        [month]: {
          ...current,
          [participantId]: Number(amount) || 0,
        },
      };
    });
  };

  const setMonthPayments = (month, payments) => {
    setParticipantPayments((prev) => ({
      ...prev,
      [month]: { ...payments },
    }));
  };

  const clearMonthPayments = (month) => {
    setParticipantPayments((prev) => {
      const next = { ...prev };
      delete next[month];
      delete next[String(month)];
      return next;
    });
  };

  const fillMonthsWithValues = (monthsMap) => {
    setParticipantPayments((prev) => ({
      ...prev,
      ...monthsMap,
    }));
  };

  const setInternalPlanPayment = (key, month, amount) => {
    setInternalPlanPayments((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [month]: Number(amount) || 0,
      },
    }));
  };

  const clearInternalPlanMonth = (key, month) => {
    setInternalPlanPayments((prev) => {
      const pair = { ...(prev[key] || {}) };
      delete pair[month];
      delete pair[String(month)];
      const next = { ...prev };
      if (Object.keys(pair).length === 0) {
        delete next[key];
      } else {
        next[key] = pair;
      }
      return next;
    });
  };

  const getInternalDebtPayload = () =>
    serializeInternalDebt({
      internalDebtEnabled,
      internalRate,
      settleMonths,
      participants,
      participantPayments,
      internalPlanPayments,
    });

  return (
    <LoanContext.Provider
      value={{
        scenarioName, setScenarioName,
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
        internalDebtEnabled, setInternalDebtEnabled,
        internalRate, setInternalRate,
        settleMonths, setSettleMonths,
        participants, setParticipants,
        participantPayments,
        addParticipant,
        removeParticipant,
        updateParticipant,
        splitSharesEvenly,
        setParticipantPayment,
        setMonthPayments,
        clearMonthPayments,
        fillMonthsWithValues,
        internalPlanPayments,
        setInternalPlanPayment,
        clearInternalPlanMonth,
        getInternalDebtPayload,
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
