import type { Metadata } from "next";
import { ProductForm } from "@/features/admin/components/product-form";
import { getCategoriesForSelect, getCollectionsForSelect } from "@/actions/admin/product.actions";
import type { ProductFormValues } from "@/features/admin/schemas/product.schema";

export const metadata: Metadata = {
  title: "Nouveau produit | Administration",
};

const DEFAULT_VALUES: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  brand: "",
  status: "DRAFT",
  basePrice: 0,
  compareAtPrice: null,
  categoryId: "",
  collectionIds: [],
  isFeatured: false,
  isBestSeller: false,
  isNewArrival: false,
  materials: "",
  careInstructions: "",
  videoUrl: "",
  variants: [{ sku: "", size: "", stock: 0, isDefault: true }],
  images: [],
};

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([
    getCategoriesForSelect(),
    getCollectionsForSelect(),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Nouveau produit</h1>
      <ProductForm
        defaultValues={DEFAULT_VALUES}
        categories={categories}
        collections={collections}
      />
    </div>
  );
}
