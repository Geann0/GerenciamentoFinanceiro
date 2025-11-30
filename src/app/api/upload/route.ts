import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, unauthorizedResponse } from "@/middlewares/auth";
import { uploadFileToS3 } from "@/services/s3.service";
import { uploadFileToDrive } from "@/services/google-drive.service";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest();
    if (!user) return unauthorizedResponse();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const transactionId = formData.get("transactionId") as string;
    const storageType = (formData.get("storageType") as string) || "s3";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    // Verify transaction belongs to user
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: user.id,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let fileUrl: string;

    if (storageType === "google_drive") {
      // Get user's Google tokens from account
      const account = await prisma.account.findFirst({
        where: {
          userId: user.id,
          provider: "google",
        },
      });

      if (!account || !account.access_token) {
        return NextResponse.json(
          { error: "Google Drive not connected" },
          { status: 400 }
        );
      }

      const driveFile = await uploadFileToDrive({
        fileName: file.name,
        mimeType: file.type,
        fileBuffer: buffer,
        accessToken: account.access_token,
        refreshToken: account.refresh_token || undefined,
      });

      fileUrl = driveFile.webViewLink || driveFile.webContentLink || "";
    } else {
      fileUrl = await uploadFileToS3({
        file: buffer,
        fileName: file.name,
        mimeType: file.type,
        folder: `users/${user.id}/attachments`,
      });
    }

    const attachment = await prisma.attachment.create({
      data: {
        transactionId,
        fileName: file.name,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type,
        storageType,
      },
    });

    return NextResponse.json(attachment, { status: 201 });
  } catch (error) {
    console.error("Upload file error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
