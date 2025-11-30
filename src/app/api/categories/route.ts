import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, unauthorizedResponse } from "@/middlewares/auth";
import { categoryService } from "@/services/category.service";
import { categorySchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const validation = categorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const category = await categoryService.createCategory(
      user.id,
      validation.data
    );

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("all") === "true";

    const categories = includeAll
      ? await categoryService.getAllCategories(user.id)
      : await categoryService.getCategories(user.id);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
