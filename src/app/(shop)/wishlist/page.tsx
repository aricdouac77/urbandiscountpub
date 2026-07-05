import type { Metadata } from "next";
import { requireUser } from "@/lib/auth-guards";
import { getWishlistProducts } from "@/actions/wishlist.actions";
import { ProductCard } from "@/features/catalog/components/product-card";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";

export const metadata: Metadata = {
  title: "Ma liste d'envies",
};

export default async function WishlistPage() {
  await requireUser();
  const products = await getWishlistProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SiteBreadcrumb items={[{ label: "Ma liste d'envies" }]} />
      <h1 className="font-heading mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        Ma liste d&apos;envies
      </h1>

      {products.length === 0 ? (
        <p className="text-muted-foreground mt-16 text-center text-sm">
          Votre liste d&apos;envies est vide. Ajoutez vos produits préférés en cliquant sur le cœur.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
