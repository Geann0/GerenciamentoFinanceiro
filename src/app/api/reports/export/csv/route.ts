import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, unauthorizedResponse } from "@/middlewares/auth";
import { reportService } from "@/services/report.service";

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "transactions";

    const filters = {
      startDate: searchParams.get("startDate")
        ? new Date(searchParams.get("startDate")!)
        : undefined,
      endDate: searchParams.get("endDate")
        ? new Date(searchParams.get("endDate")!)
        : undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      type: searchParams.get("type") as any,
    };

    let csv: string;

    if (format === "categories") {
      csv = await reportService.exportCategoryBreakdownCSV(user.id, filters);
    } else {
      csv = await reportService.exportTransactionsCSV(user.id, filters);
    }

    // Adicionar BOM UTF-8 para Excel reconhecer caracteres acentuados
    const csvWithBOM = "\uFEFF" + csv;

    return new NextResponse(csvWithBOM, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="financial-report-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export CSV error:", error);
    return NextResponse.json(
      { error: "Failed to export CSV" },
      { status: 500 }
    );
  }
}
