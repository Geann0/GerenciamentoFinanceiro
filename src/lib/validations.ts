import { z } from 'zod'

export const createTransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Transaction type is required',
  }),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(500),
  date: z.string().datetime().or(z.date()),
  categoryId: z.string().uuid('Invalid category ID'),
  tags: z.array(z.string()).optional(),
})

export const updateTransactionSchema = createTransactionSchema.partial()

export const transactionFilterSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.string().uuid().optional(),
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').default('#3B82F6'),
  icon: z.string().optional(),
  parentId: z.string().uuid().optional(),
})

export const budgetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  amount: z.number().positive('Amount must be positive'),
  categoryId: z.string().uuid().optional(),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type TransactionFilter = z.infer<typeof transactionFilterSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type BudgetInput = z.infer<typeof budgetSchema>
