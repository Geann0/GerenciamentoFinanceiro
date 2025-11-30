import { transactionService } from "./transaction.service";
import { prisma } from "@/lib/prisma";

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
  type?: "INCOME" | "EXPENSE";
}

export class ReportService {
  async generateFinancialReport(userId: string, filters: ReportFilters) {
    const { startDate, endDate, categoryId, type } = filters;

    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }
    if (categoryId) where.categoryId = categoryId;
    if (type) where.type = type;

    const [balance, transactions, categoryBreakdown, monthlyTrend] =
      await Promise.all([
        transactionService.getBalance(userId, startDate, endDate),
        prisma.transaction.findMany({
          where,
          include: {
            category: true,
            tags: { include: { tag: true } },
          },
          orderBy: { date: "desc" },
        }),
        this.getCategoryBreakdown(userId, filters),
        this.getMonthlyTrend(userId, filters),
      ]);

    return {
      summary: {
        ...balance,
        transactionCount: transactions.length,
        period: {
          startDate,
          endDate,
        },
      },
      transactions,
      categoryBreakdown,
      monthlyTrend,
    };
  }

  async getCategoryBreakdown(userId: string, filters: ReportFilters) {
    const where: any = { userId };

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = filters.startDate;
      if (filters.endDate) where.date.lte = filters.endDate;
    }
    if (filters.type) where.type = filters.type;

    const breakdown = await prisma.transaction.groupBy({
      by: ["categoryId", "type"],
      where,
      _sum: {
        amount: true,
      },
      _count: true,
    });

    const categoriesMap = new Map();
    const categoryIds = breakdown.map((b) => b.categoryId);

    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
      },
    });

    categories.forEach((cat) => categoriesMap.set(cat.id, cat));

    return breakdown.map((item) => ({
      category: categoriesMap.get(item.categoryId),
      type: item.type,
      total: Number(item._sum.amount || 0),
      count: item._count,
    }));
  }

  async getMonthlyTrend(userId: string, filters: ReportFilters) {
    const where: any = { userId };

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = filters.startDate;
      if (filters.endDate) where.date.lte = filters.endDate;
    }
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.type) where.type = filters.type;

    // Get all transactions for manual grouping (SQLite compatible)
    const transactions = await prisma.transaction.findMany({
      where,
      select: {
        date: true,
        type: true,
        amount: true,
      },
      orderBy: { date: "asc" },
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

    return Array.from(monthlyMap.values()).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }

  generateCSV(data: any[]): string {
    if (!data.length) return "";

    const headers = Object.keys(data[0]);
    // Usar ponto-e-vírgula para compatibilidade com Excel em português
    const csvRows = [headers.join(";")];

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        // Escapar aspas duplas e remover ponto-e-vírgula do conteúdo
        const escaped = ("" + value).replace(/"/g, '""').replace(/;/g, ",");
        return `"${escaped}"`;
      });
      csvRows.push(values.join(";"));
    }

    // Usar \r\n para compatibilidade com Excel no Windows
    return csvRows.join("\r\n");
  }

  async exportTransactionsCSV(
    userId: string,
    filters: ReportFilters
  ): Promise<string> {
    const where: any = { userId };

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = filters.startDate;
      if (filters.endDate) where.date.lte = filters.endDate;
    }
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.type) where.type = filters.type;

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { date: "desc" },
    });

    const csvData = transactions.map((t) => ({
      Date: t.date.toISOString().split("T")[0],
      Type: t.type,
      Amount: Number(t.amount),
      Description: t.description,
      Category: t.category.name,
    }));

    return this.generateCSV(csvData);
  }

  async exportCategoryBreakdownCSV(
    userId: string,
    filters: ReportFilters
  ): Promise<string> {
    const breakdown = await this.getCategoryBreakdown(userId, filters);

    const csvData = breakdown.map((item) => ({
      Category: item.category?.name || "Unknown",
      Type: item.type,
      Total: item.total,
      TransactionCount: item.count,
    }));

    return this.generateCSV(csvData);
  }

  // For PDF generation, you would integrate a library like pdfkit or puppeteer
  // This is a placeholder that returns HTML that can be converted to PDF
  generateReportHTML(report: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Financial Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #0ea5e9; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #0ea5e9; color: white; }
          .summary { background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .income { color: #10b981; }
          .expense { color: #ef4444; }
        </style>
      </head>
      <body>
        <h1>Financial Report</h1>
        <div class="summary">
          <h2>Summary</h2>
          <p><strong>Period:</strong> ${
            report.summary.period.startDate || "All time"
          } to ${report.summary.period.endDate || "Present"}</p>
          <p><strong>Total Income:</strong> <span class="income">$${report.summary.totalIncome.toFixed(
            2
          )}</span></p>
          <p><strong>Total Expense:</strong> <span class="expense">$${report.summary.totalExpense.toFixed(
            2
          )}</span></p>
          <p><strong>Balance:</strong> $${report.summary.balance.toFixed(2)}</p>
          <p><strong>Transactions:</strong> ${
            report.summary.transactionCount
          }</p>
        </div>
        
        <h2>Category Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Type</th>
              <th>Total</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            ${report.categoryBreakdown
              .map(
                (item: any) => `
              <tr>
                <td>${item.category?.name || "Unknown"}</td>
                <td>${item.type}</td>
                <td class="${item.type.toLowerCase()}">$${item.total.toFixed(
                  2
                )}</td>
                <td>${item.count}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;
  }
}

export const reportService = new ReportService();
