import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, unauthorizedResponse } from "@/middlewares/auth";
import { transactionService } from "@/services/transaction.service";
import { createTransactionSchema } from "@/lib/validations";
import { sendTransactionNotification } from "@/services/email.service";

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const validation = createTransactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const transaction = await transactionService.createTransaction(
      user.id,
      validation.data
    );

    // Send notification email (async, don't wait)
    sendTransactionNotification(
      user.email,
      user.name,
      transaction.type,
      Number(transaction.amount)
    ).catch(console.error);

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Create transaction error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);

    const filters = {
      type: searchParams.get("type") as any,
      categoryId: searchParams.get("categoryId") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      minAmount: searchParams.get("minAmount")
        ? Number(searchParams.get("minAmount"))
        : undefined,
      maxAmount: searchParams.get("maxAmount")
        ? Number(searchParams.get("maxAmount"))
        : undefined,
      tags: searchParams.get("tags")?.split(","),
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
    };

    const result = await transactionService.getTransactions(user.id, filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
