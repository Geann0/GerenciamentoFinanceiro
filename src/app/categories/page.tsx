"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast, ConfirmDialog } from "@/components/ui/Toast";

export default function CategoriesPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#3B82F6",
    description: "",
  });

  const { data: categories, isLoading } = useQuery("categories", async () => {
    const response = await fetch("/api/categories?all=true");
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  });

  const createCategory = useMutation(
    async (data: typeof formData) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao criar categoria");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
        setFormData({ name: "", color: "#3B82F6", description: "" });
        setShowForm(false);
      },
      onError: (error: any) => {
        setToast({ message: error.message, type: "error" });
      },
    }
  );

  const deleteCategory = useMutation(
    async (id: string) => {
      const response = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao deletar categoria");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
        setToast({ message: "Categoria deletada com sucesso!", type: "success" });
      },
      onError: (error: any) => {
        setToast({ message: error.message, type: "error" });
      },
    }
  );

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">
          Por favor, faça login para gerenciar categorias
        </div>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categorias</h1>
            <p className="text-sm sm:text-base text-gray-600">Organize suas transações</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} variant="primary" className="w-full sm:w-auto whitespace-nowrap">
            {showForm ? "Cancelar" : "+ Nova Categoria"}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Nova Categoria</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome <span className="text-danger-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="ex: Alimentação, Transporte"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor <span className="text-danger-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descrição opcional"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full" disabled={createCategory.isLoading}>
                {createCategory.isLoading ? "Criando..." : "Criar Categoria"}
              </Button>
            </form>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((category: any) => (
            <Card
              key={category.id}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-black">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setConfirmDialog({
                      message: `Deseja realmente deletar a categoria "${category.name}"?`,
                      onConfirm: () => {
                        deleteCategory.mutate(category.id);
                        setConfirmDialog(null);
                      },
                    });
                  }}
                  className="text-danger-600 hover:text-danger-700 p-2 hover:bg-danger-50 rounded-lg transition-colors flex-shrink-0"
                  title="Deletar categoria"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </Card>
          ))}
        </div>

        {categories?.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                Nenhuma categoria ainda
              </p>
              <Button onClick={() => setShowForm(true)} variant="primary">
                Criar Sua Primeira Categoria
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
          confirmText="Deletar"
          cancelText="Cancelar"
        />
      )}
    </div>
  );
}
