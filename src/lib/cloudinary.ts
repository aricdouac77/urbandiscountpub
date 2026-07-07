import "server-only";
import { createHash } from "crypto";

const UPLOAD_FOLDER = "urbandiscount/products";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

/**
 * Signed-upload parameters for a direct browser → Cloudinary upload.
 * The signature covers every param sent except `file` and `api_key`, per
 * Cloudinary's signing rules: https://cloudinary.com/documentation/authentication_signatures
 */
export function createUploadSignature() {
  const config = getCloudinaryConfig();
  if (!config) return null;

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${UPLOAD_FOLDER}&timestamp=${timestamp}`;
  const signature = createHash("sha1")
    .update(`${paramsToSign}${config.apiSecret}`)
    .digest("hex");

  return {
    timestamp,
    folder: UPLOAD_FOLDER,
    signature,
    apiKey: config.apiKey,
    cloudName: config.cloudName,
  };
}
