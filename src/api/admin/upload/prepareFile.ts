import medusa from "@api/medusa";
import { apiFetch } from "@/api/http";

/**
 * The API runs on AWS Lambda: a request body can be at most 6 MB, and binary
 * uploads are base64-encoded (+33%). Keep files sent through the API under this.
 */
export const DIRECT_UPLOAD_LIMIT = 4 * 1024 * 1024;

const MAX_IMAGE_SIDE = 1600;
const COMPRESSIBLE = /^image\/(jpeg|png|webp|heic|heif|bmp)$/i;

/** Downscale photos to <= 1600 px and re-encode as JPEG (phone photos are 3-12 MB). */
export async function compressImage(file: File): Promise<File> {
  if (!COMPRESSIBLE.test(file.type) || typeof createImageBitmap !== "function") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1024 * 1024) {
      bitmap.close?.();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff"; // transparent PNG areas -> white, not black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file; // unsupported format in this browser: upload the original
  }
}

type UploadResult = { uploads: { url: string; key: string }[] };

/** Upload straight to S3 with a presigned PUT (for files too large for Lambda). */
export async function uploadViaPresignedUrl(file: File, isPrivate: boolean): Promise<UploadResult> {
  const contentType = file.type || "application/octet-stream";
  const { data } = await apiFetch<{ upload_url: string; key: string; url: string }>(
    "/admin/mms-uploads/presign",
    { method: "POST", body: { filename: file.name, content_type: contentType, private: isPrivate } }
  );
  const put = await fetch(data.upload_url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });
  if (!put.ok) throw new Error(`Upload to storage failed (${put.status})`);
  return { uploads: [{ url: data.url, key: data.key }] };
}

export async function uploadFile(file: File, isPrivate: boolean): Promise<UploadResult> {
  const prepared = await compressImage(file);
  if (prepared.size > DIRECT_UPLOAD_LIMIT) return uploadViaPresignedUrl(prepared, isPrivate);
  const res = isPrivate
    ? await medusa.admin.uploads.createProtected(prepared)
    : await medusa.admin.uploads.create(prepared);
  return res as unknown as UploadResult;
}
