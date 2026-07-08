import { requireAdmin } from "./auth.js";
import { assertSupabaseSuccess, unwrapSupabaseData } from "./result.js";
import type { CBrainSupabaseClient } from "./server.js";

export const STORAGE_BUCKETS = {
  privateAttachments: "private-attachments",
  publicAssets: "public-assets",
} as const;

export type StorageBucket =
  (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];
export type UploadBody = ArrayBuffer | Blob | FormData | string;

export async function uploadFile(
  client: CBrainSupabaseClient,
  bucket: StorageBucket,
  path: string,
  body: UploadBody,
  options?: {
    contentType?: string;
    upsert?: boolean;
  },
) {
  const { data, error } = await client.storage
    .from(bucket)
    .upload(path, body, options);

  return unwrapSupabaseData(data, error);
}

export async function createSignedFileUrl(
  client: CBrainSupabaseClient,
  bucket: StorageBucket,
  path: string,
  expiresInSeconds = 60 * 10,
) {
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  return unwrapSupabaseData(data, error);
}

export function getPublicFileUrl(
  client: CBrainSupabaseClient,
  bucket: StorageBucket,
  path: string,
) {
  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function deleteFiles(
  client: CBrainSupabaseClient,
  bucket: StorageBucket,
  paths: string[],
) {
  await requireAdmin(client);

  const { error } = await client.storage.from(bucket).remove(paths);

  assertSupabaseSuccess(error);
}
