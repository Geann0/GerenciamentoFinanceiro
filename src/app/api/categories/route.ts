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

    // Invalidate cache on creation
    return NextResponse.json(category, { 
      status: 201,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
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

    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'private, max-age=300', // 5 minutos
      },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { id } = body;

    console.log("Delete category - User ID:", user.id);
    console.log("Delete category - Category ID:", id);

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    await categoryService.deleteCategory(id, user.id);

    return NextResponse.json(
      { success: true, message: "Categoria deletada com sucesso" },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete category" },
      { status: 400 }
    );
  }
}
