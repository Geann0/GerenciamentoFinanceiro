import { transactionService } from '../transaction.service'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}))

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const mockTransaction = {
        id: '1',
        userId: 'user1',
        type: 'INCOME',
        amount: 100,
        description: 'Test',
        date: new Date(),
        categoryId: 'cat1',
        category: { id: 'cat1', name: 'Salary' },
        tags: [],
        attachments: [],
      }

      ;(prisma.transaction.create as jest.Mock).mockResolvedValue(mockTransaction)

      const result = await transactionService.createTransaction('user1', {
        type: 'INCOME',
        amount: 100,
        description: 'Test',
        date: new Date().toISOString(),
        categoryId: 'cat1',
      })

      expect(result).toEqual(mockTransaction)
      expect(prisma.transaction.create).toHaveBeenCalledTimes(1)
    })
  })

  describe('getBalance', () => {
    it('should calculate balance correctly', async () => {
      ;(prisma.transaction.aggregate as jest.Mock)
        .mockResolvedValueOnce({ _sum: { amount: 1000 } })
        .mockResolvedValueOnce({ _sum: { amount: 600 } })

      const result = await transactionService.getBalance('user1')

      expect(result).toEqual({
        totalIncome: 1000,
        totalExpense: 600,
        balance: 400,
      })
    })
  })
})
