"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function CategoriesPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    color: "#3B82F6",
    description: "",
  });

  const { data: categories, isLoading } = useQuery("categories", async () => {
    const response = await fetch("/api/categories?all=true");
    return response.json();
  });

  const createCategory = useMutation(
    async (data: typeof formData) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Falha ao criar categoria");
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
        setFormData({ name: "", color: "#3B82F6", description: "" });
        setShowForm(false);
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

              <Button type="submit" variant="primary" className="w-full">
                Criar Categoria
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
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-black">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <span>{category._count?.transactions || 0} transações</span>
                  </div>
                </div>
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
    </div>
  );
}
