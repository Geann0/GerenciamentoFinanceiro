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
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {session?.user?.name}!
          </h1>
          <p className="text-gray-600">Aqui está sua visão financeira</p>
        </div>

        {/* Balance Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white">
            <h3 className="text-lg font-medium mb-2">Receitas Totais</h3>
            <p className="text-3xl font-bold" data-testid="total-income">
              R$ {statistics?.balance?.totalIncome?.toFixed(2) || "0.00"}
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-danger-500 to-danger-600 text-white">
            <h3 className="text-lg font-medium mb-2">Despesas Totais</h3>
            <p className="text-3xl font-bold" data-testid="total-expense">
              R$ {statistics?.balance?.totalExpense?.toFixed(2) || "0.00"}
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <h3 className="text-lg font-medium mb-2">Saldo</h3>
            <p className="text-3xl font-bold" data-testid="balance">
              R$ {statistics?.balance?.balance?.toFixed(2) || "0.00"}
            </p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
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
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
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
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      data-testid="transaction-item"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()} •{" "}
                          {transaction.category.name}
                        </p>
                      </div>
                      <p
                        className={`text-lg font-semibold ${
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
                  onClick={() => setShowTransactionForm(!showTransactionForm)}
                  data-testid="create-transaction-btn"
                >
                  {showTransactionForm
                    ? "Ocultar Formulário"
                    : "+ Nova Transação"}
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => (window.location.href = "/reports")}
                >
                  📊 Ver Relatórios
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => (window.location.href = "/categories")}
                >
                  🏷️ Gerenciar Categorias
                </Button>
              </div>

              {showTransactionForm && categories && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-4">Nova Transação</h4>
                  <TransactionForm
                    categories={categories}
                    onSuccess={() => setShowTransactionForm(false)}
                  />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
