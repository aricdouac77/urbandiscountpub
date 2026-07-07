"use server";

import { requireAdmin } from "@/lib/auth-guards";
import { createUploadSignature } from "@/lib/cloudinary";

export type CloudinarySignatureResult =
  | {
      ok: true;
      timestamp: number;
      folder: string;
      signature: string;
      apiKey: string;
      cloudName: string;
    }
  | { ok: false; message: string };

export async function getCloudinaryUploadSignature(): Promise<CloudinarySignatureResult> {
  await requireAdmin();

  const signature = createUploadSignature();
  if (!signature) {
    return {
      ok: false,
      message: "Cloudinary n'est pas configuré (variables d'environnement manquantes).",
    };
  }

  return { ok: true, ...signature };
}
