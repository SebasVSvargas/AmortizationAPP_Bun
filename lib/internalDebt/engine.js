import { AMORTIZATION_METHODS, CALCULATION } from '../constants';

export const MAX_PARTICIPANTS = 3;
export const MIN_PARTICIPANTS = 2;
export const PESO_EPS = 1;

export const PARTICIPANT_PALETTE = [
  { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', accent: 'text-indigo-600', chip: 'bg-indigo-600' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', accent: 'text-emerald-600', chip: 'bg-emerald-600' },
  { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', accent: 'text-amber-700', chip: 'bg-amber-500' },
];

export const roundPeso = (value) => Math.round(Number(value) || 0);

const sumValues = (obj, ids) => ids.reduce((total, id) => total + (Number(obj[id]) || 0), 0);

export const createParticipant = (partial = {}, index = 0) => ({
  id: partial.id || `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: partial.name || `Participante ${index + 1}`,
  sharePercent: Number(partial.sharePercent) || 0,
  capacity: Number(partial.capacity) || 0,
});

export const defaultParticipants = () => [
  createParticipant({ id: 'p1', name: 'Participante 1', sharePercent: 50, capacity: 0 }, 0),
  createParticipant({ id: 'p2', name: 'Participante 2', sharePercent: 50, capacity: 0 }, 1),
];

export const defaultInternalDebtState = () => ({
  enabled: false,
  internalRate: 8,
  settleMonths: 0,
  participants: defaultParticipants(),
  payments: {},
  planPayments: {},
});

export const pairKey = (from, to) => `${from}__${to}`;

export const normalizeParticipant = (raw, index = 0) => createParticipant(raw || {}, index);

export const getMonthPayments = (payments, month) => {
  if (!payments || typeof payments !== 'object') return null;
  const record = payments[month] ?? payments[String(month)];
  if (!record || typeof record !== 'object') return null;
  return record;
};

export const normalizeInternalDebt = (raw) => {
  const fallback = defaultInternalDebtState();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return fallback;
  }

  const participants = Array.isArray(raw.participants) && raw.participants.length > 0
    ? raw.participants.slice(0, MAX_PARTICIPANTS).map((item, index) => normalizeParticipant(item, index))
    : fallback.participants;

  return {
    enabled: Boolean(raw.enabled),
    internalRate: Number.isFinite(Number(raw.internalRate)) ? Number(raw.internalRate) : fallback.internalRate,
    settleMonths: Number.isFinite(Number(raw.settleMonths)) ? Math.max(0, Math.round(Number(raw.settleMonths))) : 0,
    participants,
    payments: raw.payments && typeof raw.payments === 'object' && !Array.isArray(raw.payments)
      ? raw.payments
      : {},
    planPayments: raw.planPayments && typeof raw.planPayments === 'object' && !Array.isArray(raw.planPayments)
      ? raw.planPayments
      : {},
  };
};

export const serializeInternalDebt = ({
  internalDebtEnabled,
  internalRate,
  settleMonths,
  participants,
  participantPayments,
  internalPlanPayments,
}) => ({
  enabled: Boolean(internalDebtEnabled),
  internalRate: Number(internalRate) || 0,
  settleMonths: Number(settleMonths) || 0,
  participants: (participants || []).slice(0, MAX_PARTICIPANTS),
  payments: participantPayments || {},
  planPayments: internalPlanPayments || {},
});

export const shareSum = (participants) =>
  (participants || []).reduce((total, person) => total + Number(person.sharePercent || 0), 0);

export const validateInternalDebtConfig = ({ enabled, internalRate, bankRate, participants }) => {
  const errors = [];
  if (!enabled) return errors;

  const people = participants || [];
  if (people.length < MIN_PARTICIPANTS) {
    errors.push('Se necesitan al menos 2 participantes.');
  }
  if (people.length > MAX_PARTICIPANTS) {
    errors.push('El máximo es 3 participantes.');
  }
  if (Math.abs(shareSum(people) - 100) > 0.05) {
    errors.push('Los porcentajes deben sumar 100%.');
  }
  if (Number(internalRate) < 0) {
    errors.push('La tasa interna no puede ser negativa.');
  }
  if (Number(internalRate) >= Number(bankRate)) {
    errors.push('La tasa interna debe ser menor que la del banco.');
  }
  return errors;
};

export const splitAmount = (total, participants) => {
  const people = participants || [];
  const result = {};
  if (people.length === 0) return result;

  const roundedTotal = roundPeso(total);
  let allocated = 0;
  people.forEach((person, index) => {
    if (index === people.length - 1) {
      result[person.id] = roundedTotal - allocated;
      return;
    }
    const amount = roundPeso(roundedTotal * (Number(person.sharePercent) || 0) / 100);
    result[person.id] = amount;
    allocated += amount;
  });
  return result;
};

export const zeroBalances = (participants) =>
  Object.fromEntries((participants || []).map((person) => [person.id, 0]));

const zeroMap = (ids) => Object.fromEntries(ids.map((id) => [id, 0]));

export const accrueInternalInterest = (balances, monthlyRate, participantIds) => {
  const next = {};
  const accrued = {};
  participantIds.forEach((id) => {
    const opening = roundPeso(balances[id] || 0);
    if (!monthlyRate) {
      next[id] = opening;
      accrued[id] = 0;
      return;
    }
    const grown = roundPeso(opening * (1 + monthlyRate));
    next[id] = grown;
    accrued[id] = grown - opening;
  });

  const drift = participantIds.reduce((total, id) => total + next[id], 0);
  if (drift !== 0 && participantIds.length > 0) {
    let target = participantIds[0];
    participantIds.forEach((id) => {
      if (Math.abs(next[id]) > Math.abs(next[target])) target = id;
    });
    next[target] -= drift;
    accrued[target] = (accrued[target] || 0) - drift;
  }

  return { balances: next, accrued };
};

export const allocateCovering = (surplus, shortfall, participantIds) => {
  const coveredBy = zeroMap(participantIds);
  const coveredFor = zeroMap(participantIds);
  const transfers = [];

  const totalSurplus = sumValues(surplus, participantIds);
  const totalShortfall = sumValues(shortfall, participantIds);
  const covered = Math.min(totalSurplus, totalShortfall);

  if (covered < PESO_EPS || totalSurplus < PESO_EPS || totalShortfall < PESO_EPS) {
    return { transfers, covered: 0, coveredBy, coveredFor };
  }

  const raw = [];
  participantIds.forEach((from) => {
    if ((surplus[from] || 0) <= 0) return;
    participantIds.forEach((to) => {
      if (from === to || (shortfall[to] || 0) <= 0) return;
      const amount = covered * (surplus[from] / totalSurplus) * (shortfall[to] / totalShortfall);
      raw.push({ from, to, amount });
    });
  });

  let allocated = 0;
  raw.forEach((item, index) => {
    const amount = index === raw.length - 1
      ? covered - allocated
      : roundPeso(item.amount);
    if (Math.abs(amount) < PESO_EPS) return;
    transfers.push({ from: item.from, to: item.to, amount });
    coveredBy[item.from] += amount;
    coveredFor[item.to] += amount;
    allocated += amount;
  });

  return { transfers, covered, coveredBy, coveredFor };
};

export const extraIncentive = (delta, participantId, participants) => {
  const amount = Math.max(0, roundPeso(delta));
  const fairShare = splitAmount(amount, participants);
  const ownPrincipal = fairShare[participantId] || 0;
  const others = (participants || [])
    .filter((item) => item.id !== participantId)
    .map((item) => ({
      id: item.id,
      name: item.name,
      amount: fairShare[item.id] || 0,
    }));

  return {
    extra: amount,
    ownPrincipal,
    internalCredit: amount - ownPrincipal,
    others,
  };
};

export const frenchPayment = (principal, monthlyRate, months) => {
  if (months <= 0 || principal <= 0) return 0;
  if (!monthlyRate) return roundPeso(principal / months);
  return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
};

export const pairSettlement = (balances, participants) => {
  const creditors = [];
  const debtors = [];

  (participants || []).forEach((person) => {
    const amount = roundPeso(balances[person.id] || 0);
    if (amount > PESO_EPS) {
      creditors.push({ id: person.id, name: person.name, amount });
    } else if (amount < -PESO_EPS) {
      debtors.push({ id: person.id, name: person.name, amount: -amount });
    }
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transfers = [];
  let i = 0;
  let j = 0;
  while (i < creditors.length && j < debtors.length) {
    const pay = Math.min(creditors[i].amount, debtors[j].amount);
    if (pay >= PESO_EPS) {
      transfers.push({
        from: debtors[j].id,
        fromName: debtors[j].name,
        to: creditors[i].id,
        toName: creditors[i].name,
        amount: pay,
      });
    }
    creditors[i].amount -= pay;
    debtors[j].amount -= pay;
    if (creditors[i].amount < PESO_EPS) i += 1;
    if (debtors[j].amount < PESO_EPS) j += 1;
  }

  return transfers;
};

export const getPlanMonthPayment = (planPayments, key, month) => {
  const pair = planPayments?.[key];
  if (!pair || typeof pair !== 'object') return null;
  const value = pair[month] ?? pair[String(month)];
  if (value === undefined || value === null || value === '') return null;
  return roundPeso(value);
};

const emptyInternalPlan = () => ({ months: 0, pairs: [], byDebtor: [], rows: [] });

export const amortizeInternalPlan = (settlement, monthlyRate, months, planPayments = {}) => {
  if (!months || months <= 0 || !settlement?.length) {
    return emptyInternalPlan();
  }

  const pairs = settlement.map((transfer) => {
    const key = pairKey(transfer.from, transfer.to);
    let balance = transfer.amount;
    const installment = roundPeso(frenchPayment(transfer.amount, monthlyRate, months));
    const rows = [];

    for (let month = 1; month <= months && balance > PESO_EPS; month += 1) {
      const interest = roundPeso(balance * monthlyRate);
      const maxDue = balance + interest;
      const expected = month === months
        ? maxDue
        : Math.min(Math.max(installment, interest), maxDue);

      const recorded = getPlanMonthPayment(planPayments, key, month);
      const projected = recorded === null;
      const payment = Math.min(maxDue, projected ? expected : Math.max(0, recorded));
      const extra = Math.max(0, payment - expected);
      const principal = Math.min(balance, Math.max(0, payment - interest));
      balance = Math.max(0, balance - principal);

      rows.push({
        month,
        from: transfer.from,
        fromName: transfer.fromName,
        to: transfer.to,
        toName: transfer.toName,
        expected,
        payment,
        extra,
        interest,
        principal,
        balance,
        projected,
      });
    }

    return {
      key,
      from: transfer.from,
      fromName: transfer.fromName,
      to: transfer.to,
      toName: transfer.toName,
      originalAmount: transfer.amount,
      installment,
      monthsSaved: Math.max(0, months - rows.length),
      rows,
    };
  });

  const byDebtor = [];
  const indexByFrom = {};
  pairs.forEach((pair) => {
    if (indexByFrom[pair.from] === undefined) {
      indexByFrom[pair.from] = byDebtor.length;
      byDebtor.push({
        from: pair.from,
        fromName: pair.fromName,
        pairs: [],
      });
    }
    byDebtor[indexByFrom[pair.from]].pairs.push(pair);
  });

  return {
    months,
    pairs,
    byDebtor,
    rows: pairs.flatMap((pair) => pair.rows),
  };
};

const frenchBasePayment = (loanAmount, monthlyRate, termMonths) => {
  if (!monthlyRate) return loanAmount / termMonths;
  return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
};

export const computeContractualPmt = ({
  method,
  loanAmount,
  termMonths,
  month,
  balance,
  monthlyRate,
  useCustomInstallment,
  customInstallmentValue,
}) => {
  const interest = balance * monthlyRate;
  let basePmt;
  if (method === AMORTIZATION_METHODS.FRENCH) {
    basePmt = frenchBasePayment(loanAmount, monthlyRate, termMonths);
  } else if (method === AMORTIZATION_METHODS.GERMAN) {
    basePmt = (loanAmount / termMonths) + (loanAmount * monthlyRate);
  } else {
    basePmt = loanAmount * monthlyRate;
  }

  let effectivePmt = basePmt;
  if (useCustomInstallment && customInstallmentValue > basePmt) {
    effectivePmt = customInstallmentValue;
  }

  let currentPmt =
    method === AMORTIZATION_METHODS.GERMAN && !useCustomInstallment
      ? (loanAmount / termMonths) + interest
      : effectivePmt;

  if (method === AMORTIZATION_METHODS.AMERICAN && month === termMonths && !useCustomInstallment) {
    currentPmt = balance + interest;
  }

  currentPmt = Math.max(currentPmt, interest + 1);
  return Math.min(currentPmt, balance + interest);
};

const projectPayments = (participants, obligations) => {
  const payments = {};
  participants.forEach((person) => {
    const capacity = Number(person.capacity) || 0;
    payments[person.id] = capacity > 0 ? roundPeso(capacity) : (obligations[person.id] || 0);
  });
  return payments;
};

export const applyMonthFlows = ({ participants, balances, bankDue, payments }) => {
  const ids = participants.map((person) => person.id);
  const obligations = splitAmount(bankDue, participants);
  const normalizedPayments = {};
  const surplus = zeroMap(ids);
  const shortfall = zeroMap(ids);

  ids.forEach((id) => {
    const paid = roundPeso(payments?.[id] || 0);
    normalizedPayments[id] = paid;
    const obligation = obligations[id] || 0;
    surplus[id] = Math.max(0, paid - obligation);
    shortfall[id] = Math.max(0, obligation - paid);
  });

  const covering = allocateCovering(surplus, shortfall, ids);
  const remainingSurplus = zeroMap(ids);
  const remainingShortfall = zeroMap(ids);

  ids.forEach((id) => {
    remainingSurplus[id] = Math.max(0, (surplus[id] || 0) - (covering.coveredBy[id] || 0));
    remainingShortfall[id] = Math.max(0, (shortfall[id] || 0) - (covering.coveredFor[id] || 0));
  });

  const uncovered = sumValues(remainingShortfall, ids);
  const complete = uncovered < PESO_EPS;

  const balancesAfterCovering = { ...balances };
  covering.transfers.forEach((transfer) => {
    balancesAfterCovering[transfer.from] = (balancesAfterCovering[transfer.from] || 0) + transfer.amount;
    balancesAfterCovering[transfer.to] = (balancesAfterCovering[transfer.to] || 0) - transfer.amount;
  });

  const extraByPerson = complete ? remainingSurplus : zeroMap(ids);
  const totalExtra = sumValues(extraByPerson, ids);

  return {
    obligations,
    payments: normalizedPayments,
    surplus,
    shortfall,
    covering,
    remainingSurplus,
    remainingShortfall,
    uncovered,
    complete,
    extraByPerson,
    totalExtra,
    balancesAfterCovering,
  };
};

const applyExtraAllocations = (balances, extraByPerson, extraApplied, participants) => {
  const ids = participants.map((person) => person.id);
  const next = { ...balances };
  const extraAllocations = zeroMap(ids);
  const extraAppliedByPerson = zeroMap(ids);

  if (extraApplied < PESO_EPS) {
    return { balances: next, extraAllocations, extraAppliedByPerson };
  }

  const totalExtra = sumValues(extraByPerson, ids);
  if (totalExtra < PESO_EPS) {
    return { balances: next, extraAllocations, extraAppliedByPerson };
  }

  const scale = extraApplied / totalExtra;
  let allocated = 0;
  ids.forEach((id, index) => {
    const amount = index === ids.length - 1
      ? extraApplied - allocated
      : roundPeso((extraByPerson[id] || 0) * scale);
    extraAppliedByPerson[id] = amount;
    allocated += amount;
  });

  const fairShare = splitAmount(extraApplied, participants);
  ids.forEach((id) => {
    extraAllocations[id] = (extraAppliedByPerson[id] || 0) - (fairShare[id] || 0);
    next[id] = (next[id] || 0) + extraAllocations[id];
  });

  return { balances: next, extraAllocations, extraAppliedByPerson };
};

export const simulateSharedLoan = ({
  loanAmount,
  interestRate,
  termMonths,
  method,
  useCustomInstallment = false,
  customInstallmentValue = 0,
  participants,
  payments = {},
  internalRate = 0,
  settleMonths = 0,
  planPayments = {},
}) => {
  const people = (participants || []).slice(0, MAX_PARTICIPANTS);
  const ids = people.map((person) => person.id);
  const empty = {
    enabled: people.length >= MIN_PARTICIPANTS,
    bankSchedule: [],
    ledger: [],
    extras: [],
    finalBalances: zeroBalances(people),
    settlement: [],
    internalPlan: emptyInternalPlan(),
    bankPaidOffMonth: 0,
    warnings: [],
    groupCoversQuota: true,
  };

  if (people.length < MIN_PARTICIPANTS) {
    return { ...empty, enabled: false };
  }

  let balance = Number(loanAmount) || 0;
  const bankMonthlyRate = (Number(interestRate) || 0) / 100 / 12;
  const internalMonthlyRate = (Number(internalRate) || 0) / 100 / 12;
  let internalBalances = zeroBalances(people);
  const bankSchedule = [];
  const ledger = [];
  const extras = [];
  const warnings = [];
  let groupCoversQuota = true;
  let totalInterest = 0;

  for (
    let month = 1;
    month <= CALCULATION.MAX_AMORTIZATION_MONTHS && balance > CALCULATION.BALANCE_THRESHOLD;
    month += 1
  ) {
    const interest = balance * bankMonthlyRate;
    const bankDue = computeContractualPmt({
      method,
      loanAmount,
      termMonths,
      month,
      balance,
      monthlyRate: bankMonthlyRate,
      useCustomInstallment,
      customInstallmentValue,
    });

    const { balances: accruedBalances, accrued } = accrueInternalInterest(
      internalBalances,
      internalMonthlyRate,
      ids,
    );
    internalBalances = accruedBalances;

    const obligations = splitAmount(bankDue, people);
    const recorded = getMonthPayments(payments, month);
    const projected = !recorded;
    const monthPayments = recorded
      ? Object.fromEntries(ids.map((id) => [id, roundPeso(recorded[id] || 0)]))
      : projectPayments(people, obligations);

    const flows = applyMonthFlows({
      participants: people,
      balances: internalBalances,
      bankDue,
      payments: monthPayments,
    });

    if (!flows.complete) {
      if (projected) groupCoversQuota = false;
      warnings.push({
        month,
        type: 'incomplete',
        uncovered: flows.uncovered,
        projected,
      });
    }

    const scheduledPrincipal = Math.min(balance, Math.max(0, bankDue - interest));
    const extraApplied = flows.complete
      ? Math.min(flows.totalExtra, Math.max(0, balance - scheduledPrincipal))
      : 0;

    const allocated = applyExtraAllocations(
      flows.balancesAfterCovering,
      flows.extraByPerson,
      extraApplied,
      people,
    );
    internalBalances = allocated.balances;

    const principal = scheduledPrincipal;
    balance = Math.max(0, balance - principal - extraApplied);
    totalInterest += interest;

    const paymentToBank = bankDue + extraApplied;
    bankSchedule.push({
      month,
      payment: paymentToBank,
      principal,
      interest,
      extra: extraApplied,
      balance,
    });

    if (extraApplied > 0) {
      extras.push({
        id: `internal-extra-${month}`,
        month,
        amount: extraApplied,
      });
    }

    ledger.push({
      month,
      projected,
      bankDue: roundPeso(bankDue),
      interest,
      principal,
      extraApplied,
      paymentToBank,
      balanceAfter: balance,
      obligations: flows.obligations,
      payments: flows.payments,
      covering: flows.covering.transfers,
      extraByPerson: allocated.extraAppliedByPerson,
      extraAllocations: allocated.extraAllocations,
      uncovered: flows.uncovered,
      complete: flows.complete,
      interestInternal: accrued,
      balancesOpen: accruedBalances,
      balancesClose: { ...internalBalances },
    });
  }

  const finalBalances = { ...internalBalances };
  const settlement = pairSettlement(finalBalances, people);
  const internalPlan = amortizeInternalPlan(
    settlement,
    internalMonthlyRate,
    Number(settleMonths) > 0 ? Number(settleMonths) : 0,
    planPayments,
  );

  return {
    enabled: true,
    bankSchedule,
    ledger,
    extras,
    finalBalances,
    settlement,
    internalPlan,
    bankPaidOffMonth: bankSchedule.length,
    warnings,
    groupCoversQuota,
    totalInterest,
    duration: bankSchedule.length,
    totalCost: (Number(loanAmount) || 0) + totalInterest,
  };
};
