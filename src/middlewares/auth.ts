import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function authenticateRequest() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return null;
  }

  return session.user;
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized - Please login to continue" },
    { status: 401 }
  );
}

export function forbiddenResponse(message = "Access denied") {
  return NextResponse.json({ error: message }, { status: 403 });
}
