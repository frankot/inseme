import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

import { env } from "@/lib/env";

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export const ALLOWED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "application/pdf",
] as const;

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
};

/**
 * R2 stays optional so the app boots without it (phases B1/B3/B4 don't need
 * storage). Every media action checks this and reports a clear message instead
 * of throwing a credentials error at the editor.
 */
export function getR2Config(): R2Config | null {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } = env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL) {
    return null;
  }
  return {
    accountId: R2_ACCOUNT_ID,
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
    bucket: R2_BUCKET,
    publicUrl: R2_PUBLIC_URL.replace(/\/$/, ""),
  };
}

export function createR2Client(config: R2Config): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
};

/** Keys are generated server-side — the client-supplied filename never becomes a path. */
export function buildObjectKey(mimeType: string, originalName: string): string {
  const extension = EXTENSIONS[mimeType] ?? "bin";
  const base =
    originalName
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "plik";
  return `media/${new Date().getFullYear()}/${crypto.randomUUID()}-${base}.${extension}`;
}

export function publicUrlFor(config: R2Config, key: string): string {
  return `${config.publicUrl}/${key}`;
}
