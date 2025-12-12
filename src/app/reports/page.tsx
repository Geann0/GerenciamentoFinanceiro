"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ReportsPage() {
  const { data: session } = useSession();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    data: report,
    isLoading,
    refetch,
  } = useQuery(
    ["report", startDate, endDate],
    async () => {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(`/api/reports?${params.toString()}`);
      return response.json();
    },
    {
      enabled: !!session,
    }
  );

  const handleExportCSV = async () => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    window.open(`/api/reports/export/csv?${params.toString()}`, "_blank");
  };

  const handleExportPDF = async () => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    window.open(`/api/reports/export/pdf?${params.toString()}`, "_blank");
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">
          Por favor, faça login para ver os relatórios
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Relatórios Financeiros
          </h1>
          <p className="text-gray-600">Analise seus dados financeiros</p>
        </div>

        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Filtros</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Inicial
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Final
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => refetch()}
                variant="primary"
                className="w-full"
              >
                Gerar Relatório
              </Button>
            </div>
          </div>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-xl">Carregando relatório...</div>
          </div>
        ) : report ? (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white">
                <h3 className="text-lg font-medium mb-2">Receitas Totais</h3>
                <p className="text-3xl font-bold">
                  R$ {Number(report.summary?.totalIncome || 0).toFixed(2)}
                </p>
              </Card>

              <Card className="bg-gradient-to-br from-danger-500 to-danger-600 text-white">
                <h3 className="text-lg font-medium mb-2">Despesas Totais</h3>
                <p className="text-3xl font-bold">
                  R$ {Number(report.summary?.totalExpense || 0).toFixed(2)}
                </p>
              </Card>

              <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                <h3 className="text-lg font-medium mb-2">Saldo Líquido</h3>
                <p className="text-3xl font-bold">
                  R$ {Number(report.summary?.balance || 0).toFixed(2)}
                </p>
              </Card>
            </div>

            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Opções de Exportação
              </h2>
              <div className="flex gap-4">
                <Button onClick={handleExportCSV} variant="secondary">
                  📊 Exportar para CSV
                </Button>
                <Button onClick={handleExportPDF} variant="secondary">
                  📄 Exportar para PDF
                </Button>
              </div>
            </Card>

            {report.categoryBreakdown &&
              report.categoryBreakdown.length > 0 && (
                <Card>
                  <h2 className="text-xl font-semibold mb-4">
                    Detalhamento por Categoria
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Categoria
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Tipo
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                            Transações
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                            Valor Total
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                            Porcentagem
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {report.categoryBreakdown.map(
                          (item: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: item.category.color + "20",
                                    color: item.category.color,
                                  }}
                                >
                                  {item.category.name}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    item.type === "INCOME"
                                      ? "bg-success-100 text-success-800"
                                      : "bg-danger-100 text-danger-800"
                                  }`}
                                >
                                  {item.type === "INCOME"
                                    ? "RECEITA"
                                    : "DESPESA"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-right text-gray-900">
                                {item.count}
                              </td>
                              <td
                                className={`px-4 py-3 text-sm font-semibold text-right ${
                                  item.type === "INCOME"
                                    ? "text-success-600"
                                    : "text-danger-600"
                                }`}
                              >
                                R$ {Number(item.total).toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-sm text-right text-gray-900">
                                {item.percentage?.toFixed(1)}%
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
          </>
        ) : null}
      </div>
    </div>
  );
}
