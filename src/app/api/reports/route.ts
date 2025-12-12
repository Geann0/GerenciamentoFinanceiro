import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, unauthorizedResponse } from "@/middlewares/auth";
import { reportService } from "@/services/report.service";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);

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

    const report = await reportService.generateFinancialReport(
      user.id,
      filters
    );

    return NextResponse.json(report);
  } catch (error) {
    console.error("Generate report error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
