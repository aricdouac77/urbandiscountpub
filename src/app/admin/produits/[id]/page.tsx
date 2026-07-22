import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/features/admin/components/product-form";
import {
  getCategoriesForSelect,
  getCollectionsForSelect,
  getProductForEdit,
} from "@/actions/admin/product.actions";
import type { ProductFormValues } from "@/features/admin/schemas/product.schema";

export const metadata: Metadata = {
  title: "Modifier le produit | Administration",
};

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories, collections] = await Promise.all([
    getProductForEdit(id),
    getCategoriesForSelect(),
    getCollectionsForSelect(),
  ]);

  if (!product) {
    notFound();
  }

  const defaultValues: ProductFormValues = {
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription ?? "",
    brand: product.brand ?? "",
    status: product.status,
    basePrice: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    categoryId: product.categoryId ?? "",
    collectionIds: product.collections.map((c) => c.collectionId),
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    isNewArrival: product.isNewArrival,
    materials: product.materials ?? "",
    careInstructions: product.careInstructions ?? "",
    videoUrl: product.videoUrl ?? "",
    variants: product.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      size: v.size ?? "",
      size2: v.size2 ?? "",
      color: v.color ?? "",
      colorHex: v.colorHex ?? "",
      stock: v.stock,
      isDefault: v.isDefault,
    })),
    images: product.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt ?? "" })),
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Modifier {product.name}</h1>
      <ProductForm
        productId={product.id}
        defaultValues={defaultValues}
        categories={categories}
        collections={collections}
      />
    </div>
  );
}
