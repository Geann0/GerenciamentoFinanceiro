import { prisma } from "@/lib/prisma";
import { CategoryInput } from "@/lib/validations";

export class CategoryService {
  async createCategory(userId: string, data: CategoryInput) {
    const category = await prisma.category.create({
      data: {
        ...data,
        userId,
      },
      include: {
        parent: true,
        subcategories: true,
      },
    });

    return category;
  }

  async getCategories(userId: string, includeSubcategories = true) {
    const categories = await prisma.category.findMany({
      where: {
        userId,
        parentId: null, // Only root categories
      },
      include: {
        subcategories: includeSubcategories
          ? {
              include: {
                subcategories: true,
              },
            }
          : false,
      },
      orderBy: { name: "asc" },
    });

    return categories;
  }

  async getAllCategories(userId: string) {
    const categories = await prisma.category.findMany({
      where: { userId },
      include: {
        parent: true,
        subcategories: true,
      },
      orderBy: { name: "asc" },
    });

    return categories;
  }

  async getCategoryById(categoryId: string, userId: string) {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
      include: {
        parent: true,
        subcategories: true,
        transactions: {
          take: 10,
          orderBy: { date: "desc" },
        },
      },
    });

    return category;
  }

  async updateCategory(
    categoryId: string,
    userId: string,
    data: Partial<CategoryInput>
  ) {
    const category = await prisma.category.update({
      where: {
        id: categoryId,
        userId,
      },
      data,
      include: {
        parent: true,
        subcategories: true,
      },
    });

    return category;
  }

  async deleteCategory(categoryId: string, userId: string) {
    // Check if category has transactions
    const transactionCount = await prisma.transaction.count({
      where: { categoryId },
    });

    if (transactionCount > 0) {
      throw new Error("Cannot delete category with existing transactions");
    }

    // Delete category and subcategories
    await prisma.category.deleteMany({
      where: {
        OR: [
          { id: categoryId, userId },
          { parentId: categoryId, userId },
        ],
      },
    });
  }

  async getCategoryStatistics(
    categoryId: string,
    userId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const where: any = {
      categoryId,
      userId,
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const [totalIncome, totalExpense, transactionCount] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      totalIncome: Number(totalIncome._sum.amount || 0),
      totalExpense: Number(totalExpense._sum.amount || 0),
      transactionCount,
    };
  }
}

export const categoryService = new CategoryService();
