import React, { useMemo, useState } from 'react';
import { Users, Plus, Trash2, Handshake, Scale, Wallet, AlertTriangle, CheckCircle2, Info, ChevronDown } from 'lucide-react';
import { useLoanContext } from '../../lib/context/LoanContext';
import { useCalculations } from '../../lib/context/CalculationsContext';
import { formatCurrency } from '../../lib/utils/formatters';
import {
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
  PARTICIPANT_PALETTE,
  extraIncentive,
  shareSum,
} from '../../lib/internalDebt/engine';

const parseMoney = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  return parseInt(String(value).replace(/[^\d-]/g, ''), 10) || 0;
};

const personName = (person, index) => String(person?.name || '').trim() || `Participante ${index + 1}`;

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
      checked ? 'bg-indigo-600' : 'bg-slate-300'
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const ParticipantCard = ({
  person,
  index,
  canRemove,
  onChange,
  onRemove,
}) => {
  const palette = PARTICIPANT_PALETTE[index] || PARTICIPANT_PALETTE[0];

  return (
    <div className={`rounded-2xl border p-5 ${palette.bg} ${palette.border}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${palette.chip}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${palette.accent}`}>
            Integrante {index + 1}
          </span>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(person.id)}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-white/80 rounded-lg"
            title="Quitar participante"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase">Nombre</label>
          <input
            type="text"
            value={person.name}
            onChange={(event) => onChange(person.id, { name: event.target.value })}
            className="mt-1 w-full p-2.5 bg-white border rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">% de la cuota</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={person.sharePercent}
              onChange={(event) => onChange(person.id, { sharePercent: Number(event.target.value) })}
              className="mt-1 w-full p-2.5 bg-white border rounded-xl text-sm font-black outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Capacidad / mes</label>
            <input
              type="text"
              inputMode="numeric"
              value={person.capacity ? Number(person.capacity).toLocaleString('es-CO') : ''}
              onChange={(event) => onChange(person.id, { capacity: parseMoney(event.target.value) })}
              placeholder="Opcional"
              className="mt-1 w-full p-2.5 bg-white border rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ThreePersonExample = ({ interestRate, internalRate }) => (
  <details className="mt-4 rounded-2xl border border-indigo-200 bg-white/70 group">
    <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-3 px-4 py-3 text-sm font-black text-indigo-900">
      <span>Ver un ejemplo con 3 integrantes (partes iguales)</span>
      <ChevronDown className="w-4 h-4 shrink-0 text-indigo-500 transition-transform group-open:rotate-180" />
    </summary>
    <div className="px-4 pb-4 text-sm text-indigo-800 space-y-3 leading-relaxed border-t border-indigo-100 pt-3">
      <p>
        Ana, Bruno y Carla deben <span className="font-black">un tercio cada uno</span> (33,33 %).
        La cuota del banco es {formatCurrency(1_200_000)}: a cada uno le tocan {formatCurrency(400_000)}.
      </p>
      <p>
        Ana pone {formatCurrency(700_000)}. Bruno y Carla ponen sus {formatCurrency(400_000)}.
        El extra de Ana es {formatCurrency(300_000)}.
      </p>
      <p>
        <span className="font-black">Al banco</span> llegan {formatCurrency(1_500_000)}.
        Los {formatCurrency(300_000)} extra bajan el saldo del crédito. Enteros. No se queda nada afuera.
      </p>
      <p>Entre ustedes se anota así, porque el crédito es de los tres:</p>
      <ul className="list-disc list-inside space-y-1.5">
        <li>
          <span className="font-black">{formatCurrency(100_000)}</span> (1/3 del extra) son de Ana:
          estaba pagando más rápido <span className="italic">su</span> pedazo. Sobre esa plata el grupo
          deja de pagar la tasa del banco ({interestRate}% anual).
        </li>
        <li>
          <span className="font-black">{formatCurrency(200_000)}</span> (los otros 2/3) se los prestó a
          Bruno y Carla: {formatCurrency(100_000)} a cada uno, porque el banco también les bajó la deuda
          sin que ellos pusieran esos {formatCurrency(100_000)}. Eso se lo devuelven a Ana al {internalRate}% anual.
        </li>
      </ul>
      <p>
        Al cerrar con el banco, Bruno le debe ~{formatCurrency(100_000)} a Ana y Carla otros
        ~{formatCurrency(100_000)} (más el interés interno). Ana no regaló esa plata; el banco sí se
        cobró los {formatCurrency(300_000)} completos.
      </p>
    </div>
  </details>
);

const IncentiveExplainer = ({ participants, interestRate, internalRate, exampleAmount, onExampleChange }) => (
  <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6 mb-6">
    <h4 className="text-sm font-black text-indigo-900 mb-3">Qué pasa si alguien paga de más</h4>
    <div className="text-sm text-indigo-800 space-y-3 leading-relaxed">
      <p>
        La cuota del banco se parte según el % de cada uno. Si un integrante pone <span className="font-black">más</span> que
        su parte, ese extra no se regala: se parte en dos. El dinero entero sí va al banco.
      </p>
      <ol className="list-decimal list-inside space-y-2">
        <li>
          <span className="font-bold">Su propio pedazo</span> (su % del extra) baja su saldo con el banco.
          Sobre esa plata ya no le cobran la tasa del banco ({interestRate}% anual).
        </li>
        <li>
          <span className="font-bold">El resto se lo está prestando a los otros.</span>
          {' '}Ellos se lo devuelven cuando se acabe el crédito, con la tasa interna ({internalRate}% anual), que es más baja que la del banco.
        </li>
      </ol>
      <p>
        Quien pone de más recupera su plata con un rendimiento. El grupo entero deja de pagar
        la tasa del banco ({interestRate}% anual) sobre <span className="font-black">todo</span> el extra,
        no un recorte de {interestRate}% del abono.
      </p>
    </div>

    <div className="mt-4 pt-4 border-t border-indigo-200">
      <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
        Ejemplo: si alguien pone este extra
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={exampleAmount ? Number(exampleAmount).toLocaleString('es-CO') : ''}
        onChange={(event) => onExampleChange(parseMoney(event.target.value))}
        className="mt-2 w-full max-w-xs p-2.5 bg-white border border-indigo-200 rounded-xl text-sm font-black text-indigo-800 outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {exampleAmount > 0 && (
        <ul className="mt-3 space-y-1.5 text-xs text-indigo-800">
          {participants.map((person, index) => {
            const split = extraIncentive(exampleAmount, person.id, participants);
            return (
              <li key={person.id}>
                <span className="font-black">{personName(person, index)}</span>
                {' '}({person.sharePercent}%): {formatCurrency(split.ownPrincipal)} van a su deuda con el banco
                y {formatCurrency(split.internalCredit)} se los deben los demás al {internalRate}% anual.
              </li>
            );
          })}
        </ul>
      )}
    </div>

    <ThreePersonExample interestRate={interestRate} internalRate={internalRate} />
  </div>
);

const DebtorPlanTable = ({ debtor, paletteIndex, onPaymentChange, onClearMonth }) => {
  const palette = PARTICIPANT_PALETTE[paletteIndex] || PARTICIPANT_PALETTE[0];

  return (
    <div className={`rounded-3xl border ${palette.border} bg-white shadow-sm overflow-hidden`}>
      <div className={`${palette.bg} px-5 py-4 border-b ${palette.border}`}>
        <p className={`text-[10px] font-black uppercase tracking-widest ${palette.accent}`}>Quien debe</p>
        <h4 className={`text-lg font-black ${palette.text}`}>{debtor.fromName}</h4>
        <p className="text-xs text-slate-500 mt-1">
          Cada tabla es lo que {debtor.fromName} le paga a un acreedor. Si un mes pone más que la cuota esperada,
          ese extra baja el saldo más rápido.
        </p>
      </div>

      <div className="divide-y">
        {debtor.pairs.map((pair) => (
          <div key={pair.key} className="p-5">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-black text-slate-800">
                  {pair.fromName} le paga a {pair.toName}
                </p>
                <p className="text-xs text-slate-400">
                  Deuda inicial {formatCurrency(pair.originalAmount)} · Cuota esperada {formatCurrency(pair.installment)}
                  {pair.monthsSaved > 0 ? ` · Se acorta ${pair.monthsSaved} mes(es)` : ''}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-slate-400">
                    <th className="text-left p-2">Mes</th>
                    <th className="text-right p-2">Cuota esperada</th>
                    <th className="text-right p-2">Pagado</th>
                    <th className="text-right p-2">Extra</th>
                    <th className="text-right p-2">Interés</th>
                    <th className="text-right p-2">Saldo</th>
                    <th className="p-2" />
                  </tr>
                </thead>
                <tbody>
                  {pair.rows.map((row) => (
                    <tr key={row.month} className={`border-t ${row.projected ? 'bg-white' : 'bg-indigo-50/40'}`}>
                      <td className="p-2 font-bold">{row.month}</td>
                      <td className="p-2 text-right text-slate-500">{formatCurrency(row.expected)}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={Number(row.payment || 0).toLocaleString('es-CO')}
                          onChange={(event) => onPaymentChange(pair.key, row.month, parseMoney(event.target.value))}
                          className={`w-28 ml-auto block p-2 rounded-lg border text-right text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 ${
                            row.projected ? 'bg-slate-50 text-slate-500' : 'bg-white text-indigo-800'
                          }`}
                        />
                      </td>
                      <td className="p-2 text-right font-black text-emerald-600">
                        {row.extra > 0 ? formatCurrency(row.extra) : '—'}
                      </td>
                      <td className="p-2 text-right">{formatCurrency(row.interest)}</td>
                      <td className="p-2 text-right font-bold">{formatCurrency(row.balance)}</td>
                      <td className="p-2 whitespace-nowrap">
                        {!row.projected && (
                          <button
                            type="button"
                            onClick={() => onClearMonth(pair.key, row.month)}
                            className="text-[10px] font-bold text-slate-400 hover:underline"
                          >
                            Usar cuota
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InternalDebtTab = () => {
  const {
    interestRate,
    internalDebtEnabled, setInternalDebtEnabled,
    internalRate, setInternalRate,
    settleMonths, setSettleMonths,
    participants,
    addParticipant, removeParticipant, updateParticipant, splitSharesEvenly,
    setParticipantPayment, setMonthPayments, clearMonthPayments, fillMonthsWithValues,
    setInternalPlanPayment, clearInternalPlanMonth,
  } = useLoanContext();
  const { internalDebt, baseline, optDuration, interestSaved } = useCalculations();
  const [incentiveAmount, setIncentiveAmount] = useState(100000);

  const percentTotal = shareSum(participants);
  const { configErrors = [], ledger = [], settlement = [], internalPlan, warnings = [], groupCoversQuota } = internalDebt || {};
  const canSimulate = internalDebtEnabled && configErrors.length === 0;

  const latestBalances = useMemo(() => {
    const last = ledger[ledger.length - 1];
    return last?.balancesClose || {};
  }, [ledger]);

  const incompleteCount = warnings.filter((item) => !item.projected).length;
  const nameOf = (id) => {
    const index = participants.findIndex((person) => person.id === id);
    return personName(participants[index], Math.max(0, index));
  };

  const fillMonth = (row, mode) => {
    const payments = {};
    participants.forEach((person) => {
      if (mode === 'capacity' && Number(person.capacity) > 0) {
        payments[person.id] = Number(person.capacity);
      } else {
        payments[person.id] = row.obligations[person.id] || 0;
      }
    });
    setMonthPayments(row.month, payments);
  };

  const fillEmptyMonths = (mode) => {
    const next = {};
    ledger.forEach((row) => {
      if (!row.projected) return;
      const payments = {};
      participants.forEach((person) => {
        if (mode === 'capacity' && Number(person.capacity) > 0) {
          payments[person.id] = Number(person.capacity);
        } else {
          payments[person.id] = row.obligations[person.id] || 0;
        }
      });
      next[row.month] = payments;
    });
    fillMonthsWithValues(next);
  };

  const handlePaymentChange = (row, participantId, value) => {
    setParticipantPayment(row.month, participantId, parseMoney(value), row.payments);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <section className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black text-indigo-900 mb-2 flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-500" /> Deuda interna
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Parte la cuota entre hasta 3 personas. Quien cubra a otro o abone de más genera un crédito interno
              a una tasa menor que la del banco. Al cerrar el crédito, se liquida quién le debe a quién.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 border rounded-2xl px-4 py-3">
            <span className="text-xs font-black uppercase text-slate-500">Activar módulo</span>
            <Toggle checked={internalDebtEnabled} onChange={setInternalDebtEnabled} />
          </div>
        </div>

        {internalDebtEnabled && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400">Tasa interna (% anual)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={internalRate}
                onChange={(event) => setInternalRate(Number(event.target.value))}
                className="mt-1 w-full p-3 bg-slate-50 border rounded-xl font-black text-indigo-700 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Debe ser menor al {interestRate}% del banco.</p>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400">Cuotas internas al cierre</label>
              <input
                type="number"
                min="0"
                step="1"
                value={settleMonths}
                onChange={(event) => setSettleMonths(Math.max(0, parseInt(event.target.value, 10) || 0))}
                className="mt-1 w-full p-3 bg-slate-50 border rounded-xl font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">0 = solo liquidación en un pago. Si pones un plazo, se arma el plan de cuotas.</p>
            </div>
          </div>
        )}
      </section>

      {!internalDebtEnabled && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 text-indigo-800">
          <p className="font-bold mb-2">¿Cómo se incentiva el abono extra?</p>
          <p className="text-sm leading-relaxed text-indigo-700">
            La parte extra que beneficia a los demás no se regala: queda como deuda interna al {internalRate || 8}%.
            Quien pone de más recupera su plata con rendimiento, y el grupo ahorra la diferencia frente a la tasa del banco.
          </p>
        </div>
      )}

      {internalDebtEnabled && (
        <>
          <section>
            <IncentiveExplainer
              participants={participants}
              interestRate={interestRate}
              internalRate={internalRate}
              exampleAmount={incentiveAmount}
              onExampleChange={setIncentiveAmount}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Participantes</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={splitSharesEvenly}
                  className="px-3 py-2 text-xs font-bold rounded-xl border bg-white hover:bg-slate-50"
                >
                  Repartir % igual
                </button>
                <button
                  type="button"
                  onClick={addParticipant}
                  disabled={participants.length >= MAX_PARTICIPANTS}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
            </div>

            <div className={`grid grid-cols-1 ${participants.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4`}>
              {participants.map((person, index) => (
                <ParticipantCard
                  key={person.id}
                  person={person}
                  index={index}
                  canRemove={participants.length > MIN_PARTICIPANTS}
                  onChange={updateParticipant}
                  onRemove={removeParticipant}
                />
              ))}
            </div>
            <p className={`mt-3 text-xs font-bold ${Math.abs(percentTotal - 100) < 0.05 ? 'text-slate-400' : 'text-rose-600'}`}>
              Los porcentajes suman {percentTotal.toFixed(2)}%. Deben dar 100%.
            </p>
          </section>

          {configErrors.length > 0 && (
            <div className="flex gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <ul className="text-sm space-y-1">
                {configErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {canSimulate && (
            <>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {participants.map((person, index) => {
                  const palette = PARTICIPANT_PALETTE[index] || PARTICIPANT_PALETTE[0];
                  const balance = latestBalances[person.id] || 0;
                  const creditor = balance > 1;
                  return (
                    <div key={person.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                      <p className={`text-[10px] font-black uppercase tracking-widest ${palette.accent}`}>
                        {personName(person, index)}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 mb-4">
                        {creditor ? 'El grupo le debe' : balance < -1 ? 'Le debe al grupo' : 'Cuentas a paz y salvo'}
                      </p>
                      <p className={`text-3xl font-black ${creditor ? 'text-emerald-600' : balance < -1 ? 'text-rose-600' : 'text-slate-500'}`}>
                        {formatCurrency(Math.abs(balance))}
                      </p>
                    </div>
                  );
                })}
              </section>

              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-900 text-white rounded-3xl p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Crédito con el banco</p>
                  <p className="text-3xl font-black mt-3">{optDuration} meses</p>
                  <p className="text-sm text-indigo-200 mt-1">Plazo original: {baseline.duration} meses</p>
                </div>
                <div className="bg-emerald-600 text-white rounded-3xl p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Intereses de banco ahorrados</p>
                  <p className="text-3xl font-black mt-3">{formatCurrency(Math.max(0, interestSaved))}</p>
                </div>
                <div className={`rounded-3xl p-6 border ${groupCoversQuota ? 'bg-white border-slate-200' : 'bg-amber-50 border-amber-200'}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Capacidad del grupo</p>
                  <p className={`text-lg font-black mt-3 ${groupCoversQuota ? 'text-slate-800' : 'text-amber-800'}`}>
                    {groupCoversQuota ? 'Cubre la cuota (y puede abonar)' : 'No cubre la cuota proyectada'}
                  </p>
                  {incompleteCount > 0 && (
                    <p className="text-xs text-rose-600 mt-2">{incompleteCount} mes(es) registrados quedan incompletos.</p>
                  )}
                </div>
              </section>

              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <Wallet className="w-4 h-4" /> Control mes a mes
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Los meses en gris son proyección (capacidad o cuota). Al editar un valor, ese mes queda registrado.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fillEmptyMonths('obligation')}
                      className="px-3 py-2 text-xs font-bold rounded-xl border bg-slate-50 hover:bg-slate-100"
                    >
                      Vacíos con cuota
                    </button>
                    <button
                      type="button"
                      onClick={() => fillEmptyMonths('capacity')}
                      className="px-3 py-2 text-xs font-bold rounded-xl border bg-slate-50 hover:bg-slate-100"
                    >
                      Vacíos con capacidad
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[32rem]">
                  <table className="min-w-full text-sm">
                    <thead className="sticky top-0 bg-slate-50 z-10">
                      <tr className="text-[10px] uppercase tracking-widest text-slate-400">
                        <th className="text-left p-3">Mes</th>
                        <th className="text-right p-3">Cuota banco</th>
                        {participants.map((person, index) => (
                          <th key={person.id} className="text-right p-3">{personName(person, index)}</th>
                        ))}
                        <th className="text-right p-3">Extra</th>
                        <th className="text-left p-3">Estado</th>
                        <th className="p-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {ledger.map((row) => (
                        <tr key={row.month} className={`border-t ${row.projected ? 'bg-white' : 'bg-indigo-50/40'}`}>
                          <td className="p-3 font-black text-slate-700">{row.month}</td>
                          <td className="p-3 text-right font-bold text-slate-600">{formatCurrency(row.bankDue)}</td>
                          {participants.map((person) => (
                            <td key={person.id} className="p-2">
                              <input
                                type="text"
                                inputMode="numeric"
                                value={Number(row.payments[person.id] || 0).toLocaleString('es-CO')}
                                onChange={(event) => handlePaymentChange(row, person.id, event.target.value)}
                                className={`w-28 ml-auto block p-2 rounded-lg border text-right text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 ${
                                  row.projected ? 'bg-slate-50 text-slate-400' : 'bg-white text-indigo-800'
                                }`}
                              />
                              <p className="text-[10px] text-right text-slate-400 mt-0.5">
                                cuota {formatCurrency(row.obligations[person.id] || 0)}
                              </p>
                            </td>
                          ))}
                          <td className="p-3 text-right font-black text-emerald-600">{formatCurrency(row.extraApplied)}</td>
                          <td className="p-3">
                            {row.complete ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" /> {row.projected ? 'Proyección' : 'Completo'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
                                <AlertTriangle className="w-3.5 h-3.5" /> Faltan {formatCurrency(row.uncovered)}
                              </span>
                            )}
                            {row.covering?.length > 0 && (
                              <p className="text-[10px] text-slate-500 mt-1">
                                {row.covering.map((item) => `${nameOf(item.from)} cubrió ${formatCurrency(item.amount)} de ${nameOf(item.to)}`).join(' · ')}
                              </p>
                            )}
                            {row.extraApplied > 0 && (
                              <p className="text-[10px] text-emerald-700 mt-1">
                                Extra interno:{' '}
                                {participants.map((person) => {
                                  const delta = row.extraAllocations?.[person.id] || 0;
                                  const sign = delta > 0 ? '+' : '';
                                  return `${nameOf(person.id)} ${sign}${formatCurrency(delta)}`;
                                }).join(' · ')}
                              </p>
                            )}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                onClick={() => fillMonth(row, 'obligation')}
                                className="text-[10px] font-bold text-indigo-600 hover:underline"
                              >
                                Usar cuota
                              </button>
                              <button
                                type="button"
                                onClick={() => fillMonth(row, 'capacity')}
                                className="text-[10px] font-bold text-emerald-600 hover:underline"
                              >
                                Usar capacidad
                              </button>
                              {!row.projected && (
                                <button
                                  type="button"
                                  onClick={() => clearMonthPayments(row.month)}
                                  className="text-[10px] font-bold text-slate-400 hover:underline"
                                >
                                  Volver a proyectar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-4">
                    <Scale className="w-4 h-4" /> Liquidación al cierre del banco
                  </h3>
                  {settlement.length === 0 ? (
                    <p className="text-sm text-slate-500">No hay deuda interna pendiente entre participantes.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {settlement.map((item) => (
                        <div key={`${item.from}-${item.to}`} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border">
                          <div>
                            <p className="text-sm font-black text-slate-800">
                              {item.fromName} le paga a {item.toName}
                            </p>
                            <p className="text-xs text-slate-400">Pago único para dejar cuentas en cero</p>
                          </div>
                          <p className="text-lg font-black text-indigo-700">{formatCurrency(item.amount)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-4">
                    <Handshake className="w-4 h-4" /> Plan de cuotas internas
                  </h3>
                  {settleMonths <= 0 ? (
                    <div className="flex gap-2 text-sm text-slate-500 bg-white rounded-3xl border border-slate-200 p-6">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      Pon un plazo mayor a 0 para convertir la liquidación en cuotas al {internalRate}% anual.
                    </div>
                  ) : settlement.length === 0 ? (
                    <p className="text-sm text-slate-500 bg-white rounded-3xl border border-slate-200 p-6">
                      No hay saldos internos para cuotificar.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {(internalPlan?.byDebtor || []).map((debtor) => {
                        const paletteIndex = Math.max(0, participants.findIndex((person) => person.id === debtor.from));
                        return (
                          <DebtorPlanTable
                            key={debtor.from}
                            debtor={debtor}
                            paletteIndex={paletteIndex}
                            onPaymentChange={setInternalPlanPayment}
                            onClearMonth={clearInternalPlanMonth}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default InternalDebtTab;
