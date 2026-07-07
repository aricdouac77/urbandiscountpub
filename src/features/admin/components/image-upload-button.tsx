"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCloudinaryUploadSignature } from "@/actions/admin/upload.actions";

type ImageUploadButtonProps = {
  onUploaded: (url: string) => void;
};

export function ImageUploadButton({ onUploaded }: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploading(true);

    try {
      const signature = await getCloudinaryUploadSignature();
      if (!signature.ok) {
        toast.error(signature.message);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signature.apiKey);
      formData.append("timestamp", String(signature.timestamp));
      formData.append("signature", signature.signature);
      formData.append("folder", signature.folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
        { method: "POST", body: formData },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = (await response.json()) as { secure_url: string };
      onUploaded(data.secure_url);
      toast.success("Image téléversée");
    } catch {
      toast.error("Échec du téléversement de l'image");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-4" />
        {isUploading ? "Envoi..." : "Téléverser une image"}
      </Button>
    </>
  );
}
