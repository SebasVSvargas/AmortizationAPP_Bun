import React, { useState } from 'react';
import { Calculator, LogIn, UserPlus, FolderOpen, LogOut, User, Save, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useUIContext } from '../../lib/context/UIContext';
import { useLoanContext } from '../../lib/context/LoanContext';
import { TABS } from '../../lib/constants';

const SaveModal = ({ isOpen, onClose, loanData }) => {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Ingresa un nombre para el escenario');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          loanAmount: loanData.loanAmount,
          interestRate: loanData.interestRate,
          termMonths: loanData.termMonths,
          method: loanData.method,
          customInstallment: loanData.useCustomInstallment ? loanData.customInstallmentValue : 0,
          extraPayments: loanData.extraPayments || [],
          internalDebt: loanData.getInternalDebtPayload?.() || {},
        }),
      });

      if (res.ok) {
        setName('');
        onClose(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Error al guardar');
      }
    } catch {
      setError('Error al guardar el escenario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-800">Guardar Escenario</h2>
          <button onClick={() => onClose(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-slate-500 mb-4">
          Guarda los valores actuales de la calculadora como un escenario nuevo.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-500 mb-1">Nombre del escenario</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: Mi préstamo de carro"
            autoFocus
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AppHeader = () => {
  const { activeTab, setActiveTab } = useUIContext();
  const { data: session, status } = useSession();
  const loanData = useLoanContext();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleModalClose = (saved) => {
    setShowSaveModal(false);
    if (saved) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <>
      <header className="mb-2">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex-shrink-0">
            <h1 className="text-2xl md:text-3xl font-black text-indigo-900 flex items-center gap-2">
              <Calculator className="text-indigo-600" size={28} />
              Amortízate
            </h1>
            <p className="text-slate-500 text-xs md:text-sm">Optimización de deuda y gestión patrimonial</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {status === "loading" && (
              <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
            )}

            {status === "authenticated" && session?.user && (
              <>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs md:text-sm font-bold shadow-sm transition-all"
                >
                  <Save size={16} />
                  <span className="hidden sm:inline">Guardar Escenario</span>
                </button>

                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-600 animate-pulse">
                    Guardado
                  </span>
                )}

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-bold shadow-sm transition-all"
                >
                  <FolderOpen size={16} />
                  <span className="hidden sm:inline">Mis Escenarios</span>
                </Link>

                <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm">
                  <User size={14} className="text-slate-400" />
                  <span className="text-slate-700 font-medium truncate max-w-[120px]">
                    {session.user.name || session.user.email}
                  </span>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  title="Cerrar Sesión"
                >
                  <LogOut size={18} />
                </button>
              </>
            )}

            {status === "unauthenticated" && (
              <>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs md:text-sm font-bold shadow-sm transition-all"
                >
                  <LogIn size={16} />
                  <span className="hidden sm:inline">Iniciar Sesión</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-bold shadow-sm transition-all"
                >
                  <UserPlus size={16} />
                  <span className="hidden sm:inline">Registrarse</span>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-2 flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === key ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <SaveModal
        isOpen={showSaveModal}
        onClose={handleModalClose}
        loanData={loanData}
      />
    </>
  );
};

export default AppHeader;
