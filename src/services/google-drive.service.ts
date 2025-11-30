import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.file"],
  });
}

export async function getAccessToken(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
}

export function setCredentials(accessToken: string, refreshToken?: string) {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
}

export interface UploadToDriveParams {
  fileName: string;
  mimeType: string;
  fileBuffer: Buffer;
  accessToken: string;
  refreshToken?: string;
}

export async function uploadFileToDrive({
  fileName,
  mimeType,
  fileBuffer,
  accessToken,
  refreshToken,
}: UploadToDriveParams) {
  setCredentials(accessToken, refreshToken);

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const fileMetadata = {
    name: fileName,
  };

  const { Readable } = await import("stream");
  const media = {
    mimeType,
    body: Readable.from(fileBuffer),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id, webViewLink, webContentLink",
  });

  return response.data;
}

export async function deleteFileFromDrive(
  fileId: string,
  accessToken: string,
  refreshToken?: string
) {
  setCredentials(accessToken, refreshToken);

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  await drive.files.delete({
    fileId,
  });
}

export async function getFileFromDrive(
  fileId: string,
  accessToken: string,
  refreshToken?: string
) {
  setCredentials(accessToken, refreshToken);

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const response = await drive.files.get({
    fileId,
    fields: "id, name, mimeType, size, webViewLink, webContentLink",
  });

  return response.data;
}
