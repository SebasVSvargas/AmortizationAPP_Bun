"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Calculator, LogOut, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Calculator className="w-6 h-6 text-indigo-600" />
              <span className="text-xl font-black text-indigo-900">
                Simulador Crédito
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-colors"
              >
                <ArrowLeft size={16} />
                Calculadora
              </Link>

              <Link
                href="/dashboard/scenario/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500 transition-colors"
              >
                <Plus size={16} />
                Nuevo Escenario
              </Link>

              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-700">
                    {session.user?.name || "Usuario"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {session.user?.email}
                  </p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
