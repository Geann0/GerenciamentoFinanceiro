"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MonthlyChart, CategoryChart } from "@/components/charts/Charts";
import { useState } from "react";
import { TransactionForm } from "@/components/transactions/TransactionForm";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const { data: statistics, isLoading: statsLoading } = useQuery(
    "statistics",
    async () => {
      const response = await fetch("/api/transactions/statistics");
      return response.json();
    }
  );

  const { data: categories } = useQuery("categories", async () => {
    const response = await fetch("/api/categories?all=true");
    return response.json();
  });

  const { data: transactions } = useQuery("transactions", async () => {
    const response = await fetch("/api/transactions?limit=10");
    return response.json();
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Bem-vindo, {session?.user?.name}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Aqui está sua visão financeira</p>
        </div>

        {/* Transaction Form Modal */}
        {showTransactionForm && categories && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h4 className="text-xl font-semibold text-gray-900">Nova Transação</h4>
                <button
                  onClick={() => setShowTransactionForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <TransactionForm
                  categories={categories}
                  onSuccess={() => setShowTransactionForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Balance Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white">
            <h3 className="text-base sm:text-lg font-medium mb-2">Receitas Totais</h3>
            <p className="text-2xl sm:text-3xl font-bold" data-testid="total-income">
              R$ {statistics?.balance?.totalIncome?.toFixed(2) || "0.00"}
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-danger-500 to-danger-600 text-white">
            <h3 className="text-base sm:text-lg font-medium mb-2">Despesas Totais</h3>
            <p className="text-2xl sm:text-3xl font-bold" data-testid="total-expense">
              R$ {statistics?.balance?.totalExpense?.toFixed(2) || "0.00"}
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <h3 className="text-base sm:text-lg font-medium mb-2">Saldo</h3>
            <p className="text-2xl sm:text-3xl font-bold" data-testid="balance">
              R$ {statistics?.balance?.balance?.toFixed(2) || "0.00"}
            </p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card title="Tendência Mensal">
            {statistics?.monthlyStats && (
              <MonthlyChart data={statistics.monthlyStats} />
            )}
          </Card>

          <Card title="Detalhamento por Categoria">
            {statistics?.categoryStats && (
              <CategoryChart data={statistics.categoryStats} />
            )}
          </Card>
        </div>

        {/* Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <Card title="Transações Recentes">
              <div className="space-y-3">
                {transactions?.data?.map(
                  (transaction: {
                    id: string;
                    description: string;
                    date: string;
                    category: { name: string };
                    type: string;
                    amount: number;
                  }) => (
                    <div
                      key={transaction.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2"
                      data-testid="transaction-item"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{transaction.description}</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()} •{" "}
                          {transaction.category.name}
                        </p>
                      </div>
                      <p
                        className={`text-base sm:text-lg font-semibold whitespace-nowrap ${
                          transaction.type === "INCOME"
                            ? "text-success-600"
                            : "text-danger-600"
                        }`}
                      >
                        {transaction.type === "INCOME" ? "+" : "-"}R$
                        {Number(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  )
                )}
              </div>
              <Button
                variant="secondary"
                className="w-full mt-4"
                onClick={() => (window.location.href = "/transactions")}
              >
                Ver Todas as Transações
              </Button>
            </Card>
          </div>

          <div>
            <Card title="Ações Rápidas">
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setShowTransactionForm(true)}
                  data-testid="create-transaction-btn"
                >
                  + Nova Transação
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => (window.location.href = "/reports")}
                >
                  Ver Relatórios
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => (window.location.href = "/categories")}
                >
                  Gerenciar Categorias
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
