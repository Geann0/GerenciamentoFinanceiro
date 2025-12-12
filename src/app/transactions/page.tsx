"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TransactionForm } from "@/components/transactions/TransactionForm";

export default function TransactionsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "INCOME" | "EXPENSE">("all");

  const { data: transactions, isLoading } = useQuery(
    "transactions",
    async () => {
      const response = await fetch("/api/transactions?limit=100");
      return response.json();
    }
  );

  const { data: categories } = useQuery("categories", async () => {
    const response = await fetch("/api/categories?all=true");
    return response.json();
  });

  const deleteTransaction = useMutation(
    async (id: string) => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Falha ao deletar");
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("statistics");
      },
    }
  );

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Faça login para ver as transações</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  const filteredTransactions =
    transactions?.data?.filter((t: any) =>
      filter === "all" ? true : t.type === filter
    ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transações</h1>
            <p className="text-gray-600">Gerencie suas receitas e despesas</p>
          </div>
          <Button
            onClick={() => {
              setEditingTransaction(null);
              setShowForm(!showForm);
            }}
            variant="primary"
          >
            {showForm ? "Cancelar" : "+ Nova Transação"}
          </Button>
        </div>

        {showForm && categories && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingTransaction ? "Editar Transação" : "Nova Transação"}
            </h2>
            <TransactionForm
              categories={categories}
              onSuccess={() => {
                setShowForm(false);
                setEditingTransaction(null);
              }}
            />
          </Card>
        )}

        <Card>
          <div className="mb-4 flex gap-2">
            <Button
              variant={filter === "all" ? "primary" : "secondary"}
              onClick={() => setFilter("all")}
            >
              Todas
            </Button>
            <Button
              variant={filter === "INCOME" ? "primary" : "secondary"}
              onClick={() => setFilter("INCOME")}
            >
              Receitas
            </Button>
            <Button
              variant={filter === "EXPENSE" ? "primary" : "secondary"}
              onClick={() => setFilter("EXPENSE")}
            >
              Despesas
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Descrição
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Nenhuma transação encontrada
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction: any) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: transaction.category.color + "20",
                            color: transaction.category.color,
                          }}
                        >
                          {transaction.category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === "INCOME"
                              ? "bg-success-100 text-success-800"
                              : "bg-danger-100 text-danger-800"
                          }`}
                        >
                          {transaction.type === "INCOME"
                            ? "RECEITA"
                            : "DESPESA"}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-3 text-sm font-semibold text-right ${
                          transaction.type === "INCOME"
                            ? "text-success-600"
                            : "text-danger-600"
                        }`}
                      >
                        {transaction.type === "INCOME" ? "+" : "-"}R$
                        {Number(transaction.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right space-x-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditingTransaction(transaction);
                            setShowForm(true);
                          }}
                          className="text-xs"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            if (
                              confirm(
                                "Tem certeza que deseja deletar esta transação?"
                              )
                            ) {
                              deleteTransaction.mutate(transaction.id);
                            }
                          }}
                          className="text-xs"
                        >
                          Deletar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
