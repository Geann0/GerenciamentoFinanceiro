"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path
      ? "bg-primary-600 text-white"
      : "text-gray-700 hover:bg-gray-100";
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (!session || pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Nome */}
          <Link href="/dashboard" className="text-xl font-bold text-primary-600 flex items-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Finanças Pro</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/dashboard")}`}
            >
              Painel
            </Link>
            <Link
              href="/transactions"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/transactions")}`}
            >
              Transações
            </Link>
            <Link
              href="/categories"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/categories")}`}
            >
              Categorias
            </Link>
            <Link
              href="/reports"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/reports")}`}
            >
              Relatórios
            </Link>
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
              <span className="text-sm text-gray-700 max-w-[150px] truncate">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="px-4 py-2 text-sm font-medium text-white bg-danger-600 rounded-md hover:bg-danger-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>

          {/* Botão Menu Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/dashboard")}`}
              >
                Painel
              </Link>
              <Link
                href="/transactions"
                onClick={closeMobileMenu}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/transactions")}`}
              >
                Transações
              </Link>
              <Link
                href="/categories"
                onClick={closeMobileMenu}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/categories")}`}
              >
                Categorias
              </Link>
              <Link
                href="/reports"
                onClick={closeMobileMenu}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/reports")}`}
              >
                Relatórios
              </Link>
              <div className="pt-4 mt-2 border-t border-gray-200">
                <div className="px-3 py-2 text-sm text-gray-700 font-medium">
                  {session.user?.name || session.user?.email}
                </div>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    signOut({ callbackUrl: "/auth/login" });
                  }}
                  className="w-full mt-2 px-3 py-2 text-sm font-medium text-white bg-danger-600 rounded-md hover:bg-danger-700 transition-colors text-left"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
