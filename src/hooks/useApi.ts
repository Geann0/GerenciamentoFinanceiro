import { useQuery, useMutation, useQueryClient } from "react-query";

export function useTransactions(filters?: any) {
  return useQuery(["transactions", filters], async () => {
    const params = new URLSearchParams(filters || {});
    const response = await fetch(`/api/transactions?${params}`);
    if (!response.ok) throw new Error("Failed to fetch transactions");
    return response.json();
  });
}

export function useTransaction(id: string) {
  return useQuery(["transaction", id], async () => {
    const response = await fetch(`/api/transactions/${id}`);
    if (!response.ok) throw new Error("Failed to fetch transaction");
    return response.json();
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: any) => {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create transaction");
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("statistics");
      },
    }
  );
}

export function useUpdateTransaction(id: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: any) => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update transaction");
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["transaction", id]);
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("statistics");
      },
    }
  );
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete transaction");
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("statistics");
      },
    }
  );
}

export function useStatistics(filters?: any) {
  return useQuery(["statistics", filters], async () => {
    const params = new URLSearchParams(filters || {});
    const response = await fetch(`/api/transactions/statistics?${params}`);
    if (!response.ok) throw new Error("Failed to fetch statistics");
    return response.json();
  });
}

export function useCategories() {
  return useQuery("categories", async () => {
    const response = await fetch("/api/categories?all=true");
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: any) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create category");
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
      },
    }
  );
}
