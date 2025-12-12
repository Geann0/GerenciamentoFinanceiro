"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => {
    return pathname === path
      ? "bg-primary-600 text-white"
      : "text-gray-700 hover:bg-gray-100";
  };

  if (!session || pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-primary-600">
              💰 Finanças Pro
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                  "/dashboard"
                )}`}
              >
                Painel
              </Link>
              <Link
                href="/transactions"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                  "/transactions"
                )}`}
              >
                Transações
              </Link>
              <Link
                href="/categories"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                  "/categories"
                )}`}
              >
                Categorias
              </Link>
              <Link
                href="/reports"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                  "/reports"
                )}`}
              >
                Relatórios
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
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
      </div>
    </nav>
  );
}
