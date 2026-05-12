"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { useUIContext } from "../lib/context/UIContext";
import AppHeader from "../components/layout/AppHeader";
import SidePanel from "../components/layout/SidePanel";
import Footer from "../components/layout/Footer";
import SummaryTab from "../components/tabs/SummaryTab";
import StrategyTab from "../components/tabs/StrategyTab";
import TableTab from "../components/tabs/TableTab";
import ChartsTab from "../components/tabs/ChartsTab";
import { LoanProvider } from "../lib/context/LoanContext";
import { UIProvider } from "../lib/context/UIContext";
import { CalculationsProvider } from "../lib/context/CalculationsContext";

const AppContent = () => {
  const { activeTab, drawerOpen, setDrawerOpen } = useUIContext();

  useEffect(() => {
    setDrawerOpen(false);
  }, [activeTab, setDrawerOpen]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <AppHeader />

        <div
          className={`grid gap-8 ${
            activeTab === "strategy"
              ? "grid-cols-1"
              : "grid-cols-1 lg:grid-cols-12"
          }`}
        >
          {activeTab !== "strategy" && (
            <SidePanel alwaysVisible={activeTab === "summary"} />
          )}

          <main
            className={
              activeTab === "strategy" ? "col-span-full" : "lg:col-span-8"
            }
          >
            {activeTab === "summary" && <SummaryTab />}
            {activeTab === "strategy" && <StrategyTab />}
            {activeTab === "table" && <TableTab />}
            {activeTab === "charts" && <ChartsTab />}
          </main>
        </div>

        <Footer />
      </div>

      {activeTab !== "strategy" && activeTab !== "summary" && (
        <button
          onClick={() => setDrawerOpen(true)}
          className={`fixed bottom-6 right-6 z-20 lg:hidden inline-flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-sm font-bold shadow-xl transition-all ${
            drawerOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <SlidersHorizontal size={16} />
          Configurar
        </button>
      )}
    </div>
  );
};

function HomeContent() {
  const searchParams = useSearchParams();
  const [scenarioData, setScenarioData] = useState(null);
  const [loadingScenario, setLoadingScenario] = useState(false);

  const scenarioId = searchParams.get("scenarioId");

  useEffect(() => {
    if (!scenarioId) {
      setScenarioData(null);
      return;
    }

    setLoadingScenario(true);
    fetch(`/api/scenarios/${scenarioId}`)
      .then((res) => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
      })
      .then((data) => {
        setScenarioData({
          loanAmount: data.loanAmount,
          interestRate: data.interestRate,
          termMonths: data.termMonths,
          method: data.method,
          customInstallment: data.customInstallment || 0,
          extraPayments: data.extraPayments || [],
        });
      })
      .catch(() => {
        setScenarioData(null);
      })
      .finally(() => {
        setLoadingScenario(false);
      });
  }, [scenarioId]);

  const initialData = useMemo(() => {
    if (scenarioData) return scenarioData;

    const amount = searchParams.get("amount");
    const rate = searchParams.get("rate");
    const term = searchParams.get("term");
    const method = searchParams.get("method");

    if (amount || rate || term || method) {
      return {
        loanAmount: amount ? parseFloat(amount) : undefined,
        interestRate: rate ? parseFloat(rate) : undefined,
        termMonths: term ? parseInt(term) : undefined,
        method: method || undefined,
      };
    }

    return null;
  }, [scenarioData, searchParams]);

  if (loadingScenario) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <UIProvider>
      <LoanProvider initialData={initialData}>
        <CalculationsProvider>
          <AppContent />
        </CalculationsProvider>
      </LoanProvider>
    </UIProvider>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
