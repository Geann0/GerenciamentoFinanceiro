import { prisma } from "@/lib/prisma";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilter,
} from "@/lib/validations";

export class TransactionService {
  async createTransaction(userId: string, data: CreateTransactionInput) {
    const { tags, ...transactionData } = data;

    const transaction = await prisma.transaction.create({
      data: {
        ...transactionData,
        userId,
        date: new Date(data.date),
        tags: tags?.length
          ? {
              create: tags.map((tagName) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName },
                    create: { name: tagName },
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        attachments: true,
      },
    });

    return transaction;
  }

  async getTransactions(userId: string, filters: TransactionFilter) {
    const {
      page,
      limit,
      startDate,
      endDate,
      type,
      categoryId,
      minAmount,
      maxAmount,
      tags,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      userId,
    };

    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount.gte = minAmount;
      if (maxAmount) where.amount.lte = maxAmount;
    }
    if (tags?.length) {
      where.tags = {
        some: {
          tag: {
            name: {
              in: tags,
            },
          },
        },
      };
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          attachments: true,
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionById(transactionId: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        attachments: true,
      },
    });

    return transaction;
  }

  async updateTransaction(
    transactionId: string,
    userId: string,
    data: UpdateTransactionInput
  ) {
    const { tags, ...updateData } = data;

    const transaction = await prisma.transaction.update({
      where: {
        id: transactionId,
        userId,
      },
      data: {
        ...updateData,
        date: data.date ? new Date(data.date) : undefined,
        tags: tags
          ? {
              deleteMany: {},
              create: tags.map((tagName) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName },
                    create: { name: tagName },
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        attachments: true,
      },
    });

    return transaction;
  }

  async deleteTransaction(transactionId: string, userId: string) {
    await prisma.transaction.delete({
      where: {
        id: transactionId,
        userId,
      },
    });
  }

  async getBalance(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const [incomeResult, expenseResult] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = Number(incomeResult._sum.amount || 0);
    const totalExpense = Number(expenseResult._sum.amount || 0);
    const balance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      balance,
    };
  }

  async getStatistics(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const balance = await this.getBalance(userId, startDate, endDate);

    const categoryStatsRaw = await prisma.transaction.groupBy({
      by: ["categoryId", "type"],
      where,
      _sum: { amount: true },
      _count: true,
    });

    // Get category details for the stats
    const categoryIds = [
      ...new Set(categoryStatsRaw.map((stat) => stat.categoryId)),
    ];
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, color: true },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    // Combine stats with category details
    const categoryStats = categoryStatsRaw
      .map((stat) => ({
        category: categoryMap.get(stat.categoryId),
        type: stat.type,
        total: stat._sum.amount || 0,
        count: stat._count,
      }))
      .filter((stat) => stat.category); // Remove entries without category

    // Get all transactions for monthly grouping (SQLite compatible)
    const transactions = await prisma.transaction.findMany({
      where,
      select: {
        date: true,
        type: true,
        amount: true,
      },
      orderBy: { date: "desc" },
    });

    // Group by month manually
    const monthlyMap = new Map<
      string,
      { month: string; type: string; total: number; count: number }
    >();

    transactions.forEach((t) => {
      const month = new Date(t.date).toISOString().slice(0, 7); // YYYY-MM
      const key = `${month}-${t.type}`;

      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, { month, type: t.type, total: 0, count: 0 });
      }

      const entry = monthlyMap.get(key)!;
      entry.total += Number(t.amount);
      entry.count += 1;
    });

    const monthlyStats = Array.from(monthlyMap.values()).sort((a, b) =>
      b.month.localeCompare(a.month)
    );

    return {
      balance,
      categoryStats,
      monthlyStats,
    };
  }
}

export const transactionService = new TransactionService();
