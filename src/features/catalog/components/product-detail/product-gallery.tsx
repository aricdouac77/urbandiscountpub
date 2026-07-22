"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useProductColor } from "@/features/catalog/components/product-detail/product-color-context";

type GalleryImage = { id: string; url: string; alt: string | null };

export function ProductGallery({
  images: baseImages,
  productName,
  colorImages,
}: {
  images: GalleryImage[];
  productName: string;
  colorImages?: Record<string, string>;
}) {
  const { selectedColor } = useProductColor();

  const images = useMemo(() => {
    if (!colorImages) return baseImages;
    const extra = Object.entries(colorImages)
      .filter(([, url]) => !baseImages.some((image) => image.url === url))
      .map(([color, url]) => ({ id: `color-${color}`, url, alt: `${productName} — ${color}` }));
    return [...baseImages, ...extra];
  }, [baseImages, colorImages, productName]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const lastSyncedColor = useRef<string | null>(null);

  useEffect(() => {
    if (!colorImages || !selectedColor || lastSyncedColor.current === selectedColor) return;
    lastSyncedColor.current = selectedColor;
    const url = colorImages[selectedColor];
    if (!url) return;
    const index = images.findIndex((image) => image.url === url);
    if (index >= 0) setActiveIndex(index);
  }, [selectedColor, colorImages, images]);

  const activeImage = images[activeIndex] ?? images[0];

  if (!activeImage) {
    return <div className="bg-muted aspect-[4/5] rounded-lg" />;
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "bg-muted relative size-16 shrink-0 overflow-hidden rounded-md ring-offset-2 sm:size-20",
                index === activeIndex && "ring-foreground ring-2",
              )}
              aria-label={`Voir l'image ${index + 1}`}
            >
              <Image src={image.url} alt={image.alt ?? productName} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setZoomOpen(true)}
        className="bg-muted group relative aspect-[4/5] flex-1 overflow-hidden rounded-lg"
        aria-label="Zoomer sur l'image"
      >
        <Image
          src={activeImage.url}
          alt={activeImage.alt ?? productName}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <span className="bg-background/90 absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="size-4" />
        </span>
      </button>

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-3xl p-0" showCloseButton>
          <DialogTitle className="sr-only">{productName}</DialogTitle>
          <div className="relative aspect-square w-full">
            <Image
              src={activeImage.url}
              alt={activeImage.alt ?? productName}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
