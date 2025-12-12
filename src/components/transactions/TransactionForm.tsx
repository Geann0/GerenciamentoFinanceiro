'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useMutation, useQueryClient } from 'react-query'

const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.string().min(1, 'Valor é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  date: z.string().min(1, 'Data é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  onSuccess?: () => void
  categories: Array<{ id: string; name: string }>
}

export function TransactionForm({ onSuccess, categories }: TransactionFormProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
  })

  const createTransaction = useMutation(
    async (data: TransactionFormData) => {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          amount: parseFloat(data.amount),
          date: new Date(data.date).toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create transaction')
      }

      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('transactions')
        queryClient.invalidateQueries('statistics')
        reset()
        onSuccess?.()
      },
    }
  )

  const onSubmit = (data: TransactionFormData) => {
    createTransaction.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo <span className="text-danger-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="INCOME"
              {...register('type')}
              className="mr-2"
            />
            <span className="text-success-600">Receita</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="EXPENSE"
              {...register('type')}
              className="mr-2"
            />
            <span className="text-danger-600">Despesa</span>
          </label>
        </div>
        {errors.type && (
          <p className="mt-1 text-sm text-danger-500">{errors.type.message}</p>
        )}
      </div>

      <Input
        label="Valor"
        type="number"
        step="0.01"
        placeholder="0.00"
        {...register('amount')}
        error={errors.amount?.message}
        required
      />

      <Input
        label="Descrição"
        placeholder="Digite a descrição"
        {...register('description')}
        error={errors.description?.message}
        required
      />

      <Input
        label="Data"
        type="date"
        {...register('date')}
        error={errors.date?.message}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoria <span className="text-danger-500">*</span>
        </label>
        <select
          {...register('categoryId')}
          className="input"
        >
          <option value="">Selecione a categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-danger-500">{errors.categoryId.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={createTransaction.isLoading}
      >
        Criar Transação
      </Button>
    </form>
  )
}
