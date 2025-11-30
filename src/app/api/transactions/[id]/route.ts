import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, unauthorizedResponse } from "@/middlewares/auth";
import { transactionService } from "@/services/transaction.service";
import { updateTransactionSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest();
    if (!user) return unauthorizedResponse();

    const transaction = await transactionService.getTransactionById(
      params.id,
      user.id
    );

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Get transaction error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const validation = updateTransactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const transaction = await transactionService.updateTransaction(
      params.id,
      user.id,
      validation.data
    );

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Update transaction error:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest();
    if (!user) return unauthorizedResponse();

    await transactionService.deleteTransaction(params.id, user.id);

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
